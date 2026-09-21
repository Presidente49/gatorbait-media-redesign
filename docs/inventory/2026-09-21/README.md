# Repository deep dive — 2026-09-21

Full inventory of everything in the two repositories reachable from this
session, what is actually live, what is dead, and what is quietly broken.

**Scope:** `Presidente49/gatorbait-media-redesign` (98 commits) and
`Presidente49/together` (1 commit). No other folders exist in this workspace.

**Method:** filesystem walk, git history, workflow triggers, and the ops-hub
state the cloud cycle recorded at 16:28 UTC today. Live Wix state was read
earlier in this session via the Wix Blog and Custom Embeds APIs.

**Verification limit — read this before acting on anything below.** This
sandbox's network policy blocks `gatorbaitmedia.com`, `static.wixstatic.com`
and `presidente49.github.io`. Everything marked **VERIFIED** was confirmed
against a primary source. Everything marked **INFERRED** follows from evidence
in the repo but has *not* been confirmed against the live URL. Do not treat an
inference as a fact.

---

## 1. Findings, most urgent first

### P1 — The Pages deploy took over the sitemap host. `INFERRED, high confidence`

At 06:52 UTC today, `Deploy flagship GitHub preview with Pages` ran for the
first time. It publishes `./flagship` as the **root** of GitHub Pages:

```yaml
- uses: actions/upload-pages-artifact@v4
  with:
    path: ./flagship
```

`flagship/` contains two files. It does not contain the sitemaps. But
`sitemap-index.xml` still points at:

```
https://presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml
https://presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml
```

