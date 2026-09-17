# Restream Clips-First Source Contract

## Objective

Use Restream Clips as the default and normal clip workflow for GatorBait shows. Restream has already created the clips after the show. The controller's job is to go into the prior night's show, review the waiting clips, select the useful ones, route them to the correct social identity, publish them, verify delivery, and record what was used.

The normal daily workflow does **not** regenerate, re-download, re-cut or re-render the show.

## Default morning action

For every completed GatorBait show from the previous night:

1. Resolve the exact Restream show/recording.
2. Open that show's existing Restream Clips project/batch.
3. Inventory the clips Restream already created.
4. Resolve guest/history context and the current game/news priority.
5. Select only the useful clips.
6. Confirm the owning editorial identity and correct connected destination page/channel.
7. Check whether that exact clip has already been published to that destination.
8. From the Restream Clips menu, publish the selected clip directly to the approved social destination(s).
9. Verify the platform publication state or URL.
10. Record the source clip ID, destination and publication ID/status.
11. Reuse selected clips in the show's single recap blog post or newsletter only when useful.

That is the default controller job. There is no clip-generation step in the normal path.

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

`Restream show -> existing Clips batch -> controller selection/context/routing -> Restream Clips Publish -> connected social destination`

The controller owns:

- which waiting clips are worth publishing;
- guest/history framing;
- caption/title rules;
- destination identity;
- duplicate prevention;
- verification;
- performance logging.

Restream owns the normal clip creation and the direct Clips-menu publish action.

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

`previous night's shows -> open waiting Restream Clips -> select -> contextualize -> route -> de-duplicate -> fire off from Clips menu -> verify -> record -> recap/newsletter reuse if useful`

If an eligible completed show has no waiting Restream Clips, record that as an exception and decide whether custom editing is worth doing.

## Verification

A clip lane is complete only when the controller has:

- exact source show/recording;
- exact Restream clip ID or timestamp fingerprint;
- owning show/editorial identity;
- destination page/channel ID;
- publication status/URL where available;
- recap/newsletter reuse state;
- de-duplication record.

A clip existing in Restream is `READY`, not `DONE`. It becomes `DONE` for a destination only after publication is verified or intentionally skipped.