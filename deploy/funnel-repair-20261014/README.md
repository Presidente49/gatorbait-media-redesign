# Funnel and rendering repair

These HTML files archive the verified live repairs from October 13–14. Each `*-before.html` is an exact rollback snapshot; `*-live.html` and `live-embed-receipt.json` identify the current repaired revisions; `*-pre-capture.html` is the immediately preceding deployed HTML. Financial evidence and contact audiences remain private and are not stored here.

The repairs prevent a timed-out renderer from mounting over its native fallback, keep fonts from swapping late, reserve space for late article controls and the homepage notice, put billing notes below native plan cards, restore trial CTA wording, and route `/subscribe` to `/pricing-plans`.

For a new homepage build, generate Home Code with `node deploy/front-page-2026/make-loader.mjs <asset-commit>`. Update the public pointer and the embed fallback to the same immutable asset commit. Keep the guards, photo containment, typography, trial CTA and reserved slots intact. The magazine retains its existing issue, styling and verified asset pin. The new magazine asset failed its delivery gate and was rolled back; the shared source build is saved for a later verified release.

Before each live write, read and compare the current revision and HTML fingerprint. PATCH in place with category `ESSENTIAL`, keep each embed below 15,000 characters, and retain the previous HTML. Verify one renderer, trial links and native plan controls at 390, 430 and 1366 pixels. Roll back using a fresh revision and the saved HTML, plus the previous pointer commit. Do not publish saved Editor drafts.

The shared capture component now distinguishes an accepted form submission from confirmed email consent. CRM labels are not evidence of newsletter consent or paid access. The reporting instructions in `docs/jobs/morning.md` distinguish acquisition, trial starts, paid charges and renewals.

The native post formatter now checks the matching canonical URL and publication timestamp before using the current article’s age label. One coalesced observer covers up to 30 seconds of delayed hydration per article route, ignores its own class changes, and stops on route exit. The publication timestamp uses an exact seven-day window; the age-label fallback retains its previous rounded-day behavior. Computed post CSS remains byte-for-byte identical. Independent Chromium fixtures passed 17 cases, and live-shell previews passed at all three target widths.
