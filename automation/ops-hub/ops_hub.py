#!/usr/bin/env python3
"""Local, dependency-free GatorBait operations control room."""

from __future__ import annotations

import argparse
import concurrent.futures
import http.client
import html
import json
import os
import signal
import ssl
import sys
import threading
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from controller import evaluate_cycle
from learning import learning_summary, update_learning_state


ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "config.json"
STATE_DIR = Path(os.environ.get("GBM_OPS_STATE_DIR", ROOT / ".state"))
STATUS_PATH = STATE_DIR / "status.json"
CONTROLLER_STATE_PATH = STATE_DIR / "controller-state.json"
LEARNING_PATH = STATE_DIR / "learning.json"
EVENTS_PATH = STATE_DIR / "events.jsonl"
BRIEF_PATH = STATE_DIR / "latest-brief.md"
USER_AGENT = "GatorBait-Ops-Hub/1.1 (+https://www.gatorbaitmedia.com/)"


@dataclass(frozen=True)
class CheckResult:
    name: str
    url: str
    ok: bool
    status: int
    final_url: str
    seconds: float
    error: str = ""


def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def read_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        return payload if isinstance(payload, dict) else None
    except (OSError, json.JSONDecodeError):
        return None


def fetch(target: dict[str, Any], timeout: int) -> CheckResult:
    started = time.monotonic()
    request = urllib.request.Request(target["url"], headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(
            request, timeout=timeout, context=ssl.create_default_context()
        ) as response:
            body = response.read().decode("utf-8", "replace")
            required = [str(v).lower() for v in target.get("required", [])]
            any_required = [str(v).lower() for v in target.get("any_required", [])]
            forbidden = [str(v).lower() for v in target.get("forbidden", [])]
            lowered = body.lower()
            missing = [value for value in required if value not in lowered]
            missing_any = any_required and not any(value in lowered for value in any_required)
            present = [value for value in forbidden if value in lowered]
            valid_url = response.geturl().startswith("https://")
            ok = (
                200 <= response.status < 400
                and valid_url
                and not missing
                and not missing_any
                and not present
            )
            problems = []
            if missing:
                problems.append("missing markers: " + ", ".join(missing))
            if missing_any:
                problems.append("missing one of markers: " + ", ".join(any_required))
            if present:
                problems.append("forbidden markers: " + ", ".join(present))
            if not valid_url:
                problems.append("final URL is not HTTPS")
            return CheckResult(
                name=target["name"],
                url=target["url"],
                ok=ok,
                status=response.status,
                final_url=response.geturl(),
                seconds=round(time.monotonic() - started, 2),
                error="; ".join(problems),
            )
    except (http.client.HTTPException, OSError, urllib.error.URLError, TimeoutError, ssl.SSLError) as exc:
        return CheckResult(
            name=target["name"],
            url=target["url"],
            ok=False,
            status=0,
            final_url=target["url"],
            seconds=round(time.monotonic() - started, 2),
            error=str(exc),
        )


def atomic_json(path: Path, payload: dict[str, Any]) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def write_event(payload: dict[str, Any]) -> None:
    with EVENTS_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, separators=(",", ":")) + "\n")


