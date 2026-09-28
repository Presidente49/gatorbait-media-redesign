# Blog keyword tagging: the standard for every GatorBait post

Every post gets Wix Blog **tags**. They render as links under the article and point to tag pages on our site, for example `/gatorbait-media-blogs/tags/jadan-baugh`. Tag pages use the Latest page layout, titled with the tag name. That gives readers somewhere to go next and gives search engines keyword-rich internal links.

## What a post gets (at most 15 new tags; existing tags are always kept)
Tags are added in this priority order, so the cap never drops the important ones:
1. **People:** Jon Sumrall, Todd Golden, Scott Stricklin, Steve Spurrier, Kevin O'Sullivan, Tim Tebow, Danny Wuerffel, Emmitt Smith, Urban Meyer. A person is tagged if mentioned anywhere.
2. **Opponents:** SEC schools plus FSU, tagged only when named in the headline or first ~700 characters.
3. **"Florida Gators Football":** on football posts only. This needs a roster player, or Sumrall, football, touchdown, quarterback or kickoff in the opening. It is never added to basketball posts.
4. **Florida roster players:** full-name matches anywhere in the post, taken from the official roster in `gameday/*/rosters-raw.json` (117 names as of 2026-09-26). A suffix is optional, so "Eric Singleton" also matches Eric Singleton Jr.

Existing tags are reused by label, case-insensitive. The most-used duplicate wins, and new tags are created only when none exists.

## Safety
- Tags only; the post's text is never touched. The run republishes the post with `UPDATE_PUBLISH`.
- **Posts with unpublished edits are skipped.** Republishing would publish a writer's work in progress.
- Nothing is removed.

## Run it
```
python3 build.py --since 2026-09-27T00:00:00Z --offset 0 --limit 35 [--dry-run]
```
Then paste `tagger.js` into ExecuteWixAPI with `hasMutations` set true for a real run. It returns tagged, skipped and error counts. Batches of 35 fit comfortably.

## History
**2026-09-27 (Brenden: "tag back to our roster and our site with keywords … standardize this for every blog"):**
- 2026 season, 140 posts: 130 tagged, 0 errors.
- 9 skipped for unpublished edits: halftime 17-6, Urquhart/Auburn, "14 Days In Gainesville", Auburn By the Numbers, "No sugar coating", "Putting things in perspective", "Reasons for optimism", "Day One Looks", "Sumrall exudes confidence". Tag them after their writers publish or discard their edits.
- Verified live on the Sumrall presser post: tags render as links to the tag pages, and `/tags/jadan-baugh` lists the posts.
- Older archive (4,400+ posts, previous rosters): not tagged. A current-roster match would mis-tag it.

**2026-09-27 10:53Z daily sweep (last 48 h, 15 posts):**
- 1 tagged: the CFB Saturday wrap (+4 tags).
- 13 already complete.
- 1 skipped for unpublished edits: the halftime story.
- The earlier 9 skips are unchanged; all still have unpublished edits.

**2026-09-28 10:52Z daily sweep (last 48 h, 21 posts):**
- 6 tagged: Missouri first look (+3), 10 Thoughts From the Sidelines (+4), Chomp Up the Charts (+2), Postgame Analysis (+4), Franz Beard's 28-points column (+4), and the halftime 17-6 story — now unblocked and tagged (+15, hitting the 30-tag cap).
- 15 already complete or nothing new to add.
- Retried the 9 earlier skips: 1 (Laura Rutledge / Carlton Reese "14 Days in Gainesville") now has no unpublished edits, but qualifies for no tags under the current rules (no roster/opponent name or football keyword in its opening) — resolved, not re-added to the skip list. The other 8 (Urquhart/Auburn, "14 Days In Gainesville" ESPN doc piece, Auburn By the Numbers, "No sugar coating", "Putting things in perspective", "Reasons for optimism", "Day One Looks", "Sumrall exudes confidence") still have unpublished edits and remain skipped.

Formatting is standardized separately: `design/post-normalizer-v1/` runs on every article page. It handles spacer lines, all-bold bodies, hand-made subheads, deck/lede lines and the typed-in byline.
