# Group think, Sept. 29, 2026: workflow, tools, spend

Brenden asked for a group think to optimize the workflow and tools, dispatch work back through FCC, and watch spend. Two bounded read-only workers reviewed the repo (all 41 branches, the agency repo, every workflow, the router policy); Jarvis synthesized. Nothing here changed production. No dollar figures or subscriber data in this file (Lesson 51).

## 1. Decisions

| # | Decision | Status |
|---|---|---|
| 1 | The purge inventory file must leave the public repo today. Pages serves `main` from the repo root, so the file is very likely reachable on the web, not just in git. | **Brenden, by hand.** Jarvis is blocked from removing it (Lesson 58). |
| 2 | FCC-eligible jobs are written as briefs in `automation/ops-hub/model-router/jobs-pending/`. They run only after Brenden's OpenRouter key exists; nothing routes to paid Claude in the meantime. | Done in this PR. |
| 3 | `ops-hub-cloud-cycle` drops from every 15 minutes to hourly. It reads the same seven URLs as the 6-hour health check and was committing to `main` about four times an hour. | Done in this PR. |
| 4 | `refresh-newsroom-feed` keeps its 5-minute cron. The script already gates ESPN reads to game windows, and Oct. 3 is a game day. | No change. |
| 5 | The paused routines (roundup, tagging, news sweep, presser, preview, together check-ins) are not re-enabled unchanged. When stop-work lifts, tagging and the news sweep move to the FCC lane; the two together check-ins merge into one. | Waiting on Brenden's "lift stop-work." |
| 6 | Stale branches from before the current shell (list in §5) are proposed for deletion. Nothing is deleted without Brenden's yes. | Card on the Control Room. |
| 7 | One analytics connector, not three: Windsor, Supermetrics and PostHog overlap and none is wired to a job. OpusClip needs a paid plan and has no job. | Recommendation only. |

## 2. Job inventory (what runs and what it costs)

**GitHub Actions** (free minutes on a public repo; no model tokens):

| Workflow | Cadence | Notes |
|---|---|---|
| `ops-hub-cloud-cycle.yml` | hourly (was `*/15`) | Fetches the 7 URLs in `ops-hub/config.json`, commits `cloud-state/`. |
| `gatorbait-production-health.yml` | every 6 h | Unit tests plus `site_health_check.py`. Same URLs as above. |
| `refresh-newsroom-feed.yml` | `*/5` (GitHub throttles it to a few runs a day) | Wix RSS plus ESPN public JSON, commits, requests a Pages build. |
| `live-presentation-qc.yml` | on push to `sports-live/`, `site-design/`, `deploy/` | Playwright at 320/390/430/1365. |
| `newsletter-stack-qc.yml` | on push to `newsletter/` | MJML plus Playwright preview. |
| `magazine-originals-source-qc.yml` | on push to `tools/magazine-originals/` | Source inventory. |
| `deploy-flagship-pages.yml` | manual | Uploads the repo root to Pages. |
| `gatorbait-agentic-audit` | manual only | The only Actions job that spends model credits. Keep it manual. |

**Claude cloud routines** (each firing spends Anthropic tokens): Jarvis ops loop (2 h), 7:44 a.m. money report, Control Room message routine (poke-only), monthly list cleanup (Oct. 1), Oct. 3 game day, Oct. 4 stats refresh, Codex's Sept. 30 8:30 a.m. Feature Rotation. Paused: see §1 row 5.

**Overlaps found:** cloud-cycle, production-health and the Jarvis ops loop all read the same seven URLs. The two together-repo check-ins do the same job.

## 3. FCC lane

Per `routing-policy.json` (`public_low_risk`) and `harness-policy.json` (`fcc_claude`, `fcc_codex`). Every job is read-only and returns text or JSON; Jarvis verifies before anything reaches production. Briefs live in `automation/ops-hub/model-router/jobs-pending/`.

