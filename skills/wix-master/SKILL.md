---
name: wix-master
description: GatorBait's Wix webmaster. Use for any question or change touching Wix settings, the Wix Studio Editor, Site Styles / theme / text themes, fonts (serif reverting, Barlow), custom code and embeds, SEO settings, robots.txt, sitemaps, redirects, Wix Blog (posts, writers, paywall, notifications), Members Area, Pricing Plans, checkout, Wix Email Marketing / Ascend (suspension, deliverability, automations), the Spaces by Wix member app and push notifications, site speed, publish, site history and rollback. Tells you where a setting lives (API, dashboard or Editor-only), whether it needs a publish, and what can't be fixed with CSS.
---

# Wix Master: the GatorBait webmaster

This skill is the Wix help center, distilled for gatorbaitmedia.com (Wix Studio site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`). It answers three questions before anyone touches the site:

1. **Where does this setting live?** API, dashboard, or Editor-only.
2. **Does changing it need a publish, and what else would that publish push live?**
3. **Can our custom code fix it, or is it hard-coded inside Wix?**

LESSONS numbers refer to `skills/master-control/references/LESSONS.md` (currently #33–#47 are on branch `fix-native-flash-20260926` until it merges).

It sits under Master Control. It doesn't grant write authority. The active controller task still decides what may change. For API mechanics (embed patch code, redirects, verification checklist), use the synced `gatorbait-site-ops` skill (`/root/.claude/skills/synced/*/gatorbait-site-ops/SKILL.md`). This skill doesn't repeat it.

## Load order

1. Read this file.
2. Load only the reference for the area involved:

| Area | Reference |
|---|---|
| Theme, fonts, Site Styles, native widget design | [references/site-design-fonts.md](references/site-design-fonts.md) |
| Custom code / custom embeds | [references/custom-code.md](references/custom-code.md) |
| SEO, robots, sitemaps, redirects, schema, Search Console | [references/seo.md](references/seo.md) |
| Blog posts, writers, paywall, post notifications | [references/blog.md](references/blog.md) |
| Spaces by Wix member app and push | [references/spaces-app.md](references/spaces-app.md) |
| Email Marketing (Ascend): compliance, suspension, automations | [references/email-marketing.md](references/email-marketing.md) |
| Pricing Plans, checkout, Members Area, roles | [references/pricing-members.md](references/pricing-members.md) |
| Site speed and third-party scripts | [references/performance.md](references/performance.md) |
| Publish, site history, rollback, what's live immediately | [references/publishing-safety.md](references/publishing-safety.md) |

Every reference cites the support.wix.com or dev.wix.com page it came from. When a help article and the live site disagree, the live site wins. Record the discrepancy.

## GatorBait rules (non-negotiable)

- **Barlow only.** Body 400–500, UI 700, display headlines 800. No Georgia, Times New Roman, Montserrat or any serif anywhere. That includes the native Wix theme, which our CSS doesn't reach everywhere (see the checklist below).
- **One writer per object.** Exactly one session or worker mutates a given embed, post, plan, automation or setting at a time. Claim it on the shared-memory board. Re-read the object and its `revision` right before writing.
- **Embed patch protocol.** GET by id → assert every string replacement matched → check length ≤ 15,000 → PATCH with the current `revision` and **the `embedData.category` read in that same GET** (presentation embeds stay `ESSENTIAL`; LESSONS #33) → verify live with a cache-buster → sync the repo copy byte-for-byte in the same pass. The code lives in `gatorbait-site-ops`.
- **No publish without need.** A site publish (`POST /site-publisher/v1/site/publish` or the Editor's Publish button) pushes **every saved Editor change** live, not just yours. It also re-renders page SEO from the Editor's copy (LESSONS #47). Many things are live without one (see the matrix). Publish only when the change actually requires it and you know what else is saved.
- **Record in issue #34.** Every production change, owner click-path handed to Brenden, or new Wix finding goes as one comment on GitHub issue #34 (Presidente49/gatorbait-media-redesign). Include object IDs, before/after, and verification. Don't open a new issue.
- **Scheduled monitors stay read-only.** They never publish, send, reschedule or change routing, and loading this skill doesn't change that.

## "Where does this live?" matrix

Legend: **API** = Wix REST API with our key. **Dash** = site dashboard. **Editor** = Wix Studio Editor only. Risk: L/M/H = blast radius if wrong.

| Setting | Where | Needs site publish? | Risk | Notes |
|---|---|---|---|---|
| Theme fonts / text styles (Heading 1–6, Paragraph 1–3) | **Editor only** (Site Styles → Typography) | **Yes** | H | No public API found. Changes every themed element and native app widget sitewide |
| Theme colors | Editor only (Site Styles → Colors) | Yes | H | Checkout "theme colors" draw from this |
| Global CSS (`global.css`) | Editor (Code panel) / Wix IDE | Yes | H | Only listed Studio element classes. Not Blog / Pricing Plans widget internals |
| Blog Post page design (fonts per text type) | Editor (Post page widget → Settings → Design) | Yes | M | Studio Post body text = **Paragraph 2** |
| Pricing Plans widget text style | Editor (Plans widget → Settings → Design → Text Style) | Yes | M | Per-text-type fonts |
| Plans checkout page design | Not customizable for Pricing Plans (help-center request article) | n/a | n/a | Inherits theme. Stores-style checkout designer is "becoming available" |
| eCom checkout brand (colors, logo) | Dash (Checkout Settings → Checkout design, "Save & Publish") / API `ecom/v1/checkout-settings` | Own publish button | M | Colors only, no font control |
| Members Area / My Account widget design | Editor (widget Settings → Design) | Yes | M | |
| Fallback / default fonts toggle | Editor (Studio menu → Site → Performance) | Yes | L | Speed setting. Also affects the pre-font flash |
| Custom code / custom embeds | Dash (Settings → Custom Code) / API `embeds/v1/custom-embeds` | **Our practice: publish then verify** (see publishing-safety) | H | 15,000-char cap, `revision` required, category = consent gate |
| Page filter (which pages an embed loads on) | Dash, and API `pageFilter` field | Same as above | M | Read `pageFilter` in the GET and re-send it unchanged |
| URL redirects (301) | Dash (SEO → URL Redirect Manager) / API | **No**, live in minutes | M | Overrides a real page at the same path. Browsers cache 301s |
| Page SEO (title, description, OG) | Editor page SEO panel / Dash SEO Settings → Edit by page / API item-seo-tags | API: live. But a later site publish reverts to the Editor copy (LESSONS #47) | M | Durable fix = paste into Editor SEO panel |
| SEO patterns by page type (posts, categories, tags) | Dash (SEO Settings) / API SEO Patterns | Dash says "Publish"; API: verify live | M | Blog **tag pages are noindex by default** |
| robots.txt | Dash (SEO → Robots.txt Editor) | No | H | A bad directive can deindex the site |
| Sitemap | Automatic | n/a | L | Noindexed, canonicalized and gated URLs are excluded |
| Blog posts, categories, tags | Dash / API Blog | No (post publish is its own action) | M | Post publish fires notifications and automations. Treat it as outbound |
| Blog writer roles | Dash (Roles & Permissions / Blog → Writers) | No | M | |
| Post paywall (post ↔ plan) | Dash (post → Monetize) / Pricing Plans perks | No | H | Money + access |
| Blog/Post page permissions (members-only, plan-gated) | Editor (Pages → Blog Pages → Settings → Permissions) | Yes | H | Can lock out every reader |
| Pricing plans (price, trial, visibility, cancellation, policy) | Dash / API Plans v3 | No | H | Can't change pricing strategy with active subs |
| Member roles, badges, page access | Dash (Site Member Access / Badges) | No | M | Page-level permission = Editor |
| Email campaigns | Dash / API (only when account `ACTIVE`) | No (send is the action) | H | Outbound. Owner approval per send |
| Email account status | API read-only (`account-details`) | n/a | n/a | Only the owner can clear a suspension (dashboard questionnaire) |
| Sending domain authentication | Dash / API sending-domains | No | M | CNAME records at DNS host |
| Automations (new-post email, push) | Dash (Automations) | No, live on activate | H | Identify by ID + origin + action ID, never by name |
| Spaces push / announcements | Dash (Mobile App) or Wix owner app | No, sends immediately | H | **No public API** to push to members |
| Spaces invite code, join approval, tab permissions | Wix owner app / Dash Mobile App | No (app-side) | M | |
| Site history restore | Editor / Dash Site History | Restore then publish | H | Doesn't revert CMS data, app content or SEO for many apps |

## "Hard-coded inside Wix" checklist

These are things custom CSS/JS **can't reliably fix**. They render from Wix's own theme or widget settings, often server-side before our embeds run, or inside app components our selectors don't reliably reach. Fix them at the source. Each item gives the owner's click path.

1. **Theme fonts (serif reverting).** Studio Editor → **Site Styles** (left bar) → **Typography** tab → under **Fonts**, click each non-Barlow font → choose **Barlow** → **Update**. Then open each **Text style** (Heading 1–6, Paragraph 1–3), set font Barlow and a weight (800 headings, 400/500 paragraphs), check the size, then click the back arrow. Themed elements and native app widgets follow. Elements with a "design override" don't: select them → Style dropdown → **Reset Changes**.
2. **Blog Post page fonts.** Studio Editor → Pages & Menu → **Blog Pages** → **Post** → click the Post widget → **Settings** → **Design** → **Text style & color** → set paragraph and heading fonts to Barlow. Repeat for the **Blog / category feed** widget → Design → Posts.
3. **Pricing Plans page.** Pages & Menu → Plans & Pricing page → click the Plans widget → **Settings** → **Design** → **Text Style** → Barlow for every text type (and the **Highlighted** tab).
4. **Plans checkout page.** Wix says the Pricing Plans checkout **can't be customized**. It inherits the theme, so step 1 is the only lever. Checkout Settings → Checkout design only sets colors and logo.
5. **Members Area / My Account / login & signup.** Pages & Menu → Members Area / Member Authentication pages → click each widget (My Account, login bar, signup/login forms) → **Settings/Design** → Barlow where offered. Anything without a font picker inherits step 1.
6. **Flash of serif before our CSS loads.** Our Barlow loader runs after Wix's server-rendered theme CSS. Until step 1 is Barlow, every cold load can paint serif first. Step 1 plus the Editor's Performance → fallback-font setting are the real fixes. More JS polling is not.
7. **Native widget spacing and line height.** Character/line spacing can't be changed in Menu, Forms, Blog, Store, Search, Events, Bookings, Ratings. Use widget Design panels.
8. **Checkout, payment and system emails.** Transactional email templates (plan receipts, blog notification emails) are styled by Wix and Automations, not by site CSS.
9. **Spaces app screens.** The member app renders natively on the phone. Site CSS/embeds don't apply. Design lives in Mobile App → Edit.
10. **Hidden native container.** Our Home/Magazine embeds hide `#SITE_PAGES`, so native widgets and AdSense Auto Ads that mount there can't render (LESSONS #43). Place intentional slots inside our renderer.
11. **Consent deferral.** Any embed that isn't `ESSENTIAL` waits for the consent manager, so native pages flash first. The fix is the embed's category, not more CSS.

After any owner change here: owner clicks **Publish** (see the publish warning below) → verify with a cache-buster on `/`, a `/post/…` page, `/plans-pricing`, `/account/my-account` and a checkout start → grep computed `font-family` for serif. Record the result in #34.

## Troubleshooting playbook

**"Font looks wrong / serif is back"**
1. Load the page cold (incognito + `?cb=`). Record where the serif appears: native blog, plans, members, checkout, a flash, or our embeds.
2. If it's inside our embeds, grep the live header, home and Magazine embeds for `Georgia|Times|serif|Montserrat` (LESSONS #41 recurrence). Patch via the embed protocol.
3. If it's on native surfaces or a flash, it's the theme. Hand the owner checklist items 1–5. Don't try to fix the theme with more CSS.
4. Verify on all five surfaces and record in #34.

**"Readers aren't getting new-post notifications"**
1. Separate the channels: blog email (Automations), member push (Spaces), Email Marketing campaigns.
2. Email: read account status via `account-details`. If it isn't `ACTIVE`, automation and campaign mail may be held (the owner fixes this). Check that quota isn't exhausted.
3. Blog emails skip contacts who are inactive (stopped opening several in a row), bounced, spam-complained, unsubscribed, blocked, or in a different site language, and they skip the post's own author.
4. Find the new-post automations by **ID** (two have been active, so there's double-send risk). Confirm one owner, then read execution/delivery evidence. Never test-publish or resend as a diagnostic.
5. Push: members must have joined the site in Spaces **and** allowed push on the device **and** in Spaces → My Profile → Settings → Notifications. Owner can't force it.

**"Paid subscriber can't access a post"**
1. Confirm they're logged in as the **same member email** that bought the plan (guest checkout can't grant online content).
2. Dashboard → Subscriptions: status must be Active, Free Trial or Pending Cancellation. Suspended, Canceled, Expired or grace-period failures lose access.
3. Check the gate: is the post connected to that plan (post → Monetize), or is the Post page permission limited to specific plans?
4. Check member status is Approved (not pending or blocked). Fix access, never by duplicating the post. Record in #34.

**"Email marketing suspended / rank BAD"**
1. Read `account-details` status (`WARNED`, `SUSPENDED`, `SUSPENDED_AUTOLIFT`, `BANNED`). No API can change it. The owner completes the dashboard questionnaire.
2. Freeze all sends. After reinstatement, send only to engaged, confirmed subscribers, in small batches, from the authenticated gatorbaitmedia.com domain.
3. Hygiene: suppress bounced and spam-complaint contacts, run the Gmail NDR sweep (LESSONS #46), turn on double opt-in on subscribe forms, and remove contacts inactive for 6+ months.
4. Record in #34. One outbound owner.

**"Change isn't showing live"**: check whether it needs a publish (matrix). Check Site History for other saved-but-unpublished changes before publishing. Retest with a cache-buster. Remember 301 caching.

**"Push to Spaces members"**: owner only, via Dashboard → Mobile App → Push notifications → Create, or Wix app → Marketing → Mobile Announcements. Recipients: all, labels or segments. No API. Treat it as an outbound send that needs Brenden's yes.

## Publish warning (read before any publish)

Publishing makes **all** saved Editor changes live, with no partial publish. Before any publish, including the API one:

1. Open Site History and compare the latest **Saved** entry with the latest **Published** entry. Anything saved after the last publish goes live with yours.
2. If unknown drafts exist, stop and ask the owner. Options are in [references/publishing-safety.md](references/publishing-safety.md).
3. After publishing, re-apply API page SEO from `docs/PAGE-SEO-2026-09-28.json` if the pass touched it (LESSONS #47). Verify live a few minutes later.
