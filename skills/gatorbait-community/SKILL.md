---
name: gatorbait-community
description: Operate and grow the GatorBait Message Board as a first-class GatorBait property, using Discourse as the discussion engine and GatorBait identity/membership as the business layer.
---

# GatorBait Community

## Product identity

Public name: **GatorBait Message Board**.

The board is a core GatorBait property, not a third-party social destination and not a clever renamed imitation of another Gator site.

Canonical site entry point: `/message-board`.

## Architecture

- **GatorBait site** owns the entry point, branding, acquisition and membership relationship.
- **Discourse** is the intended long-form discussion engine because it provides mature threads, moderation, search, trust levels, APIs and automation hooks.
- **GatorBot** is the automation/community assistant layer. It must identify itself as automated when posting.
- Do not use the retired Wix Forum product. Wix discontinued Wix Forum on March 1, 2026.
- Wix Groups may be used for lightweight member groups, but it is not a replacement for the classic message-board experience requested here.

## Initial rooms

1. Gator Football
2. Recruiting
3. Hoops & Other Sports
4. The GatorBait Pub

Keep the initial taxonomy small. Add rooms only when traffic justifies them.

## GatorBot responsibilities

GatorBot may:
- create a discussion thread when a new approved GatorBait story publishes;
- post canonical story links and short verified summaries;
- create game-day and postgame threads from verified schedules/results;
- surface unanswered high-quality questions to staff;
- summarize active threads without inventing consensus;
- flag obvious spam, duplicate threads and abuse for moderation review;
- produce daily/weekly community intelligence for Juice and Agency.

GatorBot must not:
- impersonate Buddy, Franz, Eddie, Loren, Brenden or another human;
- fabricate quotes, recruiting information, injuries, insider information or consensus;
- silently delete legitimate disagreement;
- publish sensitive legal/personal allegations without human review;
- make billing/member changes.

## Business integration

The community should feed the GatorBait flywheel:

**Story → Discuss this story → Message Board thread → GatorBot/community insights → Juice/Agency → next story/show**

Eventually support:
- open/public rooms for discovery;
- members-only rooms or benefits when audience demand supports them;
- article-level `Discuss this story` links;
- front-page trending threads;
- newsletter/community highlights;
- clear GatorBait membership upsell without degrading free discussion.

## Launch boundary

The live `/message-board` route may exist before the Discourse backend is provisioned, but it must clearly state build status. Never present placeholder topic cards as functioning discussion threads.

Provisioning a paid hosted Discourse service or any other recurring-cost service requires owner approval. A self-hosted deployment must have backups, updates, spam controls, email delivery and rollback documented before public launch.

## Quality bar

The board must feel like part of GatorBait on desktop and mobile:
- same navigation and branding;
- fast, readable threads;
- clear account state;
- accessible tap targets and contrast;
- no fake activity counters;
- no manufactured urgency;
- moderation rules visible before scale.
