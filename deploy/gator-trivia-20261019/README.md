# Swamp Trivia — playable solo trial

Owner chose the first researched option, ClassQuiz, then clarified: no writers yet; automated quizmaster, solo or optional small tables; table rules are not fixed. No writer has been contacted or attributed.

## Delivered

Original GatorBait HTML/CSS/JS solo trial: five verified questions, one at a time, correct-answer reveal, source/explanation, one point per correct answer and replay. No signup, personal data, storage, live AI calls, model fees, gambling or money prizes. This original interaction is not the ClassQuiz runtime and does not claim to be. Answer keys are public practice data; no competitive or paid leaderboard is supported.

Serve the repository root over HTTP and open this directory. It uses existing Barlow files under assets/weather. Opening index.html directly as a file may block question JSON loading.

The matching `classquiz-pack.json` follows the pinned source’s QuizInput model, with ABCD answers, 30-second host-game limits and public=false. It is a request payload, not an asserted native .cqa archive/import. Native .cqa is a separate gzip/binary format. Source/explanation provenance is in questions.json. It must be imported through a verified editor flow before a ClassQuiz game is claimable.

## ClassQuiz evaluation

Source inspected: https://github.com/mawoka-myblock/ClassQuiz at711bdde7a7dcd2d217cfc75dbbbb2592a78582d3 (MPL-2.0). Practice route exists; native live games are host-controlled. Four-seat automatic allocation and an automated shared dealer are not supplied by this trial. They require a tested adapter or separate room engine, authoritative scoring and reconnect handling. No automatic Wix sign-in or paid entitlements are established.

Local upstream image evaluation used six bounded services and loopback-only port8821; no hosting purchase, account connection or public service. Frontend root returned200 after running its already-built Node entry directly (upstream pnpm startup attempted an unnecessary install and failed ignored-build checks; no scripts were approved). Backend failed at Meilisearch startup: direct inspection through the configured runtime network returned403 “No approved upstream IPv4 address” for the internal search destination. No policy workaround was attempted. Both the block and actual frontend success are recorded rather than calling the complete ClassQuiz stack operational. Containers stopped after evaluation.

`classquiz-trial/compose.json` records the local-only trial topology. It requires locally generated QUIZ_SECRET and QUIZ_DB_PASSWORD in an untracked trial.env. Never deploy this evaluation as production: email confirmation is skipped only for isolated synthetic testing, SMTP is loopback/dummy, no production users or credentials are present. Set up proper host authentication, security review, backup, updates and network readiness before any real installation. Image digests below pin what was actually pulled; source checkout and image contents are not asserted identical.

## Verification and release

Chromium390/430/1366/1920: every correct answer counted once, choices disabled after answer, all source links matched,5/5finish, replay reset0, wrong answer0, zero horizontal overflow and no browser errors. Keyboard Enter exercised each answer. Physical iPhone untested. QC in qc/.

This is an additive playable preview. No Wix embed/homepage, membership, automation, email or site publish changed. Local trial rollback: stop only the gbm-classquiz-trial compose project. Preview rollback: revert this additive package and its lounge-preview link. Future member-area release requires the native Wix installation and entitlement checks already described in the lounge handoff.
