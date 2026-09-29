# Spend guardrails

Set Sept. 29, 2026 after the group think (`docs/GROUP-THINK-2026-09-29.md`). Brenden watches spend; these rules keep it visible and bounded. No dollar figures live in the repo; the caps are recorded on the private Money Board.

## 1. One cap per session type, stop at 80%

- Controller (Jarvis): the largest cap. It coordinates; it does not do bulk work itself.
- Back-office session (game day, stats, design): a cap set at launch in the first message, with the scope. At 80% the session posts its state to #34 and stops.
- Worker (subagent, workflow agent): read-only, one deliverable, `sonnet` or `haiku` unless the brief says why not.
- No redesign-scale session starts without a written scope and a cap. The archived Studio redesign session is the example of what happens without one.

## 2. Tier the model by the job

| Work | Model |
|---|---|
| Public low-risk (tagging, SEO drafts, research preprocessing, test generation, log summaries) | FCC when the key exists; Haiku until then, or wait |
| Drafting, QC reads, routine reconciliation | Sonnet |
| Architecture, production debugging, final editorial synthesis, final review before a live write | Opus |
| Sensitive (email, members, billing, DNS, accounts) | trusted native Claude only, never a free provider |

## 3. Read once, in batches

- Read CURRENT-STATE, LESSONS and the newest #34 comments once per session, with `offset`/`limit`.
- Wix and GitHub calls return only the fields needed and paginate; `ExecuteWixAPI` output is capped near 6,000 tokens, so fetch one object at a time and verify by hash rather than re-reading.
- Never read a subscriber file to "check" it; count with `wc` or `grep -c`.

## 4. Poll with free cron, wake sessions on change

- Health, feeds and PR status belong in GitHub Actions (free on a public repo) or PR subscriptions, not in Claude routines.
- A routine ends early when nothing changed and says so in one line.
- The Jarvis ops loop stays at 2 hours; the money report stays daily.

## 5. Close finished sessions

- Archive a session the day its job is done or its PR merges.
- One coordination surface set: Control Room, #34, CURRENT-STATE (Lesson 51). No session spends tokens re-explaining state.
- Two sessions never hold the same object. Claims go in #34 first.

## 6. Paid connectors

- TinyFish: `fetch_content` only; no browser runs for reads. Use Exa `web_fetch_exa` first.
- OpusClip: unused, needs a plan; do not subscribe.
- Analytics: one connector (Windsor recommended); the others come off the account.
- New connectors get a job before they get used.
