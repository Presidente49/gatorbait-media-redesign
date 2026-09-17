# Social Media + Show Clips Playbook

## Objective

Treat every approved GatorBait live show as a source package that produces one useful general post-show blog recap plus multiple monetizable, platform-native social assets without requiring Brenden to manually find, download and repost every clip.

This workflow is **not part of subscriber win-back**. Win-back is a separate customer-recovery lane. Show clips are an editorial/distribution lane for the general GatorBait audience.

The controller owns the loop. Restream, Metricool, YouTube/Facebook tools and models are subordinate capabilities.

## Revenue principle

GatorBait should not publish one identical clip everywhere and call that a strategy. Each completed show should create a reusable editorial package:

1. one general post-show recap blog post;
2. up to five selected clips with context;
3. platform-native social distribution;
4. optional normal GatorBait Weekly reuse when a clip genuinely improves the newsletter.

The default blog destination is the recap post, not a membership/win-back campaign.

## Guest-history principle

Many Buddy Martin Show and GatorBait guests have a real history with Buddy Martin, Brenden Martin, GatorBait, Gator Country, the University of Florida or earlier versions of the shows. That relationship is editorial context and should be resolved before packaging the guest as if they were a random interview.

For each guest, capture when known:

- relationship to Buddy Martin;
- relationship to Brenden Martin;
- prior GatorBait / Gator Country / UF connection;
- prior appearances or recurring-guest status;
- public facts that verify the relationship;
- owner recollections that may be used only with accurate attribution;
- one short `why this guest matters to us` line.

Use the history when it creates a stronger truthful hook, intro or caption. Do not force nostalgia into every clip, and do not turn a legitimate early-career relationship into an unsupported claim that GatorBait caused the guest's later success.

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
- guest-history context status;
- rights status;
- related canonical full-show URL when available.

### 3. CONTEXT — resolve the guest relationship

Before final clip selection or public copy:

1. identify the guest's relationship to Buddy, Brenden and the GatorBait/Gator Country history when known;
2. check prior show appearances and recurring-guest status when available;
3. verify public biographical/history claims when the caption will state them as fact;
4. distinguish public facts from Buddy/Brenden recollection;
5. retain one concise relationship hook only if it helps the current story.

A known recurring guest should not be reduced to generic `special guest` packaging. A new guest with no meaningful house history should not be given invented history.

### 4. CLASSIFY — pick jobs, not "best clips"

Select up to five useful moments per show, with different jobs where available:

- **News hook:** strongest timely statement or development.
- **Analysis hook:** a sharp football/basketball take with context.
- **Personality hook:** funny, emotional or human moment.
- **Relationship/history hook:** a moment whose value is strengthened by the guest's real history with Buddy/Brenden/GatorBait.
- **Debate hook:** a claim likely to prompt legitimate conversation without misleading rage-bait.
- **Evergreen hook:** useful moment that can run later in the week.

Selection is reasoning work. Rights, IDs, dates, duplication, source matching, guest identity and destination-account matching are deterministic gates.

### 5. BUILD — one general recap blog post

The default editorial output is **one recap post per completed show**, not one thin post per clip.

Recommended structure:

- headline tied to the actual show/topic, not "5 clips you missed" clickbait;
- 1–2 paragraph show summary;
- embedded full show or canonical show link near the top;
- 3–5 selected clip blocks;
- a short paragraph of context before each clip explaining what is being discussed and why it matters;
- guest names, relationship context and relevant facts verified from the source;
- related GatorBait stories when they genuinely add context;
- one final path to watch the full show or continue reading.

The recap should be useful even if a reader never clicks a clip. Do not turn transcripts into filler and do not manufacture a separate SEO article for every moment.

### 6. PLAN — package clips for social

Default social deliverables:

- 9:16 vertical master for Reels/Shorts when source quality supports it;
- burned-in readable captions or platform captions;
- hook text that does not cover faces/score graphics;
- Facebook caption;
- Instagram caption;
- YouTube Shorts title/description;
- X post only when the clip/topic belongs there;
- recap-blog or full-show CTA;
- campaign ID;
- destination account/page selected from the content identity, not merely the platform default.

Use verified guest-history context when it materially improves the hook. Do not use identical copy everywhere.

### Destination routing

Route by **editorial identity first**:

- Florida game-week / broad GatorBait editorial clips → Gator Bait Media identity unless another show identity clearly owns the segment;
- Buddy Martin Show guest/history/personality clips → The Buddy Martin Show identity;
- other named shows → their own connected identity when available and approved;
- when a destination is disconnected, stop that lane rather than silently substituting a different page/account.

