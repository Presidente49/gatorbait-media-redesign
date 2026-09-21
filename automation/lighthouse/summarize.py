#!/usr/bin/env python3
"""Reduce N Lighthouse JSON runs to one median result and check it against budget.

Usage: summarize.py <url> <run1.json> [run2.json ...]

Budget is the one already documented in
docs/STUDIO-SEO-AI-DISCOVERY-STANDARDS.md — LCP < 2.5s, CLS < 0.1 on 4G
mobile — so this job enforces the project's own standard rather than a new one.

Writes a markdown table to $GITHUB_STEP_SUMMARY when present, always prints it,
and exits 1 if a budget metric fails so the run is visibly red.
"""

import json
import os
import statistics
import sys

# metric key -> (label, budget, unit, formatter)
BUDGET = {
    "largest-contentful-paint": ("Largest Contentful Paint", 2500.0, "ms"),
    "cumulative-layout-shift": ("Cumulative Layout Shift", 0.1, ""),
    "total-blocking-time": ("Total Blocking Time", 200.0, "ms"),
    "first-contentful-paint": ("First Contentful Paint", 1800.0, "ms"),
    "speed-index": ("Speed Index", 3400.0, "ms"),
}

CATEGORIES = ["performance", "accessibility", "best-practices", "seo"]


def fmt(value, unit):
    if unit == "ms":
        return "%.2f s" % (value / 1000.0) if value >= 1000 else "%d ms" % round(value)
    return "%.3f" % value


def main():
    if len(sys.argv) < 3:
        print("usage: summarize.py <url> <run.json> [...]", file=sys.stderr)
        return 2

    url, paths = sys.argv[1], sys.argv[2:]
    runs = []
    for p in paths:
        with open(p) as fh:
            runs.append(json.load(fh))

    lines = [
        "## Lighthouse — mobile, simulated 4G",
        "",
        "`%s`" % url,
        "",
        "Median of %d run%s." % (len(runs), "" if len(runs) == 1 else "s"),
        "",
        "| Metric | Median | Budget | |",
        "|---|---:|---:|---|",
    ]

    failed = []
    measured = 0
    for key, (label, budget, unit) in BUDGET.items():
        values = []
        for r in runs:
            audit = r.get("audits", {}).get(key, {})
            v = audit.get("numericValue")
            if v is not None:
                values.append(float(v))
        if not values:
            lines.append("| %s | not reported | %s | — |" % (label, fmt(budget, unit)))
            continue
        measured += 1
        median = statistics.median(values)
        ok = median <= budget
        if not ok:
            failed.append("%s %s (budget %s)" % (label, fmt(median, unit), fmt(budget, unit)))
        lines.append("| %s | %s | %s | %s |" % (
            label, fmt(median, unit), fmt(budget, unit), "pass" if ok else "**OVER**"))

    lines += ["", "| Category | Median score |", "|---|---:|"]
    for cat in CATEGORIES:
        scores = []
        for r in runs:
            c = r.get("categories", {}).get(cat, {})
            if c.get("score") is not None:
                scores.append(float(c["score"]) * 100)
        if scores:
            lines.append("| %s | %d |" % (cat.replace("-", " ").title(), round(statistics.median(scores))))

    lines += [
        "",
        "INP is a field metric and is not measured here; Total Blocking Time is "
        "its lab proxy. Real INP needs Search Console / CrUX data from actual "
        "visitors.",
    ]

    if not measured:
        # A verification job that measures nothing must never report success.
        failed.append(
            "Lighthouse reported no metrics at all — the audit did not run "
            "against %s. Treat this as a failure, not a pass." % url)

    if failed:
        lines += ["", "### Over budget", ""] + ["- %s" % f for f in failed]

    out = "\n".join(lines)
    print(out)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a") as fh:
            fh.write(out + "\n")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
