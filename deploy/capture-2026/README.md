# GatorBait Magazine signup (Capture 2026)

Brenden, Sept. 30, 2026: "I don't see an email sign-up for our GatorBait Magazine newsletter, and I don't feel like we do a very good job at capturing the people that come to our site."

What he saw was right. The homepage hub's "The GatorBait Email" module was only a link to `/magazine`, and story pages had no signup at all. This branch adds a real signup in four places, and all four feed the list the Magazine already sends to.

## Mechanism: the existing Wix form, submitted from the browser as a site visitor

No new Wix form was created, because the site already has the right one. A live read (`ExecuteWixAPI`, `hasMutations: false`, Sept. 30) of `GET /form-schema-service/v4/forms/6babfee8-147f-428a-9e14-6b72f6225835` returned:

- **Name:** "GatorBait Email List", namespace `wix.form_app.form`, enabled, revision 2.
- **Fields:**
  - `email_gatorbait` (CONTACTS_EMAIL, required);
  - `subscribe_gatorbait` (CONTACTS_SUBSCRIBE checkbox, `checked: false` by default, required), mapped to contact SUBSCRIPTION with `DOUBLE_CONFIRMATION` on EMAIL.
- `postSubmissionTriggers.upsertContact` creates or updates the contact.
- `spamFilterProtectionLevel: ADVANCED`.
- The user automation `fea566c1` (live runbook) adds the list's audience labels to every submission.

So a submission creates the contact, and Wix sends its own confirmation email. The contact is subscribed only after the reader clicks that email. Nothing here sends mail. The account's sender rank is BAD, which is why the double opt-in matters.

The browser path uses only documented APIs:

1. **Visitor token:** `POST https://www.wixapis.com/oauth2/token` with `{clientId, grantType: "anonymous"}`. It needs only the client ID, never a secret. Doc: <https://dev.wix.com/docs/go-headless/authentication/visitors/authenticate-visitors-rest>. The site already has a headless OAuth client:
   - read with `POST /oauth-app/v1/oauth-apps/query` (read-only);
   - result: one app, "Gatorbait Media Mobile App", id `1565816d-bbbc-45c1-b82a-31f10d3e2c71`, created 2023-05-11.

   A read-only probe minted an anonymous token with that ID. The response had `token_type` Bearer, `expires_in` 14400, and access and refresh tokens (the token was not kept). Doc: <https://dev.wix.com/docs/api-reference/business-management/headless/oauth-apps/query-oauth-apps>.
2. **Submission:** `POST https://www.wixapis.com/form-submission-service/v4/submissions` with `{submission: {formId, submissions: {email_gatorbait, subscribe_gatorbait: true}}}`.
   - Its permission scope is "View Forms" (`SCOPE.FORMS.VIEW-FORM`), the visitor-level scope. The docs' HTTP example calls it with a member token.
   - Wix Forms submissions are recorded as `CONFIRMED` on creation.
   - A key that is not a field `target` fails the whole submission with `UNKNOWN_VALUE_ERROR`.
   - Docs: <https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/create-submission> and <https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/introduction>.

Paths ruled out:

- **Velo:** no Velo backend from here.
- **"Get Subscribers" / Editor form widget:** needs Editor placement.
- **A hosted form page:** only Intake Forms get shareable links (`create-customer-submission-link`, 72-hour links). Regular Wix Forms have no public page URL to link to.
- **A new form:** Create Form's `upsertContact` schema has no `labels`, so a new form would miss the audience labels the existing form's automation adds.

### What is not proven yet (needs one live signup)

No submission was sent from here, because that would be a Wix write that creates a contact. The sandbox also cannot reach `wixapis.com` directly, so browser CORS was not probed. Three things are documented but unverified on this site:

- **(a) CORS:** `wixapis.com` answers the browser's CORS preflight for `www.gatorbaitmedia.com`. Wix's headless SDK makes the same browser calls.
- **(b) Token scope:** the visitor token's scope covers Create Submission on this form.
- **(c) Spam filter:** the form's ADVANCED spam filter accepts an API submission without a reCAPTCHA token.

If any of the three fails, the reader sees "That didn't go through. Try again in a minute." Nothing breaks, and no contact is created. See "Verify after deploy" below.

## Consent and data rules in the component

