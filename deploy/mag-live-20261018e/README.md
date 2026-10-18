# /magazine reader bar matte, embed 1dd74333 rev 117 -> 118 (Oct. 18, 2026)

Brenden: the bar's matte must cover whatever is under it; a white bar flashes at the top on iPhone.
Root cause: PR #368's `box-shadow:0 -160px 0 0` is a bar-sized copy shifted up (no spread), so nothing fills the gap; html and body were white, so overscroll and toolbar-collapse slivers showed white or page content.
Fix (PR #376, merge c3424ca6): `.pm-opened .pm-readerbar::before` solid #061444, 200px above the bar; bar padding-top adds env(safe-area-inset-top); html and body navy while the postgame page is mounted; will-change:transform. Bundle 198,346 bytes (build stores `#gbm-magazine-page.mz26 ` as one token; cap 204,800).
Swap: guarded PATCH at rev 117, ESSENTIAL re-sent, pin c3424ca6, no site publish. Rollback: PATCH `rollback/1dd74333-rev117.html` (pin 5dfd57f3) at the then-current revision.
Evidence: WebKit iPhone 13 (390) and iPhone 15 Pro Max (430), 71 scroll steps; local build and the bar forced 60px down: 0 bad steps (old build 69/71 and 71/71 bad). Live cache-busted run on the real site, new pin loaded: 69/71 steps clean at both widths; the 2 others are past the end of the sticky range (bar scrolled out in the footer). Chromium QA 320/390/430/1366/1920 passed. Needs Brenden's real-iPhone check (WebKit emulation has no toolbar collapse or safe area).
