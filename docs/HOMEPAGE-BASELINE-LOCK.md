# GatorBait Homepage Baseline Lock

## Current live pointer — September 24, 2026

Fresh Wix provider read supersedes the older rev61 pointer below:
- active homepage embed `fdc2127a-845a-4d02-b711-438f1a4a86ce` = **revision 68 / enabled**
- current immutable homepage source = `485b38a036431c667584aa3990922772288399f3/sports-live/homepage.js`
- separate Magazine embed `1dd74333-ee02-40da-9c93-cf8fd787c129` = **revision 26 / enabled**, pointing to the same commit's `automation/site-design/magazine.js`
- existing `f0a2deca...` Newsroom assets are recovery/fallback assets only, not the primary homepage pointer
- AdSense serving owner is `af338ad4-8c84-4708-8859-f1d6a0121c13` **rev2 / enabled / ADVERTISING**; legacy `2da582cf...` and fallback `109a8870...` remain disabled.

The product rule remains: free sports-news homepage, separate Magazine, Buddy-led curated hierarchy, current news chronological, one visible homepage owner. Read live revisions again before any write.

## Historical/current-design record below

## Current authority — September 23, 2026

Brenden corrected the Gazette homepage direction. The **free sports front page** is now the default; `/magazine` remains separate. Use Jannah Sport as layout reference and JNews as publishing feature reference, with original GatorBait implementation on Wix. See `docs/SPORTS-PUBLISHING-DIRECTION.md` and `docs/SITEWIDE-DESIGN-2026-09-23.md`. Inner pages now share the publication header; native Blog grid, magazine mount and TV hub are repaired.

- Historical September 23 checkpoint: loader revision **61** and source `81a845304c9802d8dbd88b6448337f4f89461658/sports-live/homepage.js`; superseded by the live rev68 pointer recorded above.
- Current source file family: `sports-live/homepage.js`. One homepage root `#gbm-live.gbm-sports-home`; compatibility class `gbm-gazette` preserves existing shell integration, not Gazette page design.
- Existing mobile shell/footer/native article and business owners retained.
- Public RSS bundled/cached stories render immediately. Background refresh is bounded and does not replace the reader's layout.
- Latest Chris Spears Auburn photography is used; original story captions and bylines retained.
- Desktop live Wix preview verified: loaded lead and supporting images, no horizontal overflow, canonical article navigation succeeds and sports root absent on article.
- 390/430px isolated compiled fixtures visually inspected. These are not physical iPhone or full mobile Wix-shell tests.
- `/message-board` currently404: main navigation points to honest `/#community` status. No forum deployment claimed.
- Recent20 posts have empty pricingPlanIds. No paid/free assignments or subscription prices changed. Magazine paywall enforcement is outstanding.
- AdSense incident#30 remains separate; no new ad units/scripts, and no verified revenue recovery claimed.
- Rollback snapshot: `deploy/backups/homepage-loader-revision58.html`; current loader snapshot: `deploy/sports-home-loader-revision60.html`. Always read the live revision before restoring HTML and publishing. Do not blindly write an old revision number.

## Historical Gazette launch (superseded; retained for rollback context)


**Current presentation:** Original Gazette, owner-authorized September 22, 2026.  
**Applies to:** production homepage `/` on `gatorbaitmedia.com`.  
**Launch status:** Wix revision 58 published with compact cover proportions; prior revision 56 baseline: 63/63 unmodified public-browser functional checks passed at 2026-09-22T23:53:36Z. Details and remaining scope limits below and in issue #31.  
**Authority:** this notice supersedes the older V1-default statements in historical snapshots, including CURRENT-STATE.md. Read live Wix state before any mutation.

## Default production homepage

The default is the original Gazette layout adapted to the existing Wix site. Do not restore the old Newsroom merely because a prior snapshot calls it the default. Brenden explicitly authorized the Gazette production switch and its subsequent checks.

