# The Buddy Line

## 1) The idea (two sentences)

A show-night card series called The Buddy Line: one 1080x1350 graphic per show (Monday, Wednesday, Thursday), each built around a single Buddy Martin sentence quoted verbatim from his newest column, one or two ESPN-cited numbers, and "Tonight 9 p.m. ET." It gives the show a recognizable, repeatable visual on Facebook and YouTube three hours before every stream and turns Buddy's columns into the show's promotion without asking him to do anything extra.

## 2) Why readers or revenue care

- Buddy is the editorial lead across the homepage and Magazine (Brenden's standing direction); the card makes him the face of the show feed the same way, with no duplicate article or alert. Each card points to one canonical column URL and one stream.
- It fixes the show's biggest promotion gap: there is no standing pre-show post, so most viewers find the stream only if they are already following. A same-time, same-look card three times a week is the cheapest habit-builder we have.
- Every card carries a column link, so it feeds site traffic on the three days a week the show is on and the homepage's Buddy-led lead story gets a second front door.
- Zero marginal cost: no photo licensing, no video editing, no paid tools. Three cards a week is 30 minutes of labor. If the cards move even a few dozen extra concurrent viewers per stream, that is measurable in YouTube and Facebook analytics we already have.
- Quotable, sourced, AP-style cards are also the safest thing to put in front of sponsors: nothing on them is a claim we cannot cite.

## 3) How it is built (files, tools, effort per week)

- `deploy/dept-ideas/social/preview.html` (8,618 characters): the template and three finished examples, CSS only, Swamp Night palette, Barlow and Barlow Condensed, scales to a phone.
- `deploy/dept-ideas/social/draft.md`: format definition, rules, cadence and the three captions in full.
- To ship: add `render-buddy-line.mjs` (about 40 lines) that reads a five-field JSON (day, tag, quote, sub, stats), stamps it into the template and screenshots at 1080x1350 with the same Playwright dependency `sports-live/qa-front-page.mjs` already uses, loading Barlow from local font files. Output PNGs land in a `deploy/dept-ideas/social/out/` folder that the repo ignores.
- Posting is manual for now (Facebook page and YouTube Community tab), which keeps one human as the outbound owner. If Brenden wants it scheduled later, the existing Metricool connection can queue the three posts on Monday; that is a separate approval.
- Effort per week: 30 minutes for three cards (pick line, fill JSON, render, post). Setup: one afternoon for the render script and the first week's approval.
- Canva fallback: the same layout can be rebuilt as a Canva template in about an hour if Brenden prefers drag-and-drop; the HTML route is preferred because it is free, exact, and version-controlled.

## 4) What it needs from Brenden

- A yes on the name "The Buddy Line" and the 6 p.m. ET post time (three hours before the stream).
- Standing approval for the format after he reviews week one, so cards do not wait on him each show night; he keeps veto on any single card.
- Confirmation that quoting Buddy's published headline or excerpt on a card is fine with Buddy (it is his own published work, but he should hear it from Brenden first).
- Optional: a one-line rule on which Buddy column wins when he files two in a day (proposal: newest first, matching the site).

## 5) Risks

- Stale numbers: the stat strip is only as fresh as `sports-live/scoreboard.json`. Mitigation: the render script refuses to build if the snapshot is more than 48 hours old, and the card cites ESPN so a correction is one re-render.
- Quote drift: paraphrasing Buddy would break the "only what is published" rule and his trust. Mitigation: the quote field must match the published headline or excerpt string exactly; the script checks it against `gazette-live/posts.json` before rendering.
- Show-night changes: if a stream is canceled or moved, a card that says "Tonight 9 p.m. ET" is wrong. Mitigation: post no earlier than 6 p.m. ET, and keep a "Rescheduled" variant of the footer.
- Platform reach: Facebook can throttle link-heavy posts. Mitigation: the link is in the caption, the card itself carries no URL, and the first line of the caption is the quote, not the link.
- Scope creep: this must stay a promotion card, not a fourth homepage module. It touches nothing on Wix, sends no email and posts nothing without a human.