def write_brief(payload: dict[str, Any]) -> None:
    controller = payload.get("controller", {})
    learning = payload.get("learning", {})
    lines = [
        "# GatorBait operations brief",
        "",
        f"Generated: {payload['checked_at']}",
        "",
        f"Overall status: **{'HEALTHY' if payload['ok'] else 'ATTENTION REQUIRED'}**",
        "",
        (
            "Controller: "
            f"**{str(controller.get('phase', 'observe')).upper()}** / "
            f"{controller.get('decision', 'no_action')}"
        ),
        "",
        (
            "Learning: "
            f"**{learning.get('review_candidates', 0)} review candidate(s)** / "
            f"{learning.get('tracked_incidents', 0)} tracked incident pattern(s)"
        ),
        "",
        "| Check | Result | Time | Final URL |",
        "|---|---:|---:|---|",
    ]
    for result in payload["checks"]:
        state = "PASS" if result["ok"] else "FAIL"
        lines.append(
            f"| {result['name']} | {state} ({result['status']}) | "
            f"{result['seconds']}s | {result['final_url']} |"
        )
        if result["error"]:
            lines.append(f"\n- {result['name']}: {result['error']}")
    if controller.get("reason"):
        lines.extend(["", f"Controller reason: {controller['reason']}"])
    BRIEF_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run_checks(config: dict[str, Any]) -> dict[str, Any]:
    targets = config["checks"]
    timeout = int(config.get("request_timeout_seconds", 30))
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(8, len(targets))) as pool:
        results = list(pool.map(lambda item: fetch(item, timeout), targets))

    now = datetime.now(timezone.utc).isoformat()
    payload: dict[str, Any] = {
        "service": "gatorbait-ops-hub",
        "version": 2,
        "checked_at": now,
        "ok": all(result.ok for result in results),
        "checks": [asdict(result) for result in results],
    }

    STATE_DIR.mkdir(parents=True, exist_ok=True)
    previous_status = read_json(STATUS_PATH)
    previous_controller = read_json(CONTROLLER_STATE_PATH)
    previous_learning = read_json(LEARNING_PATH)
    controller = evaluate_cycle(payload, previous_controller, config)
    learning = update_learning_state(
        previous_learning,
        controller,
        previous_controller,
        now,
        config,
    )
    payload["controller"] = controller
    payload["learning"] = learning_summary(learning)

    atomic_json(STATUS_PATH, payload)
    atomic_json(CONTROLLER_STATE_PATH, controller)
    atomic_json(LEARNING_PATH, learning)
    write_brief(payload)

    previous_ok = previous_status.get("ok") if previous_status else None
    if previous_ok is None or previous_ok != payload["ok"] or not payload["ok"]:
        write_event({"type": "health", **payload})

    previous_decision = previous_controller.get("decision") if previous_controller else None
    previous_fingerprint = (
        previous_controller.get("failure_fingerprint") if previous_controller else None
    )
    if (
        previous_decision != controller["decision"]
        or previous_fingerprint != controller["failure_fingerprint"]
    ):
        write_event(
            {
                "type": "controller",
                "checked_at": now,
                "controller": controller,
            }
        )

    previous_candidates = {
        str(item.get("fingerprint", ""))
        for item in (previous_learning or {}).get("candidates", [])
        if isinstance(item, dict)
    }
    current_candidates = {
        str(item.get("fingerprint", ""))
        for item in learning.get("candidates", [])
        if isinstance(item, dict)
    }
    if previous_candidates != current_candidates:
        write_event(
            {
                "type": "learning",
                "checked_at": now,
                "summary": payload["learning"],
                "candidates": learning.get("candidates", []),
            }
        )

    return payload


