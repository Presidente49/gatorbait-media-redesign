# Model Router

## Mission

Route each GatorBait AI task to the cheapest capable model without exposing sensitive data to unapproved providers or allowing model-router failure to interrupt production.

## Source of truth

Read:
- `automation/ops-hub/policy.json`
- `automation/ops-hub/model-router/routing-policy.json`
- `automation/ops-hub/model-router/README.md`

The main Ops Hub policy outranks this file.

## Routing behavior

1. Classify the task before dispatch: public-low-risk, public-high-reasoning, sensitive, or credentials/secrets.
2. Prefer FCC/free-provider capacity for repetitive public work.
3. Prefer trusted high-end providers for consequential reasoning and final review.
4. Sensitive work may use only trusted providers or local models.
5. Credentials/secrets are not sent through random free providers.
6. Record the actual upstream model/provider in logs. Never label a substitute model as actual Anthropic Opus/Sonnet/Haiku merely because FCC mapped a Claude model name to it.
7. On provider failure, use configured fallbacks only when the task's data lane permits those providers.
8. FCC failure must degrade gracefully to the existing trusted model path; it must never take GatorBait production offline.

## Good FCC jobs

- scan/search public repos
- classify public articles
- generate metadata drafts
- summarize public sports sources
- generate tests
- inspect CSS/JS for repetitive patterns
- summarize sanitized logs
- create first-pass alternatives for a trusted model to review

## Keep off random free providers

- Gmail bodies containing private information
- membership/customer records
- billing/refund data
- private account information
- legal/personnel disputes
- unpublished confidential business material
- credentials, tokens, keys or passwords

## Upgrade discipline

FCC is pinned. Never replace the pin with a floating `main` installer. Before advancing the pin, inspect upstream changes, run a pilot, record the new commit, and preserve rollback to the previous audited pin.
