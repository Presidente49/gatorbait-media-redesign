# GatorBait Studio Competitive Audit — 2026-09-20

Status: RESEARCH / DOCUMENTATION ONLY
Production impact: none. No file under `studio/` was edited to produce this doc.

## Method note (read first)

This session's network egress policy blocks direct `WebFetch` access to
`247sports.com`, `www.on3.com`, `www.gatorcountry.com`, `gatorswire.usatoday.com`,
`theathletic.com`, and `web.archive.org` (confirmed via repeated `EGRESS_BLOCKED`
/ fetch-failure responses on both the live domains and an archive.org mirror
attempt). Per this environment's proxy policy, a blocked host is reported, not
routed around. Findings below therefore come from `WebSearch` results —
indexed page content, snippets, official product-guide/FAQ pages, and URL
structure observed in real search-result links (e.g. the literal 247Sports
board URL pattern) — rather than a full rendered-page fetch. Every claim below
is cited to a specific URL. Where a mechanic could not be verified this way
(e.g. exact current above-the-fold pixel layout, live card counts), it is
flagged as unverified/inferred rather than stated as fact, per the no-fabrication
rule in `skills/gatorbait-studio-product-build/SKILL.md`.

A follow-up session with unblocked egress (or a human doing a manual screen
pass) should re-verify the visual/layout specifics flagged "inferred" below
before final implementation sign-off.

---

## 1. 247Sports / Swamp247 (Florida Gators)

