# FCC jobs, pending the key

These briefs follow the job schema in `../N8N-MULTI-HARNESS.md`. They are `public_low_risk` lane only, read-only, and return text or JSON for Jarvis to verify. None writes to production.

They run only once FCC has a provider key (`~/.fcc/.env` on Brenden's Mac, never in git). To start them:

```sh
# on the Mac, after install-fcc-launchd.sh and "FCC is on"
cp automation/ops-hub/model-router/jobs-pending/*.json .state/model-jobs/inbox/
```

`job-worker.py` picks them up, `task-runner.py` chooses the harness from `harness-policy.json`, and results land in `.state/model-jobs/done/`. Record the actual upstream provider/model from the result in #34; a harness name is not a model identity.

Until the key exists, do not run these on paid Claude. Waiting costs nothing; the outputs are nice-to-have, not blocking.

## Department "one cool thing" round (Sept. 29)
Eight briefs (`dept-*-one-cool-thing.json`): design, web, SEO, social, writing, research, outreach, ops. Each department head proposes ONE additive idea with a preview file, after Jarvis's Season Road. All read-only and public-material only; the homepage look stays locked. They run when the FCC key exists (`cp dept-*.json .state/model-jobs/inbox/`). Jarvis reviews the eight results, picks the best two or three, and puts them to Brenden with previews.
