# Gameday corrections receipt

Verified live November 7, 2026, approximately 4:10 p.m. ET.

## Loren Meadows: corrected both occurrences

- Canonical post ID: `9172a4ce-d410-4a90-a800-6b9578799508`
- [Live article](https://www.gatorbaitmedia.com/post/week-9-preview-florida-gators-5-3-2-3-v-oklahoma-sooners-4-4-2-3)
- Changed **Jaden Baugh → Jadan Baugh** once in Oklahoma Defense and once in The Skinny.
- Fresh provider and public browser checks show **zero** Jaden Baugh and **two** Jadan Baugh occurrences in the article.
- Exact rich-content comparison proves these two replacements were the only body changes. The same post ID, URL, headline, author, first-publication timestamp, cover, access and category remain.
- First published: November 7 at 6:57:01 a.m. ET. Correction published: 4:06:04 p.m. ET.
- Public layout checks passed at 390, 430 and 1366px without horizontal overflow.

## Magazine metadata and Facebook cache

- Native SEO item: `STATIC_PAGE:nh0hy`; published via the item SEO API with `publish: true`, without a full-site publish.
- Server title, Open Graph title and Twitter title now read **GatorBait Magazine | Florida vs. Oklahoma Pregame Edition**.
- Meta/OG/Twitter descriptions now describe the Oklahoma pregame coverage, Meyer's Ring of Honor, Buddy Martin, Franz Beard, scouting and Loren's preview.
- OG/Twitter image and alt now use the approved Urban Meyer football cover rather than the Georgia postgame art. Matching page JSON-LD was updated.
- [Canonical magazine](https://www.gatorbaitmedia.com/magazine) returned HTTP 200 with the new server-delivered tags. Neither the Georgia title nor Ocala's Good Life wording remains in the checked response.
- In the existing authenticated Chrome session, Meta Sharing Debugger initially showed the November 2 cached Georgia card. **Scrape Again** was clicked once. Meta returned **200**, a fresh scrape time, the Oklahoma title and description, and the revised Meyer image. Facebook's actual canonical preview was read back, not inferred from a Wix save.
- The browser's magazine runtime short title remains “GatorBait Magazine | Oklahoma Week”; the crawler-facing title is the full pregame title above.

## Page-count discrepancy

The reported **43-page** label is absent from the current live redesigned page. Its two linked PDFs are **146 compact phone pages** and **42 Letter print pages**, independently downloaded and counted in this pass. The 27-page PDF belongs to the earlier separate edition, before the matching twelve-story redesign.

No current 42-page file was relabeled “27-page.” The accurate 146/42 labels and current downloads remain. This is the one requested detail not applied as written, because it would misstate the actual linked file. See `current-pdf-counts.json` and the live download screenshot.

## Scope and evidence

The unpublished Business Suite Planner duplicate was **not opened, edited, deleted or fired**. No subscriber campaign, test email, manual email/push or social post was sent. The existing blog automation `e4ff0da9-65bb-440f-b5a5-5ed94ac3fb31` remained revision 6, ACTIVE, with its `wix_blog-new_blog_post` trigger; no automation settings changed. This receipt makes no new delivery claim.

The magazine design remains on source `55cbe7a7344306e8c62489f83e61af24ca94eb65`, build `2155edef`, embed revision `145`. No PDF was rebuilt or republished in this correction pass.

Provider before/after snapshots, exact article diff checks, public HTTP tags and browser DOM evidence are saved in this folder. Screenshot `proof/loren-skinny.jpg` visibly shows the corrected name; `proof/magazine-counts.jpg` shows the actual current download labels.

WixSitePanel rejected the real custom-domain URL again; no panel refresh is claimed. Native provider, public HTML, the public browser and Facebook's authenticated debugger supplied the verification.

Rollback: re-read the current object before writing. The article before-snapshot and full prior SEO tag array are in `provider-before.json`. Only restore the exact affected field if the desk explicitly requests rollback; do not revert unrelated later edits.

Workflow: [Master Control](https://github.com/Presidente49/gatorbait-media-redesign/blob/main/skills/master-control/SKILL.md), [Wix Operator](https://github.com/Presidente49/gatorbait-media-redesign/blob/main/.codex/skills/gatorbait-wix-operator/SKILL.md).
