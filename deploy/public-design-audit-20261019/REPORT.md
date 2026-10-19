# Read-only public design review — Oct. 19, 2026

Reviewed All News and Subscribe in Chromium at 390/430 (phone UA/touch) and 1366/1920. Both pages returned HTTP 200 and fit the viewport. No plan, trial, purchase or checkout control was activated. No production changes. Pricing has no visible placeholder paragraph or duplicate price. All News contains current Chris Spears coverage.

## Priorities

Follow-up: `LATEST-DIAGNOSIS.md` traced explicit CDN/RSS503 failures across unrelated hosts, then a503 document response. Production initialization failure is unproven; retain the current fallback and do not apply a timing/legacy-width patch based only on these container observations.

1. **Restore consistent Latest Feed mounting before tuning the older layout.** The 390 phone loads mounted `#gbm-lf`; initial 430 and both desktop loads displayed legacy `#gbm-lp` / `#gbm-sn`. A second 1366 load still had no `#gbm-lf` at both 9 and 16 seconds, although the pinned latest-feed script element existed and no HTTP >=400 response was recorded. The old surface is usable, but the design changes between loads. This is a presentation-layer initialization issue to investigate; these observations do not establish its cause. Code owner: Latest Feed embed `54eedbe3` and `sports-live/src/latest-feed.js` / built `sports-live/latest-feed.js`; read fresh provider revision before any patch. The legacy objects are separate owners, not the Site Pages embed.

2. **Bring the first headline forward on All News and use wide desktop space.** In legacy desktop rendering, main content is about 940px wide even at 1920, with title, category rail, writer rail and a large search panel before the lead. At 430 phone the lead headline starts around physical y985 in a 1000px viewport, before a consent banner. Keep search accessible but compact its presentation and put story selection first. Selectors: legacy `#gbm-sn .sn-top`, `#gbm-sn nav`, `#gbm-lp-search`, `#gbm-lp`, `.lp-lead`, `.lp-rail`; current equivalent `#gbm-lf .lf-head`, `.lf-search`, `.lf-chipbar`, `.lf-in`, `.lf-top`. Legacy `#gbm-lp` is 980px wide inside Wix `#content-wrapper`, with 20px side padding, giving 940px usable width; its own max-width is1180, so merely raising that max-width will not escape the parent. Current `.lf-in` already has1240px /1440px wide-screen rules. Prefer making the existing current feed mount reliably over adding another parallel width override. Native fallback should stay available.

3. **Clarify membership value before the purchase decision.** At both phone widths the cards show name, price, trial and CTA, while the first explanatory value/billing block occurs below both plan cards. Move the existing truthful support summary above the comparison; reduce excessive blank card area and competing gray nested borders. Preserve the displayed prices, trial terms and renewal/cancellation copy. Code can improve nontransactional surrounding presentation via existing Site Pages styles and `#gbm-plan-benefits` / `#gbm-plan-terms`; selectors for native cards are `[data-hook=plan]`, `[data-hook=plan-title]`, `[data-hook=plan-price]`, `[data-hook=plan-cta]`, `[data-hook=ribbon]`. Use supported Wix Pricing Plans widget layout/design controls for plan-card content/settings, and Wix-native checkout theme/settings for checkout. No checkout CSS interception. Any change to plan terms, prices, actual entitlements or checkout behavior belongs to Brenden.

4. **Replace the missing Shop-arrow glyph with an inline SVG.** The header Shop and footer Shop Gear arrow renders as a missing-character box on both pages and phone/desktop widths. Exact header source clue: `7fee4de6` shop() builds `<span aria-hidden="true">↗</span>`, used by `.sh-util .sh-shop` and `.gbm-ms-shop`; matching footer external-arrow span also needs the existing footer owner's read. This is an existing-shell code fix; preserve destinations and accessible link names. Local source references below are historical copies, not proof of current provider revision.

5. **Reduce consent-panel obstruction through supported consent presentation.** At 390 the first-visit cookie panel covers about247px of a1000px screenshot, hiding the start of story text or the annual CTA. Keep all consent choices and their working controls; use Wix consent banner layout/settings for a more compact phone presentation if available. Do not dismiss this as a page-content defect or remove consent controls.

## Evidence

- All News390 current feed: `phone/all-news-390-top.png`, `phone/all-news-390-full.png`; confirmed mount again in `all-news-390-repeat-9s.png` / `-16s.png`.
- All News430 legacy surface: `phone/all-news-430-top.png`, `phone/all-news-430-full.png`.
- All News1366 legacy: `all-news-1366-top.png`, `all-news-1366-full.png`; repeated stable legacy after16s: `all-news-1366-repeat-16s.png`.
- All News1920 legacy wide-screen spacing: `all-news-1920-top.png`, `all-news-1920-full.png`.
- Pricing390/430: `phone/pricing-390-top.png`, `phone/pricing-390-full.png`, `phone/pricing-430-top.png`, `phone/pricing-430-full.png`.
- Pricing1366/1920: `pricing-1366-top.png`, `pricing-1366-full.png`, `pricing-1920-top.png`, `pricing-1920-full.png`.
- DOM selector/mount evidence: `selector-results.json`. Metrics: `results.json` desktop rows and `phone/results.json` phone rows.

## Source owner clues

- `deploy/latest-feed-20261018/README.md` and `latest-feed-loader-v1.html`: Latest Feed `54eedbe3`, native fallback and legacy owner list. Observed pinned script: `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@f41f7d56b729cbb020d3b9a16a3c8e9d2cecde3c/sports-live/latest-feed.js`.
- `deploy/broadcast-restore-20261018/53e15504-target.html`: legacy `#gbm-lp` / search construction and styling.
- `deploy/swamp-night-20261017/c4b41f6a-release.html`: legacy `#gbm-sn` navigation/title and search skin.
- `deploy/swamp-night-20261017/602fb362-release.html`: legacy depth/spacing overrides.
- `deploy/broadcast-2026/7fee4de6/rev37.html`: shell Shop helper / missing arrow glyph.
- `deploy/site-pages-20261018/site-pages-v1.html`: existing Site Pages style surface. Source notes identify `af792630` rev3; this review did not read or mutate its current provider object.

## Limits

These are settled screenshots, not an early-paint filmstrip, so no claim about white flash or CLS. Checkout/login were not opened or tested. No real iPhone/Safari check. Wix serves phone pages with a320px CSS layout viewport scaled to390/430 physical screenshot widths; no document overflow was present in that mode. Initial `all-news-390/430-*` and `pricing-390/430-*` files outside `phone/` came from a desktop-UA narrow-viewport harness and are not valid phone evidence; ignore those rows in `results.json`. Failed requests were mainly aborted Wix/Google telemetry; no content resource failure was established by those logs. Desktop showed `wixTagManager is not defined` twice; no corresponding visible layout break was established.
