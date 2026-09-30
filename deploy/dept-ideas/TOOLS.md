# GatorBait tool inventory (round two brief)

Brenden, Sept. 30: round one was mostly mockups. "They need to go back and push themselves with it. Look in the repo. Find some tools. Unacceptable."

Round two rule: **a pitch is a thing that works, made with a tool from this list, with evidence of the tool call.** A CSS mockup of a feature is not a pitch. A pitch with no tool behind it is not a pitch.

## What is already built in the repo (use it, extend it)

| Asset | Where | What it does |
|---|---|---|
| Front page renderer | `sports-live/src/front-page.{js,css}`, `front-page.config.json`, `build-front-page.mjs` | The live homepage (Swamp Night, The Road Ahead, The Tunnel). Deployed by editing `sports-live/current.json`; jsDelivr serves `homepage.js` at that commit. New homepage modules go here. |
| Scoreboard feed | `sports-live/scoreboard.json`, `automation/scoreboard_feed.py`, `validate_scoreboard.py` | ESPN-sourced record, rank, schedule, next game, live phase. Refreshed by the game-day desk. |
| Story feed | `gazette-live/posts.json`, `automation/update_newsroom_feed*.py`, `.github/workflows/refresh-newsroom-feed.yml` | Newest stories with author, excerpt, image, URL. Served from GitHub Pages. |
| Magazine + article runtime | `automation/site-design/magazine.{js,css}`, `blog.css`, `shared-header.js` | Magazine page and article-page code already on Wix. |
| Live screenshots | `.github/workflows/live-shots.yml`, `automation/vision/live-shots.mjs` | Real-browser shots of production at any width; push a `shots/**` branch with `automation/vision/live-shots.request.json`. Results on branch `qa/live-shots`. |
| Live QC | `automation/vision/live-qc.mjs`, `live-presentation-qc.yml` | Presentation audit of home, magazine, article at 320/390/430/1365. |
| Newsletter stack | `automation/newsletter/*` | Render preview, link check, unique-image check, stack policy. |
| Ops hub | `automation/ops-hub/{controller.py,policy.json,controller-rules.json,playbooks/,agents/}` | Controller rules, playbooks (restream-clips-first, social-and-show-clips, production-toolchain, subscriber-winback, game-day-photo-ingest, email-template-library, digital-magazine-and-print). |
| Skills | `skills/gatorbait-{editorial,agency,graphic-design,broadcast-graphics,community,site-operations}` | Juice (editorial), Agency (marketing), AP Mode (broadcast graphics), Community (Discourse spec, GatorBot rules), Flaco (site ops, MOBILE-QC). |
| Show assets | `automation/ops-hub/show-assets/*.json` | Structured show/guest records (e.g., Laura Rutledge replay). |
| Wix APIs | via `mcp__Wix__*` (docs + ExecuteWixAPI) | Custom embeds, blog, data collections, members, groups, pricing plans, site SEO. Read freely; writes only through Jarvis with #34 scope. |

## Connectors on the account (call them; prove access with one read-only call)

