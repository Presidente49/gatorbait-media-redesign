# GatorBait type standard and finish audit, October 2026

Design team, Oct. 7, 2026. Reports to the controller (Jarvis). Measured on the live site with real-browser runs (`automation/vision/type-audit.mjs`, read-only): 8 to 10 pages at 390, 430 and 1365 px. No production write was made. Every fix below is staged in this PR and handed to the game-day desk, which owns the live embeds.

## 1. The standard

**House type is the Barlow family only.** AP style for copy. No Georgia, Times, system serif, Arial, Proxima, Roboto, Avenir or Bebas anywhere a visitor can read.

| Role | Face | Weights (loaded) | Case and tracking |
|---|---|---|---|
| Display: story and section headlines, kickers, nav, ticker, buttons, numerals, scoreboard, drop caps, post `h2` | **Barlow Condensed** | 600, 700, 800 | 800 for headlines. Never below 600. Tracking 0 or positive on headlines. Kickers and buttons uppercase, +0.06 to +0.14em. |
| Text: body, bylines, dates, captions, dek paragraphs in cards, form fields, native widgets | **Barlow** | 400, 500, 600, 700, 800 | Sentence case. Tracking 0. |

Rules that follow from the loaded files:

- Barlow Condensed has no 400 or 500 file. A Condensed 500 is a synthesized face and spaces badly (the Corn Dogs column, section 4). Condensed is 600, 700 or 800 only.
- Barlow weight 900 is not loaded (the mobile "Menu" button asks for it). Use 800.
- Condensed headlines carry no negative tracking. At 28 px and up, -0.02em closes the counters and letters touch (Magazine cover headline).
- Body copy is **Barlow 500**. That is what the Magazine reader has always used (`font:500 18px/1.65`) and what the posts render today.
- All-caps with negative tracking is not allowed (the post `h3`, section 4).
- Story headlines are title or sentence case as written, never uppercase. Section heads, kickers, buttons and nav are uppercase.

## 2. Where the standard comes from