| Job | Input | Output |
|---|---|---|
| SEO metadata drafts | public article URL or text, house title/description rules | `{slug, title<=60, description<=155, og_title}`; compare with the rendered page (Lesson 55) |
| Public article tagging | published post text, the tag list | `{post_id, tags[], category}` |
| Sports research preprocessing | public ESPN or FloridaGators.com pages | bullet facts, one source URL each; writers still write |
| Test generation and lint | repo paths in a disposable snapshot | test file or patch; CI runs it |
| Sanitized log summaries | `cloud-state/events.jsonl`, URLs only | five-line change summary |

Off FCC, always: email, members, billing, DNS, account connections, unpublished pieces, credentials.

## 4. Tool swaps

- **Fetching pages:** Exa `web_fetch_exa` or TinyFish `fetch_content`. No TinyFish browser runs for reads; visual QC stays in the CI Playwright job.
- **SEO checks:** OpenRush (keywords, SERP, page inspection) instead of browser runs. New option, no job yet.
- **Social:** Metricool for scheduling and analytics once Brenden connects Facebook and YouTube (card `connect-social`).
- **Health and monitoring:** the free GitHub cron plus `site_health_check.py`, not a connector.
- **Analytics:** pick one of Windsor, Supermetrics, PostHog. Recommendation: Windsor, since it also writes to Meta and Google Business; drop the others from the account when convenient.
- **Video:** Descript (already the tool, Lesson 52) and vidIQ. OpusClip stays unused.
- **New, not yet wired:** Shopify, Idiolect writing profiles, Miro, Descript `search_drive`. None costs anything today; none gets a job until it has one.

## 5. Branches (from the sweep of all 41)

- **Worth a PR or a decision:** `claude/front-page-hub` (Front Page 2026, PR #44), `feat/reader-support-20260929` (PR #49), `codex/customer-audit-repairs-20260929` (mostly landed; 5 files differ), `claude/barlow-only-typography` (PR #38), `claude/wix-master-skill`, `gameday-front-page-20260926` (likely superseded by front-page-hub), `claude/tender-wozniak-rmp60e` and `fix-native-flash-20260926` (large, overlapping, need triage).
- **Already on `main` by squash** (safe to delete): `claude/memory-sync-2026-09-28`, `claude/memory-sync-2026-09-28b`, `claude/pages-unblock`, `claude/scoreboard-feed`, `fix/mobile-ads-relief-20260929`, `claude/magazine-animated`, `claude/magazine-rotation`, `claude/media-2026-09-28`, `claude/ops-cleanup-20260929`.
- **Stale and superseded** (Sept. 13–22, before the current shell): `master-control*` (4), `homepage-*` (3), `restore-*` (2), `magazine-buddy-lead`, `magazine-live-issue`, `masthead-wix-refresh`, `masthead-design-quality`, `gbm-clean-frontend-v1`, `studio-rebuild-2026`, `studio-ui-lab`, `studio-product-system`.
- **Keep for reference:** `gazette-rebuild`, `ops/revenue-watch-adsense-diagnostic`, `skills/portable-business-operations-20260924`, `tools/magazine-originals-20260924`, `claude/gatorbait-studio-redesign-ysxi79`.
- **Skills only on branches:** `skills/business-operations` (portable ops plugin), `skills/wix-master`, `skills/gatorbait-design-quality`, `skills/gatorbait-studio-product-build`. Bring `wix-master` to `main` next; the rest wait.
- **Subscriber data on branches:** the purge file is on `main` plus 38 branches. Two desk logs on `claude/tender-wozniak-rmp60e` and `fix-native-flash-20260926` and one DNS inventory on `studio-rebuild-2026` hold a handful of addresses each. Deleting those branches after triage removes them from the branch list; git history keeps them until rewritten.

## 6. Spend guardrails

See `automation/ops-hub/SPEND-GUARDRAILS.md`. Short form: a cap per session type with a stop at 80%; Haiku or FCC for §3 jobs, Sonnet for drafting and QC, Opus only for architecture and final synthesis; read shared state once per session; poll with free cron, wake sessions only on change; archive a finished session the same day.