| Tool | Best for | Notes |
|---|---|---|
| **Canva** | social cards, thumbnails, brand templates, autofill from data, export PNG/PDF | `create-design`, `generate-design`, `autofill-design`, `export-design`, `list-brand-kits`. Designs in the account are private until shared. |
| **vidIQ** | YouTube/Shorts: `generate_clips`, `generate_thumbnail`, `score_title`, `score_thumbnail`, `keyword_research`, `outliers`, `channel_analytics`, `video_transcript`, `generate_video_chapters`, `voiceover_generate` | Read the Buddy Martin Show channel data first. No publishing. |
| **Descript** | show transcript → column, clip by text, `prompt_project_agent` (Agent Underlord), `export_transcript` | Restream feeds Descript per the clips playbook. |
| **Metricool** | `getBestTimeToPostByNetwork`, `getAnalyticsDataByMetrics`, `getScheduledPosts`, `createScheduledPostForReview` | Read analytics. Scheduling only as "for review", never live. |
| **Cloudflare Developer Platform** | Workers, KV, D1, R2 | Real backend for live polls, chat, counters, presence. `workers_list`, `kv_namespaces_list`, `d1_databases_list` are read-only proofs. Creating a KV/D1 in the account is reversible and fine; deploying a Worker needs Jarvis. |
| **Figma** | `use_figma`, `create_new_file`, shaders, `export_video`, design systems | Motion/design systems, broadcast graphics. |
| **HyperFrames by HeyGen** | HTML → rendered MP4 (`compose`, `render_video`) | Programmatic video: scoreboard recaps, countdowns, story cards to video. |
| **Adobe for creativity** | Express designs, Firefly boards, image tools (remove background, expand, vectorize), fonts, PDF tools, `video_create_quick_cut` | Call `adobe_mandatory_init` first. |
| **OpenRush** | `audit_site`, `inspect_serp`, `research_keywords`, `inspect_page`, `inspect_ai_visibility`, `discover_competitors` | Real SEO data for gatorbaitmedia.com. |
| **Exa** | `web_search_exa`, `web_fetch_exa`, `agent_run` | Research with citations; works from this container. |
| **PostHog** | product analytics, session recordings, surveys, feature flags, heatmaps (`exec`) | On-site behavior if the snippet is installed; check first. |
| **Supermetrics** / **Windsor.ai** | Facebook, Instagram, YouTube, GA4, Search Console data | Read audience numbers; do not commit dollar figures or subscriber counts. |
| **Perspective AI** | AI-run fan interviews and conversational surveys, embeddable | Fan research, "ask the readers" at scale. |
| **Idiolect** | learn a writer's voice from samples, `write`/`rewrite` in it | Buddy's voice from his columns (repo `gazette-live/posts.json` excerpts + Drive). |
| **Wispr Flow** | Brenden's voice notes and meetings (`search_scratchpad_notes`, `search_meetings`) | Turn dictated ideas into drafts. |
| **Google Drive / Gmail / Calendar** | archives, photos, drafts, schedule | Gmail: drafts only. Drive: read. |
| **Notion**, **Miro**, **Claude Docs** | planning boards, docs | |
| **Shopify** | store, products, discounts, orders | Read only; no pricing changes. |
| **Base44 / Lovable / Replit / Macaly / Onepage / Webflow / WordPress.com** | app builders | Only if a hosted app is genuinely the right home; default is the repo + Pages + Cloudflare. |
| **Hugging Face** | models, Spaces | Niche. |
| **GitHub** (`mcp__github__*`) | issues, PRs, Actions | Post nothing to #34 yourself; Jarvis does. |
| **Claude Code Remote** | `create_trigger` routines (scheduled runs), `send_later` | Ops automation. Do not create triggers in round two; propose the cron and prompt. |

## Known dead ends this session
- TinyFish wallet is negative: `fetch_content` only, no automation runs.
- OpusClip MCP needs a Pro/Max plan; treat as unavailable.
- Restream MCP and wix-mcp-remote fail to connect from this container (proxy 403). Restream Clips still exists as the playbook's clip source; say so, do not call it.
- `wix-editor-local` tools exist only on Brenden's Mac.
- Direct HTTP to ESPN and gatorbaitmedia.com is blocked here; use `sports-live/scoreboard.json`, `gazette-live/posts.json`, Exa, or TinyFish `fetch_content`.

## Hard rules for every department
1. One idea. It must run on at least one tool above, and you must have made a real call to that tool (read-only or in-account create) and recorded the call and result in PITCH.md under **Evidence**.
2. Deliver a working thing, not a picture of one: a Canva design ID and exported PNG, a vidIQ job result, a Worker + KV schema with a local test, a Descript transcript export, an OpenRush audit with the numbers, a HyperFrames project, a Figma file link, a front-page module that builds and passes `node sports-live/qa-front-page.mjs`.
3. Never: subscriber sends, scheduling or publishing posts, payments/pricing, DNS, Meta/Google account connections, deleting anything, deploying to Wix or Cloudflare, posting on GitHub. Creating private designs, projects, boards, KV namespaces or files inside our own accounts is fine; say what you created so it can be cleaned up.
4. Barlow / Barlow Condensed only. AP style. Stats from ESPN or FloridaGators.com only (the scoreboard feed is ESPN). No dollar figures or subscriber counts in any file.
5. PITCH.md headings, exactly: `# <Idea name>` then `## The idea`, `## Why it matters`, `## Evidence` (tool calls made, IDs, results, links), `## What it needs from Brenden`, `## Risks`. Under 1,200 words.
6. preview.html (optional, under 12,000 chars) shows the real output (exported image as a link or data URI, real data, real transcript), not fictional content.
