# Story front v1: magazine-style top of every story (Nov. 22, 2026)

Owner direction: Brenden, Nov. 21: "Feel we could use some better magazine style fronting on the blog page template that we all use" and "At the bottom of each blog, there should be a join up for the email list right here at the bottom."

## What a reader sees

Top of the story, in order: a slim guide strip (next game, last result, Roster, Schedule, Stats), the label, the headline, a deck (the story's excerpt), a byline line with the date in AP style and the reading time, a Share button, the cover photo, then the caption and credit, then the body.

Before this, the order was: label, cover photo, writer, headline, a full-width Share bar, the guide chips, then the caption. On a phone the headline started 552 px down the page; it now starts at 252 px. On a 900 px tall laptop it was below the fold (926 px); it is now at 316 px.

End of the story: the email signup box is the first thing under the last paragraph, ahead of the Roster and Road Ahead cards. A reader who already signed up on that device used to see no email box at all (the signup script hides it once a signup is pending or confirmed there). They now see a short confirmation in its place with a link to sign up another address.

## How it is built

- `sports-live/story-front.css`: every rule is inside one cascade layer (`@layer gbmsf`) with `!important`, which outranks the older stacked story-header skins without editing or disabling any of them. All rules are gated by `html.gbm-sf`.
- `story-front.inline.js`: the small script in the embed. It sets `html.gbm-sf`, formats the date from `article:published_time` in Eastern time, picks up the excerpt as the deck (skipped when it is cut off or just repeats the opening lines), tags caption and credit lines a writer typed at the top of the body, closes the fixed gap around the cover block, and adds the already-signed-up confirmation. It re-applies itself after Wix re-renders the page a few seconds into each load.
- `build.py <commit sha>` writes `embed.html`: a stylesheet link to the CSS on jsDelivr at that commit, plus the inline script.
- No existing embed was changed. The signup form, its consent box and double opt-in are untouched; only its position and look changed.

Nothing is moved in the page structure. The order comes from CSS grid `order`, the date and deck are printed from CSS variables, and the cover photo's room is held before it mounts, so the page no longer jumps while loading. Measured layout shift, same stories, before and after: phone 0.45 to 0.04, desktop 0.25 to 0.01 or less.

## Checks before going live

Injected into the live pages in a private headless browser (nothing sent to the site), phone (390 wide, phone user agent) and desktop (1366 wide): a Buddy Martin column with caption lines, a staff story, a story with a video, a photo gallery, a Franz Beard column, a very long headline, a show post, the oldest story on the site (2019), a story that shows Wix's own cover with a special crop (one photo, not two), the roster guide (unchanged, its header is hidden), and both signed-up states. No script errors and no sideways scroll on any.

Not exercised: a logged-in member, Safari on a real phone, the Spaces app (custom code does not run there), and browsers older than Safari 15.4 (they ignore the layer and keep the previous design).

## Live

- Custom embed **"GBM - Story front v1 (magazine order, deck, date, email signup first at story end)"**, id `ed872869-b4e1-47fc-9026-12787d85ac95`, revision 1, HEAD, `loadOnce: false`, ESSENTIAL, 5,386 characters. Source: [`embed.html`](embed.html), built with `build.py 90d96bee6a45aacc3d49a19a0d35629ac765c6fb`.
- Stylesheet: `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@90d96bee6a45aacc3d49a19a0d35629ac765c6fb/sports-live/story-front.css` (checked byte for byte against the repo file).
- Created Nov. 22, about 1:35 a.m. ET. No site publish. Wix refreshed its cached copy of each story page over the next two to three minutes.
- Live check with nothing injected, phone and desktop, on the Buddy Martin column and the Sumrall story: new order in place, date and deck showing, caption lines tagged, no script errors, no sideways scroll, layout shift 0.04 (phone) and 0.01 or less (desktop). The other story pages sampled carry the embed in their page source.

## To change it later

- Styles: edit `sports-live/story-front.css`, merge, run `build.py <new main sha>`, then PATCH the embed with the new `embed.html` (current revision, category ESSENTIAL).
- Script: edit `story-front.inline.js`, rebuild, PATCH the same way.
- Keep the embed plain ASCII. The Wix tool's file upload turns `\uXXXX` escapes into the real characters, which changes the length and hash of what is sent.

## Rollback

Disable embed `ed872869` (`enabled: false`). The site returns to the previous story page as Wix refreshes each page. Nothing else to undo.
