# Responsive article cover reservation

The existing recovery layer briefly loses its cover during Wix hydration. On a 390 px phone the article header then moves 197 px. This candidate reserves the approved image's aspect ratio while its hero is empty, using the existing canonical-path, unsigned Wix media and inline-image checks. Invalid or unmapped media clears the reservation. The media query ends at 750 px.

The expanded existing CSS is byte-for-byte preserved except for one 246-character mobile rule. Reversible CSS compression keeps both the character count and UTF-8 byte count below Wix's 15,000 limit. No article copy, author, artwork, credit, metadata, exposure or delivery changes.

## Release identity

- Site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`.
- Target custom embed: `14a887e3-38ea-4258-ae0b-7d19cf9feead`.
- Expected baseline: revision `28`, HTML SHA-256 `0dbc42a3bd04c074708d1596513387707d8360d83e74e548845803fabe32bab2`.
- Candidate: 14,955 characters and UTF-8 bytes; SHA-256 `56e4afc1c3e6410c9092eecd145b3696b00787a489b153c48c4a7e30e3410b3f`.
- Keep `enabled: true`, `loadOnce: false`, `position: HEAD`, category `ESSENTIAL`, and the existing name.
- Codex controls release; Maestro is the sole live writer. Claim and final native/public receipt remain in [issue #34](https://github.com/Presidente49/gatorbait-media-redesign/issues/34#issuecomment-6482721054). A committed candidate is not evidence of a live release.

## Build and source verification

Use the repository's installed esbuild, or point `ESBUILD_MODULE` to an existing compatible installation. Do not install or change a global runtime for this build.

```sh
ESBUILD_MODULE=/path/to/esbuild/lib/main.js python3 deploy/article-cover-cls-20261028/build.py
node deploy/article-cover-cls-20261028/verify-source.cjs
```

`rollback-v27.html` is the immutable historical build input; `rollback-rev28.html` is the actual pre-release live rollback. They serve different purposes. `source-proof.json` proves parsing, script identity, expanded-CSS equivalence and both size limits. `tests.cjs` passed 20 fixture regressions with an explicit private `NATIVE_SNAPSHOT`; omitting that optional input does not prove full manuscript parity. Eighteen additional empty-slot geometry cases also passed. The source verifier intentionally executes only the trusted CSS decoder in an isolated Node VM, never page scripts from an incoming filing.

## Pre-release evidence

Thirteen isolated, ordinary-origin Google Chrome runs replaced exactly the existing full formatter before first paint and verified all other document bytes unchanged. This is unthrottled lab evidence, not field Core Web Vitals. CLS is the largest eligible session window, excluding recent-input shifts.

| Profile | Baseline CLS | Candidate CLS |
| --- | --- | --- |
| Buddy, 390 px, three cold runs | 0.208381 / 0.207466 / 0.208381 | 0.004200 / 0.005115 / 0.004200 |
| Buddy, 320 px | — | 0.005718 |
| Buddy, 430 px | — | 0.003996 |
| Golden, 390 px, different image ratio | — | 0.001035 |
| Rays / Stetson, 390 px | — | 0.000176 each |
| Buddy, 1366 px | 0.201356 | 0.201373 |

Full saved text and ending, headline, actual writer, visible credit, one loaded intended cover, script parity and no horizontal overflow pass. Desktop final geometry is unchanged; its pre-existing layout shift is outside this mobile repair. Actual-page invalid-metadata, matching-inline-image, unmapped/no-cover and reinjection controls pass. Claude approved the exact source; its remaining cleanup condition passed. Actual native article links and browser Back reload the document and restore the right cover. After 31 seconds, the installed history wrapper emits `gbmroutechange` on same-document navigation and clears old reservation/art. An exact valid return restores its ratio and image by 2.5 seconds; an immediate 300 ms assertion was too early for the existing asynchronous route cycle. No native SPA tap is claimed. See `navigation-proof.json`. Security scan passes all three candidate scripts (83 applicable JavaScript/security rules) and the local runner (200 applicable Python/security rules), with no findings, errors or skips.

## Apply and rollback

Before the single in-place PATCH, Maestro must read the exact current entity, compare revision and SHA-256 with the baseline, snapshot the full object, and validate the candidate bytes. Any drift stops this release. Re-send category `ESSENTIAL` and preserve every other setting. Do not mutate either adjacent embed or publish the Wix Editor.

After applying, read back the native entity and independently test ordinary public pages without interception at 390, 430 and 1366 px (also 320), full copy/ending/byline/credit/one cover, and navigation cleanup. Never replay article publication, email, push or social.

If this exact release causes a verified regression, the one writer reads the current known entity and restores `rollback-rev28.html` at that current revision with the same settings. Verify native and public state after rollback; do not blindly replay a timed-out write.
