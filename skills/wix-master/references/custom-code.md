# Custom code (custom embeds)

GatorBait's homepage, Magazine, header and Barlow loader are custom embeds. The patch mechanics (ExecuteWixAPI projection, in-code replace, assertions) live in the synced `gatorbait-site-ops` skill. This file covers the Wix rules around them.

## Dashboard vs API

| Property | Dashboard (Settings → Custom Code) | API (`/embeds/v1/custom-embeds`) |
|---|---|---|
| Code | Paste box | `embedData.html`, **max 15,000 characters** |
| Name | Yes | `name` 1–100 chars |
| Placement | Head / Body-start / Body-end | `position`: `HEAD`, `BODY_START`, `BODY_END` |
| Pages | All pages, or "Choose specific pages" | `pageFilter` object (read it in the GET, re-send unchanged) |
| Load once vs each page | Only when "All pages" is chosen | `loadOnce` (**defaults to `true`** if omitted) |
| Consent category | "Code type" categorization | `embedData.category` (**required** on update) |
| Enabled toggle | Yes | `enabled` |
| Concurrency | n/a | `revision` required. Stale revision = rejected |

Sources:
- Dashboard steps: https://support.wix.com/en/article/embedding-custom-code-on-your-site
- API intro (categories, positions, loadOnce): https://dev.wix.com/docs/api-reference/business-management/custom-embeds/introduction
- Update method (revision, category required, 15,000 limit, `pageFilter`): https://dev.wix.com/docs/api-reference/business-management/custom-embeds/update-custom-embed
- Overview (placement, scope, loading behavior): https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/custom-code/about-custom-code

## Consent categories (this is a rendering switch, not a label)

- `ESSENTIAL`: "Always loaded ... Tags will be returned in the HTML immediately." Never for tracking.
- `FUNCTIONAL`, `ANALYTICS`, `ADVERTISING`, `DATA_TO_THIRD_PARTY`: loaded only after the consent manager allows them, so they're **not server-rendered**.
- GatorBait rule: first-party layout, routing and nav embeds = `ESSENTIAL`. Copying `FUNCTIONAL` from a docs example caused the native-page flash (LESSONS #33).

## SPA navigation

- Wix navigates between pages without a full reload. `loadOnce: true` code runs once per visit, on initial render only. Anything that must re-apply per route (layout injection, SEO/schema, route-specific UI) needs `loadOnce: false`, or its own route listener.
- `loadOnce: true` scripts don't run on the 404 page (observed; see `gatorbait-site-ops`).
- Code that mutates the DOM must tolerate Wix re-rendering the page container on navigation. Prefer deterministic startup over permanent polling (LESSONS #5).

## Other Wix rules that bite

- **Domain binding:** "Your code snippets are associated with a specific domain. If you assign a different domain to your site, your code snippets will be deleted." Never change the primary domain without exporting every embed to the repo first. (Same dashboard article.)
- **Tracking pixels don't work through custom code** (GA, GTM, Facebook, TikTok). Use Marketing Integrations. (Same article.)
- **Frontend security (Dec 2025):** Wix added frontend security measures that can block snippets that previously worked. That covers dashboard custom code, embedded code and Velo. A newly broken script may be blocked, not buggy. (Same article, FAQ.)
- Finding a bad snippet: disable one at a time and test (Wix's own guidance).
- Custom embeds are cloned when the site is duplicated (API intro).
- Performance: defer third-party scripts, put them at body-end, remove unused ones (performance.md).

## Does an embed change need a publish?

Wix docs don't state it for the API. GatorBait practice (site-ops skill) has been PATCH → publish → verify. Treat it as **"verify live first. Publish only if the live site still serves the old revision."** Every publish carries the risks in publishing-safety.md (unrelated drafts, API page SEO rollback). Record which way it went in #34 so the answer becomes evidence.
