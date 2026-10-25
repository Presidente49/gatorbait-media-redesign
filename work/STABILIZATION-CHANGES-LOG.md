# Stabilization changes — Oct. 25, 2026

## Story Alert recipient binding — applied and independently verified

Owner: Codex Master Control, explicitly assigned by Brenden to execute the systematic repair program. Bounded specialists inspect and independently verify; one production writer.

Existing primary automation `5006baf5-fbbf-440c-a012-a09bdbd95fc9`, action `042c6c7c-f7e4-4d60-abd2-5f22fa69cf0e`, revision 19, ACTIVE. Existing labels resolve in Contacts, but the saved legacy UUID audience resolves to zero participants in the native Audience service. The exact same labels addressed by native keys resolve to 470 contacts. Independent complete participant enumeration agrees with the intended cohort.

Planned action: one native Update Automation Email Action call changing recipients only from legacy UUIDs to the two existing native label keys. Preserve the intended audience, sender, topic, PROMOTIONAL type, content, status, trigger and consent flags. No added automation, full-list expansion, contact/member/billing change, publish or diagnostic send.

Success prediction: saved action contains native keys; saved audience resolves to the same intended contact union; unrelated settings and content compare equal. Independent reviewer repeats provider reads. Actual delivery remains pending until a genuine new-post run supplies recipient/delivery evidence.

Rollback: private original action/configuration/content and recipients-only rollback payload are saved locally under the systematic-repairs output. Fresh-read current state; restore only the original recipients through the same API if required. Do not restore the whole automation over newer work. No revision precondition exists on this endpoint, so compare current recipients immediately before the write and abort on drift.

Outcome: one recipients-only native PATCH succeeded at 2026-10-25T05:40:59.529Z; primary automation is revision 20 ACTIVE. Saved audience count is 470. Independent fresh provider reads at 05:41:37Z confirmed the exact same contact union, unchanged content/configuration/trigger and preserved consent flags. No diagnostic send occurred. Actual delivery remains pending a genuine new-post run; 470 resolved participants is not a delivered-recipient count.

## Two article metadata corrections — applied and public verification passed

At 05:48:13Z, the supported Item SEO Tags bulk API accepted both entries, with two successes and zero failures. The Doering article gets a concise, article-supported description and matching social descriptions. The Oct. 24 article retains its exact browser title and description and gets explicit social titles with one brand suffix. No Blog publish operation was called.

Root and independent reads confirm exact saved tags, PUBLISHED state, no pending edits, and unchanged writer copy, author, covers, canonical URLs, access and first/last publication dates. Fresh public cache-MISS responses at 05:49Z render each corrected target tag once. Ordinary URLs initially served cached old metadata; a bounded final ordinary-URL read at 05:52:44–45Z returned HTTP200 and both corrected sets exactly, with one target tag each and unchanged title/canonical/publication metadata. The Doering feed excerpt is unchanged. Absence of a new automation activation is not established by configuration or publication-date checks alone.

Rollback: private own-tag snapshots and exact supported rollback requests are retained. Fresh-read tags before restoring, preserving unrelated newer edits. Doering originally inherited its metadata; reset to default rather than submitting an empty replacement list. Restore the Oct. 24 article's original two own tags if required.

## Homepage free email entry — staged only

Draft PR #425 adds one scoped link to the existing native hosted form beside the magazine preview. Production homepage embed revision 24 and its c90a603 pin remain unchanged. Immutable candidate 649810ab2c7a65e74bd2b1cf21ec98cdc251bb39 returns HTTP 200 and matches SHA-256 73cc0529112a3a60c9e358c7368576d263ddf1214334539b8e9135f601b6d646.

Syntax/diff and independent source review passed. Root CUA browser checks of a local fixture built from active homepage snapshots passed at actual 390/430/1366 CSS pixels: one CTA, no horizontal overflow, at least 44px hit height, paid Join preserved, visible keyboard focus, and the same CTA survives the existing edition-refresh handler. Clicking reaches the existing empty native email form with its consent box unchecked; no submission occurred. The fixture excludes Wix hydration, account/checkout and analytics; real-origin candidate verification remains required.

StackHawk preflight returned 402 Payment Required. No DAST scan completed. Keep the PR draft and do not deploy the code until the required security and real-origin checks can finish. No purchase or account change was made.

## Billing recovery and the complete queue — investigation and drafts

Marlowe reports four native subscription details with failed renewals and existing three-day grace, automatic retry and failure/success notices enabled. Full native-to-order join evidence is still requested. Aggregate notice delivery does not establish delivery to any particular member; three decline causes remain unknown. Do not infer an exact midnight lapse from a displayed grace-end date. Existing recovery/support drafts remain unsent; no retry, charge, cancellation, access, price or consent change was made.

The private master queue maps all 40 original findings to an owner, evidence classification, dependency, next action and success proof. Source labels are evidence to investigate, not customer intent. Native payment/order/contact history takes precedence over names and friendly statuses. Unresolved payment, access, consent, analytics and category theories remain open rather than receiving speculative bulk changes.
