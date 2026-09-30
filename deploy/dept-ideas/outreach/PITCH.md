# Game Week Partner

## 1) The idea (two sentences)

Sell one sponsor per Florida game week a single labeled tag that rides the three places Gator Nation already checks: The Tunnel game-day opener on Saturday, the next-game card in The Road Ahead all week, and a live mention on the Wednesday Buddy Martin Show's "Bloody Tuesday Report." Eight game weeks remain (ESPN schedule), with Texas and Georgia weeks priced as premium, and the whole thing is text in the page's own type, so it adds one line to the homepage without touching its look.

## 2) Why readers or revenue care

- Revenue: doctrine ranks direct local/regional sponsorship and Buddy Martin Show sponsorship third and fourth in the revenue stack, above the newsletter and merchandise, yet neither has a packaged, dated inventory unit a local business can buy in one email. A game week is a unit a sports bar, dealer or credit union already understands.
- Timing: Florida is 4-0 and No. 8 after beating No. 4 Ole Miss 52-28 (ESPN), the first 4-0 start since 2019 (gatorbaitmedia.com), with ESPN's FPI favoring the Gators in every remaining game except Texas and Georgia (gatorbaitmedia.com). Demand for anything Gators will not be higher than the next five weeks.
- Readers: nothing new to load and nothing that jumps. The tag is one text line in the existing pill row and one text line on one card. Readers get a clearly labeled sponsor, and the show gets a recurring Wednesday segment ("what Bloody Tuesday told Buddy") that stands on its own even with no sponsor sold.
- Different from Jarvis's work: The Road Ahead and The Tunnel are the product; this is the first way to monetize them without altering them.

## 3) How it is built (what the sponsor gets, where it appears, effort)

What the sponsor gets:
- Saturday: "Game week partner · Name" as a ghost pill beside the "Game day" pill at the top of The Tunnel, visible across countdown, live and final states.
- Sunday through kickoff: the same one-line tag on the `.g.nx` next-game card in The Road Ahead.
- Wednesday: a live verbal mention from Buddy at the top of the Bloody Tuesday Report segment plus one lower-third card on the YouTube and Facebook stream.
- Optional: a linked fan offer for that week (watch-party special, game-day discount).

Where it appears in the code (proposal only, no edits made):
- `sports-live/front-page.config.json`: add an optional `partner` object, e.g. `{ "name": "", "url": "", "from": "<ISO>", "until": "<ISO>" }`, next to `pins`, so it expires on its own like a timed pin.
- `sports-live/src/front-page.js`: `tunnelHtml()` appends one `<span class="fp-pill fp-ghost">` when a partner is active; `roadHtml()` appends one `<div class="sub">` line to the `nx` card. Both are escaped strings, no script, no image, no network call, so Core Web Vitals and the no-jump architecture are untouched.
- `sports-live/qa-front-page.mjs`: one assertion that the tag renders only inside the window and never on a finished game.
- Show: a reusable lower-third in the existing broadcast-graphics style (Barlow Condensed, Swamp Night colors) with the sponsor name swapped per week.

Effort: about 30 lines of JS/CSS and one QA case, plus one lower-third template. Selling it is the real work: the pitch page, the email template and the target list in this folder are ready once the rate card is filled.

## 4) What it needs from Brenden

- Rates for a standard week, premium weeks (Texas, Georgia, FSU) and multi-week/season bundles; the page has `[Brenden: fill]` blanks for each.
- Any audience figures he is willing to state publicly; none exist in published stories, so the page leaves that blank rather than inventing one.
- Contact phone/email for the close line.
- Buddy's sign-off on a standing Wednesday "Bloody Tuesday Report" segment and on reading one sponsor line.
- Master Control authorization for the additive front-page change (config field plus two render lines) and for the QA run; the homepage look is locked and this idea does not change it, but the change is still a production edit.
- A decision on labeling wording ("Game week partner" vs. "Presented by") for consistency with existing sponsorship labeling.

## 5) Risks

- Trust: a sponsor line next to editorial can look like influence. Mitigation: fixed "Game week partner" label, no sponsor input on stories, and the tag never appears on injury or news items.
- Homepage lock: even one added line is a change to the locked Front Page 2026 presentation and needs explicit approval; ship behind an empty config field so nothing renders until a partner is sold.
- Term drift: "Bloody Tuesday" is Jon Sumrall's phrase for practice. If he stops using it, the segment name should follow; keep the config label editable.
- Unsold weeks: an empty tag must never render. The expiry window handles that; QA should assert it.
- Category conflicts: two competing businesses in adjacent weeks, or a category that conflicts with an existing display-ad relationship. Brenden should keep a simple exclusivity rule per category.
- Show dependency: the Wednesday read depends on the live show airing; if a show is skipped, the make-good is the following Monday show, stated up front in the agreement.
- Numbers: the pitch cites only ESPN and gatorbaitmedia.com stories. If Brenden fills audience blanks, those figures need a source he can defend to a sponsor.
