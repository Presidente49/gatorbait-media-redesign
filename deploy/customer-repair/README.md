# Customer audit repair — September 28–29, 2026

Owner: Brenden Martin. Request: dispatch the appropriate agents and fix the customer audit issues. One production writer: root ChatGPT controller. Webmaster and Broadcast Ops staged disjoint repairs from freshly read Wix objects. Existing work item: issue #34. Canonical site: `18fb3a4e-d7f6-414a-aeb9-3047db3ea115`.

## Applied objects

The root controller reports successful provider updates with returned HTML exactly matching these candidate files. Public-browser verification is recorded separately; provider acceptance alone is not customer verification. `after.json` contains the source revision used in the PATCH, not its resulting revision.

| ID | Before → accepted revision | Changes |
|---|---|---|
| `622d8ece-df55-44fc-9e4a-3f580804743b` | 15 → 16 | Restore supplied homepage logo with reserved dimensions. Add Search link. Preserve story order and game band. |
| `53e15504-76c9-4551-90fe-4defe7cad84d` | 6 → 7 | Desktop Just In thumbnails above full-width headlines; sentence casing. Add accessible Google site-scoped archive search form, explicitly labeled as external results. |
| `7fee4de6-1886-475e-a3f3-b9c68161c242` | 28 → 29 | Route Search to actual form; prevent duplicate active-nav marking; correct stale newsletter rename to GatorBait Magazine Newsletter. |
| `5a43ae83-690e-4933-971d-4837db00b2f3` | 16 → 17 | Visible publication date in article header, using native `article:published_time` only, formatted in America/New_York. No invented fallback dates. |
| `1dd74333-ee02-40da-9c93-cf8fd787c129` | 41 → 42 | Show cover-story date from existing RSS metadata when available. No invented issue number or PDF. |
| `82c4ca83-98df-4f35-9972-7345a2a71755` | 27 → 28 | Broadcast agent: retain current player/audio initialization, add normal show schedule, current episode to strip, selected episode indication, thumbnails and clearly described Apple audio archive. |

## Validation and boundaries

All executable script blocks parse with Node `vm.Script`; all six HTML payloads remain below Wix's 15,000-character limit. Existing publication, canonical article URLs, typography family, member access, consent and Google ad-serving controls remain owned by their existing systems. No full-site publish was performed: publishing unrelated drafts can regress SEO state.

Search deliberately opens Google and is labeled accordingly. It is not a native complete-archive search index. Newsletter capture is separate: correcting the name does not establish a signup endpoint. Cover-date display is not a downloadable magazine implementation. Paid-plan settings, signup, ad-overlay settings and customer checkout testing are tracked separately by the root controller. Playback audio and physical iPhone behavior require public/device checks. Do not claim them from these code changes.

## Rollback and reapply

`{id}.before.json` is the exact fetched object before this change. `{id}.after.json` is the candidate object sent by root. Do not blindly send either stored revision. Before any future change:

1. GET `https://www.wixapis.com/embeds/v1/custom-embeds/{id}` from the selected site. Save the returned object or `{ "customEmbed": ... }` envelope locally.
2. Prepare a guarded payload, for example:
   `python3 deploy/customer-repair/prepare-patch.py rollback 622d8ece-df55-44fc-9e4a-3f580804743b --current /path/to/fresh-object.json --expected-revision 16`
3. The offline helper checks ID, revision, current HTML/category, enabled state, placement and scope against the recorded counterpart. It refuses to overwrite later edits. For reapply use `apply`, with the freshly observed revision; the current HTML must exactly match `before`.
4. PATCH the same URL with the generated body through the authorized Wix connector. Use a fresh read and revision guard within the mutation invocation where supported. The helper does not call APIs, authenticate, publish or bypass concurrent-write checks.
5. Verify public pages, then record accepted revision and evidence. A conflict means inspect and merge; do not force old code over another writer's changes.

Official methods: [Get Custom Embed](https://dev.wix.com/docs/api-reference/business-management/custom-embeds/get-custom-embed) and [Update Custom Embed](https://dev.wix.com/docs/api-reference/business-management/custom-embeds/update-custom-embed). List inventory with documented `paging.limit=100`; default first-page inventory is incomplete. Do not infer a missing owner from the default 20 results.