def dashboard(payload: dict[str, Any]) -> str:
    rows = []
    for item in payload.get("checks", []):
        css = "pass" if item["ok"] else "fail"
        label = "PASS" if item["ok"] else "FAIL"
        error = html.escape(str(item.get("error", "")))
        error_cell = f"<div class='issue'>{error}</div>" if error else ""
        rows.append(
            "<tr>"
            f"<td><strong>{html.escape(item['name'])}</strong>{error_cell}</td>"
            f"<td><span class='pill {css}'>{label}</span></td>"
            f"<td>{html.escape(str(item['status']))}</td>"
            f"<td>{html.escape(str(item['seconds']))}s</td>"
            f"<td><a href='{html.escape(item['final_url'])}' rel='noreferrer'>Open</a></td>"
            "</tr>"
        )
    overall = "ALL SYSTEMS HEALTHY" if payload.get("ok") else "ATTENTION REQUIRED"
    status_class = "healthy" if payload.get("ok") else "attention"
    failed = sum(1 for item in payload.get("checks", []) if not item.get("ok"))
    passed = sum(1 for item in payload.get("checks", []) if item.get("ok"))
    controller = payload.get("controller", {})
    learning = payload.get("learning", {})
    phase = html.escape(str(controller.get("phase", "observe")).upper())
    decision = html.escape(str(controller.get("decision", "no_action")))
    reason = html.escape(str(controller.get("reason", "")))
    fingerprint = html.escape(str(controller.get("failure_fingerprint", "")))
    next_check = html.escape(str(controller.get("next_check_seconds", "unknown")))
    learning_candidates = int(learning.get("review_candidates", 0))
    tracked_incidents = int(learning.get("tracked_incidents", 0))
    updated = html.escape(payload.get("checked_at", "Not run yet"))
    source_path = html.escape(str(ROOT))
    return f"""<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GatorBait Operations</title>
<style>
:root{{color-scheme:light;--ink:#131821;--muted:#667085;--line:#d9dee7;--soft:#f6f7f9;--panel:#fff;--blue:#0021a5;--orange:#fa4616;--green:#137333;--red:#b3261e}}
*{{box-sizing:border-box}}body{{margin:0;background:#eef1f5;color:var(--ink);font:14px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}}
main{{max-width:1160px;margin:auto;padding:28px 18px 44px}}header{{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}}
h1{{font:700 32px/1.05 Georgia,serif;margin:0}}h2{{font-size:16px;margin:0 0 12px}}p{{margin:0}}a{{color:var(--blue);font-weight:700;text-decoration:none}}a:hover{{text-decoration:underline}}
.eyebrow{{font-size:11px;font-weight:800;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}}.updated{{color:var(--muted);font-size:12px;text-align:right}}
.status{{border-left:6px solid var(--green);background:var(--panel);padding:18px 20px;margin:0 0 18px;display:grid;grid-template-columns:1.2fr .8fr;gap:18px;box-shadow:0 1px 2px rgba(16,24,40,.06)}}
.status.attention{{border-left-color:var(--red)}}.status h2{{font-size:24px;margin:4px 0 8px}}.metrics{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}
.metric{{background:var(--soft);border:1px solid var(--line);padding:12px}}.metric strong{{display:block;font-size:22px;line-height:1}}.metric span{{color:var(--muted);font-size:12px}}
.grid{{display:grid;grid-template-columns:2fr 1fr;gap:18px}}.panel{{background:var(--panel);border:1px solid var(--line);padding:18px;overflow:auto}}table{{width:100%;border-collapse:collapse;min-width:720px}}th,td{{padding:11px 10px;text-align:left;border-bottom:1px solid #e6e9ef;vertical-align:top}}th{{font-size:11px;text-transform:uppercase;color:var(--muted);letter-spacing:.04em}}tr:last-child td{{border-bottom:0}}
.pill{{display:inline-block;min-width:54px;text-align:center;border:1px solid currentColor;padding:3px 8px;font-size:11px;font-weight:900}}.pass{{color:var(--green)}}.fail{{color:var(--red)}}.issue{{margin-top:4px;color:var(--red);font-size:12px;max-width:620px}}.controller{{display:grid;gap:10px}}.kv{{display:grid;grid-template-columns:104px 1fr;gap:8px;border-bottom:1px solid #edf0f4;padding-bottom:9px}}.kv:last-child{{border-bottom:0;padding-bottom:0}}.key{{color:var(--muted);font-size:12px}}.value{{font-weight:700;overflow-wrap:anywhere}}.links{{display:grid;gap:8px;margin-top:2px}}.note{{margin-top:12px;color:var(--muted);font-size:12px;overflow-wrap:anywhere}}
@media (max-width:760px){{main{{padding:20px 12px 34px}}header,.status,.grid{{display:block}}.updated{{text-align:left;margin-top:6px}}.metrics{{grid-template-columns:repeat(3,1fr);margin-top:14px}}h1{{font-size:27px}}.panel{{margin-top:14px;padding:14px}}}}
</style><main><header><div><div class="eyebrow">Local Master Control</div><h1>GatorBait Operations</h1></div><p class="updated">Last check<br><strong>{updated}</strong></p></header>
<section class="status {status_class}"><div><div class="eyebrow">Current State</div><h2>{overall}</h2><p>{reason or 'Routes are being watched by the local single-controller loop.'}</p></div><div class="metrics"><div class="metric"><strong>{passed}</strong><span>passed</span></div><div class="metric"><strong>{failed}</strong><span>failed</span></div><div class="metric"><strong>{next_check}</strong><span>next check seconds</span></div></div></section>
<section class="grid"><div class="panel"><h2>Production Route Checks</h2><table><thead><tr><th>System</th><th>Result</th><th>HTTP</th><th>Time</th><th>Link</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div><aside class="panel controller"><h2>Controller</h2><div class="kv"><div class="key">Phase</div><div class="value">{phase}</div></div><div class="kv"><div class="key">Decision</div><div class="value">{decision}</div></div><div class="kv"><div class="key">Learning</div><div class="value">{learning_candidates} review candidate(s), {tracked_incidents} tracked pattern(s)</div></div><div class="kv"><div class="key">Fingerprint</div><div class="value">{fingerprint or 'none'}</div></div><h2>Quick Links</h2><div class="links"><a href="/api/status">Status JSON</a><a href="/api/controller">Controller JSON</a><a href="/api/learning">Learning JSON</a><a href="https://www.gatorbaitmedia.com/" rel="noreferrer">Live homepage</a><a href="https://github.com/Presidente49/gatorbait-media-redesign" rel="noreferrer">GitHub repo</a></div><p class="note">Source: {source_path}</p></aside></section></main></html>"""


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        if self.path not in ("/", "/api/status", "/api/controller", "/api/learning"):
            self.send_error(404)
            return
        payload = read_json(STATUS_PATH) or {
            "ok": False,
            "checked_at": "Not run yet",
            "checks": [],
            "controller": {
                "architecture": "single-controller",
                "phase": "observe",
                "decision": "not_started",
            },
        }
        if self.path == "/api/controller":
            body = json.dumps(payload.get("controller", {})).encode()
            content_type = "application/json"
        elif self.path == "/api/learning":
            body = json.dumps(read_json(LEARNING_PATH) or {}).encode()
            content_type = "application/json"
        elif self.path == "/api/status":
            body = json.dumps(payload).encode()
            content_type = "application/json"
        else:
            body = dashboard(payload).encode()
            content_type = "text/html; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


