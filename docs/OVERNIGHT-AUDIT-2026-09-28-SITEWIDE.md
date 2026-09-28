# Sitewide font / photo / SEO pass — Sept. 28, 2026 (~03:30–04:30Z)

Brenden: "Go through every page on the site and change fonts or photos and update seo." He chose Chris Spears photos for share images and confirmed brenden@gatorbaitmedia.com is the real contact address.

## Fonts (done, live, verified)
- Removed the last Georgia/Times/Lora declarations from three live embeds, replaced with `Barlow,Arial,sans-serif`, category ESSENTIAL, published:
  - `a13b04e3` Inner Page UI Layer (modal h2) rev 1→2, 13,705 chars — repo `deploy/wix-served/split/ui-layer.html` synced, length matches.
  - `82c4ca83` TV + News Images / media hub (h1/h2) rev 18→19, 5,717 chars — repo copy `deploy/sitewide-design/current-82c4ca83-…html` had already drifted (5,521); rewritten from live, length matches.
  - `fb8963cc` Policies & Compliance (body + h1/h2) rev 2→3, 9,839 chars — no repo copy existed before; none created.
- Two other "Georgia" hits (`96ef5a04` backup stories, `756655cf` stats) are the football team, not fonts. Disabled/BACKUP embeds left alone.

## Share photos (done, live, verified)
- Sitewide default share image: 2020 `GBLogo.jpeg` → Chris Spears csp1 (19 of 75) `16b519_4d80d39e…`. Sitewide default description refreshed. Verification/admin tags preserved.
- Page-specific: Magazine csp1 (63 of 75), Buddy Martin Show csp1 (39 of 75), About csp1 (7 of 75), Home + Latest csp1 (19 of 75). All with `og:image:alt` credit. Could not visually inspect (wixstatic blocked from sandbox); chose multi-player action shots, not tight portraits.

## Page SEO (API correct; live render split — see LESSONS #47)
Written to 13 static pages; canonical values in `docs/PAGE-SEO-2026-09-28.json`:
- Contact: email typo `gatorademedia.com` → `gatorbaitmedia.com`.
- 2021 archive: removed literal "(Title)" placeholder.
- 2022 archive: dropped "@gatorbaitmedia" twitter title and a broken relative twitter:image.
- Magazine: new title/description (dropped the pipe list).
- Tags ("Blog/Tags"), Groups, Events: real titles and descriptions.
- Latest: fixed quoted/stale OG text, `max-image-preview:standard` → `large`, replaced placeholder JSON-LD ("YOUR FOUNDING DATE", "Founder Name(s)", youtube.com/channel/yourchannel, seven links to nonexistent policy pages).
- About: stale twitter description and a JSON-LD image pointing at a nonexistent /images/about-us.jpg.
- /news-3 and /projects (both redirect): noindex so they drop out of the sitemap.

A full-site publish run after these writes (to push the share image) rolled page SEO back to the Editor's copy, rolling out page by page. Two re-publish passes did not converge: consecutive live fetches return a different mix of old and new pages. Durable fix: paste the values from the JSON into each page's SEO panel in the Wix Editor once.

## llms.txt (done, verified)
- "Canonical business contact email" corrected to brenden@gatorbaitmedia.com; removed dead `/message-board` link (404). Repo: fixed the same typo in `newsroom-preview/index.html` and `docs/INCIDENT-2026-09-15-HOMEPAGE-BLANK.md`.

## Side finding
- The media-hub embed links to YouTube `@thebuddymartinshow` — that is the channel's current handle (relevant to the @GatorBaitMedia rename discussion).
