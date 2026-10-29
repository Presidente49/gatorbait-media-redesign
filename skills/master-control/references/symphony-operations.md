# Symphony operating adapter (retired reference)

> **RETIRED — owner direction, Oct. 29, 2026.** Do not use Symphony, dispatch to Maestro or resume paused Symphony work for GatorBait. This file preserves historical evidence only; every execution instruction below is inactive. Current work uses [Master Control](../SKILL.md), direct supported providers and the reusable newsroom skills/agents. No account disconnection, billing change, paid fallback or schedule change is implied by this retirement.

Use for current GatorBait work performed through Symphony. Master Control remains the single controller contract. Read `docs/START-HERE.md`, relevant current-state entries and the newest issue #34 outcomes before related production work. This adapter does not authorize a new scheduler, competing ledger, purchase or outbound send.

## Evidence and connections

- Use verified live Wix/provider results obtained through Symphony ahead of stale repository snapshots, chats and model memory. Agent prose is a report to verify, not a substitute for the result.
- Record the service, connection identity, scope, actual tool, object ID, operation and observation time for a material capability claim. Keep secrets, credential-bearing URLs and customer data out of public records.
- Separate Symphony's exposed MCP servers from native internal app connections. An empty MCP list does not establish that its GitHub, Wix, Gmail or other native services are absent.
- Incoming MCP clients, including Codex and Claude Code/Jarvis, are not outbound connected servers. An empty `list_connections` result does not prove Jarvis is disconnected, and an MCP connection does not establish shared conversation history between clients.
- Verify identity on the connector doing the work. Different Google accounts on two integrations need not match. A GA4 or Search Console connection on Windsor does not establish the same connection inside Symphony.
- Discover current account capabilities before relying on agent counts, concurrency, billing or a trial. Available tools, approval preferences and marketing examples do not prove runtime access, included usage or an authenticated dashboard session.

## Request, collect and verify

- Send a new bounded instruction through `symphony_ask`. The bridge routes work to the user's Symphony; Wix changes belong in that sanctioned workflow, not the read-only gateway.
- Keep one coordinator for a conversation. If the result is `working`, preserve its `conversationId` and collect with `symphony_reply`; do not resend the same ask. A stalled response is still pending.
- Tie outputs to task/resource IDs and timestamps. A progress message may describe an earlier task event; do not assume it answers every newer instruction.
- Re-read task state when saying an agent is running, completed or blocked. A roster or accepted job is not current execution or a completed repair.
- If a worker cannot edit another task's brief, Maestro must relay its handoff and verify receipt. Saving a handoff file is not delivery.
- Follow the [owner-provided team handoff](team-handoff.md) for cross-arm coordination. There is no direct Marlowe-to-Jarvis connection. The designated `TEAM-STATUS.md` is the desk channel; the existing shared social claim registry is mandatory across all social entry paths. Issue #34 remains GitHub coordination and does not substitute for either file. Verify actual host access, send the relevant brief and require a receipt; do not assume one shared chat or create another controller, scheduler or chat platform.

## Authority and real blockers

Owner instructions in the active conversation govern scope. Do not ask again for routine reversible work they already authorize.

Before declaring that an owner must type the same instruction in Symphony's own chat, establish an applicable tool/runtime rule or inspect the original tool/approval refusal. Distinguish that evidence from a worker's `ACTION_NEEDED` explanation. If the original result is unavailable, label the explanation unverified rather than treating it as a universal platform rule.

If the restriction was inferred and the normal sanctioned tool permits the already-authorized action, use that route with the checks below. If a real permission, safety or provider denial applies, respect it: do not spoof the owner, switch credentials, hide a mutation in read-only execution or alter approvals to evade it. Correct a schema/contract error only within the existing bounded retry policy; do not turn a denial into an open-ended retry loop.

## Immediate execution and production writes