Those paths were served from the repository root before this morning. They are
almost certainly **404 now**. `news-sitemap.xml` is a Google News sitemap and
is actively maintained — it was refreshed today ("Auto-refresh sitemap
2026-09-21"). If it is submitted in Search Console, Google News discovery has
been broken since this morning and nothing would have reported it.

**Scope correction:** the homepage loader pins its assets to **jsDelivr**, not
GitHub Pages, so this finding does *not* affect the live site. It is a
sitemap-serving problem only.

**Check first:** open both URLs in a browser. If they 404, confirm in Search
Console whether either sitemap is submitted.

**Fix:** copy `news-sitemap.xml`, `posts-sitemap.xml`, `sitemap-index.xml` and
the root `index.html` into the published directory, or point the Pages
artifact at a directory that contains both the preview and the sitemaps. One
commit either way.

### P2 — The monitor is telling the truth: the newsroom front page is switched off. `VERIFIED`

**This finding replaces an earlier version of this document, which claimed the
monitor was raising a false alarm. That was wrong, and the correction matters.**

`ops-hub` requires the homepage to contain one of `gbm-standalone-live`,
`gbm-newsroom-boot`, `gbm-prepaint-v2`, and reports it missing. The first of
those is the marker of the **current** architecture, not an abandoned one. It
is missing because the loader that produces it is disabled.

Live embed `fdc2127a-845a-4d02-b711-438f1a4a86ce`:

```
name      GBM - Game Night loader + source mobile fit [SAFE MODE OFF]
revision  36
enabled   FALSE
position  HEAD
```

Its 670 bytes are four asset references — `wix-live.css`, `wix-live-ui.css`,
`wix-live.js`, `wix-live-ui.js` — served from jsDelivr, pinned to commit
`d03d9d1e0350c55be03df1a8ebed0180c9a74c5d`. That is the repo-backed newsroom
front page. With it off, the homepage falls back to native Wix.

**This is the most likely explanation for "the site is super basic and not
functioning correctly."**

The pinned renderer is fail-open and satisfies every condition the Sept 15
incident doc requires:

```js
function mount(posts){
  if(!home()||!posts||posts.length<4) return;
  root.innerHTML=build(posts);
  document.documentElement.classList.add('gbm-standalone-live');
}
```

Content is built first; the native site is suppressed only afterwards; any
early return or thrown exception leaves native Wix visible. `unmount()`
removes both the class and the root. This is not the pattern that caused the
outage — it is the corrected version of it.

**Unresolved:** the `[SAFE MODE OFF]` tag appears on 15 embeds. Something
put this site into a deliberate safe mode and the reason is not recorded
anywhere in this repository. Re-enabling without knowing why safe mode was
engaged is the same class of mistake as the original outage.

### P3 — Four front pages, no source of truth. `VERIFIED`

| Path | Size | Status | Consumer |
|---|---:|---|---|
| `newsroom-preview/` (`wix-live.*`) | — | **production source of the live front page**, currently disabled | embed `fdc2127a` rev 36 |
| `studio/` + `studio/landing.html` | 38.9 KB | today's build | reference only per `WIX-STUDIO-TOOLCHAIN.md` |
| `flagship/index.html` | 28.1 KB | **publicly deployed** | GitHub Pages |
| `flagship/front-page/index.html` | 39.8 KB | staged, awaiting deploy | GitHub Pages |

Two of these are the same design (`studio/landing.html` and
`flagship/front-page/index.html` come from one generator). The other two are
genuinely different directions built two days apart.

This is the mechanism behind "I don't know which version of the site is
real." Nothing here is broken; it is unresolved. **One direction should be
chosen and the others deleted, not left in place.**

### P4 — A five-minute job feeds a renderer that is currently switched off. `VERIFIED`

`refresh-newsroom-feed.yml` runs `*/5 * * * *` — **288 runs/day** — pulling
fresh Wix Blog posts into `newsroom-preview/data/posts.json`. It feeds the production newsroom renderer — which is real, and currently
disabled (P2).

It is not useless, it is mis-wired: it is the exact live-data pipeline the new
front page needs. `studio/build_front_page.py` currently reads a snapshot I
captured by hand today, which will go stale. Pointing the generator at this
feed makes the front page self-updating.

### P5 — 90% of the repository is a different company. `VERIFIED`

```
working tree   19 MB
divorce-club/  18 MB   (90%)
```

`divorce-club/` holds Instagram graphics, a business strategy deck and a
GoHighLevel playbook for an unrelated venture. It is in git history, so every
clone and every CI checkout pays for it.

Not urgent, not dangerous, and **not mine to delete.** Moving it to its own
repository would cut checkout time on all five workflows.

### P6 — Stale branches. `VERIFIED`

| Branch | vs `main` | Verdict |
|---|---|---|
| `claude/gatorbait-studio-redesign-ysxi79` | 22 ahead | active (PR #29) |
| `studio-product-system` | 26 behind, 8 ahead | the original handoff branch, now diverged |
| `ops-hub-cloud-cycle` | 26 behind, 1 ahead | merged work; safe to delete |
| `fix-ops-hub-cloud-commit-detection` | 25 behind, 1 ahead | merged work; safe to delete |
| `fix-ops-hub-cloud-state-path` | 24 behind, 1 ahead | merged work; safe to delete |

`studio-product-system` needs a decision: its 8 commits either matter or they
do not. It is the branch the original Studio handoff named.

### P7 — The new front page violates its own performance budget. `VERIFIED`

`STUDIO-SEO-AI-DISCOVERY-STANDARDS.md` line 20 says *"No remote webfont
downloads."* `studio/landing.html` loads Newsreader and Barlow Condensed from
Google Fonts. The Lighthouse job added today will measure the real cost. The
documented remedy — self-host a subset — keeps the design.

Same document requires `content-visibility:auto` on below-fold sections. Not
implemented.

### P8 — There is an active owner coordination thread nobody replied to. `VERIFIED`

Issue #3, *"Agent coordination thread — live newsroom / membership / author
follow work"*, 42 comments, last updated 2026-09-20. It is addressed to
whichever agent is working the repo, names Opus 5 explicitly, and asks for a
reply stating branch, files touched and anything to review.

Four owner requests in it are still open:

1. Article bylines should be clickable and lead to a writer profile / follow
   flow for Buddy Martin, Franz Beard and the others.
2. **Follow on GatorBait must stay distinct from marketing consent.** Email
   and SMS alerts are explicit opt-ins, never silently bundled into a follow
   click.
3. Membership UX is confusing — surface an obvious **Manage Membership /
   Billing & Cancellation** path and make cancellation discoverable for
   recurring plans.
4. Do not overwrite live newsroom production files without checking the thread.

Items 2 and 3 are consent and cancellation-transparency obligations, not
features. They have been open since Sept 14.

The thread also states a production source of truth that is now out of date:
it names embed `GBM - Standalone Newsroom Live v1`, which was disabled the
following day.

---

## 2. What is actually live right now

### On `gatorbaitmedia.com` `VERIFIED via Wix API earlier today`

Wix site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`, Premium, custom domain,
Velo enabled, 4,528 published posts across 28 categories.

**Correction: the site has 41 custom embeds, not the 8 an earlier pass of
this document listed. Only 10 are enabled.**

| Custom embed | State |
|---|---|
| Compact Optimized Logo + Header v11 | **ON** (re-enabled today, rev 13) |
| Sports Feed Cards v10 | **ON** (re-enabled today, rev 8) |
| Google AdSense Auto Ads | ON |
| GBM Site Fixer v7.1 | ON |
| GBM Light Theme v1 | ON |
| Magazine Digital Cover v5.6 | **OFF** — has a blank-page defect, left off deliberately |
| Homepage Safe Prepaint Shield v2 | **OFF** — documented outage cause, permanently off |
| GA4 Analytics LIVE | OFF |
| Standalone Newsroom Live (`2cc2735e`) | **OFF** — outage fail-safe |
| **Game Night / Newsroom loader (`fdc2127a`) rev 36** | **OFF** — the repo-backed front page (P2) |
| FB Pixel ViewContent, News SEO, Smart 404, Policies, Compact Mobile Typography | ON (BODY_END) |
| 31 further embeds | OFF, 15 of them tagged `[SAFE MODE OFF]` |

### On GitHub Pages `INFERRED`

Root serves `flagship/index.html`. The sitemaps are not served (see P1).

### Scheduled automation `VERIFIED`

| Workflow | Schedule | Runs/day |
|---|---|---:|
| `refresh-newsroom-feed` | `*/5 * * * *` | 288 |
| `ops-hub-cloud-cycle` | `*/15 * * * *` | 96 |
| `gatorbait-production-health` | `17 */6 * * *` | 4 |
| `deploy-flagship-pages` | on push / manual | — |
| `gatorbait-agentic-audit` | manual only (Codex engine) | — |

Observed cadence is slower than configured — the ops-hub state file holds only
7 events, so GitHub is throttling the short crons rather than honouring them.

### Who writes to this repository

```
70  Presidente49          13  Claude
 8  gatorbait-ops-bot      6  gatorbait-newsroom-bot
 1  GBM Sitemap Bot
```

The sitemap refresh has run under two different identities. No workflow in
this repository references `news-sitemap`, so **something outside this repo
updates it.** Unresolved — see open questions.

---

## 3. Full inventory

| Path | Files | Size | What it is | Verdict |
|---|---:|---:|---|---|
| `automation/ops-hub/` | 17 | — | health checks, controller, learning loop | **live**, misconfigured (P2) |
| `automation/ops-hub/model-router/` | 13 | — | model routing + Claude plugin scaffold | dormant; CLAUDE.md says do not reactivate |
| `automation/ops-hub/playbooks/` | 14 | — | operational runbooks | reference |
| `automation/ops-hub/agents/` | 8 | — | agent definitions | dormant |
| `automation/ops-hub/cloud-state/` | 5 | — | committed health/controller/learning state | **live** |
| `automation/lighthouse/` | 1 | — | CWV budget checker | added today |
| `backups/` | 10 | 156 K | embed backups, CRM purge inventory, v4 originals | **keep** — real rollback material |
| `broadcast-preview/` | 1 | 16 K | Buddy Martin Show page | reference |
| `deploy/` | 4 | 32 K | embed source: prepaint shield, magazine QC, footer guard, show v9 | source of record for live embeds |
| `divorce-club/` | 12 | **18 M** | unrelated business | **move out** (P5) |
| `docs/` | 21 | 172 K | standards, incidents, audits, Studio briefs | reference |
| `flagship/` | 2 | 76 K | Codex prototype + today's front page | **deployed** |
| `newsletter/` | 2 | 28 K | Sept 18 Auburn magazine email (HTML + MJML) | reference |
| `newsroom-preview/` | 14 | 160 K | **live production front-end source** + 5-min feed | **production**, renderer disabled (P2) |
| `skills/` | 14 | 172 K | master-control + 6 specialist skills | **live** — CLAUDE.md entrypoint |
| `studio/` | 15 | 196 K | Studio product build + new front page | active |
| root `*.xml`, `index.html` | 4 | 40 K | sitemap host | **broken** (P1) |
| `custom-css-LIVE.css`, `masterPage.js` | 2 | 16 K | live Wix CSS/Velo layer | source of record |

### `Presidente49/together`

Empty. One commit, one file (`README.md`), untouched since 2026-08-02. No
Wix Studio Git Integration repository exists in either account — which is why
the toolchain doc's preferred Studio workflow cannot be used yet.

---

## 4. Open questions I could not answer from here

1. **What updates `news-sitemap.xml`?** No workflow in this repo references
   it, yet it refreshed today under two different author identities.
2. **Are the sitemaps submitted in Search Console?** Determines whether P1 is
   an emergency or a cleanup.
3. **Why did the homepage hero image change?** The monitor noticed; no
   document explains it.
4. **Does the homepage still contain the retired "Monday Chomp" text?** The
   Sept 15 incident doc says the legacy string was still in native Wix markup
   and that browser-side renaming is not source cleanup.
5. **Do the 8 commits on `studio-product-system` still matter?**

---

## 5. Recommended order of work

1. Confirm and fix the sitemap host (P1). One commit. Do this first — it is
   the only finding that is actively costing search visibility.
2. Delete the `any_required` block from the ops-hub config (P2), then treat
   the two remaining markers as real findings.
3. Pick one front-page direction and delete the others (P3).
4. Point `build_front_page.py` at the 5-minute feed so the front page stops
   depending on a hand-captured snapshot (P4).
5. Delete the three merged branches; decide on `studio-product-system` (P6).
6. Move `divorce-club/` to its own repository (P5).

Items 1 and 2 are corrections to things that are wrong right now. Items 3–6
are cleanup that makes the next four days cheaper than the last four.

---

*Produced by Claude Code under Master Control, 2026-09-21. No production
surface was modified while producing this inventory.*
