# Permanent football field guide — September 29, 2026

## Scope and ownership

Requested by Brenden: a permanent, attractive roster and schedule, linked from the front page and inserted into the separate Magazine. Root/controller owns all live changes. This worker staged the existing article's replacement body and verified source data; it made no live content writes.

Reuse native published post `aeb4f5a5-3910-4b11-9a63-b05bac96e623`:

https://www.gatorbaitmedia.com/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play

The full published-post title inventory contained no separate evergreen 2026 roster/schedule. This existing former guide had been rewritten as a September 24 Ole Miss injury watch. Preserve the canonical slug and archive the full current post before replacing its stale body. No new route, duplicate article or client-side 404 replacement is required.

## Ready for controller

- `resource-rich-content.json`: native Ricos body, ready for the article's `richContent` field.
- `resource-metadata.json`: exact existing post ID, canonical URL, title and excerpt.
- `resource-seo-data.json`: existing native SEO object with stale injury title, description, OG copy and keywords updated; canonical URL, photo, robots, `custom: false` flags and redirect settings preserved.
- `before.json`: complete native draft rollback, read with matching `editedDate` across bounded metadata/rich-content reads. At capture: `PUBLISHED`, `hasUnpublishedChanges: false`, `editedDate: 2026-09-27T05:11:23Z`.
- `resource-native.html`: readable semantic source body.
- `roster.json`: all 117 official 2026 players, including source bio URLs.
- `schedule.json`: source schedule, including the spring game; build selects the 12 regular-season games.
- `build.py`: regenerates the HTML, native Ricos, metadata and independent style preview.
- `preview.html`: standalone layout reference only; do not replace the Wix article shell with this file.
- `inserts.html`: root-owned front page/Magazine widget implementation, if present.
- `link-card.html` / `link-card.css`: optional isolated visual reference; root's widget supersedes these.

Run `python deploy/roster-schedule/build.py` from the repository root.

The native body credits **Brenden Martin**, separately preserves **Chris Spears / GatorBait Media** cover-photo credit, and contains no injury designations or unsupported depth-chart claims. All facts are explicitly labeled **2026**, checked September 29. Keep the existing original publication date, canonical slug, categories, tags and cover media unless the controller separately verifies a change.

The current native hero is `16b519_a7ef6b30ac954bf5962d6583bbd14b1e~mv2.jpg`, 3000×1698. Its native alt text explicitly credits Chris Spears and identifies Florida at Auburn, September 19, 2026. The body credit is grounded in this exact current media record. Preserve the native `firstPublishedDate` of `2026-09-17T23:51:02Z`.

## Native formatting

The schedule has three columns (date, opponent, result/kickoff). The complete roster uses 14 small position-group tables with three columns (number, player, year), official linked bios, light-blue header rows and alternating backgrounds. The upcoming Missouri row uses pale orange. No seven-column desktop table is squeezed into a phone. Minimum column widths and content-width containers are declared in native Ricos; root still must verify public mobile rendering and table containment before claiming device-tested behavior.

H2 texts and stable authored node IDs:

| Text | Ricos node ID |
| --- | --- |
| 2026 schedule & results | `schedule` |
| 2026 player roster | `roster` |

Native rendered DOM anchors must be checked before publishing deep links. Root may map its route-scoped widget to these verified heading texts. A source node ID alone is not proof of the browser fragment ID.

## Source and fact checks