- Active loader: `fdc2127a-845a-4d02-b711-438f1a4a86ce`.
- Verified revision after cover repair: `58`, enabled.
- Name: `GBM - Original Gazette Live v1 (Wix business preserved)`.
- Position/category/load behavior preserved: HEAD, ESSENTIAL, loadOnce false.
- Gazette asset pin: `bdb4154e00429c03f419ebb0320994b47c0d3f2c`, `gazette-live/homepage.js`.
- Package is derived from original MIT Gazette 1.1.4, upstream `cee215fd3ec0b78bba6f99d3a59a033b0a5f0b48`; it is not the earlier Lovable recreation or custom Masthead V2 renderer.
- One homepage root: `#gbm-live.gbm-gazette`.
- Original mobile shell and account styles remain inside the existing loader. No second active header or footer was added.
- The old V2 preview bootstrap and four unconditional V1 asset tags were removed from the active loader.
- V1 asset loading remains for native routes and explicit recovery, never beside Gazette on the normal homepage.

## Publishing and business boundaries

- Gazette uses `gazette-live/posts.json`, refreshed from public Wix Blog RSS by the EXISTING `refresh-newsroom-feed.yml` workflow.
- One source read updates both the full Gazette publication feed and the existing filtered legacy Newsroom feed.
- Existing five-minute schedule retained; no additional recurring worker. Updated data requests the same native Pages publisher because GITHUB_TOKEN commits do not trigger it automatically.
- Homepage contents are newest-first. The magazine-style cover uses the newest verified Buddy Martin byline within seven days, or the newest post when no such article exists.
- Article links go directly to existing canonical Wix `/post/` URLs. They do not go through preview excerpt pages.
- `/magazine`, `/account/my-account`, `/pricing-plans`, TV, Store, email, payments and member access retain their existing owners.
- No DNS, consent, AdSense or GA4 configuration was changed.

## Stability and navigation

- Only one presentation owner may mount.
- Native homepage content must not appear under Gazette.
- DOM ownership selectors are used because Wix can replace document classes during hydration.
- The initial loader hides the obsolete native canvas before loading Gazette and avoids painting the footer ahead of the publication.
- Revision 56 adds only `html:has(#gbm-gazette-bundle) #BACKGROUND_GROUP{display:none!important}` inside the existing `gbm-gazette-startup-v1` style. This visual-only background sibling was independently identified in public DOM as the source of a full-viewport startup shift and 828px blank document tail. No application/member/consent containers were hidden. The remainder of revision55 HTML was preserved exactly.
- Crossing between homepage and native business/article routes uses normal document navigation, preventing overlapping V1/Gazette lifecycle handlers.
- No permanent polling loop or new broad DOM observer is allowed.
- No Today's Edition, Monday Chomp, bottom-menu duplication or back-to-top control should be introduced.
- The existing unified mobile menu remains the sole mobile navigation owner.
- Cookie/privacy choices must remain available and must not be hidden or bypassed by layout changes.

## Post-launch verification and evidence

Initial real-site tests exposed a cached pre-launch Wix loader54 response, even while the API stored Gazette55. Captured HTML contained the old V2 preview bootstrap and V1 asset tags, with no Gazette bootstrap or bundle request. Do not misdiagnose this as a Gazette startup timeout. The documented Wix Publish Site method was called successfully, followed by an unmodified real-site test that passed63/63. The unrelated tagged Web Methods/Router cache API was NOT used.

The scoped background fix was applied at 2026-09-22T23:50:22Z, advancing loader55 to56, and the documented Publish Site call returned200. Final real-site run https://github.com/Presidente49/gatorbait-media-redesign/actions/runs/35799374059 passed63/63 at 2026-09-22T23:53:36Z. No candidate injection or data/asset substitutions were used.

- Chromium device-emulated 390/430 and desktop1440; WebKit device-emulated390.
- Wix's emulated phone layout reported client/scroll width320/320. Desktop was1440/1440. No horizontal overflow or out-of-bounds Gazette descendants.
- One Gazette root and visible masthead;12 current-feed story links; loaded real cover; canonical homepage and indexability preserved; no preview labels.
- Mobile menus opened/closed; full-document article navigation rendered native article content and removed Gazette correctly.
- Native account and pricing requests returned200 with Gazette absent. Account baseline request had returned403. HTTP reachability is not authenticated login/billing certification; the account screenshot was taken during the existing short prepaint screen, so final form rendering was not independently certified.
- Footer-to-content gap0 at all tested widths. Independent desktop document-tail diagnostic fell from828.078125px to0.078125px, effectively subpixel rounding. Actual final phone and desktop full-page screenshots were inspected and no longer show the blank tail.
- Recorded Chromium layout-shift sum: phones0; desktop0.00015558288323045264, down from1.0001555828832305 before the background fix. These bounded lab readings are not field Core Web Vitals certification; WebKit's0 must not be interpreted as support for the Chromium Layout Instability API.
- Existing cookie Accept/Decline/Settings controls remain visibly present. The test saw one AdSense loader, not proof of serving ads, consent transitions, impressions or revenue.
- Residual native console messages recorded: desktop `wixTagManager is not defined`, WebKit ResizeObserver undelivered notification. Do not claim an entirely error-free Wix runtime or a monetization fix. Monetization diagnosis remains issue #30.

