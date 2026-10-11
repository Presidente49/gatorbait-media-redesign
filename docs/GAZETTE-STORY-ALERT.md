# GatorBait Gazette story alert (one story, one email)

Draft-only tooling. Jarvis builds a Wix email campaign DRAFT for one published story, runs the pre-send checklist and the send-governor, and sends. Workers never send. Both blog alert automations (`5006baf5`, `824714d4`) stay INACTIVE and untouched; this path does not use them or their `${...}` fields.

Files
- `newsletter/templates/gatorbait-gazette-alert-v1.mjml` the template (navy GATORBAIT / THE GAZETTE masthead, dateline strip, kicker, headline, byline, cover with credit, excerpt, one orange READ THE FULL STORY button, footer). 600 px, Barlow with Arial fallback, light-locked colors.
- `automation/newsletter/build-story-alert.mjs` fills, compiles, checks.
- `automation/newsletter/story-alert-presend.wix.js` read-only pre-send checklist for `ExecuteWixAPI`.
- `newsletter/templates/gatorbait-gazette-alert-sample.json` fake sample input.

## 1. Build

```
node automation/newsletter/build-story-alert.mjs --json post.json
node automation/newsletter/build-story-alert.mjs --url https://www.gatorbaitmedia.com/post/<slug> --credit "Photo by <name>, GatorBait Media" --category "Florida Football" --author "Brenden Martin"
```
JSON keys: `title, excerpt, cover_image_url, cover_credit, author, category, date (YYYY-MM-DD ET), slug, url, cover_alt`. Tokens in the template are plain `{{title}}`, `{{cover_image_url}}`, `{{cover_credit}}`, `{{excerpt}}`, `{{url}}` (as `url_headline|url_cover|url_cta|url_site`), `{{author}}`, `{{category}}`, `{{date}}`; the script fills every one and fails on any left over. Not Wix automation fields.

Rules enforced: canonical `https://www.gatorbaitmedia.com/post/<slug>` URL, cover must be a production Wix Media Manager URL, subject = the story headline (fails if all caps; pass `--subject`), preheader = excerpt (trimmed to 240 characters), AP date. UTM on every site link: `utm_source=gatorbait_gazette_alert`, `utm_medium=email`, `utm_campaign=story_alert_<slug>`, `utm_content` = `headline | cover | read_full_story | footer_home`. It runs `check-links.mjs` (source and rendered) and `validate-unique-images.mjs`. `run-stack-qc.mjs` is Magazine-only (it requires the Magazine Newsletter identity strings) so it does not apply.

Output in `build/newsletter/story-alert-<slug>/`: `story-alert.mjml`, `story-alert.html`, `campaign-create-body.json`, `meta.json`. Needs `mjml@4` (`npm i --no-save mjml@4`, or `MJML_MODULE=<entry file>`).

No "More from today" block: a per-story alert has one story. Do not hardcode other stories (fresh news only).

## 2. Create the DRAFT (ExecuteWixAPI, hasMutations true, siteId 18fb3a4e-d7f6-414a-aeb9-3047db3ea115)

