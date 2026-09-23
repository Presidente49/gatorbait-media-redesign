# GatorBait creative direction and verified refinement

Owner mandate September 23: Master Control chooses tools, bounded specialist workers and implementation details, optimizing from verified lessons rather than preserving failed approaches. Keep one production writer and current canonical repository. No new duplicate site/controller is needed.

## Product and design decisions
- Free sports-news homepage owns discovery and advertising opportunity. Magazine retains a separate issue/cover experience. Paywall enforcement is a separate unfinished access-control decision, never implied by appearance.
- Buddy Martin remains the editorial lead. Other news is chronological; supporting coverage may rotate between visits, never while reading.
- Preserve Wix Blog/canonical URLs, members/subscriptions, native email, external ItemOrder Store, TV/podcasts, consent and Spaces connections.
- Prefer current real editorial photography, preserve captions and full heads. Compact phone headlines, reserved image geometry and one mobile shell.
- Motion is progressive, restrained and reduced-motion-aware. No content-hidden entrance, autoplay story swapping, scroll hijacking or extra animation framework for small effects.
- Publication name is **GatorBait Magazine Newsletter**. This owner correction supersedes older GatorBait Weekly wording. Preserve descriptive edition subjects; do not resend a dispatched edition merely to change branding.

## Implemented and verified
- Source commit a9bfec014c1ce95f283e3ff72173967c3cfe969b: composed desktop Buddy lead, clear column label/CTA, refined Latest and columnist treatments, portrait-safe mobile image230px and headline28px, small hover/focus motion.
- Explicit headline refresh action now reloads the document instead of getting stuck in same-route Wix navigation.
- Magazine resets route state, aborts departed requests and ignores stale responses. Five independent NodeVM lifecycle tests pass (automation/site-design/magazine-lifecycle.test.cjs).
- Candidate390/430/1440iframe tests: client/scroll375/375,415/415,1425/1425; headlines28/28/36px; lead images loaded/contain. Isolated fixtures, not physical-phone or full Wix-mobile verification.
- Live homepage loader revision67; Magazine revision25. Both pinned to source commit above. Wix Publish200. Normal live homepage has one root, new lead composition, Buddy latest column and1348/1348width. Live Magazine displays latest Buddy cover separately.
- Initial cold-CDN attempt65 triggered legacy recovery; exact baseline restored66, immutable asset confirmedHTTP200, then one evidence-based retry67 succeeded. Never treat successful API update alone as successful presentation delivery.
- Exact pre-change snapshots in deploy/creative-refinement/. Re-read live revisions before rollback. Never blindly restore old document revision numbers.

## Community
Eight pre-existing Wix Groups records found on production. Reconnected native app148c2287-c669-d849-d153-463c7486a694, instance08c3f62d-07a2-4b7e-b3ae-6fdc630aa033 enabled. Existing groups and private VIP privacy preserved. Do not create duplicates or switch to Discourse by default.
Public /message-board still404 after app reconnection. Native Groups frontend pages require Editor completion and public/member/Spaces QC before changing navigation or claiming a working/indexed board. App installation does not prove frontend restoration.

## Remaining limits
Current homepage paints bundled/session-cached data immediately and fetches in background. This preserves stable reading but a new visitor can see the bundled snapshot until explicit refresh. Do not call first-visit freshness fully solved. Production mobile menu/header/footer interaction remains separately testable; iframe geometry does not certify the Wix phone shell. AdSense delivery/revenue incident30 and paid Magazine enforcement remain outstanding. No new Google scripts, prices, DNS or paid services were added.

## Newsletter dispatch
Campaign1add4bcd-23ea-4d17-9d61-52703923afe8: Buddy latest three published columns plus latest published Thoughts of the Day. Single dispatch authorized by Brenden. Source saved newsletter/2026-09-23-buddy-four-story.mjml. Wix reported475mailsSent/DISTRIBUTED, while delivery statistics were still updating. Subject Buddy Martin on Sumrall: The words, the choice, the promise. Sent header GatorBait Magazine; owner subsequently clarified full publication name above. No duplicate resend. Unused reused draft89cfd9a8-f350-4bab-8df0-360077cc37fe contains old source content and must never be sent as this edition.
