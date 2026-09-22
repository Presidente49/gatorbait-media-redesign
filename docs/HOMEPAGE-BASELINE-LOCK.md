# GatorBait Homepage Baseline Lock

**Current presentation:** Original Gazette, owner-authorized September 22, 2026.  
**Applies to:** production homepage `/` on `gatorbaitmedia.com`.  
**Launch status:** Wix revision 55 applied and API-verified; unmodified public-browser verification tracked in issue #31.  
**Authority:** this notice supersedes the older V1-default statements in historical snapshots, including CURRENT-STATE.md. Read live Wix state before any mutation.

## Default production homepage

The default is the original Gazette layout adapted to the existing Wix site. Do not restore the old Newsroom merely because a prior snapshot calls it the default. Brenden explicitly authorized the Gazette production switch and its subsequent checks.

- Active loader: `fdc2127a-845a-4d02-b711-438f1a4a86ce`.
- Verified revision after switch: `55`, enabled.
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
- Crossing between homepage and native business/article routes uses normal document navigation, preventing overlapping V1/Gazette lifecycle handlers.
- No permanent polling loop or new broad DOM observer is allowed.
- No Today's Edition, Monday Chomp, bottom-menu duplication or back-to-top control should be introduced.
- The existing unified mobile menu remains the sole mobile navigation owner.
- Cookie/privacy choices must remain available and must not be hidden or bypassed by layout changes.

## Exact rollback

- Disabled backup embed: `dd2b9790-a520-4000-baca-0fac9f18871a`, revision `1`.
- Name: `BACKUP - Newsroom loader revision 54 before original Gazette launch`.
- Its HTML was verified byte-for-byte against the active loader immediately before the switch.
- For a confirmed Gazette regression, read the CURRENT active revision, then PATCH that same active embed with the backup HTML and appropriate old name. Keep the backup disabled. Never enable both loaders.
- On a startup failure, the new loader performs one ordinary recovery navigation using `?gbm_fallback=newsroom`. The recovery page loads the prior V1 assets and does not load Gazette, avoiding a late-script race.
- Prior V1 assets remain pinned together at `f0a2deca30b8080b10efa8216f308414b7a95636` for recovery only.

## Existing shared owners retained

- Prepaint shield: `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51`, revision 17.
- Legacy cleanup: `ed3718cc-5ca3-485b-a7dc-1c697afdcd5f`, revision 8.
- Native header core: `7fee4de6-1886-475e-a3f3-b9c68161c242`, revision 14.
- Universal utility footer: `f8b950c9-47ce-4390-976f-85a0f040f0c6`, revision 22.
- Footer-gap guard: `15302fb2-44ef-4a93-a2a8-899731a6c197`, revision 6.
- Single AdSense embed: `2da582cf-6935-4255-b248-e14add7e82a8`, revision 7, ADVERTISING category. No claim that ad-serving/revenue is fixed by this launch.

These are dated observed revisions, not instructions to overwrite newer live changes. Street addresses must not reappear. Preserve the magazine's existing independent route, existing native article/member UX and all recovery assets.

## Further changes

Material changes to the approved homepage require Brenden's authorization. Routine story publishing and current feed refreshes do not. Track launch verification and residual defects in existing issue #31, not a new redesign incident. See `docs/GAZETTE-PRODUCTION-LAUNCH.md`.
