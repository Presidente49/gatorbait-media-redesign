# Member lounge reuse: repository and live foundation, Oct.19

Owner asked to revisit a fresh member-lounge experience with expandable widgets, reusing old Labs and Wix member access. This is a read-only recommendation, not a shipped lounge or access change.

## Live evidence

Wix Groups query returned all9 groups. GatorBait Gold VIP Lounge a6400ba5-8553-44a6-b627-c8cb3377c171 still exists: PRIVATE, sluggatorbait-gold-vip-lounge, accessRestriction ADMIN_APPROVAL. The Insider Board590d01c2 is also PRIVATE/ADMIN_APPROVAL. The Swamp Lounge is PUBLIC. PRIVATE/admin approval is not evidence of paid-plan enforcement; preserve current access until native page/group permissions and plan mapping are independently verified.

## Reusable source

- deploy/boards/PLAN.md: existing Wix Groups/community concept. September permissions and redirects are historical; live current state wins.
- sports-live/src/ask-gatorbait.js: phone-friendly Ask/Trivia tabs and panels. Reuse the interaction pattern; this is not an authenticated member dashboard.
- sports-live/src/make-the-call.js: score-pick module; sports-live/src/the-stands.js: chat client requiring an authenticated token bridge.
- deploy/dept-ideas/ai/, web/ and chat/: older prototypes/test/preview packages. No fresh Labs/lounge implementation or local branch was identified. deploy/cloudflare/endpoints.json is absent in inspected checkout; code presence is not live service evidence.
- skills/wix-master/references/pricing-members.md and spaces-app.md: native Wix Members Area and app-screen permission reference.

## Recommendation

One compact lounge inside existing Wix Members Area, with cards that expand on tap: current magazine/PDF, discussion destinations, game-day activities and account tools. Wix owns authentication and any applicable role/plan access. Keep the newsletter magazine/PDF free as Brenden directed. Do not infer paid access from a CSS-hidden panel or private group label. Begin with existing Groups and low-cost deterministic widgets; stage chat only after the Wix member-token bridge and moderation pass. No new service, routine, subscription, paywall, plan or live page is created by this review.

Bounded repo helper inspection and one complete live Groups read performed. One remote Labs search returned401 and was not retried; broader remote PR inventory remains incomplete. No claim that every historical Labs branch was found.
