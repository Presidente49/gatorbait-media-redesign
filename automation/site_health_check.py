#!/usr/bin/env python3
"""Dependency-free production checks for GatorBait Media."""

from __future__ import annotations

import concurrent.futures
import os
import ssl
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass


USER_AGENT = "GatorBait-Production-QC/1.0 (+https://www.gatorbaitmedia.com/)"
TIMEOUT_SECONDS = 35


@dataclass(frozen=True)
class Target:
    name: str
    url: str


TARGETS = (
    Target("Homepage", "https://www.gatorbaitmedia.com/?github_health=1"),
    Target("Magazine", "https://www.gatorbaitmedia.com/magazine"),
    Target("GatorBait TV", "https://www.gatorbaitmedia.com/the-buddy-martin-show"),
    Target("Membership", "https://www.gatorbaitmedia.com/pricing-plans"),
    Target("Policies", "https://www.gatorbaitmedia.com/policies"),
    Target("Contact", "https://www.gatorbaitmedia.com/contact"),
    Target("Official store", "https://gatorbait2026.itemorder.com/shop/home/"),
)

HOMEPAGE_REQUIRED = (
    "GatorBait Media",
    "d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp",
    "GatorBait Weekly",
)

HOMEPAGE_BOOT_MARKERS = (
    "gbm-standalone-live",
    "gbm-newsroom-boot",
    "gbm-prepaint-v2",
)

HOMEPAGE_FORBIDDEN = (
    "fonts.googleapis.com/css2?family=Archivo",
    "background-color: #1c1f2e",
)


def fetch(target: Target) -> dict[str, object]:
    request = urllib.request.Request(target.url, headers={"User-Agent": USER_AGENT})
    started = time.monotonic()
    context = ssl.create_default_context()
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=context) as response:
            body = response.read().decode("utf-8", "replace")
            elapsed = round(time.monotonic() - started, 2)
            return {
                "target": target,
                "ok": 200 <= response.status < 400 and response.geturl().startswith("https://"),
                "status": response.status,
                "final_url": response.geturl(),
                "seconds": elapsed,
                "body": body,
                "error": "",
            }
    except (urllib.error.URLError, TimeoutError, ssl.SSLError) as exc:
        return {
            "target": target,
            "ok": False,
            "status": 0,
            "final_url": target.url,
            "seconds": round(time.monotonic() - started, 2),
            "body": "",
            "error": str(exc),
        }


def write_summary(lines: list[str]) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as handle:
            handle.write("\n".join(lines) + "\n")


def main() -> int:
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(TARGETS)) as pool:
        results = list(pool.map(fetch, TARGETS))

    failures: list[str] = []
    summary = [
        "## GatorBait production health",
        "",
        "| Check | Status | Seconds | Final URL |",
        "|---|---:|---:|---|",
    ]

    for result in results:
        target = result["target"]
        assert isinstance(target, Target)
        label = "PASS" if result["ok"] else "FAIL"
        summary.append(
            f"| {target.name} | {label} ({result['status']}) | {result['seconds']} | {result['final_url']} |"
        )
        if not result["ok"]:
            failures.append(f"{target.name}: {result['error'] or result['status']}")

    homepage = next(item for item in results if item["target"].name == "Homepage")
    homepage_body = str(homepage["body"])
    if homepage["ok"]:
        for marker in HOMEPAGE_REQUIRED:
            if marker.lower() not in homepage_body.lower():
                failures.append(f"Homepage missing required marker: {marker}")
        if not any(marker.lower() in homepage_body.lower() for marker in HOMEPAGE_BOOT_MARKERS):
            failures.append(
                "Homepage missing an active newsroom boot marker: "
                + ", ".join(HOMEPAGE_BOOT_MARKERS)
            )
        for marker in HOMEPAGE_FORBIDDEN:
            if marker.lower() in homepage_body.lower():
                failures.append(f"Homepage contains retired marker: {marker}")

    summary.extend(["", "### Result", ""])
    if failures:
        summary.extend([f"- ❌ {failure}" for failure in failures])
    else:
        summary.append("- ✅ Critical routes, HTTPS, stable boot, optimized logo and newsletter branding passed.")

    write_summary(summary)
    print("\n".join(summary))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
