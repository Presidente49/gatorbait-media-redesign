#!/usr/bin/env python3
"""Bounded local worker dispatcher for GatorBait Claude/Codex/FCC lanes.

The runner is intentionally NOT a production writer. By default it creates a disposable
snapshot of the repository, runs a read-only worker there, and returns structured evidence
for the controller to verify and apply separately.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
from typing import Any

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[2]
POLICY_PATH = HERE / "harness-policy.json"
PLUGIN_REL = Path("automation/ops-hub/model-router/gatorbait-claude-plugin")

SECRET_PATTERNS = [
    re.compile(r"\b(?:ANTHROPIC|OPENAI|WIX|GMAIL|GOOGLE|STRIPE|OPENROUTER)_?(?:API_)?(?:KEY|TOKEN)\s*[=:]\s*\S+", re.I),
    re.compile(r"\b(?:password|passwd|secret)\s*[=:]\s*\S+", re.I),
    re.compile(r"\bsk-[A-Za-z0-9_-]{16,}"),
    re.compile(r"\bBearer\s+[A-Za-z0-9._~+/-]{16,}", re.I),
]


def load_policy() -> dict[str, Any]:
    return json.loads(POLICY_PATH.read_text(encoding="utf-8"))


def secret_like(text: str) -> bool:
    return any(pattern.search(text) for pattern in SECRET_PATTERNS)


def choose_harness(lane: str, kind: str, explicit: str | None, policy: dict[str, Any]) -> str:
    harnesses = policy["harnesses"]
    if explicit:
        if explicit not in harnesses:
            raise ValueError(f"unknown harness: {explicit}")
        allowed = harnesses[explicit].get("allowed_data_lanes", [])
        if lane not in allowed:
            raise ValueError(f"{explicit} is not allowed for data lane {lane}")
        return explicit

    if lane == "credentials_and_secrets":
        raise ValueError("credentials_and_secrets may not be dispatched to a model worker")
    if lane == "sensitive":
        return "codex_native" if kind == "code" else "claude_native"
    if lane == "public_high_reasoning":
        return "codex_native" if kind == "code" else "claude_native"
    if lane == "public_low_risk":
        return "fcc_codex" if kind == "code" else "fcc_claude"
    raise ValueError(f"unknown data lane: {lane}")


def make_snapshot(source: Path, target: Path) -> str:
    """Create a disposable source snapshot. Prefer committed git state for determinism."""
    git = shutil.which("git")
    if git and (source / ".git").exists():
        archive = target.parent / "repo.tar"
        with archive.open("wb") as fh:
            proc = subprocess.run(
                [git, "-C", str(source), "archive", "--format=tar", "HEAD"],
                stdout=fh,
                stderr=subprocess.PIPE,
                check=False,
            )
        if proc.returncode == 0:
            target.mkdir(parents=True, exist_ok=True)
            with tarfile.open(archive, "r") as tf:
                tf.extractall(target, filter="data")
            return "git_archive_head"

    ignore = shutil.ignore_patterns(".git", ".state", "__pycache__", ".DS_Store")
    shutil.copytree(source, target, dirs_exist_ok=True, ignore=ignore)
    return "filesystem_copy"


def command_for(harness: str, prompt: str, workspace: Path, max_turns: int) -> list[str]:
    plugin_dir = workspace / PLUGIN_REL

    if harness in {"claude_native", "fcc_claude"}:
        exe = "claude" if harness == "claude_native" else "fcc-claude"
        command = [
            exe,
            "-p",
            prompt,
            "--output-format",
            "json",
            "--permission-mode",
            "dontAsk",
            "--allowedTools",
            "Read,Glob,Grep",
            "--max-turns",
            str(max_turns),
        ]
        if plugin_dir.exists():
            command.extend(["--plugin-dir", str(plugin_dir)])
        return command

    if harness in {"codex_native", "fcc_codex"}:
        exe = "codex" if harness == "codex_native" else "fcc-codex"
        # The disposable workspace is the real write boundary. read-only remains requested,
        # but controller safety does not depend on the harness correctly enforcing it.
        return [
            exe,
            "exec",
            "--json",
            "--ephemeral",
            "--sandbox",
            "read-only",
            "--skip-git-repo-check",
            "-C",
            str(workspace),
            "--",
            prompt,
        ]

    raise ValueError(f"unsupported harness: {harness}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lane", choices=["public_low_risk", "public_high_reasoning", "sensitive", "credentials_and_secrets"], required=True)
    parser.add_argument("--kind", choices=["code", "editorial", "operations", "analysis"], default="analysis")
    parser.add_argument("--harness", choices=["claude_native", "fcc_claude", "codex_native", "fcc_codex"])
    prompt_group = parser.add_mutually_exclusive_group(required=True)
    prompt_group.add_argument("--prompt")
    prompt_group.add_argument("--prompt-file")
    parser.add_argument("--working-dir", default=str(REPO_ROOT))
    parser.add_argument("--max-turns", type=int, default=8)
    parser.add_argument("--timeout", type=int, default=900)
    parser.add_argument("--execute", action="store_true", help="Actually invoke the selected harness. Omit for a routing dry-run.")
    args = parser.parse_args()

    prompt = args.prompt
    if args.prompt_file:
        prompt = Path(args.prompt_file).read_text(encoding="utf-8")
    assert prompt is not None

    if secret_like(prompt):
        print(json.dumps({"ok": False, "error": "prompt_rejected_secret_like_material"}))
        return 3

    if not 1 <= args.max_turns <= 20:
        print(json.dumps({"ok": False, "error": "max_turns_out_of_bounds"}))
        return 3

    policy = load_policy()
    try:
        harness = choose_harness(args.lane, args.kind, args.harness, policy)
    except ValueError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 3

    command_name = policy["harnesses"][harness]["command"]
    route = {
        "ok": True,
        "controller_authority": True,
        "production_write_authorized": False,
        "lane": args.lane,
        "kind": args.kind,
        "harness": harness,
        "command": command_name,
        "token_pool": policy["harnesses"][harness]["token_pool"],
        "actual_upstream_model": "must_be_observed_from_runtime; never inferred from harness name",
        "snapshot": True,
    }

    if not args.execute:
        route["dry_run"] = True
        print(json.dumps(route, indent=2))
        return 0

    if shutil.which(command_name) is None:
        route.update({"ok": False, "error": f"missing_command:{command_name}"})
        print(json.dumps(route, indent=2))
        return 4

    source = Path(args.working_dir).resolve()
    if not source.is_dir():
        route.update({"ok": False, "error": f"working_dir_not_found:{source}"})
        print(json.dumps(route, indent=2))
        return 4

    started = time.time()
    with tempfile.TemporaryDirectory(prefix="gatorbait-worker-") as temp:
        workspace = Path(temp) / "workspace"
        snapshot_method = make_snapshot(source, workspace)
        command = command_for(harness, prompt, workspace, args.max_turns)
        env = os.environ.copy()
        env["NO_COLOR"] = "1"

        try:
            proc = subprocess.run(
                command,
                cwd=workspace,
                env=env,
                capture_output=True,
                text=True,
                timeout=max(30, args.timeout),
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            route.update({
                "ok": False,
                "error": "worker_timeout",
                "timeout_seconds": args.timeout,
                "snapshot_method": snapshot_method,
                "elapsed_seconds": round(time.time() - started, 3),
                "stdout": exc.stdout or "",
                "stderr": exc.stderr or "",
            })
            print(json.dumps(route, indent=2))
            return 5

        route.update({
            "ok": proc.returncode == 0,
            "dry_run": False,
            "returncode": proc.returncode,
            "snapshot_method": snapshot_method,
            "elapsed_seconds": round(time.time() - started, 3),
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        })
        print(json.dumps(route, indent=2))
        return 0 if proc.returncode == 0 else 6


if __name__ == "__main__":
    raise SystemExit(main())
