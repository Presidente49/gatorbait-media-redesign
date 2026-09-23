---
name: gatorbait-broadcast-graphics
description: Specialist broadcast-graphics and AP Mode skill for GatorBait Sports Network shows, YouTube thumbnails, matchup cards, rankings, lower thirds, topic cards, scorebugs, tickers, stat boards, guest IDs, social derivatives, and live-show visual systems. Use under Master Control for Florida Gator Lowdown, The Buddy Martin Show, SEC Sidelines, GatorBait TV, and future network programming.
---

# GatorBait Broadcast Graphics

This is a specialist skill under **Master Control**. It does not replace Master Control or the broader GatorBait Graphic Design skill.

Use it when Brenden says:

- AP Mode
- make the thumbnail
- make the show graphics
- make a rankings graphic
- lower thirds
- matchup graphic
- scorebug
- ticker
- GatorBait TV
- GatorBait Sports Network
- Florida Gator Lowdown graphics
- Buddy Martin Show graphics
- SEC Sidelines graphics
- broadcast package
- show open / coming up / topic board

## Brand hierarchy

Use this hierarchy unless a current production decision explicitly changes it:

**Network:** GatorBait Sports Network  
**Video destination / channel label:** GatorBait TV  
**Publisher:** GatorBaitMedia.com  
**Show:** program-specific identity, e.g. Florida Gator Lowdown  
**Talent:** host / guests / contributors  
**Executive Producer:** Brenden Martin when production credits are required

Do not make every asset carry every brand line. The viewer should understand the show first, then network identity.

For Florida Gator Lowdown:

- Show name: **Florida Gator Lowdown**
- Host: **Loren Meadows**
- Loren is a GatorBaitMedia.com writer/contributor.
- Default network lockup: **GatorBait Sports Network**
- Use **GatorBait TV** as a channel/destination bug or end-card label when useful, not as a competing network name.

## AP Mode contract

AP Mode means fast, fact-checked, major-network-quality sports production with restrained copy and strong mobile readability.

### Editorial rules

- Verify current rankings, records, opponent, venue, date, kickoff, network, injuries, coaches and stats before rendering when they are used.
- Treat rankings as volatile facts. Re-read the current AP poll or authoritative source.
- Never fabricate a quote, ranking, record, player identity, helmet, uniform, logo, sponsor, venue detail or statistic.
- No guest names in the primary YouTube title unless explicitly requested.
- Prefer title length under about 60 characters for mobile.
- Put the strongest searchable matchup/topic terms first.
- Avoid hype words that are not supported by facts.
- Do not bake uncertain facts into art.

## Visual doctrine

GatorBait must not look like a generic ESPN imitation, stock sports template or AI-generated poster.

The target is:

**sports magazine editorial depth + modern live-broadcast precision**

### Core visual traits

- authentic photography first;
- correct team marks and equipment;
- layered depth built from meaningful planes;
- editorial typography with clear hierarchy;
- controlled Florida orange and blue, not wall-to-wall team color;
- paper / grain / halftone / stadium atmosphere used sparingly;
- asymmetric magazine composition when it improves distinction;
- one dominant story in under two seconds;
- negative space around the key message;
- visual tension created with crop, scale and depth rather than fake sparks.

### Avoid

- generic chrome-heavy ESPN clone styling;
- fake metallic bevels as the default;
- random particles, lightning, fire, lens flares and smoke;
- excessive glow;
- multiple competing headlines;
- tiny lower copy that cannot be read on a phone;
- distorted AI faces;
- invented team logos or redrawn GatorBait marks;
- decorative stadium signage with fabricated slogans;
- fake sponsor marks;
- repeated logos in every corner;
- black-heavy design when orange/blue/white can carry the piece.

## Layer model

Build broadcast art in explicit layers whenever the production engine permits it.

Recommended 8-plane stack:

1. **Atmosphere plane** — stadium, texture, environmental depth.
2. **Editorial background plane** — paper, halftone, gradient, image crop or data grid.
3. **Team/story color plane** — controlled opponent and GatorBait accents.
4. **Hero plane** — authentic player, helmet, coach, stadium or verified object.
5. **Secondary depth plane** — cutout overlap, shadow, frame, crop or field line.
6. **Information plane** — matchup/ranking/stat text.
7. **Show identity plane** — Florida Gator Lowdown / TBMS / Sidelines lockup.
8. **Network utility plane** — GatorBait Sports Network bug, live state, CTA or destination.

Every layer must have a job. Depth is not an excuse for clutter.

## Logo and asset rules

Use assets in this order:

1. approved current GatorBait logo files;
2. approved current show lockups;
3. recent GatorBait photography, especially credited staff photography;
4. official / rights-cleared team assets;
5. repo brand assets;
6. generated backgrounds or non-identifying decorative elements only when necessary.

Never redraw the GatorBait logo from memory. If the exact current logo is unavailable, omit it temporarily rather than generating a fake approximation.

When Brenden provides recent photography, prefer it over synthetic sports imagery.

## Thumbnail system

Default master: **1920 × 1080, 16:9**

A thumbnail must survive at roughly 10–15% size.

### Thumbnail hierarchy

1. matchup / central story;
2. ranking or key factual hook;
3. show identity;
4. network identity only if space allows.

### Default Florida Gator Lowdown thumbnail behavior

- no faces unless Brenden specifically wants an authentic supplied photo;
- correct helmets if helmets are used;
- Florida visual dominance when the show is Florida-led, without misrepresenting home/away status;
- one compact phrase such as:
  - #4 OLE MISS AT #21 FLORIDA
  - RANKED IN THE SWAMP
  - FLORIDA VS OLE MISS
