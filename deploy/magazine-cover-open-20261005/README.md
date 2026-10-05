# Portrait cover opening — owner-approved implementation

October 5, 2026. Sole production writer: Codex / Master Control.

Adds a responsive 9:16 cover to the current curated postgame issue. Reuses the issue's real UAA photograph, Buddy Martin title, date, and credits. A 480ms user-triggered opening leads to the contents. Reduced motion opens immediately; keyboard Enter/Space works. Existing issue content remains in the document and scrollable, with sticky Contents and Cover controls. Print / save as PDF uses the browser print dialog at the end. No story text, canonical URL, byline, signup destination, or homepage change.

Baseline: Magazine embed 1dd74333-ee02-40da-9c93-cf8fd787c129 revision 75, immutable source 6d803965e330feb8aad0484f1899e3f6c4dd4a54. Exact previous HTML saved in rollback-loader.html. Rollback: read current revision then PATCH this embed's HTML back to that file, preserving the remaining live fields.

Build: `MAG_VARIANT=postgame node sports-live/build-magazine.mjs`. Candidate build 54dc31fd, 182753 bytes, below existing 180KiB gate. Build --check and JS syntax check pass; existing magazine contracts pass. Live deployment and final render results are recorded after verification.

Phone preview: CUA-rendered same bundle in 320/390/430px iframes (content widths reduced by scrollbar). Cover→contents focus and seven-story menu navigation verified. This is responsive viewport evidence, not physical-device testing. Independent browser QA (`sports-live/qa-magazine-cover.mjs`) captures exact 320/390/430/1366 viewports plus reduced motion at 390, interaction/focus, overflow, images, print CSS, and existing seven-story count.
