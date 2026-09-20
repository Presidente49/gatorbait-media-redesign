# Native Wix Studio Editor Playbook

## Purpose

Use the locally authenticated `Studio-1119-Inc/wix-editor-mcp` lane when GatorBait work requires native Wix editor-canvas changes that the public Wix REST API cannot perform.

Examples:

- delete retired homepage sections such as old Chomp or Today's Edition blocks
- inspect the actual page/component tree
- edit masterPage header/footer components
- remove unwanted navigation items at the real menu source
- resize/move/delete static components
- update static-page SEO/schema
- run Wix mobile optimization after structural edits

Do not use this lane for Blog/CMS/media/business data when official Wix APIs already support the task.

## Safety contract

1. Never commit Wix session cookies, tokens, Chrome profile data, or authenticated editor URLs.
2. Read the page/masterPage structure before mutating it.
3. Record stable component/page IDs before deletion.
4. Make editor-canvas changes in draft first.
5. Save the draft.
6. Take a Wix editor screenshot and inspect the affected desktop layout.
7. Check mobile/editor layout where the tool supports it; otherwise verify the public mobile runtime after publish.
8. Publish only when the active user request authorizes the production change.
9. Verify the public URL after propagation.
10. If a change is wrong in the same editor session, use Wix undo before publishing. After publish, use Site History or a known prior component/layout state.

## First-run local setup

The repository `.mcp.json` defines:

```json
"wix-editor-local": {
  "command": "npx",
  "args": ["-y", "github:Studio-1119-Inc/wix-editor-mcp"]
}
```

No account-specific editor URL is stored in Git.

After pulling the repo and reloading MCP servers:

1. Call `wix_open_editor` with the current GatorBait Wix Studio editor URL.
2. If the MCP browser is not authenticated, use the repository's supported login import flow on the user's Mac or sign in once in its managed Chrome profile.
3. Call `wix_status`.
4. Call `wix_page_structure` on `masterPage` and the homepage before any mutation.

## GatorBait homepage cleanup pilot

Goal: remove native retired architecture rather than masking it at runtime.

Draft-only first pass:

1. Inspect homepage structure.
2. Locate components/ancestor sections containing:
   - Today's Edition
   - Monday Chomp
   - any retired newsletter/content blocks explicitly identified by Brenden
3. Delete only those confirmed component subtrees.
4. Inspect `masterPage`:
   - keep one canonical GatorBait header
   - keep one canonical footer
   - reduce navigation to current destinations
5. Save draft.
6. Screenshot desktop.
7. Verify article/blog category pages remain structurally intact.
8. Publish only after the draft passes the checks above.

## AdSense boundary

The editor MCP may remove or reposition static containers, but it must not create a second AdSense account or duplicate the publisher script.

Keep the existing GatorBait publisher ID:

`pub-6592453291626199`

Ad rendering remains controlled through the existing approved AdSense setup. Structural editor work should preserve reasonable content width and margin space for Auto Ads without hard-coding intrusive ad placements into every page.
