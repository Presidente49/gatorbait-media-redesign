# Website email capture candidate — Oct.26,2026

One shared website component, kept separate from paid membership and the Spaces member gate. No native form, audience, automation, OAuth client, account or campaign changes are included.

## Reader behavior

- Warm white, ink and restrained orange Barlow signup cards. Explicit consent remains unchecked and required. Free email does not promise paid magazine access.
- Immediate homepage entry: one Free email link in the current Gazette/Broadcast desktop navigation; a44px row directly after the existing sticky mobile shell on phones. Root approved this44px flow change. The existing logo, Shop and Menu are preserved. Resize moves the same link; leaving home removes the entire row/link.
- A small nonmodal invitation on home, `/magazine` and `/post/` routes waits for55 visible seconds plus engagement. It opens the existing hosted form. There is no immediate scroll trigger or first-load wall.55seconds and14days are candidate design choices, not measured conversion optima.
- Close and Escape dismiss it, with a44px close target and no retained focus in the hidden prompt. Shown/dismissed invitations are quiet for14days in this browser. Storage denial still permits at most one prompt in the current runtime.
- Share, visible native dialogs/cookie choices, a visible signup card, form focus and hidden tabs suppress the invitation. Automatic observation is bounded; account, checkout, pricing and other noneditorial routes are excluded.
- Submission acceptance is **pending confirmation**. Neither a provider submission status nor the old local `gbm-capture-joined` marker proves subscription. New acceptance stores only a pending timestamp. Opening the hosted form never marks the reader pending or subscribed.

## Scope and unchanged contract

`sports-live/src/capture.js` is the only production source changed. `capture-candidate.js` is its standalone minified output. No homepage, Share, magazine or shared pointer bundle is rebuilt. `build.mjs` writes only this standalone asset and preview-only CSS.

The anonymous-token/Create Submission implementation and consent wording are byte-identical to the base source. Existing public client1565816d-bbbc-45c1-b82a-31f10d3e2c71 and form6babfee8-147f-428a-9e14-6b72f6225835 remain unchanged. Existing source-field fallback remains; this does not add `signup_source` to Wix.

The standard component still supplies existing `html()` and `mountStory()` entry points. No hot-upgrade of an old runtime is attempted because its anonymous listeners/timers cannot be safely detached.

## Build and local review

```sh
node deploy/capture-experience-20261026/build.mjs
PLAYWRIGHT=/path/to/playwright node --test deploy/capture-experience-20261026/test.mjs
python3 deploy/capture-experience-20261026/serve-preview.py 8766
```

Review `http://127.0.0.1:8766/`. It serves `index.html` at the homepage route and blocks all form submissions. Its invitation delay is explicitly2seconds for review; production defaults to55seconds. Scroll the existing visible signup card out of view before expecting an invitation. The static HTML card can also be opened directly; route behavior requires the local server.

Eleven mocked Chromium regressions pass. They cover timing, engagement, hidden tabs, excluded routes,14day/reload/storage behavior, true visible impression recording, Share/cookie/dialog/focus collisions,44px/Escape, pending-only acceptance, legacy marker compatibility, both loader orders, one mocked submission,320/390/430/1366 layout, the actual current header structure and row/resize/SPA cleanup. No request reaches Wix.

The current-header fixture contains independently observed public mobile markup, relevant rules in observed DOM order and runtime dimensions, plus the repository's current Gazette base/Broadcast skin. It is not a full Wix replay or a physical-phone test. Local visual checks do not establish live deployment, confirmation delivery, new subscribers or conversion lift.

## Deployment gate — root only

1. Root reviews exact source/minified hashes, security results, tests and independent UX evidence.
2. Upload the exact asset to the existing branch, obtain an immutable commit URL and verify CDN200, byte count and SHA256. Do not publish mutable branch URLs.
3. Fresh-read the existing earliest ESSENTIAL Site Fixer embed5a43ae83-690e-4933-971d-4837db00b2f3 and save its complete rollback before mutation. Prepend one synchronous external script, without `async`/`defer`, before the retained original HTML. Preserve all original settings/category and guard revision/HTML fingerprint. Native total must remain under15000characters. No Editor/site publish is required.
4. Cold-load the actual public homepage, magazine and a representative article. Confirm `html[data-gbm-capture-runtime="capture-2026.2"]`, no `data-gbm-capture-blocked`, one stylesheet/component, visible current-renderer Free email entry and correct hosted destination. Check320/390/430/1366, article-end form, phone row, Shop/Menu/sign-in, SPA cleanup and delayed invitation. Do not use a live diagnostic submission/send.
   - A fresh query-bearing page is not sufficient release proof: Wix may still serve an older cached canonical document. On this release, the native API accepted revision26, and fresh query-bearing pages ran the new code, while the ordinary homepage still lacked it. Root opened this exact existing snippet in Settings > Custom Code, verified the complete saved HTML and unchanged Essential/all-pages/each-new-page/Head settings, then used native Apply once. The independent native readback became revision27 with the same10742characters. Ordinary homepage, magazine and article runtime checks subsequently passed. Do not blindly repeat an API update, invent a cache endpoint, or publish unrelated Editor drafts to force a refresh. The generic REST tag-cache invalidator does not clear site SSR cache.
5. Record native acceptance separately from actual public/runtime verification. Real confirmation delivery and attribution remain open until independently observed through the existing consented route.

The new script must initialize before legacy bundled copies. Cold-load `data-gbm-capture-blocked="legacy-first"` means the old runtime won: do not claim the new experience is active or attempt to hot-upgrade listeners.

## Rollback

Restore the exact saved pre-bootstrap HTML using the **then-current** native revision and matching ownership/fingerprint; preserve ESSENTIAL and all embed settings. Restore only this reviewed bootstrap change, not unrelated concurrent edits. Then cold-reload the public page to discard the new runtime's listeners and verify the previous experience. Never create another capture publisher, reconnect an account, alter consent or resend a campaign to validate rollback.

## Metrics and limits

Existing `gbm:capture`/dataLayer events distinguish `shown`, `signup_opened`, `submitted` and `failed`. `shown` is recorded only after the invitation is actually within the visible viewport. These events are browser evidence, not email confirmation or delivery. No visitor email is added to analytics. Full-site DAST/account blockers and live verification are owned by root and must be reported honestly.
