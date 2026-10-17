---
name: run-gatorbait-site
description: Build, run, test and screenshot the GatorBait homepage bundle (sports-live/front-page.js, front-page.css, share.js) in headless Chromium, and take real-browser screenshots of the live gatorbaitmedia.com site. Use when asked to run, render, preview, QA, test or screenshot the homepage, story-page kit or a design change before deploying.
---

# Run the GatorBait site bundle

The live site is Wix. What this repo ships is the **homepage bundle**: `sports-live/src/*.js|css` gets built into `sports-live/homepage.js` and the fixture page `sports-live/frame.html`. Most PRs touch that bundle.

You drive it two ways:
- **Locally:** `sports-live/qa-front-page.mjs` serves the fixture as `https://www.gatorbaitmedia.com/` inside headless Chromium. It stubs every network call, runs about 67 scenario × width checks and writes screenshots.
- **Live production:** the `live-shots` GitHub workflow. Push a `shots/*` branch and it screenshots the real site.

All paths are relative to the repo root. The wrapper is `.claude/skills/run-gatorbait-site/driver.sh`.

## Prerequisites

Already present in this container: Node 22, global `playwright` (`$(npm root -g)/playwright`), and Chromium under `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. Do not run `playwright install`.

The build needs esbuild, which is not in the repo. Install it once into `/tmp/gbm-tools`:

```bash
.claude/skills/run-gatorbait-site/driver.sh setup
```

## Run (agent path)

```bash
.claude/skills/run-gatorbait-site/driver.sh build                       # rebuild homepage.js + frame.html from sports-live/src
.claude/skills/run-gatorbait-site/driver.sh qa day-light /tmp/gbm-shots   # one scenario, ~20 s
.claude/skills/run-gatorbait-site/driver.sh qa "" /tmp/gbm-shots          # everything, ~5.5 min
.claude/skills/run-gatorbait-site/driver.sh restore                     # drop the build outputs if your PR doesn't ship them
```

- **Output:** each check prints `ok`/`FAIL <scenario>@<width> lead=… cls=… h1=…`, and the run ends with `All front-page checks passed.` or `N failing checks` (exit 1). The log is also saved as `<dir>/qa.log`.
- **Screenshots:** `<dir>/fp-<scenario>-<width>.png`, at widths 320, 390, 430 and 1366. Story-page scenarios are `story*`.
- **Look at the PNGs.** A check can pass on a page that looks wrong.
- **Scenario prefixes for the first argument:** `day-light`, `day-dark`, `night`, `gameday-pre`, `gameday-live`, `reduced-motion`, `pin-`, `scoreboard-`, `endpoints`, `capture-home`, `story`. The full list is the `scenarios` array near line 102 of `sports-live/qa-front-page.mjs`.

## Run against live production (read-only)

The container cannot reach gatorbaitmedia.com. GitHub Actions can.

1. Commit a request file to any `shots/<name>` branch and push. This session used `shots/magazine-live`:
   ```bash
   cat > automation/vision/live-shots.request.json <<'J'
   {"path":"/?v=qc1|/post/hey-missouri-don-t-show-me-anymore|/magazine|/the-buddy-martin-show|/florida-football-stats","widths":"320,390,430,1366","perf":"1"}
   J
   git add automation/vision/live-shots.request.json && git commit -m "shots: QC sweep" && git push origin shots/magazine-live
   ```
2. About 4 minutes later the results are on the orphan branch `qa/live-shots`:
   ```bash
   git fetch origin qa/live-shots && git show origin/qa/live-shots:p0-top-390.jpg > /tmp/home-390.jpg
   ```
   - File names are `p<N>-{top,view,element}-<width>.jpg`, where `<N>` is the index of the path in the `|` list.
   - `metrics.json` holds the JS errors and the perf block (LCP, TBT, bytes by host).

## Test

`driver.sh qa ""` is the test suite. On `origin/main` as of Oct. 4, 2026 it passes 65 checks and fails 2 that were already failing (see Gotchas).

## Gotchas

- **`driver.sh check` always reports "Out of date".** The build bundles the newest stories from `gazette-live/posts.json`, and the feed workflow refreshes that file every 5 minutes. Only run `check` right after `build`. Don't use it as a gate.
- **Build outputs churn.** `build` rewrites `sports-live/homepage.js` and `sports-live/frame.html` every time the snapshot moves. Run `restore` before committing unless your PR is a deploy.
- **The fixture clock is frozen.** Scenarios set `window.__GBM_FP_NOW__`; `day-light`, for example, renders "Wednesday, Sept. 30". Dates in the screenshots are not today's.
- **Known failures on main (Oct. 4):**
  - `all-feeds-down@390`: "root missing". With every feed down, the page doesn't mount.
  - `pin-breaking@390`: "lead buddy != breaking". The Buddy-as-lead rule beats the breaking-pin fixture.
  - Don't chase these in an unrelated PR.
- **"Day" scenarios still produce `fp-night`.** The config `look` is `swamp-night`, so the everyday look is the dark one. Design PRs that change `modes()` must update the `expect` blocks in `qa-front-page.mjs`.
- **The live site is not this fixture.**
  - Wix wraps the bundle and injects its own header, cookie banner and lazy images.
  - Going live needs `sports-live/current.json` pinned to a commit on `main`.
  - Confirm on production with live-shots, not the fixture.
- **No direct network from the container.** `curl` and `WebFetch` to gatorbaitmedia.com, static.wixstatic.com or jsdelivr get 403 from the proxy. Use live-shots for the site, and TinyFish `fetch_content` for reading pages.

## Troubleshooting

- **`Cannot find module 'esbuild'`** → run `driver.sh setup`. `build` sets `NODE_PATH=/tmp/gbm-tools/node_modules`, which can be overridden with `TOOLS=…`.
- **A full QA run takes ~5.5 minutes with long pauses.** Some scenarios wait on purpose (slide-up capture delays of 60 s). Use a prefix for quick loops.
- **Live-shots results look stale.** `qa/live-shots` keeps only the newest run. Check that the commit message there names your request's paths before trusting the images.