Artifact10725137431 (`gazette-runtime-evidence`) SHA256 `dbc94873de4eb4387d63ee85882c57549a0d86cdd565dfd27fb4a1c4c748da97` contains final screenshots, verification.json, startup-diagnostics.json and captured public HTML. Functional report is also saved by the passing workflow under `gazette-runtime-qa/verification.json` on `gazette-rebuild`. Device emulation is not physical-iPhone testing; no customer charge, login credential use or paid checkout was performed.

## Exact rollback

- Disabled backup embed: `dd2b9790-a520-4000-baca-0fac9f18871a`, revision `1`.
- Name: `BACKUP - Newsroom loader revision 54 before original Gazette launch`.
- Its HTML was verified byte-for-byte against the active loader immediately before the switch.
- For a confirmed Gazette regression, read the CURRENT active revision, then PATCH that same active embed with the backup HTML and appropriate old name. Keep the backup disabled. Never enable both loaders.
- For the revision56 background rule alone, remove only the recorded rule after reading the newest active revision, then republish and verify. Do not overwrite later unrelated changes.
- On a startup failure, the new loader performs one ordinary recovery navigation using `?gbm_fallback=newsroom`. The recovery page loads the prior V1 assets and does not load Gazette, avoiding a late-script race.
- Prior V1 assets remain pinned together at `f0a2deca30b8080b10efa8216f308414b7a95636` for recovery only.

## Existing shared owners retained

- Prepaint shield: `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51`, revision17.
- Legacy cleanup: `ed3718cc-5ca3-485b-a7dc-1c697afdcd5f`, revision8.
- Native header core: `7fee4de6-1886-475e-a3f3-b9c68161c242`, revision14.
- Universal utility footer: `f8b950c9-47ce-4390-976f-85a0f040f0c6`, revision22.
- Footer-gap guard: `15302fb2-44ef-4a93-a2a8-899731a6c197`, revision6.
- Historical AdSense checkpoint: `2da582cf-6935-4255-b248-e14add7e82a8` was formerly the serving loader. It is now rev8 / disabled; current owner is the rev2 Wix-layer `af338ad4...` object recorded above. Earnings/consent verification remains separate.

These are dated observed revisions, not instructions to overwrite newer live changes. Street addresses must not reappear. Preserve the magazine's existing independent route, existing native article/member UX and all recovery assets.

## Further changes

Material changes to the approved homepage require Brenden's authorization. Routine story publishing and current feed refreshes do not. Track launch verification and residual defects in existing issue #31, not a new redesign incident. See `docs/GAZETTE-PRODUCTION-LAUNCH.md`.

## September 23 compact cover repair

Owner requested fixing the installed Gazette after reviewing the prior chat. Revision58 retains revision56 startup/background repair and changes only the Gazette bundle pin. Source and bundle saved on main; original cover/contents structure and native route owners retained. Reduced desktop cover maximum from520px to360px, headline54px to36px, logo300px to240px and cover/contents padding. Mobile headline clamp24–28px and cover maximum240px. Removed duplicated Magazine from logo accessible name.

Fresh public browser at `/?gbm_check=revision58` verified final asset pin, loaded cover height360px, computed headline36px,12 story links, one root, no horizontal overflow, footer gap0. CDN SHA256 matched local bundle:73fee19094787483aec8bd5dec256d569291bb8617458a625e04a8ba7c2bfb3f. JavaScript syntax passed. Existing root browser response briefly retained revision57 from cache; fresh URL served58. No claim of new physical-iPhone or emulated-mobile QA for this sizing patch. Earlier63/63 checks belong to revision56, not58.

Revision57 first sizing pass was partially overridden by more-specific original template selectors;58 uses matching original selectors. For size-only rollback, restore bundle pin77c35c9a6e980606c40ec110522c2b31fb26385b after reading current revision, keeping revision56 background repair. No DNS, financial, email, consent or Google settings changed.