- **Recruiting taxonomy is deep and is its own top-level product.** The
  Florida recruiting hub exposes distinct nav destinations: FB Recruiting
  Home, Latest News, Team Rankings, Commitments, Decommitments, Scheduled
  Commits, Player Rankings, Player Search, Crystal Ball, Recruiter Rankings,
  Class Calculator, All-Time Top Recruits, Transfer Portal. [Swamp247 hub](https://247sports.com/college/florida/) · [Crystal Ball prediction example](https://247sports.com/college/florida/Article/florida-gators-football-recruiting-247sports-crystal-ball-prediction-logged-in-favor-of-uf--165429392/)
- **Crystal Ball is a named, sourced mechanic**: industry "experts" log
  individual predictions on where a recruit will commit, each attributed and
  dated, aggregated into a team-level prediction confidence. [In-depth Crystal Ball explainer](https://247sports.com/college/florida/article/in-depth-on-the-who-why-and-what-of-a-crystal-ball-prediction-for-florida-recruiting-288055072/)
- **Article-to-community bridge is structural, not a footer link.** 247Sports
  runs a dedicated per-team message board as a first-class URL alongside the
  news hub — e.g. `247sports.com/college/florida/board/florida-gators-message-board-forum-14/` — and a sitewide board directory at `247sports.com/board/`. This is a same-network bridge (proprietary "message board" brand, not reusable), but the *pattern* — every team's news hub has a paired, permanent board URL, and boards can be followed into a personal "My Boards" tab — is real and citable. [Florida message board](https://247sports.com/college/florida/board/florida-gators-message-board-forum-14/) · [247Sports Forums FAQ](https://247sports.com/college/nebraska/article/247sports-forums-faq-104020037/) · [Board directory](https://247sports.com/board/)
- **Membership gates message-board VIP content and cross-network reading**,
  not base news: "All-Access VIP allows Annual and Monthly subscribers to
  read all 247Sports network content including articles and VIP message
  board posts from any team site." [247Sports Product Guide](https://247sports.com/college/oregon/article/247sports-product-and-features-guide-134261/)
- **Mobile is the majority of usage**: 247Sports has stated mobile accounts
  for 48%+ of total site usage, and the company ships a dedicated mobile app
  with its own "all-new navigation experience" iterated across betas — i.e.
  mobile nav is treated as a first-class, separately-designed surface, not a
  hamburger afterthought. [247Sports mobile app announcement](https://247sports.com/article/introducing-the-247sports-app-34276307/)
- Unverified/inferred (flagging, not asserting): exact above-the-fold card
  count and pixel hierarchy on the current Swamp247 front page — could not be
  fetched this session.

## 2. On3 / Gators Online

- **Deliberately low ad-clutter positioning as a subscriber benefit.** On3+
  membership is explicitly marketed on "minimum ads per page, no slideshows,
  and no video player in articles unless the video is about the actual
  article" — i.e. On3's stated differentiator vs. the rest of the recruiting-
  media category is *removing* clutter, not adding a bigger paywall. [On3+ Gators Online Membership](https://www.on3.com/teams/florida-gators/page/on3-plus/)
- **Named recurring content franchises gate to membership**: "The War Room"
  (general team scoop) and "Ten Most Wanted" (recruiting board), plus
  recruiting/team live chats and a game-day visitors list. These are named,
  repeating content formats, not one-off articles — a franchise-naming
  pattern worth noting for GatorBait TV/Magazine, without copying the names. [On3+ Gators Online Membership](https://www.on3.com/teams/florida-gators/page/on3-plus/)
- **Composite ranking as a credibility device.** On3 both runs its own
  rankings and republishes the industry-standard "Rivals Industry Ranking" /
  composite methodology (Rivals 33% / 247Sports 33% / ESPN 33%), and cites
  its own five-star draft-hit-rate stat (81.3% of On3 Five-Stars drafted in
  2023) as evidence of ranking credibility. This is On3's own claimed,
  sourced stat — not something GatorBait should assert as its own data. [How Recruiting Rankings are Determined](https://www.on3.com/recruits/news/how-recruiting-rankings-are-determined/) · [Rivals Industry Ranking explainer](https://www.on3.com/news/rivals-industry-ratings-rankings/)
- Unverified/inferred: literal current nav-bar item order and above-the-fold
  card count — could not be fetched this session.

## 3. GatorCountry (SwampGas forums — pattern only)

- **Board hierarchy separates public and paid tiers by name and by access,
  not just by a badge.** Verified board list includes: Swamp Gas (general
  football discussion), RayGator's Swamp Gas, Nuttin' but Net (basketball),
  Awesome Recruiting, Gator Insider Recruiting, Gator Insider BullGator Den
  (subscriber-only — "exclusive forum just for Gator Insiders"), Help Forum,
  Diamond Gators, Full Court Press. [Swamp Gas Forums index](https://www.gatorcountry.com/swampgas/) · [BullGator Den](https://www.gatorcountry.com/swampgas/forums/gator-insider-bullgator-den.10/) · [Insider Recruiting board](https://www.gatorcountry.com/swampgas/forums/gator-insider-recruiting.11/) · [Awesome Recruiting board](https://www.gatorcountry.com/swampgas/forums/awesome-recruiting.18/)
- **Underlying tech, verified**: the forum runs on **XenForo** — a paid,
  closed-source PHP forum platform (former vBulletin developers, released
  2011) — not an open-source project, so it is not eligible for the Studio
  toolbox even as a reference. Noted here only as a fact about the
  competitor's stack, per the task's "only if actually documented" rule. [XenForo product site](https://xenforo.com/) · [XenForo — Grokipedia summary](https://grokipedia.com/page/XenForo)
- **Board-level metadata pattern**: individual board pages show a "purpose"
  line, and paginate long threads (e.g. `/page-2`) — consistent with standard
  forum-software affordances (thread count / latest activity) already called
  for in `STUDIO-MASTER-WIREFRAME-BRIEF.md`'s GatorBait.net board-row spec. [BullGator Den page 2](https://www.gatorcountry.com/swampgas/forums/gator-insider-bullgator-den.10/page-2)
- Per the task's hard rule: GatorBait.net must not reuse the "Swamp Gas" name,
  its green-gas branding, or its exact board-name set. The wireframe brief's
  existing "Football / Recruiting / Basketball / Other Gator Sports /
  General-Pub / Premium-Insider" grouping is a safe, already-renamed
  equivalent structure and should stay as-is.

## 4. Gators Wire (USA Today Network)

- **Confirmed network affiliation**: Gators Wire is part of the "USA TODAY
  Sports Media Group College Wires constellation of websites," covering all
  UF athletics, not just football. [Muck Rack outlet profile](https://muckrack.com/media-outlet/gatorswire)
- **Parent-network paywall context**: USA Today (Gannett) began moving to a
  metered paywall for select articles industry-wide, with digital
  subscriptions starting near $10/month after a discounted trial — but this
  is a masthead-level (USA Today proper) shift; nothing found this session
  confirms whether Gators Wire's own team-site articles sit behind that same
  meter or remain free (Gannett's sports-wire network has historically stayed
  ad-supported/free rather than metered — flagged as inferred, not verified,
  do not state as fact in implementation). [Awful Announcing: USA Today paywall](https://awfulannouncing.com/online-outlets/usa-today-is-going-to-a-paywall.html)
- Could not verify specific nav taxonomy, above-the-fold card count, or ad
  density this session — flagged unverified rather than guessed.

## 5. The Athletic

- **Soft paywall, front-loaded**: readers are blocked from premium articles
  after a few paragraphs, with the subscribe prompt shown without needing to
  scroll, and the pitch framed as "full access, no ads" (i.e. the ad-free
  promise is bundled into the same CTA as content access — worth noting since
  it markets removal of *both* frictions at once). [Paywall subscription journey analysis](https://blog.poool.fr/subscription-journey-of-the-athletic-paywall/)
- **Comments are a named retention feature, auto-moderated, not staff-reviewed
  by default**: "comments are automatically deleted after three users flag
  them" — a community-policed flagging threshold rather than a moderation
  queue — and The Athletic explicitly promotes comment quality as a
  differentiator ("less toxic than others"). This is a real, if imperfect,
  article→community bridge model (in-page comments, not a separate forum). [Awful Announcing: comment-flagging incident](https://awfulannouncing.com/athletic/the-athletic-apologizes-for-deleting-a-comment-questioning-diversity.html)
- **Podcasts/shows live in a persistent "Listen" surface**: "You can find all
  your podcasts in the Listen tab of The Athletic app or by clicking the
  Podcasts button at the top right of TheAthletic.com," with followed-show
  episodes also surfacing directly in the user's main feed, not just on a
  buried podcast page. [The Athletic podcasts help article](https://theathletic.zendesk.com/hc/en-us/articles/360053214674-Podcasts)
- Unverified/inferred: current desktop nav-bar taxonomy and above-the-fold
  card count — could not be fetched this session.

---

## Adopt-as-pattern list (ranked by impact)

Framed as interaction/hierarchy patterns, not copied layouts, names, or copy.

1. **Paired, permanent article↔community link, not a one-off footer mention**
   (from 247Sports's per-team board URL structure). *Applies to:* `article.html`
   "Discuss this story" module and the eventual GatorBait.net board pages —
   each article's discuss CTA should route to a real, stable board/category
   URL (once a backend is chosen), the same way 247Sports's board is a fixed
   sibling URL to its news hub, not a generic community homepage link.
2. **"Ad-light" as the subscriber pitch, not just "more stuff for more money"**
   (from On3+'s explicit no-slideshow/minimum-ads framing). *Applies to:*
   `join.html` (still-stub) — GatorBait's membership pitch can lead with a
   cleaner reading experience as a tangible, verifiable benefit alongside any
   exclusive content, which is cheap to deliver and easy to keep honest.
3. **Podcasts/shows surfaced in a persistent cross-page "Listen"/"Watch"
   affordance, with followed-show episodes appearing in the main feed**
   (from The Athletic's Listen tab pattern). *Applies to:* `tv.html` (still-
   stub) — the wireframe brief already calls for a Show rail + Latest
   episodes + Audio/Listen block; this confirms that pattern against a real
   competitor and suggests episodes from a followed/continued show should
   also be eligible to appear in the Front Page's "Latest News" rail
   treatment area or a dedicated TV band, not only on `tv.html` itself.
4. **Community-policed comment threshold as a lighter-weight discussion layer
   than a full board**, distinct from GatorBait.net (from The Athletic's
   flag-to-remove model). *Applies to:* `article.html` — worth flagging as a
   possible *future* lightweight in-article discussion layer that is separate
   from and simpler than standing up a full GatorBait.net backend; not a
   near-term build item, but a cheaper interim step if GatorBait.net backend
   selection stalls.
5. **Named, recurring content franchises as membership hooks** (from On3's
   "The War Room" / "Ten Most Wanted" naming pattern — pattern only, names are
   On3's). *Applies to:* `magazine.html` and `recruiting.html` (both stub) —
   a named recurring recruiting-notebook feature and a named recurring
   magazine department both give members something specific and repeatable to
   return for, versus generic "premium content."

## Avoid list

- **Recruiting-media star-rating sprawl without in-house data.** 247Sports
  and On3/Rivals both run large, proprietary, editorially-staffed ranking
  operations (Crystal Ball, Industry Composite, Class Calculator). GatorBait
  has no verified in-house ranking data; the wireframe brief's existing rule
  — "Do not invent rankings, stars, NIL values or commitments" — is correct
  and this audit found nothing that should weaken it. Recruiting content
  should stay chronological-news + verified commit/visit reporting, optionally
  *linking out* to a named source's rankings rather than fabricating a
  GatorBait rating.
- **Stacking full-page slideshows/autoplay video into article bodies.** On3+
  explicitly markets *removing* this as a premium benefit, implying it is a
  recognized annoyance industry-wide — GatorBait should not add it in the
  first place rather than removing it later as a "membership perk."
  [On3+ Gators Online Membership](https://www.on3.com/teams/florida-gators/page/on3-plus/)
- **Opaque comment removal with no reason given.** The Athletic's own
  moderation friction (a public apology after auto-flag-deleting a comment
  with no stated reason) shows the risk of a pure crowd-flag system with zero
  transparency. If GatorBait ever adds lightweight in-article comments, pair
  any auto-removal with a visible reason/appeal path, unlike the case found
  here. [Awful Announcing: comment-flagging incident](https://awfulannouncing.com/athletic/the-athletic-apologizes-for-deleting-a-comment-questioning-diversity.html)
- **A "premium" tier defined mainly by walling off basic news.** Nothing
  found this session suggests GatorBait should follow USA Today's
  masthead-level meter-everything shift; the network-wire sports sites in
  this audit (Gators Wire) appear to keep sports coverage more accessible
  than the flagship paper, which fits GatorBait's existing ad-supported News
  model better than a hard meter.

## Proposed changes to existing `studio/` pages

Implementation is a separate follow-up step; these are scoped recommendations
only, no `studio/` file was touched.

### `studio/index.html`

- **`gb-band-tv` module (GatorBait TV promo band)**: currently a single
  static CTA band. Consider (later) surfacing the *currently live or most
  recent* show/episode name dynamically once TV data exists, mirroring The
  Athletic's "followed show surfaces in main feed" pattern (adopt-list #3) —
  not a structural change now, just a data-wiring note for when `tv.html`
  gets real data.
- **`gb-recruiting-rail` (Recruiting snapshot)**: currently filters existing
  posts by a title-keyword regex (`/recruit|transfer portal|commit/i`) as a
  stopgap. That's fine as a stopgap, but per the "avoid" list, this rail
  should stay strictly chronological-news cards — no star/rating badges
  should be added to these cards even as a visual placeholder, since none of
  GatorBait's own verified ranking data exists.
- **`gb-community-note` (GatorBait.net module)**: correctly shows an honest
  "backend not yet selected" empty state per the no-fake-data rule. Keep this
  exact pattern (transparent empty state, not a fabricated placeholder feed)
  until a backend decision lands — this audit found no competitor reason to
  deviate from that discipline.

### `studio/pages/article.html`

- **`gb-discuss` module**: currently a static band pointing to
  `gatorbait-net.html` generically. Per adopt-list #1, once GatorBait.net has
  real boards, this CTA's `href` should route to the *specific* board/category
  a story belongs to (e.g. a Recruiting story → Recruiting board), not the
  community homepage — matching the 247Sports paired-URL pattern. This is a
  data-wiring change for later, not a structural one now.
- **`gb-article-actions` (Save / Follow author / Share buttons)**: already
  matches the wireframe brief's shared interaction model; no competitor
  pattern found this session argues for changing it.
- **Related coverage grid**: currently pulls the next 3 posts with no
  relevance logic. No urgent change, but flag for later: none of the
  competitors reviewed use pure "next N posts" — they use topic/player-tagged
  related modules. Worth a backlog note once taxonomy/tagging exists, not a
  blocker now.

## Guidance for still-stub pages

### `studio/pages/recruiting.html`

- Structure per the existing wireframe brief (chronological lead + news +
  verified commit/visit + video + discussion + search/filter) is directionally
  correct and this audit found nothing to change in that ordering.
- **Do not add**: star ratings, Crystal-Ball-style predictions, class
  rankings, or NIL figures as GatorBait's own data (confirmed reinforcement
  of the brief's existing rule, based on how data-intensive and
  editorially-staffed 247Sports/On3/Rivals's ranking operations actually are
  — GatorBait has no equivalent verified pipeline).
- **New guidance not yet in the brief**: consider a simple, honest
  "Sourced from: [outlet]" attribution pattern if GatorBait ever needs to
  *reference* an outside ranking or Crystal-Ball-style prediction in a news
  story (e.g. "247Sports' Crystal Ball favors X") — link out, attribute by
  name, never restate the number as GatorBait's own. This does not conflict
  with the brief; it's an addition worth folding into
  `STUDIO-MASTER-WIREFRAME-BRIEF.md`'s Recruiting section next time that doc
  is revised.

### `studio/pages/tv.html`

- Wireframe brief's rail structure (hero player → live/current show →
  Continue Watching → show rail → latest episodes → clips → Listen block →
  social embeds → related stories) holds up well against The Athletic's
  Listen-tab pattern and On3's named-franchise pattern — no structural
  conflict found.
- **New guidance**: give each recurring show a stable, named landing anchor
  (own URL/section) the way On3 names "The War Room" and The Athletic surfaces
  followed shows in-feed — GatorBait already has real named shows (The Buddy
  Martin Show, Florida Gator Lowdown, Best Friday in Football, per
  `studio/index.html`'s existing copy), so this is just formalizing what
  already exists into a per-show page/anchor rather than one flat episode list.

### `studio/pages/magazine.html`

- No conflict found with the existing wireframe brief's cover → cover story →
  Inside This Issue → features → gallery → archive → subscribe structure.
- **New guidance**: On3's named-franchise membership pattern (adopt-list #5)
  suggests Magazine could benefit from 1–2 *named, recurring* departments
  (e.g. a standing photo-essay slot, a standing Q&A slot) rather than only
  one-off feature cards, giving Subscribe/save-issue a specific recurring
  reason beyond "read this issue." This is additive guidance, not a
  contradiction of the brief.

### `studio/pages/gatorbait-net.html`

- The existing board-group taxonomy (Football / Recruiting / Basketball /
  Other Gator Sports / General-Pub / Premium-Insider) is structurally
  equivalent to what real competitor forums do (GatorCountry's
  Football/Basketball/Recruiting/Insider split, 247Sports's per-team board +
  My Boards follow model) without copying either's names or branding — no
  change needed to the taxonomy itself.
- **New guidance**: adopt 247Sports's "paired URL" and "follow a board into
  My Boards" patterns (adopt-list #1) as concrete backend-selection criteria
  — whichever of Discourse/Flarum/NodeBB (see toolbox) is chosen should
  support (a) a stable per-board URL a news article can deep-link to, and
  (b) a per-user "followed boards" list. This is a useful addition to
  `STUDIO-REPO-FIRST-TOOLBOX.md`'s "Community / GatorBait.net" lookup section
  as a selection criterion, not a new toolbox entry (no new repo found this
  session for this — see below).

## Conflicts with `STUDIO-MASTER-WIREFRAME-BRIEF.md`

None found. This audit did not surface anything that contradicts the current
brief's structure, ordering, or hard rules (no invented recruiting data, no
proprietary-name reuse, no fake community activity). The additions above are
purely additive (attribution pattern for Recruiting, named-franchise
suggestion for Magazine/TV, board-selection criteria for GatorBait.net) and
should be folded in the next time that brief is revised, not treated as
urgent corrections.

## Toolbox additions

No new open-source repository is added to `STUDIO-REPO-FIRST-TOOLBOX.md` from
this audit. The one technology fact independently verified this session —
GatorCountry's Swamp Gas forums run on **XenForo** — is a closed-source,
commercially-licensed product (confirmed via the XenForo product site and a
third-party summary), so it is explicitly *not* an adoption candidate and is
recorded only in this doc's GatorCountry section for reference. The toolbox's
existing Discourse/Flarum/NodeBB community-backend candidates remain
unchanged; this audit found no new information to update their entries and
followed the task instruction not to touch entries without new verified
information.
