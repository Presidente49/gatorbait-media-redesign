# Restream Clips-First Source Contract

## Objective

Use Restream Clips as the default clip factory for GatorBait shows. The controller should consume the waiting clip batch Restream already created for each show, not regenerate the same work in another editor unless there is a specific editorial reason.

## Default source order

For any completed GatorBait show longer than the Restream Clips minimum:

1. Resolve the exact Restream show/recording.
2. Open that show's existing Restream Clips project/batch.
3. Inventory the generated clips and their source IDs.
4. Select the strongest useful clips from that waiting batch.
5. Add guest-history, game-week/news context and destination routing.
6. Publish or schedule only the selected clips.
7. Record source clip ID + destination + publication ID so the same clip cannot be posted twice to the same destination.

Do **not** create a second clip-generation pass by default.

## Fallback editors

Use vidIQ, Descript or another approved editor only when one of these is true:

- Restream failed to generate a usable clip for an important moment;
- a precise timestamp has editorial value that Restream did not select;
- the vertical crop/captions need a custom repair;
- the clip must be combined with another approved asset;
- the owner explicitly requests a custom version.

Fallback output must retain the same source-show identity and de-duplication record as a Restream clip.

## Editorial selection gate

The controller does not publish every generated clip. For each waiting batch it should prefer a small set with clear jobs:

- timely game/news hook;
- analysis/tactical hook;
- guest relationship/history hook;
- personality/human hook;
- debate/conversation hook;
- evergreen hook.

If the week's priority is a specific game or breaking story, timely clips related to that priority should be considered first, but unrelated high-value Buddy Martin Show history/personality clips can still run under the Buddy identity when they are genuinely strong.

## Guest-history pass

Before public packaging, resolve why the guest matters to Buddy Martin, Brenden Martin, GatorBait, Gator Country or the University of Florida when that history exists. Use verified public facts or clearly attributed owner recollection. Do not invent relationships and do not claim ownership of a guest's later success.

## Destination routing

Route by editorial identity before platform defaults:

- broad Florida/game-week GatorBait clips -> Gator Bait Media;
- Buddy Martin Show guest/history/personality clips -> The Buddy Martin Show;
- other named shows -> their approved page/channel when connected.

Facebook is currently the first distribution lane because it is the largest active GatorBait audience. Other connected destinations may be added after Facebook or multiposted when appropriate.

## Facebook de-duplication gate

Before Restream publishes to Facebook, the controller must check whether the same source clip has already been published to the same Facebook Page through Wix Social Publisher, Restream, or another approved route.

Identity key:

`source_show_id + source_clip_id(or timestamp fingerprint) + destination_platform + destination_page_id`

If a matching publication exists, Facebook for that clip is `DONE`; Restream must not post it again there. Other still-unpublished destinations can continue independently.

## Restream posting behavior

Restream can publish Clips directly to supported connected destinations. Treat the Restream publish UI/API as a delivery capability, not as the source of editorial authority. The controller still owns:

- clip selection;
- guest/history framing;
- caption/title approval rules;
- destination identity;
- duplicate prevention;
- verification;
- performance logging.

Autoposting for Live Clipping must remain bounded by a minimum quality/virality threshold, a maximum clips-per-batch limit, approved destinations and brand-safe caption templates. It must never bypass the controller's destination or duplication rules.

## Daily flow

Morning show-content step:

`previous night's shows -> resolve Restream project -> consume waiting Clips batch -> select -> contextualize -> route -> de-duplicate -> publish -> build/update recap -> verify -> record`

If Restream has no waiting clips for an eligible completed show, record that as an exception and decide whether fallback editing is worth doing.

## Verification

A clip lane is complete only when the controller has:

- exact source show/recording;
- exact selected clip or timestamp fingerprint;
- owning show/editorial identity;
- destination page/channel ID;
- publication status/URL where available;
- recap reuse state;
- de-duplication record.

A generated clip existing in Restream does not by itself mean the distribution job is complete.
