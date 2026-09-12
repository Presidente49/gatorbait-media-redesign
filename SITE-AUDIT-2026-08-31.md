# GatorBait Media — Site Audit, Aug 31 2026

Findings verified against the live site through the Wix API. Ordered
by how much they cost the business, not by effort to fix.

---

## 1. The forum doesn't exist — the app is not installed

**Verified.** The site's installed apps are:

Promote SEO · Wix Blog · Wix eCommerce · Wix Events & Tickets ·
Wix Forms · Wix Forms & Payments · Wix Invoices · Wix Members Area ·
Wix Pay Links · Wix Pricing Plans · Wix Restaurants Menus ·
Wix Restaurants Orders · Wix Stores

There is **no Wix Forum** and **no Wix Groups**.

This contradicts two documents in this repo:
- `wix-site-management-playbook.md` lists "Message Boards" and
  "Groups List" as Active pages.
- `REDESIGN-BLUEPRINT.md` claims "7 forum boards" shipped in Phase 1.

Whatever pages exist for those features are shells pointing at an app
that isn't there. "There's no community on the site" is not a design
problem — the feature is absent.

**Fix:** install Wix Forum from the App Market. This is a dashboard
action; it cannot be done through the API.

### Related: two restaurant apps are installed

`Wix Restaurants Menus` and `Wix Restaurants Orders` are installed on
a college sports news site. They load on every page. Uninstall.

---

## 2. The sitemap is broken three separate ways

### 2a. It points at the wrong domain

`sitemap-index.xml` lists its children as:

```
https://presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml
https://presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml
```

…while every URL *inside* those files is `https://www.gatorbaitmedia.com/...`.

Google treats a sitemap that lists URLs on a different host as
unverified and ignores it, unless both properties are verified and
cross-submission is deliberately configured. If this index is what was
submitted to Search Console, it is doing nothing.

### 2b. It covers 1% of the catalog

Each file contains exactly **50 `<url>` entries**. The site has 4,250+
articles. Even if Google accepted the file, it would be advertising
roughly one percent of the archive.

### 2c. The index timestamp is two months stale

`sitemap-index.xml` reports `lastmod 2026-07-08T07:56:33Z`. The newest
article inside `news-sitemap.xml` is dated `2026-08-30`. The
"GBM Sitemap Bot" regenerates the article files daily (see git log) but
never updates the index's timestamp — so a crawler reading the index is
told nothing has changed since July and skips the fetch.

There is no workflow file in this repo, so the bot runs from somewhere
external and is not version-controlled here.

### What to do about it

Wix publishes its own sitemap at `https://www.gatorbaitmedia.com/sitemap.xml`,
generated from the live blog and always complete and current. That is
almost certainly the one carrying the site's SEO.

**Recommendation:** confirm the Wix sitemap is the one registered in
Google Search Console, and retire this parallel GitHub-hosted system
rather than repairing it. A cross-domain, 50-URL, stale-timestamp
sitemap cannot beat the native one, and maintaining both invites
exactly this class of bug.

Do not "fix" the index by rewriting the `<loc>` values to
gatorbaitmedia.com — the files are not served from that domain, so
those URLs would 404.

---

## 3. The photo library is a genuine asset and is entirely unused

The Media Manager holds dozens of dated shoot folders, owner-shot and
owned outright. Current-season material:

| Folder | Date |
|---|---|
| `2026.8.18 Fla Football` | Aug 18, 2026 |
| `2026.8.11 Fla FB Practice` | Aug 11, 2026 |
| `2026.8.7 Fla FB Practice` | Aug 7, 2026 |
| `2026.4.11 Orange & Blue` | Apr 2026 |
| `2026.3.3 Spring Football` | Mar 2026 |

Plus thematic folders: `Gatorbait Magazine Covers`, `Brand Assets & Logos`,
`GatorBait Staff`, `Generic Football PIcs`, `Football Recruiting`, and
several seasons of basketball, gymnastics, softball, baseball and
volleyball.

Sample descriptor from the Aug 18 shoot:

- 3984 × 2656, 5.4 MB JPEG
- Wix auto-labels (`coach`, `sideline`, `drills`, `lineman`)
- Face-detection boxes with confidence 1.0 — usable for smart cropping
- Dominant-color palette per image

**These are 4–5 MB originals.** They must be served through Wix's image
transform CDN, never raw, or page weight will be catastrophic.

`Gatorbait Magazine Covers` is the strongest untapped brand asset on the
site: 47 years of print identity, digitized, currently shown nowhere.

---

## 4. Constraints worth recording

- The site is on the **legacy Wix Editor**. Elements are absolutely
  positioned; there is no layout flow. CSS can restyle but cannot
  meaningfully re-place anything.
- The working method for real layout is therefore an injected embed —
  the pattern the existing `GBM - Buddy Martin Show Live Hub` embed
  already uses: wait for load, find an anchor element, insert a
  self-contained section. Text inside such a block is weak for SEO, so
  it suits heroes, galleries and CTAs — not article bodies.
- The environment running this work cannot reach `gatorbaitmedia.com`,
  `manage.wix.com`, `editor.wix.com`, or `static.wixstatic.com`. All
  site changes go through the Wix API; nothing can be visually
  confirmed against the live site from here. CSS is verified by
  rendering against a DOM replica in a real browser before deploy.

---

## 5. Open items not yet diagnosed

- **Social publishing errors.** Reported as "can't post to any social
  media without getting an error." No error text captured yet — needs
  the actual message before it can be diagnosed.
- **Schema correctness.** A `NewsMediaOrganization` block and a
  `NewsArticle` injector both live in the `GBM - Site Fixer v6` embed.
  Not yet audited against what the pages actually render.
- **Interactive UF roster.** UF publishes no public roster API, so this
  likely means scraping — its own project with its own maintenance
  burden.
- **2026 press conference footage.** Sitting in the media login,
  undownloaded. Three minutes usable under the license.