- Dispatch separable reads, isolated patches/drafts and independent tests in parallel. Give every job a deliverable, owner, resource scope, dependency and acceptance check. Reuse completed evidence; do not rerun agents merely to keep them busy.
- Keep one production writer across Symphony and other tools within the assigned live repair scope. Review and serialize those writes through the controller; claim the resource in issue #34 and confirm current ownership first. Preserve the owner's three peer arms and direct-order overrides; a bounded controller assignment does not silently reassign every arm. Social outbound work additionally uses the single designated claim registry, not a new issue-only claim.
- Before a write, read the actual live object and revision, save the original, verify the exact current schema, define rollback and choose the smallest correction. Where the API lacks conditional revision checks, re-read and compare the protected snapshot immediately before replacing content; stop on drift.
- Read the result back and independently test the affected pathway. Preserve bylines, URLs, publication timestamps, category/access rules, active states and unrelated fields unless the assigned change explicitly includes them.
- Record a completed change separately from a recommendation, prepared payload, preview or accepted request. A configured email/push action is not proof of delivery.
- When the owner requests work now only, create no recurring jobs, timed wake-ups, later-start work or automatic rounds. Keep cost/deadline limits in the bounded job; do not buy capacity or extend a free window.

## Tested email-body read

The October 28, 2026 repair work demonstrated stored email-body reads through native `ExecuteWixAPI` (`hasMutations: false`) and independently through `symphony_read_wix`. The earlier blanket claim that template bodies were API-inaccessible was incorrect.

Discover the intended automation and its `triggered-emails` action from a bounded query:

```http
POST https://www.wixapis.com/automations-service/v2/automations/query
```

```json
{"query":{"cursorPaging":{"limit":100}}}
```

Then read the actual IDs, not guessed name matches:

```http
GET https://www.wixapis.com/emails-automations/v1/automations/{automationId}/email-actions/{actionId}/email-content
```

The tested response exposes `content.emailSubject`, `content.emailPreheader`, `content.composer.composerDataJson`, `content.composer.defaultValues` and `content.editorType`. Parse composer JSON without dumping private content. A template variable list does not prove a link or amount is absent. Stored content is not a rendered preview, resolved variable target or delivered message.

A paging loop was rejected during the initial read; bounded single calls succeeded. A preview POST was refused by read-only execution. Preserve those distinctions: do not report preview success, and do not relabel a call to evade the gateway. Discover the current documented write schema separately. Set Email Content was described as a whole-body replacement without a revision check; do not infer write authority from the successful GET.

## Existing site and Spaces pathways

- Read the current site's editor type, enabled Velo and installed apps. GatorBait was verified as an existing Editor/Velo site during this batch; do not infer a Studio/headless migration or rebuild it from a new-site recipe.
- Trace GitHub source and deployed commit pins, custom embeds, Velo/backend modules, categories/datasets, Google integrations and member pathways before changing their connections. Repository `main` is not proof of the deployed revision, and live article content may be newer than source snapshots.
- Preserve working login/member recovery, pricing-plan access, consent capture, native blog distribution and existing redirects. A guessed unused URL returning 404 is not evidence of a broken user journey.
- A label is not consent. Check actual subscription/consent, suppression and deliverability before audience decisions; never infer opt-in or remove an unsubscribe to repair a segment.
- Spaces by Wix (`WixOneApp`) is distinct from Symphony workspace files and ChatGPT Spaces. A website member is not automatically a Spaces member. An inline image, native cover flag or configured push does not establish the actual app card or device delivery.
- The owner Notifications API is not a member-push API. Follow the existing [Spaces guide](../../wix-master/references/spaces-app.md); do not invent an API for member pushes or change invitation/screen-access settings merely to test.

## Portable specialists

Reproduce a useful observable workflow by recording its purpose, inputs, actual tool/schema requirements, decision steps, output contract and one demonstrated example. Recheck destination permissions and tools; a copied role does not transfer credentials, hidden prompts or platform powers. Use the existing [Symphony Pit Crew skill](../../symphony-pit-crew/SKILL.md) for this specialist role.
