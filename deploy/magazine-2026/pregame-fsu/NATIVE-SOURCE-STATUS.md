# Florida–Florida State issue: native source and launch status

As of Nov. 27, 2026, 15:47 UTC. This is a status record and a concrete Editor handoff, not evidence that a prepared artifact has been applied.

The public reader is shipped: Magazine embed `1dd74333-ee02-40da-9c93-cf8fd787c129`, revision 177, immutable runtime `1155b211b50d389f9b6986854d3a3d1aa25d73bf`, build `f837b686`. Independent ordinary public checks passed at 320/390/430/1366 px: 12 complete articles, Soothsayer first, Eddie Gilley’s “Fourth and The Game” last, Black Friday included, zero videos, all game reference tables after the articles. The protected utility links to the matching 44-page PDF. Source PR #617 is merged.

Native page SEO is applied to `STATIC_PAGE/nh0hy`: current issue title and description, OG/Twitter text, current approved share card, and current CollectionPage text. The exact prepared request is `current-native-seo-tags.json`. Ordinary server-source verification is required after provider propagation.

The native Wix body is still stale. Component `comp-lpkor7th` is a Blog post-list widget constrained to featured posts, category `a2061cbb-0984-473d-800e-b8cabab1f470`, and historical tag `64d2cad6-c612-43e9-a0b9-db327c05da6b`. Do not mark current posts featured, retag them with a historical issue tag, change publication dates or pin articles to work around this widget. Those changes would affect other publication surfaces and would not preserve the required Soothsayer-first snapshot.

## Required Editor change

On the existing MAGAZINE page (`nh0hy`), replace that old native post-list component with a native, indexable current-issue heading, cover and article index. Use the complete current headline/byline/link content in `current-native-snapshot.fragment.html`; `current-native-snapshot.html` provides a full preview. Use native text/images/links that Wix serves in its HTML. An HTML iframe or a script that hides the old component does not satisfy this requirement. Preserve the separate live reader loader.

After publishing that scoped Editor change, inspect the ordinary raw page source: no old VB3/Aug. 14 edition; all 12 current titles, bylines and canonical links in the native body; current head tags; correct approved cover. Then request the Facebook Sharing Debugger re-scrape and Google Search Console indexing for the exact `/magazine` URL. Do not call a homepage-only indexing API for this path, and do not claim a sitemap submission is the requested URL indexing action.

## Member CAPTCHA: separate native dashboard action

Owner direction is to remove the visible robot checkbox from both member signup and login. Official control:

https://manage.wix.com/dashboard/18fb3a4e-d7f6-414a-aeb9-3047db3ea115/member-permissions/signup-login-settings

Under “Use reCAPTCHA for signup and login”, turn off “Add reCAPTCHA to signup” and “Add reCAPTCHA to login”, then Save. Preserve email confirmation and all unrelated membership/security settings. Verify signed out from a gated article through its actual login modal and signup form, with screenshots. Do not hide a challenge or substitute a CAPTCHA token API for the native setting.

No supported native settings GET/PATCH was found. The connected API works for content, custom embeds and SEO, but an authenticated Wix dashboard/editor is not available in this cloud session; Browser fails before UI state, the business device is offline and the other account has no device. The checkbox is reproduced in a genuine native login modal. This action remains unshipped pending a dashboard-capable operator’s exact receipt.

## Pricing

Pricing terms embed `78528a4b-6bf4-4642-9a76-5c05226a270f` is revision 9. Its source is `../../pricing-2026/cyber-weekend/pricing-terms.html`. It shows the published $49 GATOR49 offer immediately below All Access Annual’s unchanged $99 price, only Nov. 27–30 Eastern time. All native plans, billing, coupons and checkout links remain unchanged. Ordinary public verification is required.

No new magazine announcement, newsletter, social post, watcher or Symphony call follows from this work. Further magazine distribution stays paused while the native source and login issues are unresolved. The earlier distributed campaign is not replayed.
