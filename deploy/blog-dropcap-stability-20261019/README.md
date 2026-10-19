# Stable blog opening paragraphs — Oct. 19

Owner reported the large opening letter appearing/disappearing after the earlier headline-font repair. A separate age-dependent enrichment in post template 14a887e3 marked the first qualifying paragraph after hydration and recalculated it on DOM/metadata changes for 30 seconds. Baseline confirms a delayed normal-size→floating 74.7px/87.4px first-letter change; repeated disappearance was reported by the owner, not reproduced in this short capture.

Removed only the terminal `gbm-week-rich-style` and `gbm-week-rich-js` blocks. Opening paragraphs now retain ordinary Barlow letters. Headlines, copy, bylines, photography, homepage and magazine remain unchanged. No site publish. One guarded production PATCH: template revision21→22, ESSENTIAL/enabled, 12,221 characters, XOR-djb2 fingerprint41e0388.

Candidate browser checks:390/430/1366/1920. Fresh public Chromium checks at the same widths return200, zero overflow and no drop-cap script/class/floating first letter. Once visible, opening-paragraph geometry stayed stable during the capture. Additional Buddy article390 check confirms the shared decoration is absent. Provider readback independently confirms exact candidate. This is no claim of whole-page zero errors: some captures have Wix fetch/worker/import errors recorded in JSON; first desktop attempt could not find the paragraph and was repeated once successfully. Real iPhone remains untested. Existing phone first-paint width guard from prior repair remains in place.

Rollback: GET current template revision and fingerprint, then restore exact `rollback/post-template-r21.html` with ESSENTIAL retained. Do not restore historical revisions blindly after another worker's changes.
