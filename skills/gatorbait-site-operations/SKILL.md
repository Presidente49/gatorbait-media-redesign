# GatorBait Site Operations Skill

## Purpose

Use this skill whenever working on the live GatorBait Media website, newsroom, magazine, member experience, article routing, newsletter acquisition, author-follow UX, or related Wix/GitHub production code.

The goal is not redesign for redesign's sake. The operating priorities are:

1. Protect production stability.
2. Improve mobile first.
3. Protect revenue and subscriber retention.
4. Keep the site fast, current, and easy to understand.
5. Avoid duplicate or conflicting Wix layers.
6. Make one clear editorial home for each story.
7. Prefer low-cost/native solutions over new paid services.

## Production source of truth

The live homepage newsroom is driven from GitHub Pages using these repo files:

- `newsroom-preview/wix-live.css`
- `newsroom-preview/wix-live.js`
- `newsroom-preview/wix-live-ui.css`
- `newsroom-preview/wix-live-ui.js`

The Wix custom embed that loads them is:

- `GBM - Standalone Newsroom Live v1`

The anti-flash/prepaint embed is:

- `GBM - Newsroom Prepaint Guard v1`

Treat these as production-sensitive.

## First rule: inspect before layering

Before adding CSS, JS, embeds, or a new visible component:

1. Inspect all enabled Wix custom embeds that can affect the same page.
2. Identify whether an older implementation is still active underneath.
3. Disable or repurpose superseded behavior instead of stacking another layer over it.
4. Verify whether Wix native page content is still painting before the custom layer mounts.
5. Check the repo source of truth before editing live Wix embeds directly.

Do not solve a visual conflict by adding increasingly stronger CSS unless the underlying conflicting layer has been identified.

## Wix API discipline

For Wix work:

- Read Wix tool guidance first.
- Discover and confirm exact API methods from current Wix documentation before calling them.
- Do not guess endpoints, request shapes, response fields, filters, or revision requirements.
- Use read-only probes to resolve IDs/state before any mutation.
- Never use speculative writes to learn an API shape.
- When updating custom embeds, preserve the current revision and required fields.
- Wix custom embed HTML has a practical 15 KB limit; if an update exceeds it, compress or split behavior instead of repeatedly retrying an oversized payload.

## Live-write coordination

GatorBait uses more than one AI/agent. The shared coordination thread is GitHub Issue #3.

Before any meaningful production write that could overlap another agent:

1. Read the latest coordination comments.
2. Confirm ownership of the area being changed.
3. Avoid modifying production files another agent is actively editing.
4. Post a concise handoff after substantive production changes.

Production stability wins over agent autonomy.

## Anti-flash rule

The native Wix homepage exists underneath the standalone newsroom. If it paints before the newsroom mounts, visitors see a flash of the old site.

Required behavior:

- Hide native Wix homepage content during first paint.
- Show a neutral white background while booting.
- Reveal only the standalone newsroom once it exists.
- Include a fail-safe so a real newsroom load failure does not leave a permanent blank page.
- Remove homepage-only boot classes when navigating into article/member pages.
- Do not reinject the newsroom script unnecessarily on internal navigation.

Whenever a user reports flashing, inspect page visibility/mount timing and enabled embeds before changing ordinary typography or layout CSS.

## Mobile-first acceptance checklist

Every production visual change must be checked conceptually for at least:

- ~320 px width
- ~375/390 px width
- ~430 px width
- tablet width
- desktop

Mobile requirements:

- No horizontal overflow.
- Headlines never escape cards.
- Long titles wrap naturally and remain readable.
- Minimum practical tap targets around 44 px.
- Primary buttons should not become tiny side-by-side controls on narrow screens.
- Dense multi-column blocks collapse cleanly.
- Images use deliberate mobile crops, not accidental center crops.
- Magazine galleries may use horizontal snapping/swiping rather than creating a very long page.
- Footer/logo remain centered and legible.
- No follow/alert pill or account control should dominate a story card.

When desktop already looks good, prefer targeted responsive rules rather than restyling the entire component.

## Homepage editorial role

The Front Page is for timely journalism:

- breaking news
- game results
- previews
- injuries
- recruiting
- statistics / by-the-numbers
- immediate analysis
- time-sensitive team developments

The homepage feed must prioritize newest qualifying stories and should not be cluttered by long-form magazine features.

## Magazine editorial role

The Magazine is for content with shelf life:

- Buddy/Franz/Eddie columns
- history
- nostalgia
- profiles
- photo-driven features
- essays
- long-form storytelling
- stories that still read well a week later

A story should have one primary editorial home. Avoid duplicating the same feature prominently on both the Front Page and Magazine.

If classification is ambiguous, recommend a placement instead of silently guessing.

## Magazine design system

The Magazine should match GatorBait as a brand while behaving like a real publication.

Use:

- same GatorBait logo family
- same navy / orange / white palette
- same core typography language
- same site-level header/footer family

But the Magazine itself should be cover-first, not another article grid.

Preferred structure:

1. One dominant digital cover image.
2. GatorBait Magazine masthead.
3. Current edition/date language, not internal CMS tag jargon.
4. Main cover story.
5. Clickable secondary cover lines placed like real print cover teasers.
6. Reference links such as Current Roster, Schedule, and Latest Game Photos.
7. Print edition / magazine subscription commerce area.
8. Past issue archive as covers, not a generic feed.
9. One latest-game gallery only when usable fresh media exists.

