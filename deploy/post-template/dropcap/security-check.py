#!/usr/bin/env python3
"""Free local SAST for the article layer and an optional trusted template.

Requires Python 3.9+, Node.js and uvx. Does not execute template JavaScript,
contact Wix, upload source, authenticate, or replace runtime/visual testing.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from html.parser import HTMLParser


SEMGREP_VERSION = "1.182.1"
HERE = Path(__file__).resolve().parent


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def digest(data):
    return hashlib.sha256(data).hexdigest()


class Scripts(HTMLParser):
    """Preserve script text, rather than interpreting HTML or running it."""

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.current = None
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script":
            if self.current is not None:
                raise ValueError("Nested script tags")
            attrs = dict(attrs)
            kind = attrs.get("type", "").lower().strip()
            self.current = {
                "id": attrs.get("id"), "src": attrs.get("src"),
                "javascript": kind in ("", "module", "text/javascript",
                                       "application/javascript"),
                "line": self.getpos()[0], "chunks": [],
            }

    def handle_data(self, data):
        if self.current is not None:
            self.current["chunks"].append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self.current is not None:
            self.scripts.append(self.current)
            self.current = None


def extract(source, output):
    raw = source.read_bytes()
    parser = Scripts()
    parser.feed(raw.decode("utf-8"))
    parser.close()
    if parser.current is not None:
        raise ValueError("Unclosed script tag in " + str(source))
    output.mkdir()
    targets = []
    for index, script in enumerate(parser.scripts, 1):
        body = "".join(script.pop("chunks"))
        if script["src"]:
            raise ValueError("External scripts are outside this local gate: "
                             + str(source))
        if not script.pop("javascript"):
            continue  # Data blocks, such as application/ld+json, are not JS.
        if not body.strip():
            continue
        target = output / ("script-%02d.js" % index)
        target.write_text(body, encoding="utf-8")
        targets.append(dict(script, target=str(target), bytes=len(body.encode()),
                            sha256=digest(body.encode())))
    if not targets:
        raise ValueError("No nonempty inline JavaScript in " + str(source))
    return {"source": str(source), "sha256": digest(raw), "bytes": len(raw),
            "scripts": targets}


def run(command, output, name, env):
    """No shell, autofix, build, source upload, or remote execution."""
    write_json(output / (name + "-command.json"), command)
    with (output / (name + ".stdout")).open("w") as stdout:
        with (output / (name + ".stderr")).open("w") as stderr:
            result = subprocess.run(command, env=env, stdout=stdout,
                                    stderr=stderr, timeout=240, check=False)
    return result.returncode


def scan(name, targets, rules, output, uvx, env):
    command = [uvx, "--from", "semgrep==" + SEMGREP_VERSION,
               "--index-url", "https://pypi.org/simple", "semgrep", "scan",
               "--oss-only", "--metrics", "off", "--disable-version-check",
               "--no-git-ignore", "--json", "--time", "--verbose",
               "--strict", "--error"]
    for ruleset in rules:
        command.extend(["--config", ruleset])
    command.extend(str(target) for target in targets)
    code = run(command, output, name, env)
    data = json.loads((output / (name + ".stdout")).read_text())
    log = (output / (name + ".stderr")).read_text()
    log = re.sub(r"\x1b\[[0-9;]*m", "", log)
    counts = re.findall(r"Rules run:\s*(\d+)", log)
    applicable = int(counts[-1]) if counts else 0
    scanned = {str(Path(path).resolve())
               for path in data.get("paths", {}).get("scanned", [])}
    expected = {str(path.resolve()) for path in targets}
    result = {
        "exit_code": code, "version": data.get("version"),
        "applicable_rules_run": applicable, "expected_targets": sorted(expected),
        "scanned_targets": sorted(scanned), "findings": data.get("results", []),
        "errors": data.get("errors", []),
        "skipped_files": data.get("paths", {}).get("skipped", []),
        "skipped_rules": data.get("skipped_rules", []),
        "rulesets": rules,
    }
    failures = []
    if code != 0:
        failures.append("nonzero scanner exit")
    if data.get("version") != SEMGREP_VERSION:
        failures.append("unexpected scanner version")
    if applicable <= 0:
        failures.append("no applicable rules proved")
    if scanned != expected:
        failures.append("scan target coverage mismatch")
    for field in ("findings", "errors", "skipped_files", "skipped_rules"):
        if result[field]:
            failures.append(field)
    result["failures"] = failures
    write_json(output / (name + "-assessment.json"), result)
    if failures:
        raise ValueError(name + ": " + ", ".join(failures))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--candidate", type=Path,
                        help="Trusted local HTML containing this exact layer JS once")
    parser.add_argument("--output-dir", type=Path,
                        help="New or empty evidence directory; defaults to private temp")
    args = parser.parse_args()
    output = (args.output_dir.resolve() if args.output_dir else
              Path(tempfile.mkdtemp(prefix="gatorbait-template-security-")))
    if output.exists() and any(output.iterdir()):
        parser.error("Evidence directory must be empty: " + str(output))
    output.mkdir(parents=True, exist_ok=True, mode=0o700)
    summary = {"verdict": "FAIL", "started_at_utc": datetime.now(timezone.utc).isoformat(),
               "engine": "Semgrep CE", "version": SEMGREP_VERSION, "metrics": "off",
               "scope": "Local inline JavaScript SAST and runner Python SAST; no DAST",
               "sources": [], "scans": {}}
    try:
        node, uvx = shutil.which("node"), shutil.which("uvx")
        if not node or not uvx:
            raise ValueError("Node.js and uvx must be installed")
        env = dict(os.environ)
        env.pop("SEMGREP_APP_TOKEN", None)
        env.update(SEMGREP_SEND_METRICS="off", SEMGREP_ENABLE_VERSION_CHECK="0")
        for tool, command in [("node", [node, "--version"]),
                              ("uvx", [uvx, "--version"])]:
            if run(command, output, tool + "-version", env):
                raise ValueError(tool + " version check failed")
        layer = extract(HERE / "layer.html", output / "changed-layer")
        summary["sources"].append(layer)
        if args.candidate:
            candidate = extract(args.candidate.resolve(), output / "candidate")
            summary["sources"].append(candidate)
            layer_scripts = layer["scripts"]
            if len(layer_scripts) != 1 or sum(
                    script["sha256"] == layer_scripts[0]["sha256"]
                    for script in candidate["scripts"]) != 1:
                raise ValueError("Candidate must contain this exact layer JS once")
        for source in summary["sources"]:
            for script in source["scripts"]:
                name = Path(script["target"]).parent.name + "-" + Path(script["target"]).stem
                if run([node, "--check", script["target"]], output, name + "-syntax", env):
                    raise ValueError("JavaScript syntax check failed: " + name)
        for source in summary["sources"]:
            name = Path(source["scripts"][0]["target"]).parent.name
            targets = [Path(script["target"]) for script in source["scripts"]]
            summary["scans"][name] = scan(name, targets,
                ["p/javascript", "p/security-audit"], output, uvx, env)
        # Copy this exact runner so its coverage is checked like every other target.
        runner = output / "security-check.py"
        runner.write_bytes(Path(__file__).read_bytes())
        summary["runner_sha256"] = digest(runner.read_bytes())
        summary["scans"]["runner"] = scan("runner", [runner],
            ["p/python", "p/security-audit"], output, uvx, env)
        for source in summary["sources"]:
            if digest(Path(source["source"]).read_bytes()) != source["sha256"]:
                raise ValueError("Source changed during scan")
        if digest(Path(__file__).read_bytes()) != summary["runner_sha256"]:
            raise ValueError("Runner changed during scan")
        summary["verdict"] = "PASS"
    except (ValueError, OSError, subprocess.SubprocessError) as error:
        summary["error"] = str(error)
    finally:
        summary["finished_at_utc"] = datetime.now(timezone.utc).isoformat()
        write_json(output / "summary.json", summary)
    print(summary["verdict"] + ": " + str(output / "summary.json"))
    if "error" in summary:
        print(summary["error"], file=sys.stderr)
    return 0 if summary["verdict"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
