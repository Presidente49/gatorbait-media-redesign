#!/usr/bin/env python3
"""Read-only repository catalog and tracked-source discovery. Never installs."""
from __future__ import annotations
import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
URL = re.compile(r"https://(?:www\.)?github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)")
GIT = re.compile(r"(?:github:|git@github\.com:)([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)")
TEXT = {".md", ".txt", ".json", ".toml", ".yaml", ".yml", ".py", ".js", ".mjs", ".cjs", ".sh", ".html", ".css"}
PRIVATE = {".git", ".shared-memory", ".state", "node_modules", ".venv", "__pycache__", "secrets", "credentials"}

def extract(text):
    found = set()
    for pattern in (URL, GIT):
        for owner, repo in pattern.findall(text):
            repo = repo.removesuffix(".git").rstrip(".")
            if repo and owner.lower() not in {"orgs", "users", "settings", "features", "topics", "marketplace"}:
                found.add(owner + "/" + repo)
    return sorted(found)

def safe_file(root, relative):
    p = Path(relative)
    if p.is_absolute() or ".." in p.parts or any(x.lower() in PRIVATE for x in p.parts):
        return None
    if any(x.lower().startswith(".env") or any(s in x.lower() for s in ("secret", "credential", "token", "cookie", "private-key", "private_key")) for x in p.parts):
        return None
    current = root
    for part in p.parts:
        current = current / part
        if current.is_symlink():
            return None
    if not current.is_file() or not current.resolve().is_relative_to(root.resolve()):
        return None
    if current.suffix.lower() not in TEXT and current.name not in {".gitmodules", "Dockerfile"}:
        return None
    if current.stat().st_size > 1_000_000:
        return None
    return current

def scan(root):
    root = root.resolve()
    cmd = subprocess.run(["git", "-C", str(root), "ls-files", "-z"], capture_output=True, check=True, timeout=30)
    names = cmd.stdout.decode("utf-8").split("\0")
    entries, checked, skipped = {}, 0, 0
    for name in filter(None, names):
        p = safe_file(root, name)
        if p is None:
            skipped += 1
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            skipped += 1
            continue
        checked += 1
        for repo in extract(text):
            entries.setdefault(repo, []).append(name)
    return {"coverage": "Tracked safe text files only; no untracked, private, oversized, binary or external-symlink content. No history or issue crawl.", "files_read": checked, "files_skipped": skipped, "candidates": [{"repository": k, "evidence_paths": v, "status": "DISCOVERY_ONLY"} for k, v in sorted(entries.items())]}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", help="Catalog ID to inspect")
    parser.add_argument("--scan", type=Path, help="Read-only candidate scan of an approved checkout")
    args = parser.parse_args()
    try:
        if args.scan:
            result = scan(args.scan)
        else:
            data = json.loads((ROOT / "catalog/repos.json").read_text())
            matches = [r for r in data["repositories"] if r["id"] == args.repo]
            if args.repo and not matches:
                parser.error("Unknown catalog ID")
            result = matches[0] if args.repo else data
        print(json.dumps(result, indent=2))
        return 0
    except (OSError, UnicodeError, ValueError, subprocess.SubprocessError) as exc:
        print(json.dumps({"status": "BLOCKED", "error": str(exc)}))
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
