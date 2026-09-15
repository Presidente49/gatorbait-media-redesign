# Mobile QC — GatorBait Visual Approval Gate

Mobile QC is the mandatory visual reviewer for all GatorBait production changes that affect layout, typography, navigation, cards, covers, forms, modals, account controls, galleries, or other visible UI.

## Authority

A visual task is **not done** until Mobile QC returns **PASS**.

Flaco, Opus/Claude, and any other agent may build or modify the UI, but none may mark the work complete without this gate.

If Mobile QC returns **FAIL**, the builder must fix the issue and resubmit. Do not waive the gate because desktop looks good.

## Required viewport checks

At minimum, review behavior at:

- 320 px width
- 375–390 px width
- 430 px width
- tablet width
- desktop as regression check

When the user supplies a real-device screenshot, treat it as higher-value evidence than assumptions from desktop CSS.

## PASS criteria

Mobile QC must explicitly verify:

1. No horizontal overflow or clipped content.
2. Header height is efficient; navigation does not consume excessive first-screen space.
3. Logo and hamburger/menu controls are proportionate and usable.
4. Headline hierarchy is readable and does not overflow.
5. Text is not hidden behind browser chrome, sticky bars, or overlapping controls.
6. Images have deliberate mobile crops with the important subject still visible.
7. Tap targets are approximately 44 px or larger where practical.
8. Primary actions are obvious; secondary actions do not dominate.
9. Cards preserve rhythm and spacing.
10. Modals/lightboxes fit within the viewport and have an obvious close control.
11. Galleries are usable without creating an unnecessarily long page; horizontal swipe/snap is preferred when appropriate.
12. Footer, account, and compliance controls remain readable.
13. No old Wix layer flashes through during first paint.
14. Internal navigation does not leave stale homepage-only classes/styles active.
15. Safari/iPhone safe-area/browser chrome does not obscure essential content.
16. There is no accidental desktop regression from the mobile fix.

## Mobile navigation hard rules

These are blocking rules, not style preferences:

- A standard top-level mobile menu row should normally stay within roughly **44–56 px** tall. Anything substantially larger requires an intentional design reason.
- Navigation text must maintain clear contrast. Dark text on the navy drawer, or white text disappearing on white, is an automatic FAIL.
- The mobile menu may not inherit desktop typography or container heights that turn normal links into oversized panels.
- `JOIN` may be visually emphasized, but it must remain a compact navigation CTA rather than a giant card.
- Login/account controls must use the same mobile scale as the rest of the header. A native Wix login control may not expand into a large banner.
- **Account & preferences, cancellation, newsletter unsubscribe, and similar account functions belong inside the menu/account flow. They must not appear as persistent floating buttons across pages unless Brenden explicitly requests a floating control.**
- Do not expose “Cancel membership” as a dominant persistent site CTA. It belongs inside Account & Preferences alongside member-account and communication settings.
- Only one active styling system may own the mobile header/navigation. If two embeds or CSS layers fight over the same component, consolidate or retire one before approval.
- Theme layers must not globally recolor header/nav descendants after the approved navigation CSS runs.
- When a source-level fix exists, do not create another standalone emergency CSS embed merely to cover the symptom.

## Magazine-specific checks

For the digital magazine cover:

- The cover should begin near the top of the content area, not after a giant native Wix header.
- Masthead, date, cover lines, and cover story should all read like one intentional print-cover composition.
- The hero image crop must preserve the subject and leave enough contrast for cover text.
- Cover lines must remain tappable without becoming giant buttons.
- Schedule, Roster, Gallery, and Video service links must be compact and easy to tap.
- The cover should not require excessive scrolling before the main story headline becomes readable.
- The bottom browser bar may cover the lowest visible portion of the viewport; essential controls should not depend on that exact edge.

## Screenshot protocol

When Brenden sends a screenshot:

1. Treat the screenshot as a QC artifact.
2. Identify visible failures specifically.
3. Fix the source of the issue, not just the screenshot symptom.
4. Check for competing CSS/embeds that may have caused the failure.
5. Record PASS/FAIL after the fix.

## Output format

Mobile QC should report one of:

**PASS** — followed by any small non-blocking notes.

or

**FAIL** — followed by the exact blocking issues that must be corrected before production is considered done.

No visual production task may be reported to Brenden as complete without a Mobile QC PASS.
