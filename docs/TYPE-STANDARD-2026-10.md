
## 8. Before and after

`docs/type-audit-2026-10-07/` holds live-page captures (390 px phone profile, 1365 px desktop). `before/` is the live site at 14:21Z. `tier-a/` and `tier-b/` are the same live pages with the proposed stylesheet injected in the browser (`assets/sitewide-type.css` and `assets/sitewide-type-condensed.css`) and the drop-cap fix simulated; nothing was written to production. Raw numbers: `qa/type-audit` branch (`type-audit.json`, run of 15:27Z).

| Shot | before | after |
|---|---|---|
| Homepage 390 | `before/home-390-top.jpg` | `tier-b/home-390-top.jpg` |
| Homepage 1365 | `before/home-1365-top.jpg` | `tier-b/home-1365-top.jpg` |
| Magazine 390 | `before/magazine-390-top.jpg` | `tier-b/magazine-390-top.jpg` |
| Magazine 1365 | `before/magazine-1365-top.jpg` | `tier-b/magazine-1365-top.jpg` |
| Latest 390 | `before/gatorbait-media-blogs-390-top.jpg` | `tier-b/gatorbait-media-blogs-390-top.jpg` (Condensed) and `tier-a/...` (unchanged headline, Barlow banner) |
| Corn Dogs column body 390 | `before/the-college-football-crisis-corn-dogs-vs-390-body.jpg` | `tier-a/...-body.jpg` (dek in Condensed 700, no hybrid, no drop cap because the first body paragraph opens "I'm") |
| Thoughts of the Day, Oct. 7, drop cap | `before/thoughts-of-the-day-october-7-2026-390-dropcap.jpg` | `tier-a/...-dropcap.jpg` (lede 18.5 px, same cap) |

Measured with the stylesheet injected (run of 15:27Z), text nodes by family, home at 390: Tier A 89 Condensed / 215 Barlow / 0 other; Tier B 191 / 114 / 0. Magazine at 390: Tier A 34 / 206; Tier B 101 / 136. Post bodies: one family and size per width on every post; the Corn Dogs dek is Condensed 700 at 25 px (phone) and 30 px (desktop). The cookie banner, signup card and comment widget render Barlow with either tier. **Not yet verified:** the tag chips (`nav[tag-cloud-root] a`, Proxima Nova) still rendered Proxima in the 15:27Z run because the selector required a class on the `li`; the corrected selector is in both stylesheets and needs one more audit run after the desk applies the link pin.
