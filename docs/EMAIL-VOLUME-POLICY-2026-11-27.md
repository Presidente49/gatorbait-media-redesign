# Email volume policy — owner direction, Nov. 27, 2026

Brenden's exact direction in the active Nov. 27 session:

> "Hey, do what you gotta do. You're in charge. There's no capital rule. That capital's gone."

In the discussion about the prepared Florida–Florida State magazine email and the earlier same-day Cyber Weekend send, "capital rule" is the dictated **cap rule**. The controller recorded the scope in [issue #34, owner directive at 13:58 UTC](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-7220181198).

Effective Nov. 27, the former **one list send per rolling 24 hours** and **seven list sends per rolling seven days** limits are removed. Recent send counts remain useful telemetry; volume alone does not block a release or require another cap-exception approval. The owner's current instruction authorizes the already prepared magazine send within its verified scope.

Keep the current authorization scope, consent/subscription coverage, unsubscribe and HOLD/suppression exclusions, approved audience, account/provider status, verified sender, content/preview checks, bounce/complaint thresholds and duplicate-send prevention. A matching sent, queued or ambiguous release is reconciled before any retry; do not replay a send to diagnose delivery. This policy grants no unrelated outbound sends, audience expansion, automation toggle, account, payment, membership or pricing change.

Before each authorized send, run the current `automation/newsletter/send-governor.js` and applicable audience, sender, content and duplicate checks. The governor and `story-alert-presend.wix.js` retain their existing non-volume gates. Record actual provider delivery outcomes separately from acceptance.

The September 28 incident and older dated cap decisions remain historical evidence. Their numeric caps and requirement for an extra approval solely to exceed those caps are superseded by this direction, including older references in START-HERE, CURRENT-STATE, Lesson 48, the Oct. 19 handoff/roadmap, Stack/job plans and the Nov. 2 drip proposal. Read current provider state for current campaign or automation status; this documentation change makes no provider mutation.
