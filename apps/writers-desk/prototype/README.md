# GatorBait Writers’ Desk

Private, deployed writer portal. Built with Quill (BSD-3-Clause), Mammoth (BSD-2-Clause), React and the Sites Vinext starter.

## Working features

- Staff authentication through ChatGPT’s private Site access gate, plus a separate server-side approved staff list.
- Publisher email configured as `OWNER_EMAIL` in hosted secrets. Initial sign-in binds it to the platform’s stable per-site user ID. Other staff sign-ins bind approved emails once; every API call rechecks active membership by ID.
- Durable D1 stories, profiles, editorial notes, prior versions and review state. Writers see their own submissions; editors can review all.
- Word `.docx` import, rich text editing, 10 MB original-document storage in private R2, and authorized download.
- Server-side text-only Quill Delta validation and browser sanitization of Word import and HTML export.
- Photo catalogue with 45 real Wix images, known recent usage and source credits where documented. **This is a dated import of 50 recent published article covers, not a live Wix scan.** Magazine, drafts and older uses were not checked. An editor must explicitly clear availability and credit. Submitted stories reserve a photo atomically; returned stories release it.
- New JPG/PNG uploads (10 MB maximum) remain unchecked until cleared by an editor. R2 bytes are served only after staff authorization.
- Review, return with notes, approval and manual record of an already published GatorBait article URL. There is no automatic publisher endpoint.
- Ask the Desk: explicitly labeled, built-in portal help guide with editorial question handoff. It is **not general AI** and does not browse or verify sports facts.

## Not connected

Direct Gmail intake, direct Google/Wix member login, live Wix photo synchronization, live publishing, automatic emails and general AI are not connected. No messages or invitations were sent. No Wix content, design or subscriber settings were changed.

## Staff onboarding

The owner can approve staff by sign-in email in Editor desk. Site access must also be shared via the platform sharing controls. This is deliberately separate from editing the app’s role list. Until shared, the published portal is owner-private. Staff need a ChatGPT sign-in for this version.

## Verification

- `node --experimental-strip-types --test lib/domain.test.ts`: writer isolation, transitions, text sanitization, reservation eligibility, truthful help.
- `pnpm exec tsc --noEmit`
- `node scripts/check-storage.mjs`: actual SQLite constraints, conditional saves and reservation races using the generated migration.
- Production build through the Sites build helper.
- Browser render / WebMCP interaction verification unavailable in the current environment. Hosted user-session testing and staff onboarding remain to be verified with the owner.

## Operational notes

`db/schema.ts` and generated Drizzle migrations own the schema. No runtime DDL. `lib/server.ts` centralizes authentication, origin checks and D1 access. The app never accepts an author identity supplied by a browser. Runtime secrets are not committed.

Data is deliberately saved only after explicit actions. There is no autosave; the UI warns before closing an unsaved story. Photo selection is provisional until successful submission. Exports are local downloads, not a Wix publication.

## Simplified writer entry
The writer opens directly to headline and story. Story-file and optional picture uploads sit below the copy, followed by Save and Submit. Writers no longer browse art or provide mandatory credits, captions, descriptions, or art requests. Own uploaded pictures may accompany submissions without availability clearance; editorial verification remains the editor’s responsibility. Existing stories and revision history are preserved.
