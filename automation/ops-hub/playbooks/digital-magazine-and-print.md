# Digital Magazine + Premium Print Playbook

## Objective

Make `/magazine` feel like a real current publication while preserving the web-first Wix architecture. Do not turn the core experience into a flipbook. A flipbook may exist later as an optional issue artifact, but the primary product remains fast, indexable, linkable HTML.

## Benchmark pattern

The useful pattern across leading magazine publishers is consistent:

1. strong masthead and one dominant current feature;
2. a small set of secondary features instead of an undifferentiated feed;
3. clear Latest / Popular / section discovery;
4. a named current issue plus an archive of past issues;
5. video, audio or other owned formats mixed into editorial discovery;
6. persistent but restrained subscription/newsletter paths;
7. print treated as a premium product, not as the website UI.

## GatorBait vNext magazine structure

### Above the fold

- GatorBait Magazine masthead.
- `Current Issue` label with issue date or theme.
- One cover/lead package: dominant image, headline, dek, byline.
- Two or three secondary cover lines linking to current stories.
- Join + GatorBait Weekly CTAs kept visible but subordinate to editorial content.

### Main body

- `Inside This Issue`: curated 4–6 story package selected from current Wix Blog content.
- `Latest`: chronological rail sourced from the same canonical RSS/Wix data that drives the newsroom feed.
- `Columns`: Buddy Martin, Franz Beard, Eddie Gilley, Loren Meadows and other current contributors when content exists.
- `Watch / Listen`: Buddy Martin Show, Florida Gator Lowdown and other owned video/audio, using canonical destinations.
- `Most Read` only when connected analytics can support the ranking; never invent popularity.
- `Past Issues`: archive by week/month/theme without duplicating article URLs.

## Issue model

An issue should be a lightweight editorial grouping, not another CMS.

Minimum issue record:

- issue ID;
- display title/date/theme;
- cover image;
- lead story URL;
- ordered supporting story URLs;
- optional video/audio URL;
- optional print-edition SKU/link;
- published/archived state.

The existing Wix articles remain canonical. An issue only packages them.

## Freshness rule

The controller must compare `/magazine` against the canonical Wix/RSS story source. If a current issue omits materially newer published content without an editorial reason, mark the page `needs_editorial_refresh`; do not silently call stale ordering a technical failure.

## Print-on-demand pilot

### Preferred first proof: Blurb

Why:

- newsstand-quality 8.5 x 11 magazine format;
- print on demand with no inventory requirement;
- direct-to-customer printing, shipping and fulfillment through the Blurb Bookstore;
- publisher controls retail price and keeps the markup after print cost;
- PDF upload / InDesign-friendly workflow;
- current advertised magazine entry price starts at $7 for a 20-page copy before shipping.

Pilot concept: `GatorBait Collector Issue` rather than trying to print every web update. Use the strongest photography, columns, game-week features and archival material to create something worth keeping.

### Alternative: MagCloud

Useful when we want more trim/binding flexibility, publisher markup and optional paid digital distribution. MagCloud prints full-color on-demand and lets publishers set a markup over print cost. Keep as the second proof candidate, not a simultaneous launch.

## Print launch gate

Do not sell until:

1. a physical proof has been ordered and reviewed for color, bleed, spine/binding, image quality and typography;
2. delivered cost is known for the likely customer geography;
3. retail price leaves an acceptable contribution margin after print, shipping/refunds and any platform fees;
4. every photo/text asset is cleared for commercial print use;
5. fulfillment/support language is written and accurate.

## Controller loop

`fresh content → package issue → preview → editorial/rights QC → publish web issue → measure → select collector issue → produce physical proof → approve → sell`

Learning may change section mix, cover treatment and issue cadence. It must not silently change membership prices, print prices, rights rules or fulfillment terms.

## Research references

- The Atlantic: web-first feature hierarchy, Popular/Latest/Newsletters, print issue/archive, podcasts/audio.
- New York Magazine: magazine as one layer within a broader editorial network, current issue/back issues/newsletters/video.
- WIRED: subscriber exclusives plus explicit watch/listen/app experiences.
- Blurb magazine and bookstore documentation, September 2026.
- MagCloud pricing/distribution documentation, September 2026.
