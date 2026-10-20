# Job: publishing-email-qc

Owner direction, Oct. 20: check the morning publishing/email pipeline more often. Reuse hosted task `6aa88c1468ec819189d0087c5e5149cc`; do not create a second monitor. Intended cadence: hourly Monday–Saturday, 6:52 a.m.–11:52 p.m., America/New_York. Enable only after the native scheduler confirms the update; a Markdown edit is not activation.

One bounded read-only pass, at most three minutes and no helpers:

1. Read the latest relevant #34 receipt and the morning-email skill from canonical main. Reuse the existing open publishing/email incident. A known unchanged result is a quiet exit, not another full audit.
2. Inspect at most ten recent Wix blog draft/publication metadata records. Fetch full content only for a new or changed candidate from the named writers. Verify completeness including the ending; an editor autosave is not a manuscript. Do not race the live controller or active worker.
3. For a newly published candidate, check the canonical public page, native byline, intended cover and actual front-page lead. Do not alter post dates, pinning, homepage code or saved Editor drafts.
4. Check the existing Story Alert's provider outcome only for the new candidate or a materially changed delivery incident. Distinguish ACTIVE/configured, previewed, sent and delivered. Lifetime totals alone do not identify one story's result. Do not create campaigns, resend, test an automation or change recipients/status from this job.
5. Record new actionable work and exact public/Wix identifiers in the existing controller queue. A handoff is not accepted merely because it was posted. Notify only on a new complete filing, a new publication requiring follow-through, actual delivery outcome, changed blocker or regression; stay silent otherwise.

This lane can read Wix staging and GitHub with the current connections. It is **not an inbox sweep**: the correct business mailbox is still unavailable in this session. Hosted Muse inbox task `6abb42e5aba4819196a8080584891d9a` stays disabled until that exact mailbox passes an identity/access check. The Oct. 20 personal Gmail profile read is not proof of newsroom coverage. Do not buy, connect/reconnect accounts or enable any other paused routine.
