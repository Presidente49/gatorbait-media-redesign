# Uptime, status badge and RSS digest

Built for game day, Oct. 31, 2026. Read-only against the live site: plain GETs, no Wix writes, no embeds, no sends.

## What runs

| Workflow | Schedule | Writes |
|---|---|---|
| `.github/workflows/uptime.yml` | every 10 min | `sports-live/uptime.json` |
| `.github/workflows/rss-digest.yml` | hourly (:07) | `sports-live/rss-digest.json` |

Both use only the default `GITHUB_TOKEN` (`contents: write`, `pages: write`), the `gatorbait-newsroom-bot` identity, the 3-try `git pull --rebase` push loop and the Pages build request that `refresh-newsroom-feed.yml` already uses. Both run their unit tests first.

## Where to read the data (GitHub Pages)

- `https://presidente49.github.io/gatorbait-media-redesign/sports-live/uptime.json`
- `https://presidente49.github.io/gatorbait-media-redesign/sports-live/rss-digest.json`
- Status page: `https://presidente49.github.io/gatorbait-media-redesign/sports-live/status.html`

Nothing is live until this is merged and the first scheduled run finishes (run each workflow once with "Run workflow" to start it immediately). Until `uptime.json` exists the badge shows nothing, by design.

## Uptime

Each run does a GET of: homepage `/`, `/blog-feed.xml` (must be real RSS with items), `/magazine`, and the newest `/post/` URL read from the feed. Per check it records HTTP status (0 = no response), response time in ms and the UTC time.

- `uptime.json` keeps 7 days of runs (about 50 KB, hard cap 1,100 runs). Each run is `{t, s:[[status, ms, ok] x 4]}`.
- `summary.availability24h` / `availability7d`: `overall` = share of recorded runs where all four checks were OK; `targets` gives each page; `medianMs` is the median of OK responses. `coverage7d` is runs recorded against the 1,008 scheduled, so a GitHub-skipped run shows up as lower coverage, never as "up".
- With zero runs the percentages are `null`, not 100.
- Commit rule: a commit only when state or any page's HTTP status class changed against the committed copy, or the committed copy is 55+ minutes old. Between commits the running record sits in the Actions cache, so the hourly commit includes every check. If the cache is evicted, at most the unsaved hour is lost, and the file only ever contains real measurements.
- Limits: all checks come from one GitHub runner location. They show whether the site answers, not whether every reader can load it. A 200 on a page does not prove its content is right (use the existing Publication QC for that).

## Showing the badge (Jarvis)

Wherever a page can take a script tag (embed or custom code), add:

```html
<div id="gb-status"></div>
<script src="https://presidente49.github.io/gatorbait-media-redesign/sports-live/status-badge.js" defer></script>
```

The div is optional; without it the badge is inserted after the script tag. The badge is 2.6 KB, vanilla JS, Barlow only, uses `currentColor` so it works on light or dark pages, and links to `status.html`. It shows "All systems normal" or "Degraded", 24-hour availability and time since last check. It renders nothing if the fetch fails, the JSON is unreadable, or the last check is over 45 minutes old. It never shows a clear it did not measure.

Pasting this into the live site is a production change and was not done here.

## RSS

`sports-live/rss-feeds.json` is the config. `automation/rss/rss_digest.mjs`:

1. Validates our own `/blog-feed.xml` (first 20 items): well-formed RSS, newest first, every item has a cover image, no blocked publisher. Results in `rss-digest.json` under `selfFeed` (`ok`, `checks`, `problems`).
2. Builds `headlines`: ESPN college football, ESPN headlines that name an SEC team, FloridaGators.com. Each entry is exactly `{title, source, link, publishedAt}` (plus `feed`, the config id). No article text is stored. Show the title, name the source, link out.
3. The blocklist drops any item whose title, link host or link path matches Gator Country, so it is never stored or linked.

A feed that is down or blocked appears in `feeds[]` with `ok:false` and a reason, and contributes nothing.

## Verification (run Oct. 31, 2026, from the Claude Code container)

Tests: `node --test automation/uptime/probe.test.mjs automation/rss/rss_digest.test.mjs` gives 20 pass, 0 fail.

Probe against the real site (`node automation/uptime/probe.mjs`):

```
home      200   438 ms  ok
feed      200   249 ms  ok   (valid RSS with items)
magazine  200   346 ms  ok
post      200   130 ms  ok   (newest story from the feed)
state normal, availability24h 100 (1 run recorded)
```

A second immediate run recorded a run but did not write the file (`commit:false`), as designed. 100% here is one sample, not an availability claim; real figures build up from the first scheduled runs.

RSS run (`node automation/rss/rss_digest.mjs`): own feed passed all checks (20 of 20 items checked, 20 with cover images, newest first, well-formed). ESPN college football returned 12 headlines; the SEC-team subset returned items from the same feed. FloridaGators.com is `ok:false`: it sits behind Incapsula bot protection and returns an empty or challenge response. Not bypassed. Reaching it would need either FloridaGators.com granting access or a different source. ESPN answered Node's `fetch` with HTTP 202 here but answered `curl` with 200, so the digest retries a non-200 once with plain `curl` and the same honest User-Agent. Whether the Actions runner sees the same behavior is confirmed only by its first run.

## Not verified

- No scheduled run on GitHub has happened yet (nothing merged).
- The badge was syntax-checked and size-checked but not rendered in a browser against live JSON; no `uptime.json` exists until the first run.
- Rollback: delete the two workflow files (or disable them in the Actions tab); the data files are inert.
