#!/usr/bin/env python3
"""Local, dependency-free GatorBait operations control room."""

from __future__ import annotations

import argparse
import concurrent.futures
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


ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "config.json"
STATE_DIR = Path(os.environ.get("GBM_OPS_STATE_DIR", ROOT / ".state"))
STATUS_PATH = STATE_DIR / "status.json"
EVENTS_PATH = STATE_DIR / "events.jsonl"
BRIEF_PATH = STATE_DIR / "latest-brief.md"
USER_AGENT = "GatorBait-Ops-Hub/1.0 (+https://www.gatorbaitmedia.com/)"


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


def fetch(target: dict[str, Any], timeout: int) -> CheckResult:
    started = time.monotonic()
    request = urllib.request.Request(target["url"], headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(
            request, timeout=timeout, context=ssl.create_default_context()
        ) as response:
            body = response.read().decode("utf-8", "replace")
            required = [str(v).lower() for v in target.get("required", [])]
            forbidden = [str(v).lower() for v in target.get("forbidden", [])]
            lowered = body.lower()
            missing = [value for value in required if value not in lowered]
            present = [value for value in forbidden if value in lowered]
            valid_url = response.geturl().startswith("https://")
            ok = 200 <= response.status < 400 and valid_url and not missing and not present
            problems = []
            if missing:
                problems.append("missing markers: " + ", ".join(missing))
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
    except (urllib.error.URLError, TimeoutError, ssl.SSLError) as exc:
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
    lines = [
        "# GatorBait operations brief",
        "",
        f"Generated: {payload['checked_at']}",
        "",
        f"Overall status: **{'HEALTHY' if payload['ok'] else 'ATTENTION REQUIRED'}**",
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
    BRIEF_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def run_checks(config: dict[str, Any]) -> dict[str, Any]:
    targets = config["checks"]
    timeout = int(config.get("request_timeout_seconds", 30))
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(8, len(targets))) as pool:
        results = list(pool.map(lambda item: fetch(item, timeout), targets))
    now = datetime.now(timezone.utc).isoformat()
    payload = {
        "service": "gatorbait-ops-hub",
        "version": 1,
        "checked_at": now,
        "ok": all(result.ok for result in results),
        "checks": [asdict(result) for result in results],
    }
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    previous_ok = None
    if STATUS_PATH.exists():
        try:
            previous_ok = json.loads(STATUS_PATH.read_text(encoding="utf-8")).get("ok")
        except (OSError, json.JSONDecodeError):
            previous_ok = None
    atomic_json(STATUS_PATH, payload)
    write_brief(payload)
    if previous_ok is None or previous_ok != payload["ok"] or not payload["ok"]:
        write_event({"type": "health", **payload})
    return payload


def dashboard(payload: dict[str, Any]) -> str:
    rows = []
    for item in payload.get("checks", []):
        css = "pass" if item["ok"] else "fail"
        label = "PASS" if item["ok"] else "FAIL"
        rows.append(
            "<tr>"
            f"<td>{html.escape(item['name'])}</td>"
            f"<td class='{css}'>{label}</td>"
            f"<td>{item['status']}</td>"
            f"<td>{item['seconds']}s</td>"
            f"<td><a href='{html.escape(item['final_url'])}' rel='noreferrer'>Open</a></td>"
            "</tr>"
        )
    overall = "ALL SYSTEMS HEALTHY" if payload.get("ok") else "ATTENTION REQUIRED"
    return f"""<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GatorBait Operations</title>
<style>
body{{margin:0;background:#f4f1e9;color:#08132f;font:16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}}
main{{max-width:980px;margin:auto;padding:48px 20px}}h1{{font:700 clamp(34px,6vw,64px)/1 Georgia,serif;margin:0 0 8px}}
.bar{{height:6px;background:#fa4616;margin:24px 0}}.card{{background:white;border:1px solid #d7dce5;padding:24px;overflow:auto}}
table{{width:100%;border-collapse:collapse}}th,td{{padding:12px;text-align:left;border-bottom:1px solid #e2e5ea}}.pass{{color:#137333;font-weight:800}}.fail{{color:#b3261e;font-weight:800}}
a{{color:#0021a5}}small{{color:#59657b}}
</style><main><small>LOCAL CONTROL ROOM</small><h1>GatorBait Operations</h1><div class="bar"></div>
<h2>{overall}</h2><p>Last check: {html.escape(payload.get('checked_at','Not run yet'))}</p>
<div class="card"><table><thead><tr><th>System</th><th>Result</th><th>HTTP</th><th>Time</th><th>Link</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div></main></html>"""


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        if self.path not in ("/", "/api/status"):
            self.send_error(404)
            return
        payload = (
            json.loads(STATUS_PATH.read_text(encoding="utf-8"))
            if STATUS_PATH.exists()
            else {"ok": False, "checked_at": "Not run yet", "checks": []}
        )
        if self.path == "/api/status":
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
    interval = max(60, int(config.get("interval_seconds", 900)))
    server = ThreadingHTTPServer((host, port), Handler)
    server.timeout = 1
    next_check = 0.0
    print(f"GatorBait Ops Hub listening on http://{host}:{port}")
    while not stop.is_set():
        if time.monotonic() >= next_check:
            status = run_checks(config)
            print(f"{status['checked_at']} {'HEALTHY' if status['ok'] else 'ATTENTION'}")
            next_check = time.monotonic() + interval
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
