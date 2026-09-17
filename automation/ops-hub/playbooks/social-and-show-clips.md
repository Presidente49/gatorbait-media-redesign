# Social Media + Show Clips Playbook

## Objective

Treat every approved GatorBait live show as a source package that can create multiple monetizable, platform-native assets without requiring Brenden to manually find, download and repost every clip.

The controller owns the loop. Restream, Metricool, YouTube/Facebook tools and models are subordinate capabilities.

## Revenue principle

GatorBait should not publish one identical clip everywhere and call that a strategy. Each source moment becomes a small campaign with one objective:

- earn qualified video views;
- drive viewers to the full show;
- drive readers to a related article;
- grow GatorBait Weekly;
- or move a high-intent audience to membership/store.

Only one primary CTA per asset unless a platform format clearly supports more.

## Nightly show-to-distribution loop

### Trigger

Preferred trigger: a completed Restream event/recording for an approved GatorBait show. A nightly schedule is acceptable as a fallback, but the workflow must de-duplicate by event/recording ID.

### 1. OBSERVE — Restream account

Use the authenticated Restream MCP account to:

1. identify the relevant completed event or video-storage file;
2. confirm show title/date and connected GatorBait workspace;
3. list existing clip projects before creating anything;
4. create a clip project only when the source has not already been processed, unless explicit reprocessing is requested.

Restream's MCP is remote and OAuth-secured. Keep confirmation enabled for Restream write tools. Reads should be preferred until the exact source is resolved.

### 2. SCOPE — create the clip candidate set

Retrieve clip project details and build a bounded candidate set. Do not download every generated clip by default.

For each candidate record:

- clip ID;
- source event/recording ID;
- duration;
- title/summary if provided;
- speaker/guest if known;
- rights status;
- related canonical GatorBait article/show URL if one exists.

### 3. CLASSIFY — pick jobs, not "best clips"

Select up to five useful moments per show, with different jobs where available:

- **News hook:** strongest timely statement or development.
- **Analysis hook:** a sharp football/basketball take with context.
- **Personality hook:** funny, emotional or human moment.
- **Debate hook:** a claim likely to prompt legitimate conversation without misleading rage-bait.
- **Evergreen hook:** useful moment that can run later in the week.

Selection is reasoning work. Rights, IDs, dates, duplication and source matching are deterministic gates.

### 4. PLAN — package each selected clip

Default deliverables:

- 9:16 vertical master for Reels/Shorts when source quality supports it;
- burned-in readable captions or platform captions;
- hook text that does not cover faces/score graphics;
- Facebook caption;
- Instagram caption;
- YouTube Shorts title/description;
- X post only when the clip/topic belongs there;
- related article or full-show CTA;
- campaign ID.

Do not use identical copy everywhere.

### 5. ACT — distribution

Preferred execution path:

`Restream MCP → local n8n MCP Client workflow → approved clip asset → Metricool/platform destination`

n8n's MCP Client can connect to external MCP servers. The Restream connection must be OAuth-authorized locally; do not store tokens in Git.

Routine organic publishing may run automatically only inside `policy.json` and the controller's social quality gates. Sensitive claims, rights uncertainty, legal allegations, emergencies, personnel disputes, paid promotion and unapproved commercial offers escalate.

### 6. REUSE — article and GatorBait Weekly

After a clip is selected, the controller checks whether it strengthens an existing story/show package.

Allowed outputs:

- embed/link the clip in the related canonical article;
- add a `Watch` block to a relevant article;
- add a short `From GatorBait TV` block to GatorBait Weekly;
- create a new article only when the clip contains enough verified news/context to justify a standalone story.

Do not create thin SEO posts around every clip.

### 7. VERIFY

For every published/scheduled asset verify:

- correct account/channel;
- correct clip/source identity;
- title/caption matches the content;
- destination URL works;
- vertical crop and caption safe area are usable;
- rights/commercial-use status remains valid;
- scheduled/published object exists.

A model cannot certify its own edit. Verification uses platform object data and/or rendered preview.

### 8. RECORD + LEARN

At 24 hours and 7 days, record where available:

- qualified/engaged views;
- watch time / retention;
- completion rate;
- shares/comments;
- link clicks;
- followers/subscribers gained;
- revenue/earnings where the platform exposes it;
- article/newsletter conversions attributable to the campaign ID.

Promote repeatable patterns only after enough comparable posts exist. Do not let one viral outlier rewrite the playbook.

## Platform rules

### Facebook

Facebook Content Monetization can pay across Reels, longer video, Stories, photos and text posts, with payouts tied to eligible performance. In 2026 Meta said it is emphasizing original content, deeper engagement, longer watch time and qualified views. Therefore:

- prioritize original GatorBait-owned show footage;
- preserve enough context to make clips satisfying, not deceptive fragments;
- test Reels and longer native video when a segment deserves both;
- do not rely only on outbound-link posts when native video can earn directly.

### YouTube

- use compelling title/thumbnail/first seconds that immediately deliver the promised value;
- preserve original, non-repetitious content and commercial rights;
- use Shorts for discovery and the full show for watch-page monetization;
- keep a link/pinned-comment path to the related full show or article when appropriate;
- judge Shorts by engaged views and retention, not raw starts alone.

### Instagram

Treat Instagram primarily as reach/community/brand unless current account monetization data proves direct revenue. Use native 9:16 creative, captions, visible human moments and clean safe-zone text. Route high-intent users toward the owned newsletter, article, show or membership page.

### X

Use selectively for breaking context, quotes, debate and live-game/show conversation. Do not spend production time forcing every clip onto X when Facebook/YouTube provide clearer monetization value.

## Weekly social rhythm

The controller should aim for a repeatable editorial rhythm rather than a rigid quota:

- show nights: live promo + strongest immediate post-show clip;
- next morning: 1–2 analysis/news clips tied to current coverage;
- mid-day: article/column visual or quote card if it serves a real story;
- afternoon/evening: second clip or discussion post based on performance and news cycle;
- newsletter day: reuse the week's strongest clip as a `Watch` block, not as filler.

If there is no strong asset, publish less. Low-value volume can hurt monetization and audience trust.

## Safety / stop conditions

Stop and escalate when:

- source recording or workspace cannot be positively identified;
- guest/content rights are uncertain;
- clip materially changes meaning when removed from context;
- platform destination is wrong or disconnected;
- Restream returns a write action unrelated to the selected event/project;
- repeated workflow failure reaches the controller retry bound.

## Implementation requirement

Before this workflow becomes live automation, connect Restream's remote MCP endpoint to the local n8n MCP Client using OAuth and test read-only operations first. Then test one known recording end-to-end with publishing disabled. Enable automatic distribution only after the controller can prove source ID, clip ID, destination account and rollback/unschedule behavior.
