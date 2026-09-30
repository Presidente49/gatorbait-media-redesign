# Billboards — Design department pitch

## 1) The idea (two sentences)

Billboards is a type-only card system that turns any story's title, byline and one number into a finished Swamp Night poster, with six variants (Column, Final, By the Number, Magazine, Sideline, Up Next) built from Barlow Condensed, gradients and CSS art, no photo required. Each card is a link on the site and a tap-to-save 4:5 image for social, so the front page, the Magazine contents and the share stream all speak the same visual language.

## 2) Why readers or revenue care

- Photo-less stories stop looking like afterthoughts. The Senate bill, the Aberdeen injunction, Thoughts of the Day and injury news currently compete with Chris Spears' sideline frames for the same slots; a Billboard gives them art in seconds, so every list looks edited, not scraped.
- Sharing is the growth engine we do not pay for. A saved 1080x1350 "Final" card (52–28, quarter bars, GatorBait wordmark) is the thing readers already screenshot from ESPN; ours carries our URL and, later, a "Presented by" strip. That strip is a sponsorship unit we can sell per week without touching editorial.
- Buddy Martin as editorial lead gets a signature look (the orange diagonal Column card) that is recognizable across the homepage, the Magazine and social, without a second article URL or duplicated alert.
- It works on the Magazine's own terms: the paper-white "Magazine" card becomes the contents page for the Thursday issue, keeping the Magazine separate from the free sports-news homepage.

## 3) How it is built (files, size, data source, effort in hours)

- `sports-live/src/front-page.css`: about 3 KB of additive rules under a `.fp-bb` namespace (variants, sweep, reduced-motion). No changes to existing selectors.
- `sports-live/src/front-page.js`: one `billboardHtml(post, kind, stat)` builder (about 60 lines) beside `roadHtml` and `hubHtml`. It reads what already exists: `gazette-live/posts.json` (title, author, url, section) and `sports-live/scoreboard.json` (last game score, quarters, rank, record, next kickoff). Author initials map to the existing `.fp-roundel` style.
- Save-to-image: about 80 lines of vanilla JS that redraws the card onto a canvas (fonts are already loaded on the page) and hands off through the Web Share API or a download link. No new library, no server, no third-party script.
- Where it appears: (a) Latest list entries whose `image` is missing or generic; (b) one "Final" and one "Up Next" card in the hub's scores module; (c) a Magazine contents grid. Placement is config-driven through `front-page.config.json`, so it can be turned on per slot.
- Preview: `deploy/dept-ideas/design/preview.html`, about 10,500 characters, self-contained except Google Fonts.
- Effort: CSS and builder 6 hours; canvas export and share 5 hours; QA on 390px, 600px and desktop plus reduced-motion 3 hours; total about 14 hours of one worker, all on a branch, no live-site writes until the controller assigns the slot.

## 4) What it needs from Brenden

- A yes on the six variants and the copy rules: kicker tags (Column, Final, By the Number, Magazine, Sideline, Up Next), AP style dates and times, one stat per card with its source in `data-src`.
- Which slot ships first. Recommendation: the "Final" and "Up Next" pair in the scores module, because both are fed by `scoreboard.json` and change automatically each week.
- Whether the "Presented by" strip is in scope now or after the first week of share data.
- Confirmation that Buddy Martin's Column card is the lead treatment across homepage, Magazine and packages, per the current direction.

## 5) Risks

- Type-only cards can be overused; if every list item becomes a poster the page turns into a wall. Cap at one Billboard per module and keep photo stories on photos.
- The poll-jump card cites a story fact (13 spots) that will be stale by Sunday; "By the Number" must read from a dated field or be hand-set weekly, never left as a fixed string.
- Canvas export renders fonts only after they load; the button must wait for `document.fonts.ready` or the saved card falls back to a system font.
- Wix hydration can replace document classes; the module must live inside the owned `#gbm-live` DOM like The Road Ahead and The Tunnel do, and be QA'd on the mobile shell so nothing jumps.
- Any sponsor strip on a shared image is a publishing decision, not a design one; it stays off until the controller authorizes that surface.
