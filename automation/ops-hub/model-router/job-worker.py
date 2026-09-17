#!/usr/bin/env python3
"""Host-side queue worker for n8n -> GatorBait model harness jobs.

n8n writes JSON jobs into .state/model-jobs/inbox through a bind mount. This host
process claims each job atomically, calls task-runner.py, and writes a JSON result
into done/ or failed/. Model credentials stay on the Mac and never enter n8n.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import uuid
from typing import Any

HERE = Path(__file__).resolve().parent
OPS_HUB = HERE.parent
QUEUE_ROOT = OPS_HUB / ".state" / "model-jobs"
RUNNER = HERE / "task-runner.py"

ALLOWED_KEYS = {"id", "lane", "kind", "harness", "prompt", "timeout", "max_turns"}
REQUIRED_KEYS = {"lane", "prompt"}


def ensure_dirs() -> dict[str, Path]:
    paths = {name: QUEUE_ROOT / name for name in ("inbox", "running", "done", "failed")}
    for path in paths.values():
        path.mkdir(parents=True, exist_ok=True)
        try:
            path.chmod(0o700)
        except OSError:
            pass
    return paths


def load_job(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("job must be a JSON object")
    extra = set(data) - ALLOWED_KEYS
    if extra:
        raise ValueError(f"unsupported job keys: {sorted(extra)}")
    missing = REQUIRED_KEYS - set(data)
    if missing:
        raise ValueError(f"missing job keys: {sorted(missing)}")
    if not isinstance(data.get("prompt"), str) or not data["prompt"].strip():
        raise ValueError("prompt must be a non-empty string")
    return data


def write_result(path: Path, payload: dict[str, Any]) -> None:
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    try:
        temp.chmod(0o600)
    except OSError:
        pass
    os.replace(temp, path)


def claim(path: Path, running_dir: Path) -> Path | None:
    target = running_dir / path.name
    try:
        os.replace(path, target)
        return target
    except FileNotFoundError:
        return None


def run_job(path: Path, dirs: dict[str, Path]) -> None:
    started = time.time()
    try:
        job = load_job(path)
        job_id = str(job.get("id") or path.stem or uuid.uuid4())
        lane = str(job["lane"])
        kind = str(job.get("kind") or "analysis")
        timeout = int(job.get("timeout") or 900)
        max_turns = int(job.get("max_turns") or 8)

        command = [
            sys.executable,
            str(RUNNER),
            "--lane",
            lane,
            "--kind",
            kind,
            "--prompt",
            job["prompt"],
            "--timeout",
            str(timeout),
            "--max-turns",
            str(max_turns),
            "--execute",
        ]
        if job.get("harness"):
            command.extend(["--harness", str(job["harness"])])

        proc = subprocess.run(
            command,
            cwd=OPS_HUB.parent.parent,
            capture_output=True,
            text=True,
            timeout=max(60, timeout + 30),
            check=False,
        )

        runner_payload: Any
        try:
            runner_payload = json.loads(proc.stdout)
        except json.JSONDecodeError:
            runner_payload = {"raw_stdout": proc.stdout}

        result = {
            "job_id": job_id,
            "ok": proc.returncode == 0,
            "returncode": proc.returncode,
            "started_at_unix": started,
            "completed_at_unix": time.time(),
            "elapsed_seconds": round(time.time() - started, 3),
            "runner": runner_payload,
            "worker_stderr": proc.stderr,
        }
        destination = dirs["done"] if proc.returncode == 0 else dirs["failed"]
        write_result(destination / f"{job_id}.json", result)
    except Exception as exc:  # queue must record malformed jobs instead of looping forever
        job_id = path.stem or str(uuid.uuid4())
        write_result(
            dirs["failed"] / f"{job_id}.json",
            {
                "job_id": job_id,
                "ok": False,
                "error": f"{type(exc).__name__}: {exc}",
                "started_at_unix": started,
                "completed_at_unix": time.time(),
            },
        )
    finally:
        try:
            path.unlink()
        except FileNotFoundError:
            pass


def cycle() -> int:
    dirs = ensure_dirs()
    jobs = sorted(dirs["inbox"].glob("*.json"), key=lambda p: p.stat().st_mtime)
    if not jobs:
        return 0
    claimed = claim(jobs[0], dirs["running"])
    if claimed is None:
        return 0
    run_job(claimed, dirs)
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--once", action="store_true", help="Process at most one queued job and exit.")
    parser.add_argument("--interval", type=float, default=2.0, help="Polling interval in seconds when running continuously.")
    args = parser.parse_args()

    if args.once:
        cycle()
        return 0

    while True:
        worked = cycle()
        if not worked:
            time.sleep(max(0.5, args.interval))


if __name__ == "__main__":
    raise SystemExit(main())
