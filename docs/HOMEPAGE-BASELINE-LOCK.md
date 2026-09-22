# GatorBait Homepage Baseline Lock

**Current presentation:** Original Gazette, owner-authorized September 22, 2026.  
**Applies to:** production homepage `/` on `gatorbaitmedia.com`.  
**Launch status:** Wix revision 56 published; 63/63 unmodified public-browser functional checks passed at 2026-09-22T23:53:36Z. Details and remaining scope limits below and in issue #31.  
**Authority:** this notice supersedes the older V1-default statements in historical snapshots, including CURRENT-STATE.md. Read live Wix state before any mutation.

## Default production homepage

The default is the original Gazette layout adapted to the existing Wix site. Do not restore the old Newsroom merely because a prior snapshot calls it the default. Brenden explicitly authorized the Gazette production switch and its subsequent checks.

- Active loader: `fdc2127a-845a-4d02-b711-438f1a4a86ce`.
- Verified revision after launch stabilization: `56`, enabled.
- Name: `GBM - Original Gazette Live v1 (Wix business preserved)`.
- Position/category/load behavior preserved: HEAD, ESSENTIAL, loadOnce false.
- Gazette asset pin: `77c35c9a6e980606c40ec110522c2b31fb26385b`, `gazette-live/homepage.js`.
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
- Single AdSense embed: `2da582cf-6935-4255-b248-e14add7e82a8`, revision7, ADVERTISING category. No claim that ad-serving/revenue is fixed by this launch.

These are dated observed revisions, not instructions to overwrite newer live changes. Street addresses must not reappear. Preserve the magazine's existing independent route, existing native article/member UX and all recovery assets.

## Further changes

Material changes to the approved homepage require Brenden's authorization. Routine story publishing and current feed refreshes do not. Track launch verification and residual defects in existing issue #31, not a new redesign incident. See `docs/GAZETTE-PRODUCTION-LAUNCH.md`.