def serve(config: dict[str, Any]) -> None:
    stop = threading.Event()

    def request_stop(_signum: int, _frame: object) -> None:
        stop.set()

    signal.signal(signal.SIGTERM, request_stop)
    signal.signal(signal.SIGINT, request_stop)
    host = str(config.get("dashboard_host", "127.0.0.1"))
    port = int(config.get("dashboard_port", 8765))
    default_interval = max(60, int(config.get("interval_seconds", 900)))
    server = ThreadingHTTPServer((host, port), Handler)
    server.timeout = 1
    next_check = 0.0
    print(f"GatorBait Ops Hub listening on http://{host}:{port}")
    while not stop.is_set():
        if time.monotonic() >= next_check:
            status = run_checks(config)
            controller = status.get("controller", {})
            print(
                f"{status['checked_at']} "
                f"{'HEALTHY' if status['ok'] else 'ATTENTION'} "
                f"{controller.get('phase', 'observe')}/{controller.get('decision', 'no_action')}"
            )
            delay = max(
                60, int(controller.get("next_check_seconds", default_interval))
            )
            next_check = time.monotonic() + delay
        server.handle_request()
    server.server_close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("once", "serve"), nargs="?", default="once")
    args = parser.parse_args()
    config = load_config()
    if args.command == "serve":
        serve(config)
        return 0
    status = run_checks(config)
    print(json.dumps(status, indent=2))
    return 0 if status["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
