# Native story email and accepted newsroom workflow — Oct. 19, 2026

The existing Wix story email now emphasizes the article, with a single orange story button, confirmed free-signup button and quieter magazine/phone-PDF, Store and Subscribe links. Authored utility links are dark blue and underlined. This is a saved live automation template, not a newly sent campaign.

Site `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`; automation `5006baf5-fbbf-440c-a012-a09bdbd95fc9`; action `042c6c7c-f7e4-4d60-abd2-5f22fa69cf0e`. Owner-authorized primary remains ACTIVE rev19 and duplicate `824714d4` INACTIVE rev39. No state, sender, audience or consent expansion. Subject `${title} | GatorBait`, preheader `${description}`, native dynamic image, defaults, mailing address and preferences remain intact.

## Evidence and limits

- `content-after.json`: full final provider readback. Every write used a fresh full-content equality guard; this API exposes no revision lock.
- `provider-preview.html`: actual Wix preview with a supplied sample of the already-published Chris story. The sample excerpt explicitly includes writer/photo credit. This does not prove a genuine trigger produced that excerpt or delivered an email.
- `qc/preview-qc.json` and four screenshots: Chromium 390/430/1366/1920, hero loaded, zero horizontal overflow, resolved placeholders, intended decoded destinations, native preference controls. Tracking links were decoded without being clicked. Muse independently reviewed phone/desktop; low-contrast authored links found in that review were corrected and rechecked in provider output.
- Magazine/phone-PDF link opens the magazine page, where the existing download button lives. It is not a newly verified direct evergreen PDF URL. No membership/paywall changes.
- Native hero alt remains empty. The blog payload exposes no verified author/photo-credit variable. Future story excerpts or credited cover assets must supply the correct credits; do not hardcode Chris into an evergreen template.
- Real iPhone/email-client rendering, actual native trigger delivery and signup confirmation delivery remain unverified. No test publication or subscriber send was made.

## Workflow and held items

`docs/loops/newsroom.md` records accepted source → copy desk → facts → publication → live QC → native email/social → public QC → relevant video → measured engagement, with one controller and bounded repair. No endlessly running model loop or invented activity.

The existing hourly intake task is configured Monday–Saturday, 6:20 a.m.–11:20 p.m. America/New_York, but remains DISABLED. See `hourly-intake-prepared.json`. Correct business-mail access is missing; access to a personal Gmail mailbox does not cover the newsroom. Other paused routines remain paused.

The owner-pasted Baylor column is preserved and prepared in private scratch only. Corrected statistics and a native rich-content packet are ready; author confirmation and a quote-speaker conflict remain held. Do not assign a byline from prose style. External Muse's two other manuscripts were not received by the accessible helper. No new article published in this batch.

Facebook and Instagram account reads still fail with Meta OAuth190/460 (invalidated existing session). Native social stays queued, not posted/scheduled; reconnecting accounts remains owner-only. No social reach or revenue growth claimed.

Animated operating map: `../hive-workflow-20261019/index.html`; independent four-width/toggle/keyboard/pause/reduced-motion evidence in its `qc/`. Motion is illustrative; statuses are a dated snapshot, not a live monitor.

## Rollback and lesson

Re-read full current email content, compare to `content-after.json`, then POST `{content: <rollback/content-before.json>}` using the documented SetEmailContent endpoint. Preserve current automation state and audience; stop if another owner changed the template. No Wix site publish is needed. Revert additive repo previews/docs separately if desired.

Wix WEB text regions escape an embedded HTML image. A caught preview failure was repaired by restoring the native image block. Global composer link-color settings were saved but ignored in generated HTML; explicit inline styling of the four authored links produced verified dark-blue underlined output. Keep native controls and verify provider-generated HTML instead of trusting saved settings.