Do not expose internal taxonomy such as `12.2` as consumer-facing issue language unless it has genuine editorial meaning.

## Magazine gallery rule

Do not accumulate endless galleries.

- Keep one gallery for the most recent game with a usable photo/video set.
- Replace it when a newer usable game set arrives.
- If no fresh media exists, omit the gallery rather than showing stale content just to fill space.
- Gallery content should link back into relevant coverage where useful.

## Schedule and roster rule

The Magazine is a good permanent home for reference links.

Prefer stable, current destinations for:

- Current Florida football roster
- Current Florida football schedule

Do not revive stale hand-maintained homepage roster/schedule blocks unless there is a strong product reason. A current authoritative destination is better than a visually pretty but stale table.

## Newsletter acquisition lightbox

The newsletter prompt should be useful, not annoying.

Preferred behavior:

- Homepage only.
- Delayed trigger around 30 seconds.
- One obvious CTA.
- One obvious close `X`.
- Suppress for likely signed-in members.
- Suppress after the visitor has already chosen signup in that browser.
- After dismissal, suppress for about 30 days.
- Never show multiple newsletter/lightbox systems at once.
- Keep marketing consent language explicit.

Important limitation: anonymous cross-device recognition of an existing email subscriber cannot be guaranteed from browser-only code. Do not claim otherwise. For true CRM-aware suppression, use an authenticated/server-side identity path.

## Membership and cancellation UX

Membership management must be obvious.

Provide clear language such as:

- Manage Membership
- Billing & Cancellation
- Cancel Membership / Stop Renewal
- Newsletter Unsubscribe

Do not bury cancellation behind vague account labels.

Paid membership cancellation and marketing-email unsubscribe are separate actions and must remain separate.

Before changing plan behavior, inspect actual Pricing Plans state. Do not assume every plan has self-cancel enabled.

## Writer follow UX

Writer follow belongs near the writer/article experience, not on homepage cards.

Homepage cards should remain clean:

- image
- writer name
- headline
- date / concise metadata

On article pages, a small follow control near the byline may offer:

- Follow on GatorBait
- Email alerts
- Text alert opt-in

Following a writer is not the same as granting marketing email/SMS consent. Keep those choices separate.

## Article card rules

- Never repeat the writer name twice on the same card.
- Long titles must not overflow.
- Smaller cards use smaller headline sizing than lead stories.
- Avoid giant controls or pills inside cards.
- Preserve consistent card rhythm on mobile.

## Revenue / commerce principles

GatorBait Magazine is intended to become a distinct revenue line with:

- digital magazine value
- print-on-demand editions
- magazine-only subscriptions
- collectible back issues

Use existing Wix/store/payment infrastructure when practical.

Keep magazine revenue distinguishable from general site membership so performance can be measured.

Do not weaken payment/fraud protections in pursuit of conversion.

Do not introduce new recurring SaaS costs without a clear need.

## Print-on-demand implementation rule

Do not expose a fake purchase button.

Until a real print product, price, checkout, fulfillment path, and shipping behavior exist, label the control honestly as launch/waitlist/coming soon.

Once a real product exists, wire the button directly to the confirmed store/payment flow.

## Current contact/compliance consistency

Public-facing contact/footer information should stay consistent across visible pages, metadata, and schema.

When a mismatch is found, verify the intended current value before changing every location.

Do not hide cookie/consent UI blindly. Fix persistence/duplication rather than defeating compliance.

## Safe production change workflow

For a production change:

1. Identify the exact user-visible problem.
2. Locate the current production source.
3. Inspect competing Wix embeds/layers.
4. Make the smallest change that fixes the problem.
5. Preserve the existing look when the user already likes it.
6. Add targeted mobile rules.
7. Bump cache/version references when GitHub Pages assets changed.
8. Verify navigation state and first paint behavior.
9. Check that article pages/member pages still render.
10. Post a concise coordination handoff for other agents when relevant.

## Rollback principle

Prefer changes that are easy to reverse:

- repo commits
- isolated custom embeds
- versioned asset URLs
- clearly named superseded embeds kept disabled

Never delete the only known-good production implementation just to clean up the dashboard.

## Known failure modes from prior work

Watch specifically for:

- old Wix page flashing under custom newsroom
- stale browser/CDN asset caching
- multiple active embeds changing the same page
- homepage story cards showing duplicated writer names
- giant follow controls breaking card layout
- small-card headlines overflowing
- internal issue/tag names leaking into consumer-facing copy
- newsletter prompts firing too often
- old Wix newsletter prompt plus custom newsletter prompt both appearing
- member-area links going to 404s
- magazine becoming a second homepage instead of a distinct product
- Wix embed update rejected because the HTML payload exceeds the embed limit

## Definition of done

A GatorBait site task is not done because code was written.

It is done when:

- the correct production source was changed,
- conflicting layers were checked,
- the user-facing result matches the intended design,
- mobile behavior is sane,
- no stale/duplicate content was introduced,
- revenue/subscriber UX was not harmed,
- compliance choices were preserved,
- and another agent can understand what changed from the repo/coordination thread.