Before publishing, verify both the platform account ID and page/channel ID. Never assume the default connected page is the correct destination.

### 7. ACT — distribution

Preferred execution path:

`Restream MCP → local n8n MCP Client workflow → approved clip asset → Wix recap post + Metricool/platform destination`

n8n's MCP Client can connect to external MCP servers. The Restream connection must be OAuth-authorized locally; do not store tokens in Git.

Routine organic publishing may run automatically only inside `policy.json` and the controller's editorial/social quality gates. Sensitive claims, rights uncertainty, legal allegations, emergencies, personnel disputes, paid promotion and unapproved commercial offers escalate.

### 8. NEWSLETTER REUSE — optional, normal editorial only

The recap/clip workflow may contribute to the regular GatorBait Weekly newsletter, but this is optional and unrelated to win-back.

Allowed reuse:

- one `From GatorBait TV` block using the strongest clip or recap;
- a short link to the recap blog post;
- a full-show link when that is more useful.

Do not route show clips into a former-subscriber sequence just because the content exists. A win-back campaign may later choose current editorial proof independently under its own playbook, but there is no automatic linkage between these workflows.

### 9. VERIFY

For every recap/social package verify:

- correct Restream event/recording;
- correct clip/source identity;
- recap title/date/guest names are accurate;
- guest-history claims used publicly are verified or accurately attributed;
- every embedded clip or link works;
- canonical recap/full-show destination works;
- destination account/page matches the owning show/editorial identity;
- vertical crop and caption safe area are usable;
- rights/commercial-use status remains valid;
- scheduled/published platform objects exist when distribution is enabled.

A model cannot certify its own edit. Verification uses platform object data and/or rendered preview.

### 10. RECORD + LEARN

At 24 hours and 7 days, record where available:

- recap pageviews and engaged time;
- clip qualified/engaged views;
- watch time / retention;
- completion rate;
- shares/comments;
- clicks from social to recap/full show;
- followers/subscribers gained;
- revenue/earnings where the platform exposes it;
- newsletter clicks when the recap is reused there;
- whether guest-history framing improved performance versus generic packaging.

Promote repeatable patterns only after enough comparable posts exist. Do not let one viral outlier rewrite the playbook.

## Platform rules

### Facebook

- prioritize original GatorBait-owned show footage;
- preserve enough context to make clips satisfying, not deceptive fragments;
- test Reels and longer native video when a segment deserves both;
- route each clip to the correct Facebook page instead of relying on the default page;
- use the recap blog as an owned destination when a click makes sense, but do not replace native video with outbound-link-only posts.

### YouTube

- use compelling title/thumbnail/first seconds that immediately deliver the promised value;
- preserve original, non-repetitious content and commercial rights;
- use Shorts for discovery and the full show for watch-page monetization;
- link to the recap post or full show when useful;
- judge Shorts by engaged views and retention, not raw starts alone.

### Instagram

Treat Instagram primarily as reach/community/brand unless current account monetization data proves direct revenue. Use native 9:16 creative, captions, visible human moments and clean safe-zone text. Route high-intent users toward the recap, full show, newsletter or membership page as context warrants.

### X

Use selectively for breaking context, quotes, debate and live-game/show conversation. Do not spend production time forcing every clip onto X when Facebook/YouTube provide clearer monetization value.

## Weekly social rhythm

The controller should aim for a repeatable editorial rhythm rather than a rigid quota:

- show night: live promo + strongest immediate post-show clip;
- next morning: resolve guest-history context, publish the general recap blog post and 1–2 analysis/news clips;
- mid-day: related article/column visual or quote card if it serves a real story;
- afternoon/evening: second clip or discussion post based on performance and news cycle;
- newsletter day: optionally reuse the week's strongest recap/clip as a normal editorial block.

If there is no strong asset, publish less. Low-value volume can hurt monetization and audience trust.

## Safety / stop conditions

Stop and escalate when:

- source recording or workspace cannot be positively identified;
- guest/content rights are uncertain;
- guest relationship/history cannot be stated accurately;
- clip materially changes meaning when removed from context;
- recap would require unsupported facts or invented context;
- platform destination is wrong or disconnected;
- Restream returns a write action unrelated to the selected event/project;
- repeated workflow failure reaches the controller retry bound.

## Implementation requirement

Before this workflow becomes live automation, connect Restream's remote MCP endpoint to the local n8n MCP Client using OAuth and test read-only operations first. Then test one known recording end-to-end with **recap and social publishing disabled**. Enable automatic publishing only after the controller can prove source ID, clip ID, recap destination, destination account and rollback/unschedule behavior.
