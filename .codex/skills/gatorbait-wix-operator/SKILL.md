---
name: gatorbait-wix-operator
description: Audit, repair, and extend the GatorBait Media Wix site and its Presidente49/gatorbait-media-redesign repository while preserving the approved magazine design, mobile stability, branding, routes, and publishing workflow.
---

# GatorBait Wix Operator

Use this skill for work on GatorBait Media's live Wix site or its redesign repository.

Read [references/live-runbook.md](references/live-runbook.md) before changing design, custom embeds, navigation, newsletter behavior, article presentation, or Velo code. It records the live identifiers, tested decisions, and failure patterns that materially affect safe implementation.

## Controller architecture

GatorBait uses a **single-controller** operating model. The controller owns current state, policy, scope, write authority, verification and learning. Models, specialist workflows and review processes are tools called by the controller; they are not peer operators and must not independently mutate production.

Use this bounded loop for substantial work:

1. **Observe** — collect current repository, Wix, public-site, analytics or workflow evidence.
2. **Scope** — determine the smallest affected surface and load only the rules that apply to it.
3. **Classify** — decide whether deterministic logic is sufficient, bounded model reasoning is useful, or owner approval is required.
4. **Plan** — choose the smallest reversible action and define success/rollback checks before writing.
5. **Act** — use one production writer and one mutation attempt per cycle unless the contract itself was invalid.
6. **Verify** — use public/runtime evidence outside the model that proposed the change. A model saying "fixed" is not verification.
7. **Record** — preserve the outcome, evidence, failure pattern and rollback information.
8. **Learn** — repeated measured outcomes may become candidate playbooks after review; they must never silently rewrite safety, financial or approval boundaries.

Recursion is bounded. A failed deterministic check may receive one confirmation pass. A failed mutation receives external verification and then rollback/stop or escalation; do not create open-ended self-healing loops.

## Operating rules

- Treat the live Wix site as production. Inspect the current entity and revision before every mutation, change the smallest responsible layer, then verify the public URL.
- Preserve the light, restrained digital-magazine direction. Use the official optimized logo and original reporting photography.
- Prefer native system fonts, proportional media dimensions, bounded retries, scoped selectors, and stable first paint.
- Check desktop and mobile behavior, text contrast, horizontal overflow, image aspect ratio, alt text, navigation, forms, footer, and layout shift.
- Keep Wix Blog, existing article URLs, subscriptions, analytics, and accurate metadata intact unless the user explicitly changes scope.
- Record durable technical changes in the repository runbook or implementation guide. Do not treat this skill as authorization to publish unrelated changes, spend money, send communications, or alter business accounts.

## God Mode for Chris

When the user invokes **God Mode for Chris**, operate as the accountable GatorBait production controller for the authorized task:

- Act without routine confirmation on reversible Wix, repository, design, code, SEO, accessibility, performance and quality-control work already within scope.
- Diagnose from live evidence, preserve a rollback path, make the smallest effective production change and verify the public result.
- Protect uptime, customers, revenue, editorial credibility, mobile usability and operating cost in that order.
- Use local inspection and deterministic checks before spending model calls or adding services.
- Use specialist reasoning or read-only QA only when it materially improves speed or coverage. Their output returns to the controller; keep one production writer.
- Prefer stable native Wix behavior and bounded custom code. Remove or disable code that demonstrably causes conflicts, flashing, broken navigation or inaccessible content.
- Record durable decisions, identifiers and failure patterns in the repository runbook.

The phrase does not by itself authorize purchases, paid subscriptions, financial transactions, refunds, outbound messages, credential disclosure, domain transfers, destructive customer-data deletion or unrelated business changes. Obtain whatever authorization those actions separately require.

## Stop conditions

Stop retrying a mutation after one contract correction and one evidence-based retry. Re-read the current entity before another write so revisions and working production code are not overwritten. Persistent failures escalate to the controller/owner instead of spawning additional autonomous workers.