Docs: Create Campaign `POST /email-marketing/v1/campaigns` (https://dev.wix.com/docs/api-reference/business-management/marketing/emails/email-marketing/campaign/create). Wix documents three editor formats (WEB, MOBILE, MJML); raw HTML is not one of them, so the draft carries the filled MJML and `campaignEditorType.value = "MJML"`. A mismatched type fails silently on preview or send.

Pass `campaign-create-body.json` through the tool's `files` param (`=== FILE: campaign-create-body.json ===`), then:
```
async () => {
  const body = JSON.parse(files[0].content);
  const r = await wix.request({ scope: 'site', method: 'POST', url: 'https://www.wixapis.com/email-marketing/v1/campaigns', body });
  return { campaignId: r.data.campaign.campaignId, status: r.data.campaign.status, distribution: r.data.campaign.distributionStatus };
}
```
Expect `NOT_STARTED`. Creating a draft sends nothing. If a draft for this slug already exists (the checklist reports `draftsForThisPost`), update it with Update Composer (`POST /campaigns/{id}/composer`, same `composerDataJson` shape and type) instead of creating a second one.

## 3. Preview and verify the draft

`POST /email-marketing/v1/campaigns/{campaignId}/preview` with `{ "removeMissingPlaceholders": false }`. The returned `html` must contain: the headline, the cover URL, `READ THE FULL STORY`, an unsubscribe link or the Wix compliance footer (business name and address), and no `{{` or `${`. If the unsubscribe footer is missing from the preview, stop; do not publish (hygiene rule: native unsubscribe stays). This was NOT verified on a live draft in this task (no draft was created); it is the first thing to check.

Optional: `POST /campaigns/{id}/send-test` is a send to one address. It is a send, so Brenden's address only and only on Jarvis's call.

## 4. Audience: the GatorBait Daily News label

Findings Oct. 11, 2026 (counts only):
- No contact label named "GatorBait Daily News" exists today. Nearest: `custom.form-signups-welcome-oct-10-UkW1c` (16 contacts, 16 SUBSCRIBED and VALID/NOT_SET, 0 hold labels), written by the Capture signup form. The live Capture consent text reads "email me GatorBait Magazine and GatorBait Media news", not "Daily News".
- Create the label only when Jarvis asks (Find or Create Label `POST /contacts/v4/labels` `{ "displayName": "GatorBait - Daily News (opted in)" }`; keys carry a generated suffix). Membership rule: contact has `primaryEmail.subscriptionStatus = SUBSCRIBED`, deliverability `VALID` or `NOT_SET`, no `custom.gatorbait-do-not-market`, none of the HOLD labels, and a recorded signup through a form or box whose consent text covers GatorBait daily news. Never fill it from the whole `custom.gatorbait-active-email-audience` pool.
- Verify before every use: `story-alert-presend.wix.js` checks label membership equals the eligible count (diff 0), zero overlap with Do Not Market / re-opt-in HOLD / inactive / bounced / spam labels, and re-checks consent through `POST /email-marketing/v1/email-subscriptions/query` in batches of 30 emails or fewer (every requested email must come back with a record; a missing record is UNKNOWN, not consent).

## 5. Pre-send checklist (run for every story)

Edit `CFG` in `story-alert-presend.wix.js` (post URL, slug, label key, `governorOk`), paste into ExecuteWixAPI with `hasMutations: false`. It checks: both blog alert automations INACTIVE; email account ACTIVE and rank GOOD; send-governor verdict (Jarvis runs `send-governor.js` first and sets `governorOk`); label exists and is not the whole pool; label membership diff is zero; no hold labels; consent re-check in batches of 30; 24 hour and 7 day send counts under the caps (mirror of the governor); 7 day bounce and complaint rates under limits (via `GET /campaigns/statistics`); no already-sent campaign carries this post URL or `story_alert_<slug>`. Output is counts and pass/fail only. Any fail means no publish.

## 6. Send (Jarvis only, after Brenden's explicit yes and a passing checklist)

`POST /email-marketing/v1/campaigns/{campaignId}/publish` with
```
{ "emailDistributionOptions": { "emailSubject": "<headline>", "labelIds": ["<legacyId of the daily-news label>"], "activeContactsOnly": true } }
```
`labelIds` takes the label's `legacyId` GUID (the same id the automations store). Omitting `emailDistributionOptions` publishes a landing page only and permanently blocks email for that campaign. The publish call has no sender parameter: the campaign uses the site's default sender details; confirm what the default resolves to (Sender Details API, `POST /email-marketing/v1/identify-sender-address`) before the first send. Wix runs a SAMPLING phase before the full send; there is no unsend. Afterwards verify from `GET /campaigns/statistics`, never from the publish response, and log counts in #34.
