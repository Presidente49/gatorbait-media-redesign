---
name: gatorbait-wix-operator
description: Audit, repair, and extend the GatorBait Media Wix site and its Presidente49/gatorbait-media-redesign repository while preserving the approved magazine design, mobile stability, branding, routes, and publishing workflow.
---

# GatorBait Wix Operator

Use this skill for work on GatorBait Media's live Wix site or its redesign repository.

Read [references/live-runbook.md](references/live-runbook.md) before changing design, custom embeds, navigation, newsletter behavior, article presentation, or Velo code. It records the live identifiers, tested decisions, and failure patterns that materially affect safe implementation.

## Operating rules

- Treat the live Wix site as production. Inspect the current entity and revision before every mutation, change the smallest responsible layer, then verify the public URL.
- Preserve the light, restrained digital-magazine direction. Use the official optimized logo and original reporting photography.
- Prefer native system fonts, proportional media dimensions, bounded retries, scoped selectors, and stable first paint.
- Check desktop and mobile behavior, text contrast, horizontal overflow, image aspect ratio, alt text, navigation, forms, footer, and layout shift.
- Keep Wix Blog, existing article URLs, subscriptions, analytics, and accurate metadata intact unless the user explicitly changes scope.
- Record durable technical changes in the repository runbook or implementation guide. Do not treat this skill as authorization to publish unrelated changes, spend money, send communications, or alter business accounts.

## Stop conditions

Stop retrying a mutation after one contract correction and one evidence-based retry. Re-read the current entity before another write so revisions and working production code are not overwritten.
