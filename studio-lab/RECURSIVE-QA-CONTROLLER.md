# GatorBait Studio Recursive QA Controller

## Operating loop

OBSERVE -> SCOPE -> PLAN -> BUILD -> VERIFY -> CRITIQUE -> CORRECT -> REGRESSION -> RECORD -> LEARN

Repeat until every release gate is green or an external access boundary is reached.

## Roles

### Builder
Implements one bounded change from the current approved architecture.

### Critic
Must review the result independently of the builder's self-description.
Checks:
- visual hierarchy
- navigation clarity
- current-content priority
- mobile 390/430
- accessibility
- reduced motion
- performance/layout stability
- real-data integrity
- URL/SEO preservation
- member/revenue safety

### Controller
Owns:
- scope
- one-writer rule
- acceptance gates
- rollback
- regression checks
- learning promotion

The builder never certifies its own work.

## Release gates

A page family is not complete until:
- no stale/retired content is promoted
- universal header/footer behavior matches
- primary path is obvious
- 390 and 430 layouts pass
- keyboard/focus path passes
- reduced-motion path passes
- no invented live data
- existing article URLs remain canonical
- no first-paint flashing/old-shell reveal
- no horizontal overflow
- media has explicit dimensions/aspect handling
- performance cost is known
- regression check does not break another page family

## Recursive correction

For each failed gate:
1. create one failure fingerprint
2. identify smallest responsible component
3. apply one bounded correction
4. re-run the failed gate
5. re-run shared-shell regression
6. record outcome
7. if same fingerprint recurs in 3 separate episodes, create a learning candidate
8. learning candidate requires controller review before becoming doctrine

No infinite retry loops. After two failed correction approaches for the same episode, escalate the blocker and continue independent work elsewhere.

## Learning record

Record per incident:
- fingerprint
- page
- component
- symptom
- root cause
- attempted fix
- verification evidence
- recurrence
- recovery
- promoted rule if reviewed

Learning may improve playbooks but may never:
- authorize production cutover
- alter financial/consent boundaries
- change member data
- bypass verification

## Current critical blocker

Actual Wix Studio visual canvas/Git Integration repo is not exposed to the controller. Until it is:
- continue improving/testing the Studio UI lab
- do not claim lab changes are Studio-canvas changes
- do not replace the Wix member/business site with the lab
- keep production stable
- keep the promotion package ready
