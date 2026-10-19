# Phone-first homepage — Oct. 19, 2026

Brenden explicitly requested a more stylish rearranged mobile front page. This is a responsive update to the existing homepage skin, not another homepage owner. Current provider: skin0c13f955 revision20, source d1ed3d5; core622d8ece revision63 untouched.

## Reader experience

At widths up to820px the lead now shows its complete original photograph above a solid navy story card. The actual photographer credit and source links are visible separately from the summary; the writer and full publication date return. The complete summary is readable without text over a busy photo. The story CTA is48px high.

Football final and next-game panels become compact strips. The countdown is hidden on mobile. The two newest supporting stories receive larger photo cards; remaining current stories use compact cards, with dates/bylines/credits preserved. A two-column treatment at600–820px uses the available tablet width. This keeps the existing Barlow typography, navy/orange/white/green palette, menu, business links and consent controls.

Newest-first source order, lead exclusion, all eight current stories, permanent Wix media, explicit credit mapping and photo/config fallbacks are retained. No post pinning, reordering, publication, send, account/access/pricing or new dependency.

## Candidate evidence

Actual live Wix page with only the reviewed candidate script intercepted; configuration/data remained live. Chromium320/390/430/820/1366/1920 passed eight matching loaded current photos, chronology/deduplication/lead exclusion, credits/links, keyboard focus and no horizontal overflow. Root inspected320/390 top and390 rundown screenshots. Baseline320 had horizontal overflow; candidate320 does not.

Root independently compared the stored desktop geometry/style objects at1366/1920: no changed measurements/styles for the hero/photo/copy, scoreboard, next-game panel, rundown or sidebar. New credit/clean-summary nodes are hidden above820px; descriptive image alt is enriched from verified metadata at all sizes. JavaScript syntax passed `node --check`.

The candidate source SHA-256 is d6891a1b8f1a2d2aa6318295c439e0b2be2ff8253e1b1a12f1c167902d8d81d3. See `qc/before-*` and `qc/candidate-*`. The before/after viewer is `index.html`. Actual production pin/readback and final live QC must be recorded before calling this deployed. Physical iPhone behavior remains unverified.

## Release / rollback

Patch only existing skin0c13f955 after its complete current entity matches `rollback/embed-before.json`. Pin the reviewed merged immutable source, re-send category ESSENTIAL and use the fresh revision. Retain HEAD/enabled/loadOnce=false and the existing2.5s loader fallback. No Wix Editor site publish.

Rollback restores the exact revision20 HTML from `rollback/embed-before.json`, using the then-current revision after verifying this release still owns it. Do not change the separate core/homepage loader or other workers' edits.

## Provider release

PR408 merged as8e72526ea341dd1eb77d88e74539ae9359628af8. Immutable jsDelivr source returned200 and matched candidate SHA-256 before the write. The reviewed complete revision20 entity matched the fresh native GET exactly; one PATCH updated the same skin to revision21. Immediate independent provider GET matched the intended HTML and retained HEAD, enabled, loadOnce=false and ESSENTIAL. The2.5s loader fail-safe remains. No Wix site publish. Exact before/changed/after entities: `release.json`.

## Final live verification

Actual cache-busted production Chromium, without request interception, loaded the new immutable source at320/390/430/820/1366/1920. Every width passed matching loaded current images, all eight rows, chronology/uniqueness/lead exclusion, visible credits/linked sources, keyboard focus and zero horizontal overflow. Root independently inspected actual390px and1920px screenshots. See `qc/live-*`.

Muse separately checked the actual new live pin at22:10:35Z: mobile menu opens and closes with Escape; cookie settings open without saving preferences; main CTAs are48px high; full lead credit and all three attribution links are visible. See `qc/review-ui-smoke.json`. The original desktop geometry stayed identical in the candidate comparison; existing desktop wixTagManager errors remain. Physical iPhone behavior is unverified.

The before/after viewer now points to the actual live captures. No second production patch was required. Rollback remains the revision20HTML, applied with fresh revision and ownership guard. Code release PR408; this final receipt is docs/evidence only.
