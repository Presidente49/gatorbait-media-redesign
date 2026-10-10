# Story alert automation email

Automation `824714d4-7e31-4b1d-95b2-ccec04d788af`, send-email action `d8e5bf29-5bf2-4fc3-b3a6-12852de9ceee`.
Edit it with the Automation Email Action API (`/emails-automations/v1/automations/{automationId}/email-actions/{actionId}/email-content`):
- GET reads the content.
- POST replaces it in full and goes live for the next run.
- `/preview` and `/send-test-email` check it without sending to subscribers.

The editor type is locked to WEB (Wix classic editor). Wix rejected an MJML version with "Composer data JSON format incorrect", so edit the WEB regions. Text regions accept inline-styled HTML.

- `story-alert-web-2026-09-26.json` is the live template (since Sept. 26, 2026 ~18:50 UTC). It has:
  - an orange "GATORBAIT NEWS ALERT" bar and wordmark masthead;
  - cover image, headline, excerpt;
  - an orange "READ THE FULL STORY" button;
  - a navy "MORE FROM GATORBAIT" block and the business-address footer.

  It never says "new blog post".
- `story-alert-web-backup-2026-09-26.json` is the previous "Story Alert" template, byte for byte. To roll back, POST its `composerDataJson` as `content.composer.composerDataJson` with `editorType: WEB` and the same subject, preheader and default values.
- `story-alert.mjml` is the MJML design reference only. Wix won't accept it for this automation.

Preview payload format: `customPayload.placeholders.variables.<name>.text.text`.
Wix routes every link through `/so/tr/...?w=<sig>.<base64 JSON>`. The target URL is the `u` field of that JSON.
