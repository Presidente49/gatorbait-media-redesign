# GatorBait Studio — SEO, Speed, Google News & AI-Discovery Standards

Status: build-quality bar for the Studio product, applies to every page family.
Production impact: none — these are acceptance criteria for `studio/`, not a live change.

## Why this doc exists

Brenden asked that every Studio decision account for design quality, competitive
positioning, load speed, Google News eligibility, standard SEO, and discoverability
by AI systems (ChatGPT/other AI assistants that crawl or cite the web) — plus
compliance. This is the checklist that answers "does this page family meet the bar"
before it's considered done, on top of the acceptance criteria already in
`skills/gatorbait-studio-product-build/SKILL.md`.

## Speed / Core Web Vitals budget

Carried forward from the documented Sept 13 DIIB findings
(`newsroom-preview/README.md`) and applied to every new Studio page:

- No remote webfont downloads; system font stack or a single self-hosted subset.
- One hero image with `fetchpriority="high"` + eager load; everything else lazy +
  async decode.
- Explicit image `width`/`height` or `aspect-ratio` on every media slot — zero
  layout shift from late-loading images.
- `content-visibility:auto` on below-fold sections.
- Target: LCP < 2.5s, CLS < 0.1, INP < 200ms on 4G mobile — verify with real
  Lighthouse/PageSpeed Insights runs before calling a page family done, not by
  inspection.
- No motion library, carousel library, or tracking script loads above the fold
  (see `docs/STUDIO-REPO-FIRST-TOOLBOX.md` adoption gate).

## Google News eligibility

Google News indexing depends on structural/content signals, not a submission form:

- Clear, accurate, single `<h1>` headline per article; no clickbait-only titles.
- Visible byline + publish date + last-updated date on every article.
- `NewsArticle` (or `NewsMediaOrganization` on the front page) structured data —
  one instance per page, never duplicated (the Sept 13 direction already avoids
  duplicate `NewsArticle` schema; keep that rule in Studio).
- A dedicated, current `news-sitemap.xml` (one already exists at the repo root —
  keep it accurate as Studio routes go live, don't let it drift from canonical
  `/post/<slug>` URLs).
- Consistent, human-readable canonical URLs — already guaranteed by the
  content-routing doctrine (`docs/STUDIO-CONTENT-ROUTING.md`) preserving
  `/post/<slug>`.
- No interstitials or paywalls blocking the first paragraph of free content.
- Fast, stable mobile rendering (see budget above) — Google News weights mobile
  usability heavily.

## Standard SEO

- One canonical tag per page, always pointing at the production `/post/<slug>` or
  the current Studio route — never a preview/staging URL (the existing
  `newsroom-preview` already sets this correctly; carry the pattern forward).
- Unique `<title>` and meta description per page family and per article — no
  templated duplicate titles across Front Page / News / Magazine placements of
  the same story.
- Semantic heading hierarchy (one `h1`, ordered `h2`/`h3`), semantic
  `<nav>`/`<main>`/`<footer>` — already how `studio/` is built.
- `robots` meta: `index,follow` once a page is real and ready; `noindex,nofollow`
  on every Studio preview page until cutover is explicitly approved (already set
  on every current `studio/*.html` page — keep this on every new page added).
- Internal linking: every card in every module link to the real canonical article
  (already the rule in `docs/STUDIO-CONTENT-ROUTING.md`) — this is also an SEO
  signal, not just a UX one.
- `sitemap-index.xml` / `posts-sitemap.xml` / `news-sitemap.xml` stay accurate and
  are not part of what a Studio cutover is allowed to silently break.

## AI-assistant / LLM discoverability

Separate from classic search: ChatGPT, Claude, Perplexity and similar assistants
either crawl the web directly or answer from a retrieval layer. Two levers matter:

1. **Don't block the crawlers that matter.** `robots.txt` should explicitly allow
   (not merely fail to block) the major AI crawlers once a page is meant to be
   public and indexed: `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` (OpenAI),
   `ClaudeBot` (Anthropic), `PerplexityBot`, and `Google-Extended` (Gemini/AI
   Overviews training+grounding signal, separate from classic Googlebot). Verify
   the current production `robots.txt` doesn't already carry a blanket
   disallow — check before cutover, don't assume.
2. **`llms.txt`** — an emerging, low-cost convention (plain markdown at
   `/llms.txt`) that summarizes what the site is and links its most important
   pages, written for an LLM to read quickly. Cheap to add, no downside; add one
   at Studio cutover time pointing at Front Page, News, Recruiting, GatorBait TV,
   Magazine, and the site's core "what is GatorBait Media" description.
3. Everything in the Google News and standard-SEO sections above (clean
   structured data, real canonical URLs, fast/stable rendering, no paywall on
   the first paragraph) also directly helps AI-assistant retrieval accuracy —
   these are not two separate workstreams.

Do not fabricate schema, authorship, or dates to game any of this. Never claim a
page is "indexed by ChatGPT" as a fact — that is not independently verifiable the
way Search Console indexing is; treat it as a discoverability practice, not a
measurable claim.

## Compliance

- Cookie/consent banner behavior must not regress from whatever the current
  production consent state is (see `docs/COOKIE-CONSENT-STATE-2026-09-14.md`) —
  verify current live state before Studio wiring touches anything consent-related,
  per the standard truth-hierarchy rule (live state over old docs).
- Accessibility: WCAG-reasonable contrast, focus states, semantic markup, no
  motion required to access content (already required by
  `docs/STUDIO-MASTER-WIREFRAME-BRIEF.md`) — this doc doesn't relax that, it
  reinforces it as an SEO/AI-discoverability input too (accessible markup is
  also what crawlers parse most reliably).
- Do not add any tracking/ad script to a Studio page without confirming it
  matches the current live consent/privacy posture.

## Competitive bar (ties to the existing audit)

`docs/STUDIO-COMPETITIVE-AUDIT-2026-09-20.md` already captures per-competitor
findings. The standing rule from that doc: adopt interaction/hierarchy patterns,
never proprietary layout, copy, or names (see the SwampGas→GatorBait.net
correction earlier in this build for why that rule is not optional).

## Verification loop (recursive checking)

Every decision under this doc gets verified the same way the ops-hub controller
already verifies production health — evidence from outside the model, not the
model's own claim:

1. **Design/competitive** — verified against the live competitor research in
   `docs/STUDIO-COMPETITIVE-AUDIT-2026-09-20.md`, re-run if it goes stale.
2. **Speed** — verified with a real Lighthouse/PageSpeed Insights run against the
   actual built page, not estimated.
3. **Google News / SEO** — verified against Search Console (already connected,
   see `skills/master-control/references/CURRENT-STATE.md`) once a page is live;
   structural checklist above applies pre-launch.
4. **AI discoverability** — verified by confirming `robots.txt`/`llms.txt` content
   directly, not assumed from intent.
5. **Compliance** — verified against current live consent/accessibility state,
   re-queried each time per the fast state-expiry rules in `CURRENT-STATE.md`.
6. **Business systems (ads/newsletter/email)** — verified against live GA4/Search
   Console/Wix Email Marketing data, never assumed "probably still running."

No item on this list is marked done from a model's own assertion. This mirrors
Master Control's `OBSERVE → SCOPE → CLASSIFY → PLAN → ACT → VERIFY → RECORD →
LEARN` loop already governing ops-hub — the same discipline applies to Studio
product decisions, not just infrastructure monitoring.