- use **FLORIDA GATOR LOWDOWN** as a clean show lockup, not a giant competing headline;
- do not include host/guest/producer credits on the thumbnail unless required for a special event.

## Show graphics package

For a standard live show, generate or specify this package:

### A. Hero / thumbnail
- 1920×1080
- platform-safe title
- exact show branding
- no unnecessary time/date if the platform already supplies it

### B. Open card
- show name
- host
- major topic
- GatorBait Sports Network lockup

### C. Guest lower thirds
- guest name
- current verified affiliation / role
- minimal second line
- no invented job titles

### D. Host lower third
- Loren Meadows
- Florida Gator Lowdown
- GatorBaitMedia.com only when useful

### E. Matchup card
- teams
- current ranking if verified
- records if verified
- venue / kickoff / TV only if relevant to the segment

### F. Rankings board
- recreate the ranking data in GatorBait visual language;
- cite/label source in production notes when appropriate;
- never copy a broadcaster's visual trade dress;
- use GatorBait typography, spacing and hierarchy.

### G. Topic / coming-up cards
- 3–5 words preferred;
- one idea per card;
- strong text hierarchy.

### H. Stat board
- source each number;
- keep the comparison dimension obvious;
- no cherry-picked implication hidden by design.

### I. Ticker / scorebug
- utility first;
- readable;
- minimal animation;
- built for repeat use, not one-off decoration.

### J. End card
- show name;
- GatorBait Sports Network;
- GatorBaitMedia.com or GatorBait TV destination;
- CTA only when appropriate.

## Open-source architecture references

These are engineering references, not visual templates to imitate.

### UgaTEC/professional-lower-third-system — MIT

Useful ideas:
- OBS browser-source output;
- real-time Socket.IO control;
- editable presets;
- layer management;
- GSAP animation;
- 1920×1080 output;
- JSON import/export;
- control panel + visual editor separation.

Preferred base architecture for a future GatorBait graphics control surface because its MIT license permits modification and reuse with attribution/license preservation.

### xtv-online/football-graphics — GPLv3

Useful ideas:
- football state logic;
- score / clock control;
- team settings;
- lower-third triggers;
- CasparCG separation of control and render layers.

Use as architecture study unless GPL obligations are intentionally accepted for a derived codebase.

### JimThatcher/sport-streamer

Useful ideas:
- football scorebug;
- team-specific assets;
- player highlight cards;
- sponsor overlays;
- REST / event-driven updates;
- Stream Deck control.

Treat as reference architecture until licensing is explicitly verified.

### crazyscot/casparcg-client

Useful ideas:
- operator-controlled lower thirds;
- scorebugs;
- timers;
- team colors;
- take / animate off / update production model.

Treat licensing separately before copying code.

## Control architecture

Preferred future GatorBait system:

**Master Control**
→ verifies show state and facts  
→ routes to GatorBait Broadcast Graphics  
→ loads approved assets  
→ builds master graphic package  
→ sends reusable live overlays to OBS/Restream-compatible browser sources when available  
→ creates static derivatives for YouTube/social/email  
→ sends site derivatives to GatorBait Site Operations / Flaco  
→ verifies output and records reusable lessons

The graphics system should be data-driven where possible:

- show.json
- matchup.json
- rankings.json
- guests.json
- brand tokens
- approved asset manifest

Static facts should not be typed independently into ten different files.

## Design tokens

Use current approved brand files as the authority.

Default direction when exact tokens are unavailable:
- Florida/GatorBait blue and orange;
- white as the primary text field;
- dark navy rather than pure black for deep backgrounds;
- restrained opponent colors;
- strong editorial sans/condensed display pairing;
- body/support type optimized for broadcast readability.

Do not invent exact hex values when a current brand token file exists.

## Motion

Motion should communicate state:

- reveal;
- update;
- change topic;
- identify person;
- show score;
- dismiss.

Default:
- 200–450 ms micro transitions;
- 450–800 ms major graphic takes;
- smooth ease;
- no bouncing, spinning or novelty motion unless the show identity specifically calls for it.

## QA gate

Before release, check:

### Facts
- spelling;
- rankings;
- team;
- opponent;
- location;
- record;
- date/time;
- affiliations;
- source of stats.

### Visual
- correct current GatorBait logo;
- correct team logo/helmet;
- authentic photography;
- no AI artifacts;
- phone-size legibility;
- no fake signage;
- no accidental duplicate marks;
- show hierarchy is clear;
- safe areas preserved;
- 16:9 master correct.

### Brand
- does not look like ESPN/FOX/CBS copied trade dress;
- looks recognizably GatorBait;
- GatorBait Sports Network hierarchy is consistent;
- GatorBait TV is used as destination/channel, not a competing network.

### Production
- correct export;
- transparency where needed;
- static and live versions named consistently;
- rollback/source master retained;
- public release only after fact and visual QA.

## Naming convention

Use predictable asset names:

`YYYY-MM-DD_show_asset_topic_v01.ext`

Examples:

- `2026-09-22_lowdown_thumbnail_ole-miss_v01.png`
- `2026-09-22_lowdown_rankings_ap-top25_v01.png`
- `2026-09-22_lowdown_lowerthird_yancy-porter_v01.webm`
- `2026-09-22_lowdown_matchup_florida-ole-miss_v01.png`

## Learning loop

After measurable distribution:

- capture thumbnail CTR when available;
- note mobile legibility failures;
- record which art systems Brenden approves/rejects;
- compare photo-led vs helmet/data-led performance;
- record render/production failures;
- promote only repeated lessons into this skill.

Do not optimize toward generic platform aesthetics if doing so erases GatorBait identity.
