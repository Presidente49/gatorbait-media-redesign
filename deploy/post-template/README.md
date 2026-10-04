# Story page template: Magazine look, no dark-on-dark signup box

Brenden, Oct. 4: story pages "aren't looking as cool as our magazine template ... we have that giant sign-up box on mobile it looks like crap, the dark lettering, I thought we were past that."

Target: Wix custom embed `14a887e3-38ea-4258-ae0b-7d19cf9feead` ("GBM - Post template v1"), HEAD, category ESSENTIAL, enabled. Not yet applied; Jarvis applies it. Homepage untouched.

## What was wrong (live read Oct. 4, ~03:55Z)

- **The giant signup box** is the "Get GatorBait Magazine free" card from `sports-live/src/capture.js`, served by the Share embed `f285a38c` (rev 1) through the pointer `sports-live/current.json` → `3143027`. It mounts **twice** on every story: mid-article (`story-inline`, after the 4th paragraph) and in "Keep up with the Gators" (`story-end`). Live shots run 37175346300: 588 px tall at 320, 424 px at 390.
- **The dark lettering**: the card is inserted inside `[data-hook=post-description]`, so the body rules win over the card's own colors:
  - template `14a887e3` `… [data-hook=post-description] :is(p,li){color:var(--k)!important}` and post-wide `a5452619` (rev 3) `… :is(p,li){color:#0f1a2c!important}` turn the kicker, value line and fine print dark navy on blue;
  - template `… [data-hook=post-description] h3{color:var(--b)!important}` turns the card headline (an `h3`) blue on blue, which leaves an invisible line and an empty gap.
- PR #116 (merged Oct. 2) drops the mid-article card and adds `!important` to the card colors, but it was never deployed: the pointer still reads `3143027`. Its `!important` colors would still lose: `(1,2,0)` against the post rules' `(1,2,3)`.
- Same mechanism, seen in the fixture: the "By the numbers" boxes (`[data-gbm-stat]`, navy) get `a5452619`'s dark body color at equal specificity, so they turn dark-on-dark. On live, the Keep Reading embed `59e31550` (rev 10, BODY_END) already lights them again. The fixture leaves that embed out, so its `before` run shows the underlying fault.

## What changed (proposed.html, 12,777 characters; live is 14,923; cap 15,000)

1. **Signup on story pages**: the mid-article card is hidden (`[data-gbm-capture=story-inline]{display:none}`), as Brenden asked on Oct. 2. The end card under the article is now a compact strip: Gator blue `#0021A5`, orange top rule, white Barlow text, headline "Get GatorBait Magazine free", the email field and button on one row, then the consent line and privacy link. The kicker and value line are hidden. It measures 204 px at 320, 191 px at 390 and 179 px at 430 and 1366 (it was 614/453/424/390 px in the fixture). The consent checkbox stays visible and unchecked. Every selector carries one more class than the body-text rules, so post styles can't darken it again. The slide-up bar is unchanged.
2. **Headline**: Barlow 800, sentence or title case as written, never uppercase. 44 px on desktop and `clamp(28px, 8vw, 34px)` on phones (28 / 31 / 34 px at 320 / 390 / 430). It was 700 weight, 36 / 28 px.
3. **Kicker**: a Magazine-style label (white Barlow on Gator blue), left-aligned above the headline. It was blue text, centered while the headline sat left.
4. **Header rule**: a 3 px orange rule closes the header, like the Magazine's section rules. It was 1 px gray.
5. **Stat boxes**: the template's own rule now wins (its selector gains `[data-hook=post-description]`), so the light-on-navy text no longer depends on `59e31550`. It is the same selector `59e31550` uses.

The rest of the CSS is unchanged, as is all the JavaScript (kicker, hero check, By-the-numbers, Up next). To fit the cap, the CSS ships as a tiny inline script, the way header `7fee4de6` does it: `` ` `` stands for the post-page prefix, `|` for `[data-hook=post-description]` and `$` for `!important`. The script expands it and inserts `<style id="gbm-post-template">` where the old inline `<style>` sat. `build.py` makes every edit as an asserted, exact-match replacement on `live-before.html`, checks in Node that the packed CSS expands byte-for-byte to the edited CSS (`proposed.css`), and refuses anything at 15,000 characters or more.

## Fingerprints (no comment is added to the embed)

| | chars | djb2 | sha256 (first 16) |
|---|---|---|---|
| `live-before.html` = live rev **11** | 14,923 | 2163953757 | d1b150196760f1f1 |
| `proposed.html` | 12,777 | 2882521084 | 7b7e16dbf930e565 |

`live-before.html` was decoded mechanically from the API's JSON string; its inline script parses. Before patching, GET the embed and compare the live `embedData.html` against this row (same length and hash). If the revision or hash differs, someone changed it: rebuild from the new live text with `build.py`, and do not patch over it.

## Apply (Jarvis)

`PATCH https://www.wixapis.com/embeds/v1/custom-embeds/14a887e3-38ea-4258-ae0b-7d19cf9feead` with `revision` = the current live revision (11 at this read), `embedData.category` = `ESSENTIAL`, `embedData.html` = `proposed.html` verbatim. Name, enabled, position and loadOnce stay unchanged. Verify with live shots on a story at 320/390/430/1366 (selector `[data-gbm-capture="story-end"]`): no mid-article card, white text on the blue strip, and a strip under about 230 px on phones.

**Rollback:** re-PATCH `live-before.html` at the then-current revision with category `ESSENTIAL`.

## Test

```
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=$(npm root -g) node deploy/post-template/test.mjs
```

`fixture.html` is a Wix-like post page served as `https://www.gatorbaitmedia.com/post/…`. It carries the header's post rules (`7fee4de6`), the template under test, `a5452619`'s body rule in live order, and the live Share + Story Kit + signup bundle (`share.js` at `3143027`, read from git) against the repo's `scoreboard.json`. Each of `before` and `after` runs at 320/390/430/1366. The `before` run reproduces the live faults: dark text and the invisible headline on both cards, two cards, and a 424–614 px box (live shots measured 424–588 px). It also shows the stat-box fault that `59e31550` masks on live. `after` passes every check. Screenshots are in `shots/` as `{before,after}-{width}-{top,signup,stats}.jpg`.

## Not in this change (separate owners)

- **Stale "Last: W 52-28 vs. No. 4 Ole Miss" chip**: the Story Kit reads `sports-live/scoreboard.json`, last written Sept. 29. The scoreboard job in `refresh-newsroom-feed.yml` reads `site.api.espn.com`, which returns 403 to GitHub runners. The step is `continue-on-error`, so each run "succeeds" and keeps the old file. Fix: PR #123 (`jarvis/scoreboard-espn-host`, use `site.web.api.espn.com`). Live shots run 37175210974 probed it: `site.web` 200, `site.api` 403.
- **Post normalizer `c91ad133` rev 6 is broken on every page**: its backslashes were lost, so `/^/post//.test(...)` throws "SyntaxError: Invalid regular expression flags" in every live shot, and the normalizer never runs.
- **Pointer**: advancing `sports-live/current.json` to PR #116's merge commit would also remove the mid-article card at the source, but it changes the homepage bundle too. This template change does not depend on it.
