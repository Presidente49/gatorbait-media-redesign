# Independent Magazine edition

## Rotating editions (from September 29, 2026)

The cover and lineup now live in `edition-src.json`; `build.py` only renders. To rotate: edit `edition-src.json` (new `id`, `date`, `edition`, `lead`, `cover`, `stories`, `gallery`), run `python deploy/magazine-urban/build.py` (must stay under 15,000 characters), render-check, then PATCH embed `1dd74333` with the current revision and unchanged category. The Magazine cover must differ from the homepage lead (the homepage shows the newest Buddy Martin story under 7 days old).

- **Live is rev 47** (Codex added one line, `window.__GBM_MAG_EDITION__=D` plus an event, so the homepage can show a Magazine preview from the same edition data). `build.py` now emits that line; `magazine.html` and `live-rev47.html` are byte-identical to live rev 47 (14,850 characters). Rollback to rev 46 is the previous `magazine.html` in git history (commit c6b4138); rollback to rev 45 is `rollback-rev45.html`. Patching an older payload back removes the homepage Magazine preview, which falls back to a plain link.
- Sept. 29: Franz Beard, "Thoughts of the Day: September 29, 2026" (rev 45 → 46, Jarvis). Rollback: `rollback-rev45.html` is the exact rev-45 payload.

## First edition — September 28, 2026

Owner requested a different cover story and a substantially different, more urban look from the front page. The existing front page remains intact.

## Live change

- Wix site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`.
- Magazine custom embed: `1dd74333-ee02-40da-9c93-cf8fd787c129`, revision 43 → 44, followed by an attribution correction to revision 45.
- Curated edition: Franz Beard, **Who Are These Guys?**, with Chris Spears cover photography. Distinct lead and image from the current homepage.
- Portrait cover, large condensed sports type, cobalt/orange blocks, warm-paper canvas, numbered contents and article cards. Existing shared header/footer retained.
- Writer bylines appear on every story. Chris Spears' explicit in-body column byline overrides its generic RSS member label. Gallery text credits Brenden Martin under the owner's instruction, with photography separately credited to Chris Spears. Buddy's supporting image credits Hannah White / UAA Communications.
- No article URL, checkout, ad configuration or newsletter send was changed by this embed deployment.

## Source and checks

Run `python deploy/magazine-urban/build.py` to build from the frozen feed and curation in `build.py`. `magazine.html` is the exact compiled payload. `after.json` retains the baseline revision as a patch source, not a claim of current live revision. Live revision is 45. The edition is manually curated; it does not automatically choose the homepage lead.

Checks: inline JavaScript parses; route lifecycle mounts once, cleans up on article routes and remounts on Magazine; payload 14,780 characters under Wix's 15,000 limit. Public desktop rendering verified: all seven images loaded, no horizontal overflow, feature thumbnails correctly scale at 145 × 181.25 px. Independent static review covered 320/390/430/820 breakpoints; an actual mobile browser/device test was unavailable.

Public verification: https://www.gatorbaitmedia.com/magazine?edition=trenches-20260929

The site's existing floating advertisement can obstruct content until collapsed. This design pass did not change AdSense settings; it must not be reported as an ad fix.

## Rollback

`before.json` is the exact revision-43 embed snapshot. Read the live embed first. If it still matches this deployment, patch only its `embedData.html` back to the saved HTML using the current revision and unchanged category. Do not overwrite a newer unrelated edit or publish the whole Wix site.
