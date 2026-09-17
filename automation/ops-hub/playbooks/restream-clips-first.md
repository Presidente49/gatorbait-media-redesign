# Restream Clips-First Source Contract

## Objective

Use Restream Clips as the default and normal clip workflow for GatorBait shows. Restream has already created the clips after the show. The controller's job is to go into the prior night's show, review the waiting clips, verify/correct the clip titles and guest names, select the useful clips, route them to the correct social identity, publish them, verify delivery, and record what was used.

The normal daily workflow does **not** regenerate the entire show elsewhere. However, a small number of high-value clips may receive a premium second-stage edit in vidIQ or Descript when that extra polish is worth it.

## Default morning action

For every completed GatorBait show from the previous night:

1. Resolve the exact Restream show/recording.
2. Open that show's existing Restream Clips project/batch.
3. Inventory the clips Restream already created.
4. Verify each candidate clip title against the actual show title, segment topic and guest roster.
5. Correct missing, misspelled or misidentified guest names before publishing.
6. Resolve guest/history context and the current game/news priority.
7. Select only the useful clips.
8. Decide whether each selected clip is `STANDARD` or `PREMIUM`.
9. `STANDARD` clips publish directly from Restream Clips.
10. `PREMIUM` clips may go through vidIQ or Descript for a deliberate higher-polish version before distribution.
11. Confirm the owning editorial identity and correct connected destination page/channel.
12. Check whether that exact clip has already been published to that destination.
13. Publish to the approved social destination(s).
14. Verify the platform publication state or URL.
15. Record the source clip ID, final published title, guest identity, edit lane, destination and publication ID/status.
16. Reuse selected clips in the show's single recap blog post or newsletter only when useful.

## STANDARD vs PREMIUM

### STANDARD

Use the Restream-created clip as-is, after title/guest verification, when:

- framing is good;
- captions are readable;
- the selected moment is self-contained;
- no custom branding/edit is needed;
- speed matters more than extra polish.

### PREMIUM

Send only the strongest or most valuable moments to vidIQ/Descript when a second-stage edit can materially improve performance. Examples:

- flagship guest clip;
- strongest game-week take;
- especially emotional/funny/history-rich moment;
- a moment likely to be a hero Reel/Short;
- Restream crop/captions are merely acceptable but not great;
- a more aggressive hook/title or tighter cut would improve the asset;
- the clip needs branded composition, custom captions, reframe or timing.

Default target: **0–2 PREMIUM clips per show**, not a second pass over every clip.

vidIQ is the preferred premium social-edit lane when its output quality is better for a specific moment. Descript is preferred for transcript-heavy cleanup, precise spoken-word editing, or when the Restream↔Descript workflow is more efficient.

## Title + guest verification gate

Restream's AI-generated clip title is a **draft label**, not authoritative metadata. Before publication the controller must verify:

- correct show identity;
- correct guest name(s);
- correct spelling and current public name;
- whether the guest is actually speaking in or central to the clip;
- whether the title accurately describes the clip instead of guessing from nearby transcript context;
- whether a recurring guest/history relationship materially improves the final title or caption.

Preferred evidence order:

1. confirmed show guest list / AP Mode package;
2. actual show transcript or clip transcript;
3. Restream event/show metadata;
4. verified guest-history record;
5. owner recollection when clearly attributed.

If the AI title omits a meaningful guest name, add it when doing so makes the title clearer. If it names the wrong person, do not publish until corrected. Never preserve an AI-generated title just because Restream created it.

## Editorial selection gate

The controller does not publish every generated clip. For each waiting batch it should prefer a small set with clear jobs:

- timely game/news hook;
- analysis/tactical hook;
- guest relationship/history hook;
- personality/human hook;
- debate/conversation hook;
- evergreen hook.

If the week's priority is a specific game or breaking story, timely clips related to that priority should be considered first. Strong Buddy Martin Show history/personality clips can still run under the Buddy identity when they are genuinely valuable.

## Guest-history pass

Before public packaging, resolve why the guest matters to Buddy Martin, Brenden Martin, GatorBait, Gator Country or the University of Florida when that history exists. Use verified public facts or clearly attributed owner recollection. Do not invent relationships and do not claim ownership of a guest's later success.

## Destination routing

Route by editorial identity before platform defaults:

- broad Florida/game-week GatorBait clips -> Gator Bait Media;
- Buddy Martin Show guest/history/personality clips -> The Buddy Martin Show;
- other named shows -> their approved page/channel when connected.

Facebook is currently the first distribution lane because it is the largest active GatorBait audience. Restream's Clips publish action should be the primary social delivery path for `STANDARD` clips when the correct destination is connected there.

## De-duplication gate

Before any route publishes any clip to any destination, the controller must check whether the same source clip has already been published to that exact destination through Restream, Wix Social Publisher, Metricool, vidIQ output or another approved route.

Identity key:

`source_show_id + source_clip_id(or timestamp fingerprint) + destination_platform + destination_page_or_channel_id`

If a matching publication exists, that destination for that clip is `DONE`; do not post it again. Other still-unpublished destinations may continue independently.

## Restream Clips is the primary source and STANDARD publish surface

For normal post-show distribution:

`Restream show -> existing AI Clips batch -> controller title/guest verification -> controller selection -> STANDARD direct publish OR PREMIUM enhancement -> destination`

The controller owns:

- title and guest-name verification;
- which waiting clips are worth publishing;
- STANDARD vs PREMIUM decision;
- guest/history framing;
- caption/title rules;
- destination identity;
- duplicate prevention;
- verification;
- performance logging.

Restream owns the normal AI highlight selection, reframing/caption creation and direct Clips-menu publish action.

## Premium enhancement tools

### vidIQ

Use when a top clip benefits from a stronger social-first treatment: tighter selection, improved vertical presentation, burned captions, hook optimization, or a premium Reel/Short cut. Do not run a full-hour vidIQ clipping pass when Restream already created a usable batch; feed vidIQ the exact selected moment/range whenever possible.

### Descript

Use for transcript-driven spoken-word cleanup, precise edit control, or a custom version that benefits from the existing Restream↔Descript integration.

Premium editing is selective, not the default for every clip.

## Daily flow

Morning show-content step:

`previous night's shows -> open waiting Restream Clips -> verify/fix titles + guest names -> select -> STANDARD/PREMIUM -> contextualize -> route -> de-duplicate -> publish -> verify -> record -> recap/newsletter reuse if useful`

If an eligible completed show has no waiting Restream Clips, record that as an exception and decide whether custom editing is worth doing.

## Verification

A clip lane is complete only when the controller has:

- exact source show/recording;
- exact Restream clip ID or timestamp fingerprint;
- verified final title;
- verified guest name(s) where relevant;
- edit lane (`STANDARD` or `PREMIUM`);
- owning show/editorial identity;
- destination page/channel ID;
- publication status/URL where available;
- recap/newsletter reuse state;
- de-duplication record.

A clip existing in Restream is `READY`, not `DONE`. It becomes `DONE` for a destination only after publication is verified or intentionally skipped.