# Facebook reels in the postgame magazine (Oct. 18, 2026)

Rollback (repo): revert this PR; the weekly and pregame bundles are unchanged.
Rollback (live, after a later loader swap): re-pin embed 1dd74333 to the previous loader sha (563fe3bc, PR #353).
Not applied: no Wix write, no loader swap. Game story fc2ce412 change is prepared in `game-story-fc2ce412-watch-patch.json`.
Credit on each reel: "Video: Muse Made Media / GatorBait Media" (per Brenden). Photo credits to UAA/Hannah White unchanged.
Posters are static files in `sports-live/reels/` (fbcdn og:image URLs are signed and expire); the bundle resolves them from its own jsDelivr-pinned path.
Update (Oct. 18, PR stacked on this one): Sumrall card switched to YouTube JexQFsm_wts (youtube-nocookie iframe on tap); Baugh stays Facebook. See `deploy/yt-sumrall-20261018/`.
