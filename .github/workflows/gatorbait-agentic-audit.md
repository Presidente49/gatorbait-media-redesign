---
private: true
emoji: "🐊"
name: GatorBait Agentic Quality Audit
description: Manually review GatorBait production safeguards, design consistency, and repository changes with a tightly bounded AI budget.
intent: Give the owner a concise, evidence-backed quality assessment without changing production or creating unnecessary work.
on:
  workflow_dispatch:

permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read

max-ai-credits: 500
max-turns: 8
timeout-minutes: 15
strict: true

tools:
  github:
    mode: gh-proxy
    toolsets: [default]

network:
  allowed:
    - defaults
    - www.gatorbaitmedia.com
    - gatorbait2026.itemorder.com

safe-outputs:
  mentions: false
  allowed-github-references: []
  create-issue:
    title-prefix: "[GatorBait quality audit] "
    labels: [report]
    close-older-issues: true
    expires: 14d
    max: 1
---

# GatorBait Agentic Quality Audit

## Task

Audit the repository and current public site for a small set of material quality risks.

1. Read `AGENTS.md`, `.codex/skills/gatorbait-wix-operator/SKILL.md`, and its live runbook before judging any implementation.
2. Run `python automation/site_health_check.py` once. Treat its output as the source of truth for route availability and stable homepage markers.
3. Inspect only files changed in the latest 20 commits plus the production health workflow and script. Do not perform a broad rewrite or propose a new architecture.
4. Check for broken production routes, flashing or layout-instability regressions, mobile overflow risks, unreadable color contrast, incorrect GatorBait branding, stale merchandise links, and accidental reintroduction of heavy remote fonts.
5. Separate verified failures from suggestions. Include file paths and commands that support every verified failure.

Create one issue only when at least one reproducible, material problem exists. Use this structure: `### Summary`, `### Verified failures`, `### Smallest safe fixes`, and `### Evidence`. Keep it under 900 words and list at most five findings.

Do not edit files, call Wix APIs, alter DNS, deploy, merge, send messages, or expose secrets. If all checks pass, evidence is insufficient, or the only findings are subjective preferences, call `noop` with a short reason and create no issue.

## Safe Outputs

- Use `create-issue` only for reproducible material failures.
- Use `noop` when no owner action is needed.
