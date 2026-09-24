# Blog layout rules

Standards for every article page (`/post/<slug>`) and the blog index. Set by
the editor-in-chief function; binding on any renderer, embed or Figma-derived
design that touches these pages.

Each rule says **why** and, where it can be measured, **how it is checked**.
Rules without a measurement are editorial judgement and stay that way.

---

## 1. The first screen must contain journalism

**Rule.** On any phone, a reader's first screen shows the headline and at least
the first line of body text. Furniture — logo, nav, section eyebrow, share row,
hero photograph — may not consume it.

**Why.** Measured on the live homepage at 320px: the first headline sits at
y=415 in a **545px** viewport, and the consent banner covers roughly the bottom
230px. The reader gets a photograph and a cookie wall. A visitor who has to
scroll to learn what the story is has already been given a reason to leave.

**Checked.** `automation/vision/look.mjs` reports `headlineReadable`, which is
true only when the headline is inside the viewport **and** nothing is painted
over it. The rectangle test alone is not enough — it passed this exact failure.

**Design target: 320 × 545, minus a 230px banner.** That is roughly **315px of
usable first screen.** Design into that, not into a 390 × 844 mock.

## 2. Hero images are capped, and their box is reserved

**Rule.** A lead photograph may occupy at most **40%** of the first screen on a
phone. Every `<img>` carries explicit `width` and `height` (or an
`aspect-ratio`), so its box exists before the bytes arrive.

**Why.** Reserved geometry is already the standing creative direction
(portrait-safe 230px on phone). An unreserved image reflows the page under a
reader mid-sentence, which is the jump, not a rendering bug. Current live
measurement: lead image 230px at y=125 on every phone width — **this rule is
being met today and must not regress.**

**Checked.** `leadImage` is flagged when the photo exceeds 60% of the viewport.
The 40% target is stricter than the alarm on purpose: the alarm catches
disasters, the rule sets the standard.

## 3. Line length: 45–85 characters

**Rule.** Body measure stays between **45 and 85 characters per line**, target
**60–75**. One column on phone; never more than two on any width.

**Why.** Beyond ~85 characters the eye loses the return sweep; below ~45 the
rhythm breaks every few words. This is the cheapest readability gain available
and costs nothing to hold.

**Checked.** `bodyMeasure` in the vision audit, estimated from rendered column
width and font size, reported per profile and flagged outside 45–85.

## 4. Tap targets: 44px

**Rule.** Every link, button and control presents at least a **44 × 44px**
target. Inline links in body copy are exempt — they inherit the line box.

**Why.** Below 44px the failure lands on readers with larger fingers, tremor or
a moving bus, and it lands as "this site is broken."

**Measured today, and failing:** blog index **24** under-44px targets at 320,
**38** on desktop; homepage **20**; the proposed front page **5**. The standard
is reachable — one of our own pages nearly reaches it.

**Checked.** `smallTapTargets`; a finding above 10.

## 5. Article furniture, in this order

```
KICKER          section or column name, uppercase, brand orange
Headline        see rule 6
Deck            one sentence, italic, optional
By <Author>     uppercase, muted — never inside the body text
Photograph      + credit line, see rule 7
Body            see rules 3 and 8
```

**Why.** Source articles do not arrive this way. Verified on live posts, the
byline, photo credit and site line come back as ordinary leading body
paragraphs, so the first thing a reader sees can be the words "UAA Photo" set
as an opening sentence. Any renderer must lift these into their proper slots.
`magazine/build_issue.py` does this and prints what it detected to
`build-report.json` so the decision can be checked rather than trusted.

## 6. Headlines

- Phone headline set no smaller than **28px**; never wraps to more than four lines at 320px.
- No headline is truncated with an ellipsis. If it does not fit, it is too long — cut words, not glyphs.
- **Check the year.** A live post is titled *"Thoughts of the Day: September 22, **2027**"*. Harmless on the web, fatal in a paid issue.

## 7. Photo credits are mandatory and must be ours to use

**Rule.** Every photograph carries a visible credit. Before publication —
and absolutely before sale — a person looks at the image itself.

**Why.** A frame carrying a visible `© Tim Casey / GatorCountry.com` watermark
reached the cover of a magazine issue intended for sale. That is a competitor's
copyright notice on a paid product. **No automated check can read a watermark
baked into pixels.** The build prints every image URL; someone has to look.

**Checked.** Partially: `magazine/build_issue.py` fails on any image used twice
in one issue (playbook §4.3) and lists every image URL for review.

## 8. Body copy

- **Subhead roughly every 300–400 words.** Live articles run 2,500–15,900
  characters; a 2,900-word wall with no entry points is not read, it is bounced.
- Blockquotes are **pull quotes**, set apart — the reporting already contains
  them and they are wasted as plain paragraphs.
- **Ignore source bold.** Articles arrive with nearly every run marked bold —
  36 of 37 text runs in the Ole Miss lead. Rendering that faithfully produces a
  page of shouting. Where a story is mostly bold, bold means nothing: drop it.
- Section headers arrive as short bold paragraphs, not heading nodes. Promote
  them to real headings so they can be styled and navigated.

## 9. Nothing retired ships

**Rule.** No "Monday Chomp", "Quick Chomps", "Sidelines" or "Rob Browne"
content or branding on any page.

**Measured: currently failing.** The live blog page renders **"Rob Browne"** at
430 and desktop. This is content, not CSS — it needs an editorial decision, not
a stylesheet.

**Checked.** `retiredBranding` in the vision audit.

## 10. The page may not throw

**Rule.** No uncaught JavaScript errors on an article page.

**Measured: currently failing.** `ReferenceError: wixTagManager is not defined`
fires on the blog at 430 and desktop. Analytics that throws is analytics that
is not recording, which means traffic decisions are being made on partial data.

## 11. One writer owns page structure

**Rule.** Exactly one embed may own the structure of a given page. Before
shipping any renderer, enumerate every enabled embed touching `#SITE_PAGES`,
`#SITE_HEADER`, root classes or MutationObservers.

**Why.** Six scripts once rewrote the homepage simultaneously and it flickered
between layouts in production —
`docs/INCIDENT-2026-09-21-MULTI-WRITER-HOMEPAGE.md`. Styling layers and
replacement layers are mutually exclusive strategies for one surface.

## 12. Verified means rendered

**Rule.** No layout claim counts until a CI render shows it, at **320, 390, 430
and 1280**.

**Why.** Four findings were wrong because they were concluded from
configuration instead of from a request
(`docs/inventory/2026-09-21/README.md`). A profile must carry a **mobile user
agent** as well as a narrow viewport: without one, Wix serves the desktop page
in a narrow window and reports a 980px layout viewport, which measures nothing.
`layoutViewport` is reported so that mismatch is visible.

---

## Current scorecard

| Rule | Status |
|---|---|
| 1 · journalism on first screen | **failing at 320** — headline under the consent banner |
| 2 · hero capped and reserved | passing — 230px at y=125 |
| 3 · measure 45–85 | now measured each run |
| 4 · 44px tap targets | **failing** — 24 blog @320, 38 desktop, 20 homepage |
| 9 · nothing retired | **failing** — "Rob Browne" on the live blog |
| 10 · no thrown errors | **failing** — `wixTagManager is not defined` |
| 11 · one structural writer | passing — single root, no layer conflict |

Rules 1, 4, 9 and 10 are live-surface fixes and belong to the controller.
Rules 3, 5, 6, 8 and 12 are enforced in the builders and the audit.
