# GatorBait Writers' Desk

Owner requested implementation September 30, 2026. Isolated first-version code; **not a live staff service**. Jarvis retains production ownership in #34.

## What is built

`preview.html` is an interactive, responsive prototype. Create and save a story in memory, submit it, simulate an editorial change request, add a message/fact-check request, and attach sample filenames with credits. It reads no file bytes, sends no network requests and retains nothing after closing. All entered data must be synthetic. No demo claims of login, upload, AI answers or notifications.

`service.mjs` implements the server-side workflow against injected identity, persistence and private-media adapters. Every operation checks current authenticated membership plus an active staff allowlist. Ordinary members/subscribers get no access. Writers see their own stories; editors can review all. Submission freezes copy until returned by an editor. Replies and fact-check requests stay attached to the story. Revision checks require atomic storage operations and reject stale edits. There is no publish endpoint.

Private media requires a verified provider adapter; otherwise it fails closed. Server-reserved upload tickets bind staff ID, story ID, object, name/type/size/credit/caption and expiry. Finalization requires private, scanned, MIME/size-matched files; cross-story attachment and ticket replay must be rejected atomically. Downloads require fresh story authorization plus a short-lived private URL. Never use public wixstatic media URLs for private submissions.

## Remaining launch dependencies — do not deploy preview as a private hub

1. Jarvis acknowledges scope and owns Wix integration. No duplicate live operator.
2. Connect Wix authenticated member identity server-side. Configure an approved staff allowlist and editor roles by verified member IDs. No invitations or role grants performed here.
3. Provide durable server-only storage implementing the contract below; deny direct anonymous/member collection access. Do not store drafts, emails, attachment links, identity records or private files in GitHub.
4. Bind the production UI to server methods. The standalone preview is NOT that binding and its role/status state is not security.
5. Configure private media, resumable video uploads, quotas, MIME inspection/quarantine, retention and tested expiring downloads. API documentation supports private files, but account-specific capability, limits and integration have NOT been verified. No paid storage authorized.
6. Test as anonymous, ordinary subscriber, writer A, writer B, editor and revoked staff; test direct API/object access, cross-origin requests, concurrent edits, upload abuse and expiry. Never treat a hidden URL/noindex as access control.
7. Render this same candidate on 320/390/430 and desktop; test keyboard navigation, 200% text and interrupted uploads. No browser render has been certified in this build.
8. Launch privately with two invited staff only after those gates. No automatic emails, public navigation link, article publication or site-wide publish in this work.

## Server adapter contract

- `identity.currentMember()` returns verified server identity `{id}`, never a client-supplied ID.
- `store.staff(memberId)` returns private `{active,role,name}` record or null. Only an authorized administrator manages this table.
- `store.createStory`, `getStory`, `listStories(authorId|null)`, `events(storyId)` persist and retrieve authorized records. API layer bounds pagination and request rates; responses use no-store caching.
- `store.appendEvent(storyId, expectedRevision, event)` atomically compares revision, appends event, updates relevant story fields/status and increments revision. Conflict must not overwrite prior data. All prior revisions retained.
- `store.attachMedia` atomically consumes a reserved ticket and attaches it with a revision check; `getAttachment` scopes by story.
- `media.reservePrivateUpload` stores a unique reservation and returns a short-lived upload capability, never general storage credentials.
- `media.inspectTicket` returns a server-verified descriptor, including storage privacy, expected/actual size, declared/detected MIME, clean scan state, expiry and prior attachment status.
- `media.shortLivedDownload` returns a fresh restricted capability after service authorization. Never log signed URLs.
- Host handles CSRF/session validation, secure transport, rate/size limits, durable backup and recovery. No public browser keys for privileged Wix APIs.

## AI and reader conversations

### Owner clarification: Signal is the team chat

Keep Signal as the existing conversational channel. The Desk is the durable story/file/status record, not a replacement chat room. In production each authorized story gets a stable private deep link that staff can copy or share using the device share sheet and choose Signal. Link access must still require authenticated staff authorization; possession of a link grants nothing. Do not include draft text, private filenames or signed media URLs in link previews. Editor decisions affecting workflow should be recorded on the story; Signal conversation is not automatically imported or monitored. No Signal API/bot/bridge is installed or assumed available, and no messages are sent by this build. The prototype does not create fake shareable production links.

Fact-check questions currently queue for editorial review; AI is not connected. A later research adapter must give claim-level sources, dates and unresolved/conflicting evidence, preserve original quotes and never silently rewrite or publish. Untrusted story text cannot expand tool permissions. No draft is sent to an external AI provider without the approved data handling setup.

Public reader comments, chat-room subscriptions and Facebook/YouTube inboxes are not connected. Their adapters require verified accounts, scopes and per-channel reply authority. An editorial reply here is not a public reply.

## Checks

`node --test deploy/writers-desk/service.test.mjs`

Tests cover anonymous/subscriber rejection, ownership tampering, writer isolation, revocation, editorial state transitions, concurrent-edit conflict, editor-only actions, truthful research status, disconnected media failure and input limits. In-memory adapter tests establish domain behavior, not Wix authentication or production database atomicity.

## Evidence / platform references

- https://support.wix.com/en/article/wix-blog-adding-writers-and-editors-in-wix-blog
- https://dev.wix.com/docs/velo/apis/wix-members-backend/current-member/introduction
- https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/private-files
- https://support.wix.com/en/article/site-members-managing-member-page-permissions

No dependencies installed in production, no credentials, new permissions, live collections, live pages or private staff content were created. Rollback before live integration: close the PR. Deployment rollback must be defined against the actual configured objects, preserving submitted work.