1. [UF official 2026 roster](https://floridagators.com/sports/football/roster/2026): structured server payload contains 117 distinct visible players. All 117 name/number pairs also match the rendered page's independent `aria-label` player labels, with no missing or extra pairs. All 117 bio URLs are exact links from the rendered source, not reconstructed slugs. Roster data is not a participation/availability statement.
2. [UF official 2026 schedule](https://floridagators.com/sports/football/schedule/2026): 12 regular-season games, four completed wins. Spring scrimmage is not counted in the 4–0 record or displayed in the regular-season table. Exact announced times remain separate from time windows.
3. [UF Missouri game center](https://floridagators.com/game-center/27907): October 3, 3:30 p.m. ET, ABC. Independently confirmed by [Missouri's official schedule](https://mutigers.com/sports/football/schedule/season/2026), which lists 2:30 p.m. CT and ABC.
4. [UF September 28 South Carolina announcement](https://floridagators.com/news/2026/9/28/football-florida-south-carolina-kick-time-and-tv-to-be-set-after-games-of-oct-3): October 10 remains noon **or** 12:45 p.m., ABC **or** SEC Network; final assignment after October 3 games. Do not collapse these alternatives into a false exact time.
5. [Aaron Philo official bio](https://floridagators.com/sports/football/roster/aaron-philo/18345): No. 12, QB, junior. [Jayden Woods official bio](https://floridagators.com/sports/football/roster/jayden-woods/18310): No. 0, JACK, sophomore. These independent spot checks corroborate roster name/number/position/class extraction.

The source snapshots are ignored as bulky temporary upstream HTML. Structured public facts and exact provenance URLs are retained in this directory. Every table row comes from these source snapshots; no statistics, projected starters or injury details were invented.

## Wix authoring evidence

Official schema and method read:

https://dev.wix.com/docs/api-reference/assets/rich-content/ricos-documents/convert-to-ricos-document

Confirmed conversion shape is `POST https://www.wixapis.com/ricos/v1/ricos-document/convert/to-ricos`, with `{html, options: {plugins: ['HEADING', 'TABLE', 'LINK', 'TEXT_COLOR']}}`. A harmless conversion probe returned HTTP 403 (permission gap). Do not retry different URLs/bodies to circumvent it. Native Ricos is authored directly against the method's official RichContent/Node/TableData/TableCellData schemas instead.

Native table nesting: `TABLE → TABLE_ROW → TABLE_CELL → PARAGRAPH → TEXT`. Header rows use `tableData.rowHeader: true`; cells have `tableCellData.cellStyle.backgroundColor`. Widths use `tableData.dimensions.colsWidthRatio` and `colsMinWidth`; spacing/padding use documented native fields. The LINK decoration's exact `{type:'LINK',linkData:{link:{url,target:'BLANK',rel:{noreferrer:true}}}}` structure is also verified in existing native post snapshot `deploy/writer-attributions/before/1c12e61d-0018-4089-896c-47ab5d470655.json`.

Root should apply through its already documented native update/publish workflow, guarding the freshly read post and preserving unrelated metadata. Return values prove the post mutation; public UI verification proves rendering. No site-wide publish is needed.

## Durable editorial rule

- Keep this canonical destination stable. Refresh it rather than making a new weekly roster post.
- Football stories should link a useful roster/schedule reference back to this guide; do not repeatedly link every name or inject unrelated keywords.
- Before publishing a roster-dependent story or updating the guide, compare names/numbers/positions/years with the current official roster, corroborate materially changed fields with official player bios, and resolve discrepancies before publication.
- Before promoting a next-game card, cross-check date/time/location/network with UF's schedule and opponent/SEC primary source. Time windows stay labeled as windows and TBA stays TBA.
- Keep a visible checked date. Do not imply the snapshot auto-updates. A successful data fetch does not substitute for copy review and rendered verification.
- A later season should refresh the same permanent destination only with a deliberate season update and archived prior data; never silently show a new year on old tables.

## Validation performed

117 unique roster IDs; 117/117 name/jersey pairs match visible official labels; 14 position groups sum to 117; 12 regular-season game rows; four final results produce 4–0; every bio link exists in the source; 15 native tables; 129 data rows; proper native container nesting; all authored IDs unique. Browser/mobile rendering remains root's deployment verification step.

## Applied and publicly verified

Root published the native guide on September 29, 2026, preserving the original September 17 publication date and canonical slug. It now credits Brenden Martin and retains the verified Chris Spears image credit. SEO title, description and social summaries were updated while canonical, image and robots settings were preserved.

The access-card embed is `360c9265-3d33-4c5f-99d3-71ac79d011aa`, current revision **4**. Exact source: `inserts.html`. It appears above Latest in the homepage right column and below the Magazine contents. It adds stable `#roster` / `#schedule` targets to the matching native headings, with bounded mounting observation rather than permanent polling. It also scopes compact table spacing to this guide.

Native content verified after update: all text, links and table row counts match the source. Wix normalizes rich-content nodes, so literal object equality differs; the semantic comparison passes. Public browser checks confirmed 15 tables, 117 player rows, 12 game rows, author, both fragment landings, no desktop horizontal overflow, and 46px normal table rows. The frontend shows new Brenden credits in homepage lists. Actual mobile-browser emulation was unavailable; no device certification is claimed.

Rollback: read the current clean published guide before restoring the original body/title/excerpt/author/SEO from `before.json`; do not overwrite later edits. Disable the new access-card embed using its current revision if removing this feature. Do not delete or recreate the native post. Existing canonical-page caches may briefly retain the previous table styling; fresh queries verified revision 4. No new-post alert or newsletter send was requested.