- Magazine reader (the original drop-cap spec): `sports-live/magazine.js`, `.pg-prose>p:first-child::first-letter{float:left;font:800 4.6em/.8 var(--mz-cond);padding:.06em .1em 0 0;color:orange}`, body `font:500 18px/1.65 var(--mz-sans)`.
- Front page and Magazine sources (`sports-live/src/front-page.css`, `magazine.css`): `h1-h4` are `var(--fp-cond)` / `var(--mz-cond)` at 800, kickers, ticker, scoreboard, buttons and numerals are Condensed, copy is Barlow. 59 Condensed declarations in the front-page source today.
- Post template (`deploy/post-template/proposed.html`, c16c0d2 "recent-story magazine drop cap", Oct. 5): drop cap on the first body paragraph of posts under 7 days old, `font:800 4.6em/.78 Barlow Condensed`, orange `#fa4616`, float left, `padding:.07em .11em 0 0`; 4.15em on phones.
- The front page dropped its own drop cap on Oct. 4 (05d41a7, Brenden: no drop cap on the lead dek). It stays off the homepage.
- Georgia was removed from the live embeds Sept. 27 to 28 (fefc3d0, and the Arial-to-Barlow patches of seven embeds recorded in #34). PR #38 ("Barlow-only typography", `56b26d4`) would do the same in the repo sources and add `scripts/check-typography.sh`. **PR #38 is still open and conflicted (mergeable state dirty), so `main` has neither the source cleanup nor the guard**; the next rebuild of `magazine-embed.html` from `magazine-style.html` can bring Georgia back (Lesson on "don't reintroduce" rules). It replaces Georgia with plain `Barlow,Arial`, which is right for text and wrong for display type; the guard bans serifs only, not Arial, Proxima, Roboto or Bebas.

## 3. Root cause of "the fonts don't look like they did"

`assets/sitewide-type.css` v1 (served on every page by embed `0709a98e`, pinned to commit `a4b4648e`) says "One-family system: Barlow" and forces `font-family: Barlow !important` plus `font-weight:800; letter-spacing:-.02em` on every `h1-h3`, `a`, `span`, `button` and `small` inside `#gbm-live`, `#gbm-magazine-page` and `#SITE_PAGES`. The embeds ask for Condensed; v1 flattens it. Elements v1 does not list (`b`, `div`, `td`, `li`, `i`) stay Condensed. The result on one page is a mix:

| Page (live, before) | Display type that renders as | What the source asks for |
|---|---|---|
| `/` lead headline, `h3.fp-hl`, kickers, ticker, buttons | Barlow 800 | Condensed 800 |
| `/` scoreboard numerals (`div.sc`, `b`) | Barlow Condensed 800 | Condensed 800 |
| `/magazine` cover `h1`, card `h3`, `h2` | Barlow 800, -0.02em | Condensed 800 |
| `/magazine` `li`, `b` (numerals, TOC) | Barlow Condensed | Condensed |
| `/gatorbait-media-blogs` `h1` | Barlow Condensed 800 uppercase | Condensed 800 |
| Posts: title | Barlow 800, `h2` Condensed 800 uppercase | (template decision, section 6) |

Census counts of text nodes by family, home at 390: before 89 Condensed / 201 Barlow / 4 Arial; with v2 183 / 112 / 0. Magazine at 390: before 34 / 202 / 4; with v2 101 / 136 / 0.

## 4. Measured live (Oct. 7, 14:08 and 14:21Z)

Posts, all widths. Computed from the rendered text (the `span` that holds the text, not the `p`).

| Element | 390 px | 1365 px |
|---|---|---|
| Body | Barlow 500, 17.5 px, lh 29.05 (1.66) | Barlow 500, 19 px, lh 32.68 (1.72) |
| Lede / drop-cap paragraph | columns 18.5 px; news 19.5 px | columns 20 px; news 22 px |
| Drop cap `::first-letter` | Barlow Condensed 800, 76.8 px (4.15em), orange, float left | Condensed 800, 92 px (4.6em) |
| Post title | Barlow 800, 31.2 px, lh 34.3, -0.025em | Barlow 800, 44 px, lh 46.6, -0.025em |
| Kicker `header::before` | Barlow 800, 12 px, +0.14em, uppercase | same |
| Byline / date | Barlow 700 12 px / Barlow 500 12 px | 13 / 13 |
| `h2` | Condensed 800, 27 px, uppercase | Condensed 800, 32 px |
| `h3` | **Barlow 800, 23 px, uppercase, -0.46 px tracking** | same |
| Caption | Barlow 600, 14 px | 14 |
| Line length | about 42 characters | about 76 characters |

Defects found, with evidence in `docs/type-audit-2026-10-07/`:

1. **Corn Dogs vs. Commissioners column: the lede renders in Barlow Condensed 500, 18.5 px.** The author sized the opening line bold 30 px in the Wix editor. The post normalizer `c91ad133` marks it `data-gbm-dek` and styles it `700 30px/1.12 "Barlow Condensed"`; the drop-cap script in the post template `14a887e3` also picks it as "first paragraph of 80+ characters". The drop-cap rule wins size and weight, the dek rule wins the family, so the paragraph ends up Condensed 500 at body size, with ragged word spacing, and the drop cap sits on a headline. Only Buddy columns that open with a bold line show it (`p.gbm-dropcap[data-gbm-dek]`).
2. **Lede size differs by post type**: 20 / 18.5 px on columns, 22 / 19.5 px on news stories (the template's `[data-hook=rcv-block-first]+div>[data-breakout]:first-child p` rule). Body is 19 / 17.5 px.
3. **`h3` is uppercase with negative tracking** (`-0.46px` on 23 px). Uppercase wants positive tracking. The template README says no uppercase titles; this `h3` comes from another embed's rule.
4. **Non-Barlow faces still render**: the Wix cookie banner (Arial 12 px, buttons and links), the post tag chips (`nav[tag-cloud-root] a`, Proxima Nova), the Wix comments widget (Roboto, desktop), and the Wix category dropdown on the Latest list (Helvetica), and the Wix-native About page (Avenir and a decorative Wix theme face).
5. **Signup card uses two faces**: the end-of-story strip headline and button are Barlow 800 (21.84 px, 16 px), the slide-up bar (`#gbc-bar`) is Condensed 800 (22 px, 16 px).
6. **Post meta row**: "Updated:" is 14 px light and "13 hours ago" is 16 px 700 with a 24.8 px line height in the same line; the kicker chip sits centered while title and byline are left-aligned.
7. **Latest (`/gatorbait-media-blogs`) and About render in Wix's forced 320 px viewport on a 390 phone** (`innerWidth` 320). Type is scaled 1.22x, and `small` microcopy lays out at 8.33 px ("Results open on Google, limited to GatorBaitMedia.com"). `/`, `/magazine` and `/post/*` already have the override.
8. **Barlow 900** on the mobile "Menu" button (not loaded; falls back to 800).
9. **Bottom of a phone story page**: Wix cookie banner (160 px, 19 percent of a 844 px screen) plus the signup slide-up (`#gbc-bar.on`, 236 px, 28 percent) cover 47 percent of the first screen at 390.
10. Magazine masthead stack lists Bebas Neue first (`--mz-mast:"Bebas Neue","Barlow Condensed",...` in `sports-live/src/magazine.css`). The font is not loaded so it falls to Condensed, but the declaration violates the standard and the CI guard does not catch it.

Checked and fine: ticker (Condensed 700 13 px, uppercase, +0.06em), buttons (Condensed or Barlow 800 15 to 17 px, 44 to 48 px tall), no horizontal overflow at 390, 430 or 1365 on `/`, `/magazine` and posts, line lengths inside 35 to 45 (phone) and 60 to 80 (desktop), the drop cap exists on every post under 7 days old and is correctly absent on the older Ole Miss story, and on Magazine the in-issue reader keeps its own `::first-letter`.

Seen and already fixed by the desk's PR #145 between my two runs: the next-game band reads "VS. S. CAROLINA" with "SEC NETWORK" in full, and the desktop nav shows "STORE ↗" in full (it clipped to "STOF" at 1365 on the 14:08Z run). Still open at 14:21Z: the 1365 hero crop cuts the baked-in cover type ("OLUMN", "HOUGHTS"); the PR's `covers` entry is not live yet.

## 5. Scale to implement

Desktop / phone (390 to 430). Line height is unitless.

| Token | Face | Desktop | Phone |
|---|---|---|---|
| Story title | Condensed 800, title case | 52 px / 1.02 | 38 px / 1.04 (clamp 34 to 40) |
| Section `h2` (post) | Condensed 800, uppercase | 32 px / 1.02 | 27 px |
| `h3` (post) | Condensed 800, sentence case | 28 px / 1.1 | 24 px |
| Dek (bold opening line) | Condensed 700 | 30 px / 1.12 | 25 px |
| Lede (first body paragraph, drop cap) | Barlow 500 | 20 px / 1.68 | 18.5 px / 1.62 |
| Body | Barlow 500 | 19 px / 1.72 | 17.5 px / 1.66 |
| Pull quote | Condensed 700 | 28 px / 1.2 | 24 px |
| Caption | Barlow 600 | 14 px / 1.45 | 14 px |
| Byline, dates | Barlow 700 / 500 | 13 px | 12 px |
| Kicker | Condensed 800, uppercase, +0.14em | 12 to 13 px | 12 px |
| Buttons | Condensed 800, uppercase, +0.06em | 15 to 17 px, 44 px tall minimum | same |
| Fine print (never below) | Barlow 400 | 11 px | 11 px |
| Home lead headline | Condensed 800 | 57 px to be re-tuned (+12 percent for Condensed) | 24 to 28 px, re-tune to 30 to 34 px |
| Home and Latest card headlines | Condensed 800 | 21 px | 17 px, re-tune to 19 to 20 px |

Condensed runs about 15 to 20 percent narrower than Barlow at the same size. Every headline size that moves to Condensed needs a size bump, or headlines look small and the mobile cards lose their weight. The "Story title" row is a decision for Brenden (Oct. 4 made story titles Barlow 800, never uppercase). The row above keeps "never uppercase" and changes only the face.

**Drop cap.** First body paragraph that is not a dek, a byline, a credit or stats line, 80 characters or more, whose first letter is not followed by an apostrophe ("I'm" gets no drop cap), on posts published within 7 days. `float:left; font:800 4.6em/.78 "Barlow Condensed"; color:#fa4616; padding:.07em .11em 0 0`, 4.15em on phones (it spans three lines of text). Never on the homepage, in the Magazine card grid, on a dek paragraph, or on a post older than 7 days. The Magazine in-issue reader keeps `.pg-prose>p:first-child::first-letter` (4.6em/.8, padding `.06em .1em 0 0`).

**Line length.** Body 60 to 78 characters at desktop (column about 700 px at 19 px), 35 to 45 on phone. Do not widen the post column.

## 6. Punch list (exact selectors and the embed to change)

Tier A: defects and consistency. Safe to apply now; staged in this PR and dispatched to the desk. Tier B: needs Brenden's yes because `HOMEPAGE-BASELINE-LOCK.md` forbids materially changing the approved presentation without it.

| # | Tier | Change | Selector / location | Embed (owner: game-day desk) |
|---|---|---|---|---|
| A1 | A | Drop-cap script skips a dek and lands on the first real body paragraph; if that paragraph opens "I'm" or "We're" it gets no drop cap (`::first-letter` would swallow the apostrophe and leave "m" dangling) | in `gbm-week-rich-js`: change the `if` to `if(s.length>=80&&!/^by\s+/i.test(s)&&!/^(photo|image|source|statistics|stats|tags?)\b/i.test(s)&&!p[i].hasAttribute('data-gbm-dek')){if(/^[A-Za-z](?!['\u2019])/.test(s))p[i].classList.add('gbm-dropcap');break}` | `14a887e3` post template (+about 90 characters; 282 free) |
| A1b | A | CSS safety net if the script is late: dek keeps its own face, no float on its first letter | `p.gbm-dropcap[data-gbm-dek]` and `::first-letter` (sitewide-type v2 section 6) | `0709a98e` link pin |
| A2 | A | One lede size (20 / 18.5 px), one body size, weight 500 | `[data-hook=rcv-block-first]+div>[data-breakout]:first-child p`, `p.gbm-dropcap` (v2 section 5) | `0709a98e` link pin |
| A3 | A | Cookie banner, comments widget, tag chips in house type | `[data-hook^="consent-banner"] *`, `#cookies_policy_description`, `[data-hook^="comments-"] *`, `#SITE_PAGES [tag-cloud-root] a` (v2 section 3) | `0709a98e` link pin |
| A4 | A | Signup card, one face in both mounts | `.gbc .gbc-h`, `.gbc .gbc-b`, `#gbc-bar .gbc-h` (v2 section 3) | `0709a98e` link pin |
| A5 | — | About page (Wix native text: Avenir, plus a decorative small-caps heading face). Not changed: forcing Barlow onto it made the page's own letter-spacing and weight look worse. Needs a design decision, not a global override | `/about` | none |
| A6 | A | `Menu` button weight 900 to 800 | `button` in `#gbm-mobile-shell-host` | `7fee4de6` header or shell embed (small) |
| A7 | A | `h3` in posts: no uppercase with negative tracking. Condensed 800 sentence case, tracking 0 | find the rule that sets `text-transform:uppercase` on `[data-hook=post-description] h3` (not in `14a887e3`) | desk to locate (likely `a5452619` or the Share bundle) |
| A8 | A | Magazine masthead stack: remove Bebas Neue | `--mz-mast` in `sports-live/src/magazine.css` and `deploy/wix-served/magazine*.html` | Magazine `1dd74333` (37 free characters; removing a family name frees space) |
| A9 | A | Cookie banner plus slide-up cover 47 percent of a phone first screen: show the slide-up only after the banner is dismissed, or lift it above | `#gbc-bar` in `sports-live/src/capture.js` | Share bundle (pointer) |
| A11 | A | Merge PR #38 after resolving its conflicts, and extend `scripts/check-typography.sh` to fail on `Arial`, `Proxima`, `Roboto`, `Bebas` and `Helvetica` font declarations in served sources | `.github/workflows/live-presentation-qc.yml` | controller |
| A10 | A | Latest and About in the forced 320 px viewport: extend the existing viewport override, or set microcopy to at least 11 px at 320 | `.gbm-ms-foot`, `small` on `/gatorbait-media-blogs`, `/about` | header `7fee4de6` / core |
| B1 | B | Remove v1's Barlow force on display type so the embeds' Condensed shows: homepage, Magazine, Latest | sitewide-type v2 sections 1 to 2 and 3b | `0709a98e` link pin |
| B2 | B | Re-tune headline sizes for Condensed (+12 percent), keep the no-jump reserved heights | `#gbm-live .fp-hl`, `.fp-lead h2`, `#gbm-magazine-page h1, h2, h3` | front-page and Magazine sources, then the pointer |
| B3 | B | Post title in Condensed 800 title case (52 / 38 px) instead of Barlow 800 | `[data-hook=post-title]` rule, `font:800 44px/1.06 var(--f)` becomes `var(--c)` at 52 px | `14a887e3` (same length) |

One Wix write covers A1b to A4, B1: change the `sitewide-type.css` link in embed `0709a98e` from `@a4b4648e...` to the commit that carries this PR's `assets/sitewide-type.css`. jsDelivr serves any commit by hash, so the file can go live before the PR merges. Rollback is the old hash. A1 is a second, small write to `14a887e3`.

## 7. Verify after any change

1. `node --check automation/vision/type-audit.mjs`, then push a `shots/<name>` branch with `automation/vision/live-shots.request.json` set to `{"path":"/__type-audit","selector":"","widths":"390,430,1365"}`; read `qa/live-shots/type-audit.json`.
2. The audit must show: no family outside Barlow and Barlow Condensed in `probe.bad` except the Wix header logo; `post.bodyStyles` has one family and one size per width; `post.dropcap.first` is Condensed 800; no `p.gbm-dropcap[data-gbm-dek]`; `docScrollWidth` equals `innerWidth`.
3. `automation/vision/type-audit.config.json` can inject a proposed stylesheet (`variants[].css`) into the live page and photograph it with no production write. That is how the "after" images in `docs/type-audit-2026-10-07/` were made.
