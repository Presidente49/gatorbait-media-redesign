# Restream Clips-First Source Contract

## Objective

Use Restream Clips as the default and normal clip workflow for GatorBait shows. Restream has already created the clips after the show. The controller's job is to go into the prior night's show, review the waiting clips, verify/correct the clip titles and guest names, select the useful clips, route them to the correct social identity, publish them, verify delivery, and record what was used.

The normal daily workflow does **not** regenerate, re-download, re-cut or re-render the show.

## Default morning action

For every completed GatorBait show from the previous night:

1. Resolve the exact Restream show/recording.
2. Open that show's existing Restream Clips project/batch.
3. Inventory the clips Restream already created.
4. Verify each candidate clip title against the actual show title, segment topic and guest roster.
5. Correct missing, misspelled or misidentified guest names before publishing.
6. Resolve guest/history context and the current game/news priority.
7. Select only the useful clips.
8. Confirm the owning editorial identity and correct connected destination page/channel.
9. Check whether that exact clip has already been published to that destination.
10. From the Restream Clips menu, publish the selected clip directly to the approved social destination(s).
11. Verify the platform publication state or URL.
12. Record the source clip ID, final published title, guest identity, destination and publication ID/status.
13. Reuse selected clips in the show's single recap blog post or newsletter only when useful.

That is the default controller job. There is no clip-generation step in the normal path.

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

Facebook is currently the first distribution lane because it is the largest active GatorBait audience. Restream's Clips publish action should be the primary social delivery path for these already-created clips when the correct destination is connected there.

## De-duplication gate

Before Restream publishes any clip to any destination, the controller must check whether the same source clip has already been published to that exact destination through Restream, Wix Social Publisher, Metricool or another approved route.

Identity key:

`source_show_id + source_clip_id(or timestamp fingerprint) + destination_platform + destination_page_or_channel_id`

If a matching publication exists, that destination for that clip is `DONE`; do not post it again. Other still-unpublished destinations may continue independently.

## Restream Clips is the primary publish surface

For normal post-show distribution:

`Restream show -> existing AI Clips batch -> controller title/guest verification -> controller selection/context/routing -> Restream Clips Publish -> connected social destination`

The controller owns:

- title and guest-name verification;
- which waiting clips are worth publishing;
- guest/history framing;
- caption/title rules;
- destination identity;
- duplicate prevention;
- verification;
- performance logging.

Restream owns the normal AI highlight selection, reframing/caption creation and the direct Clips-menu publish action.

## Exception-only editing

Use Descript, vidIQ or another approved editor **only** when a selected Restream clip needs a specific repair or custom treatment, such as:

- unusable vertical crop;
- caption/transcript repair;
- precise trim needed for context;
- combining approved assets;
- Restream failed to create an important moment;
- owner explicitly requests a custom version.

When Descript is used, prefer the existing Restream <-> Descript integration rather than creating a manual download/upload workflow.

Custom editing is an exception. It must not become the default morning path.

## Daily flow

Morning show-content step:

`previous night's shows -> open waiting Restream Clips -> verify/fix titles + guest names -> select -> contextualize -> route -> de-duplicate -> fire off from Clips menu -> verify -> record -> recap/newsletter reuse if useful`

If an eligible completed show has no waiting Restream Clips, record that as an exception and decide whether custom editing is worth doing.

## Verification

A clip lane is complete only when the controller has:

- exact source show/recording;
- exact Restream clip ID or timestamp fingerprint;
- verified final title;
- verified guest name(s) where relevant;
- owning show/editorial identity;
- destination page/channel ID;
- publication status/URL where available;
- recap/newsletter reuse state;
- de-duplication record.

A clip existing in Restream is `READY`, not `DONE`. It becomes `DONE` for a destination only after publication is verified or intentionally skipped.