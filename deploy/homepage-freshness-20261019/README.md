# Homepage current-story photos and football context — Oct. 19

Owner reported current important stories were text-only while older stories kept thumbnail prominence. Live RSS was current; the Broadcast skin deliberately copied current stories into numbered text-only rundown rows, hid their original photo cards and left older coverage visible. This repair uses the same current feed records for matching title, photo, byline and full publication date, newest first, excluding the lead and duplicate links.

Eight current rows now have whole-photo Wix thumbnails fitted to480x320, descriptive native alt and visible photo credits. Twelve actual native cover metadata mappings were added to the existing configuration; no writer was assumed to be the photographer. UAA/Hannah White/gallery source links sit outside story anchors. Older coverage is suppressed only after a credited current replacement loads. If a photo or attribution configuration fails, existing coverage remains available. No post pinning, publication date or native story order changes.

The scorebug was already football: Florida27, Texas24 onOct17. Its proximity to the new basketball lead confused the context. It and the next-up bar now explicitly say Football; verified score/data and the existing palette/layout owners remain unchanged.

## Candidate evidence

Actual live page with only the candidate script/config intercepted in Chromium390/430/1366/1920. All eight photographs matched their current RSS stories; chronology, unique links, lead exclusion, loaded assets, native credits/alt, linked sources, keyboard focus and no horizontal overflow passed. Deliberate failed-photo and unavailable-credit-map fallbacks passed. Root independently inspected the phone rendering and reviewed the diff. Two existing desktop wixTagManager errors remain separate. See `qc/candidate-*`. Real iPhone not tested.

## Release and rollback

Production owner: existing homepage skin embed0c13f955-74bf-484c-abd9-359a5eef271b, pre-release revision19, HEAD/ESSENTIAL/loadOncefalse, pinned27c36c3ab64666dd8d60d207af3c5c24b66a769d. Release only by fingerprint-guarded in-place update of this embed to a merged immutable source commit, current revision and ESSENTIAL re-sent. No Wix site publish or global homepage rebuild. Actual release/readback and live QC will be recorded alongside this file; candidate checks alone do not establish deployment.

Rollback: `rollback/embed-before.json` contains the exact pre-release provider entity. Re-read current entity/revision, verify it still belongs to this change, then restore its prior HTML with ESSENTIAL and the fresh revision. Do not send a historical revision. Optional additive metadata rollback is `rollback/front-page.config-before.json`; preserve other workers' newer changes.

## Parallel queue remains honest

Franz's story is live. Buddy/Eddie's exact owner-named paths are still absent from shared main/workspace and both connected repositories; source-transfer request is open in issue34. No invented manuscripts or placeholder posts. Native story email validates but no timestamped Franz send is established; no manual duplicate send. `docs/loops/inflight-20261019.md` records owners, evidence and gates. Other routines stay paused.
