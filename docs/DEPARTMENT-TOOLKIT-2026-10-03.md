# Department toolkit: new tools and skills, by department (Oct. 3, 2026)

Brenden, Oct. 3: "evaluate new tools and skills and give them to all departments." This note updates `deploy/dept-ideas/TOOLS.md` (the Sept. 30 inventory) with what the account added since, what each department should use, and what is ruled out.

Status key: **proven** = a real read-only call was made in a session this week; **listed** = the connector or skill is in the account but nobody here has called it yet. Listed does not mean tested. First use should be one read-only call, recorded in the department's notes.

## Where the "Jarvis interface" lives in the repo

There is no single file named for it. The pieces are:
- **The Control Room** (Claude artifact, linked from `skills/master-control/references/CURRENT-STATE.md`): chat, asks, department board, numbers. Its data lives in the artifact's own database, not the repo.
- **`automation/ops-hub/agents/*.md`**: eight director roles (community, creative, editorial QA, marketing, merchandise, model router, revenue, subscriptions).
- **`automation/ops-hub/playbooks/iphone-control.md`** (branches `master-control-iphone` and `master-control-mobile-bootstrap`, not on main): an optional, bounded way to drive Brenden's own iPhone from the Mac. Not used today. Brenden talks to Jarvis from the Claude app.
- **`deploy/dept-ideas/`**: the twelve department builds and the tool brief.

## New or newly relevant connectors

| Tool | Status | Give it to | Use |
|---|---|---|---|
| **Mobbin** (search_screens, search_flows) | listed | Design, Web | Real app and site patterns for the scoreboard, message board and signup flows, before building. |
| **Mermaid Chart** | listed | Ops, Design | Diagrams for runbooks and the department map. |
| **Microsoft Learn** | listed | Web | Docs lookup only. Low value for this site. |
| **ClickHouse** | listed, no database connected | none now | Would suit large analytics later. Skip until there is data to put in it. |
| **Netlify** | listed | none | The repo + GitHub Pages + Cloudflare is the stack. Do not add a host. |
| **Adobe Experience Manager** | needs sign-in | none | Enterprise CMS. Not relevant. |
| **PDF Viewer** | listed | Magazine, Outreach | Preview the printable Magazine and proposal PDFs. |
| **GoDaddy** | listed | none | Domains and DNS are off limits without Brenden. Look-ups only. |
| **Expedia, Spotify, Vanguard, Learning Commons, B12, Webflow, WordPress.com** | listed | none | Not relevant to the business, or a competing site builder. |
| **Shopify** | listed | Revenue (read only) | Store reads only. No pricing changes. |
| **Idiolect** | listed | Writing | Learn Buddy's and Franz's voices from their own columns. Drafts only, always reviewed. |

Unchanged from the Sept. 30 inventory: Canva, vidIQ (zero credit balance), Descript, Metricool (for-review scheduling only), Cloudflare (reads proven; deploys through the PR #118 workflow), Figma, HyperFrames, Adobe for creativity, OpenRush, Exa, PostHog, Supermetrics, Windsor, Perspective AI, TinyFish (fetch only), Google Drive, Gmail, Calendar.

## Skills

| Skill | Give it to | Use |
|---|---|---|
| **gatorbait-writer** | Writing, Desk | Gamers, quick updates and news pieces in house voice, with the confirm-before-final rule. |
| **gatorbait-site-ops** | Web, Jarvis | Wix API fixes and audits without burning context. |
| **dataviz** | Stats, Design | Charts and stat tiles that read the same in light and dark. Use it for any new stats visual. |
| **pdf** | Magazine, Outreach | Printable full-issue PDFs and proposal PDFs. |
| **pptx** | Outreach | Sponsor and partner decks (Back Porch, betting-zone pitches, once approved). |
| **xlsx** | Revenue, Ops | Counts-only reports. No dollar figures or subscriber data in the repo. |
| **docs** | Everyone | Shareable write-ups people can comment on. |
| **canvas-design, theme-factory** | Design | Static art and themed pages, inside the Barlow-only and Swamp Night rules. |
| **artifact-design, artifact-capabilities** | Jarvis, Design | Control Room and any new internal page. |
| **skill-creator, mcp-builder** | Ops | Turn a repeated job into a skill. Build an MCP only for a defined job. |
| **internal-comms** | Ops | Handoffs and incident notes. |
| **algorithmic-art, slack-gif-creator** | none | Not useful here. |

## By department

| Department | Toolkit |
|---|---|
| **Game-day desk** | gatorbait-writer, Exa, TinyFish fetch (ESPN JSON), Canva for score cards, Descript for presser transcripts. |
| **Stats** | dataviz, TinyFish fetch (ESPN), the stats pipeline in `automation/`. |
| **Design system** | Mobbin, Figma, Canva, theme-factory, canvas-design. |
| **Writing and editorial** | gatorbait-writer, Idiolect, Descript (show to column), Exa. |
| **SEO** | OpenRush, Exa, PostHog (check the snippet first). |
| **Social** | Canva, Metricool (for-review only), vidIQ once credits return. |
| **Outreach (Back Porch)** | pptx, pdf, PDF Viewer, docs. |
| **Web and ops** | gatorbait-site-ops, Mermaid Chart, skill-creator, Cloudflare reads. |
| **Jarvis** | all of the above, plus the Claude Code Remote tools. |

## Rules that do not change
No list emails without Brenden. No automation switches. No payments, DNS or account connections. No deleting live content. Barlow only. AP style. Stats from ESPN or FloridaGators.com. No dollar figures or subscriber counts in the repo. Every live write is claimed in #34 first.

## How departments pick this up
Each department reads this file on its next wake. Nothing was pushed into running sessions during game day. Jarvis keeps the per-department summary on the Control Room board.
