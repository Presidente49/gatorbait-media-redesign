# Staff directory and About masthead (Nov. 3, 2026)

One new loader embed plus `sports-live/staff-widget.js` (built by `tools/staff/build-staff.mjs` from `sports-live/src/staff.js` and `sports-live/staff-data.json`).

- **Routes:** `/about` (adds a masthead and a writers/staff directory below the existing About copy, above the footer; nothing existing is hidden or restyled) and `/writers` (same directory as its own page, lights up only if a page is added at that URL; today it is a 404).
- **Anchors:** `/about#team`, `/about#writers`, `/about#writer-<name>` (for example `#writer-franz-beard`).
- **Data:** Wix Members profiles, the existing About copy and photos, each author's posts (Wix Blog API), refreshed in the browser from `/blog-feed.xml` (dc:creator) before first render. Falls back to the baked snapshot.
- **SEO:** JSON-LD `NewsMediaOrganization` (same `@id` as the existing block) with `member` Person entries, only verified fields. Real `<a href>` links to every author page and story.
- **Loader:** ESSENTIAL, HEAD, loadOnce false, jsDelivr bundle pinned to an immutable commit SHA.
- **QA:** `node tools/staff/qa-staff.mjs local|live <outdir>`.
- **Rollback:** PATCH the loader embed `enabled:false` (or remove it). Nothing else was changed.

## Missing from the site (Brenden to supply; none are invented here)

Bios: none of the eight has a written bio on the site. Only the About letter (Buddy, Brenden, Franz roles) and Wix profile titles exist.
Photos: Eddie Gilley, Carlton Reese, Chris Spears (his profile photo is a game action shot, not a portrait) and GatorBait Staff have no Wix-hosted portrait, so cards show initials. Buddy's Wix profile photo is a Google URL, so the existing About-page photo is used.
Titles: Loren Meadows, Carlton Reese and Chris Spears have no title on their Wix profile (roles here are Writer, Writer, Photographer from the site's own copy).
Author pages: Chris Spears's member profile URL returns 404, so his card links to his latest story instead. Chris and Brenden have no blog category.