- The consent checkbox starts unchecked. The module refuses to send without it ("Check the box to say yes to GatorBait emails"), and QA asserts that no request is sent.
- **Consent text:** "Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime." It is followed by "We'll email you a link to confirm." and a link to the privacy policy (`/policies`).
- **Value line:** "Buddy Martin's columns, the game-week package and Chris Spears' photos in your inbox. One email a day at most."
- A hidden honeypot field drops bot fills without making a request.
- Only three keys are ever sent: `email_gatorbait`, `subscribe_gatorbait: true` and (see below) `signup_source`.
- The email address is stored nowhere in the browser. localStorage keeps only timestamps:
  - `gbm-capture-joined`;
  - `gbm-capture-dismissed`.
- sessionStorage keeps the 4-hour visitor token.

## Measurement

Every submission tries to carry `signup_source`: `home`, `story-inline`, `story-end` or `story-slideup`. `story-end` is the card inside "Keep up with the Gators", tagged separately from the mid-article card.

The form has no such field today, so Wix rejects the key with `UNKNOWN_VALUE_ERROR`. The module then resends once without it and stops trying for that page view. QA covers this path (`capture-home-untagged`). Signups work today; tagging turns on by itself once the field exists.

- **To turn tagging on (Jarvis, one Wix write under #34):** add a hidden short-text field with target `signup_source` to form `6babfee8` through Update Form (<https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/update-form>). Read the full method schema and send the current revision. No code change is needed.
- **Always, with or without the field:** each outcome fires a `gbm:capture` DOM event (`{source, outcome: submitted | failed | shown, tagged}`). When `window.dataLayer` exists, the module also pushes `{event: 'gbm_capture', gbm_capture_source, gbm_capture_outcome}`.

## What is on the page after deploy

| Where | What | Source tag |
|---|---|---|
| Homepage hub | "Get GatorBait Magazine free" module. It replaces the link-only "The GatorBait Email" module. On phones it sits right under The Buddy Martin Show; on tablets it is a full row under the show; on desktop it takes the old module's slot (columns 10-12 beside the Magazine), so no other hub module moves. It is part of the first paint (no layout shift). A reader who signed up in this browser sees "You're on the GatorBait Magazine list" instead. | `home` |
| Story pages, mid-article | The same card after the 4th prose paragraph, on stories with 6 or more prose paragraphs. Bylines, quotes and captions don't count. If the anchor is above the viewport when it mounts, the scroll offset is paid back. | `story-inline` |
| Story pages, "Keep up with the Gators" | The card folded in under the three Story Kit cards. | `story-end` |
| Story pages, slide-up bar | Compact bar with the same form. Rules:<ul><li>Shows after 50% scroll or 45 seconds.</li><li>Never shows while a signup card is on screen, and steps aside while one is.</li><li>Sits under the Share sheet (z-index 9990 vs. 9998/9999) and steps aside while the sheet is open.</li><li>Close with the 44 px X or Escape; closing is remembered for 14 days.</li><li>Never shows to a reader who signed up.</li></ul> | `story-slideup` |

After a signup, the other story cards step back, and no slide-up follows. Homepage: no slide-up. Repo check: the current V3 loader copy (`deploy/wix-served/homepage-embed-cdn.html`) carries no newsletter popup. The older `homepage-embed.html` and `newsroom-preview` code does (a membership/newsletter modal). This branch did not read live embeds, so a read of the enabled embeds (read-only) is part of step 1 of "Verify after deploy"; it confirms that no second signup prompt is live.

## Files

- `sports-live/src/capture.js`: new, the component, submit path, slide-up and CSS. Barlow only, navy `#0021a5` and orange `#fa4616`, `contain: inline-size` like the Story Kit (Lesson 61). Test hooks: `window.__GBM_CAPTURE_CFG__`, `window.GBM_CAPTURE.state()`.
- `sports-live/src/story-kit.js`: `mountCapture()` hands the body, its paragraphs and the Keep up block to `GBM_CAPTURE.mountStory()` on every idempotent mount, so the cards survive the Wix hydration wipe.
- `sports-live/src/front-page.js`: the hub's email module now comes from `GBM_CAPTURE.html('home')`, placed after the show module. The old link module remains as the fallback if the capture module is absent.
- `sports-live/build-front-page.mjs`: bundles `capture.js` between `share.js` and `story-kit.js`, in both `sports-live/share.js` (story embed) and `sports-live/homepage.js`.
- `sports-live/qa-front-page.mjs`: stubs `www.wixapis.com` (token and submission, with `ok`, `no-source-field` and `down` modes) and adds the capture checks and scenarios.
- **Built outputs:** `sports-live/homepage.js`, `share.js`, `frame.html`.

## QA

`NODE_PATH=<scratchpad>/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node sports-live/qa-front-page.mjs`: **67 checks pass** (51 before this branch).

**Every homepage scenario** now also asserts:

- exactly one capture module, after the show module;
- no old email module;
- one CSS tag;
- unchecked consent;
- the privacy link;
- the value line;
- no overflow;
- no slide-up.

**New homepage scenarios:**

- `capture-home` at 320, 390 and 1366:
  - no consent means no request;
  - a signup sends formId `6babfee8`, the two values and `signup_source: home` with the visitor token;
  - the module shows the done state and sets the joined memory;
  - after a reload it shows the thank-you state.
- `capture-home-untagged`: one resend without `signup_source`.
- `capture-home-down`: the error message, no joined memory.
- `capture-home-joined` at 390 and 1366.

**Every story scenario** now also asserts:

- one inline card, after the 4th prose paragraph;
- one card inside Keep up;
- both still exactly once after the hydration wipe and after extra `mount()` and `mountStory()` calls;
- article text unchanged;
- fonts;
- no overflow;
- no consent box checked.

**New story scenarios:**

- `story-capture-inline` at 320, 390 and 1366: the signup is tagged `story-inline`, the end card steps back, and no bar follows.
- `story-capture-slideup` at 320, 390, 430 and 1366:
  - the bar holds back while a card is in view;
  - it comes up past 50% scroll;
  - it steps aside under the open Share sheet (z-index checked) and returns when the sheet closes;
  - the signup is tagged `story-slideup`;
  - the bar has no overflow and uses Barlow.
- `story-capture-timer` at 390 × 420:
  - the timer alone brings the bar;
  - X closes it and remembers;
  - a reload inside 14 days shows no bar, but the cards stay;
  - after 15 days the bar returns;
  - Escape closes it.
- `story-capture-joined`: no cards, no bar, no requests.

**Sizes:**

- `homepage.js` 241,891 bytes (was 219,344; the build guard is 260 KB).
- `share.js` 63,363 bytes (was 41,068).
- `capture.js` 21,458 bytes (about 7 KB of it is the header comment).
- `node sports-live/build-front-page.mjs --check` is current.

## Deploy (Jarvis)

Merge, then advance `sports-live/current.json` to the merge commit. The homepage loader and the story-page embed `f285a38c` both follow the pointer. No embed PATCH, no Editor step, no site publish.

## Verify after deploy (one live signup)

1. Read the enabled custom embeds (read-only) to confirm that no older newsletter popup is still enabled. Then take live shots at 320, 390, 430 and 1365 of the homepage hub and one `/post/` page (`shots/<name>` branch).
2. Brenden, or Jarvis with Brenden's own address and his yes, signs up once from a story page. That one real signup settles (a) to (c):
   - the card shows "Almost done: check your inbox…";
   - a WIX_FORMS contact appears with subscription PENDING, then SUBSCRIBED after the confirmation click;
   - the automation adds the audience labels;
   - the submission appears under form `6babfee8` in the dashboard.
3. If the card shows "That didn't go through":
   - check the browser console or network for the failing call. A CORS or 403 answer on the submission means the visitor client lacks the scope. A captcha-type rejection means the spam filter.
   - roll back (below) and record the finding in #34.
   - the fallback is Brenden placing form `6babfee8` once in the Editor (Wix Forms element, one placement on a page), with the module linking there.

## Optional follow-ups (not done here; each is a Jarvis write under #34)

- Add the hidden `signup_source` field (see Measurement).
- Create a dedicated OAuth client for the website and swap its ID into `capture.js` (`clientId`); the docs recommend one client per external client. The call is Create OAuth App, `POST /oauth-app/v1/oauth-apps` with `{oAuthApp: {name: "GatorBait Web Capture", applicationType: "WEB_APP"}}`. The existing "Gatorbait Media Mobile App" client works for anonymous tokens today.
- Align the form's own checkbox label ("…news and show alerts…") with the site copy, if Brenden wants the dashboard wording to match.

## Rollback

Point `sports-live/current.json` back to `eece061f391fc7dffc92e60efd7d9a68148764dd`, the build live before this branch. The capture module is gone on the next loader poll (within a minute), and the hub shows the old link module again. Nothing was written to Wix, so there is nothing else to undo.
