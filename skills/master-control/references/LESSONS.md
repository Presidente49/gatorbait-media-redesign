# Master Control Learned Lessons

These are recurring, evidence-backed failure patterns and operating lessons. A historical number is not current state; re-query it before using it as a present-tense fact.

## 1. One controller beats many cooks

Multiple models, tools, and automations are useful only when bounded.

The durable pattern is:

**one controller → bounded workers → one writer → external verification**

Do not reactivate FCC, n8n, extra model routing, or agent layers simply because they exist. Add a layer only when it has a defined job that improves cost, capacity, reliability, or scheduling.

## 2. Documentation drift is a production risk

GatorBait has repeatedly had repo docs, friendly names, automation mappings, and campaign descriptions become stale while live systems changed.

Rules:

- live provider state beats docs,
- read the object immediately before mutation,
- mutable state lives in CURRENT-STATE.md or provider APIs, not durable doctrine,
- label old plans historical instead of silently treating them as current,
- never force production back to an old document.

Known example: older repo text reversed the identity/status of the two Wix blog-email automations after troubleshooting. Another old runbook line described a campaign ID as an unsent pregame draft after that ID had later been used differently. This is why names and old campaign descriptions are not authoritative.

## 3. Friendly automation names are not identity

For Wix automations and similar workflows, use:

- automation/workflow ID,
- origin/type,
- message/action ID,
- live status/revision.

Never act only on the dashboard-friendly name.

## 4. Shared-layer fixes beat repeated page patches

A recurring white-band/footer problem was better solved with one shared footer-gap guard than many route-specific hacks.

General rule:

If the same defect appears on many pages, first find the shared responsible layer.

Do not accumulate dozens of CSS/DOM patches that later fight each other.

## 5. First paint must be stable

Historical flashing came from competing themes, opacity-zero boot behavior, and permanent rapid polling.

Do not restore:

- competing global themes,
- first-paint fades that hide content,
- 200 ms / permanent short-interval DOM patching,
- permanent observers for static problems.

Prefer scoped CSS, native behavior, deterministic startup, and fail-open presentation.

## 6. Mobile is a launch gate

Desktop approval is not launch approval.

Every meaningful visual change should check roughly 390 px and 430 px for:

- masthead/nav separation,
- overflow,
- headline wrapping,
- image crops/aspect ratio,
- 44 px controls where appropriate,
- forms/dialog dismissal,
- footer reachability,
- ad behavior,
- layout shift.

Text-bearing hero art must be checked in an actual small-screen render, not only at source resolution.

## 7. Images are part of publishing quality

Prominent Front Page stories without useful art look broken.

But fallback art must never introduce:

- wrong teams,
- wrong helmets,
- fake logos,
- invented faces,
- unrelated imagery.

Original reporting photography and accurate custom broadcast art are preferred.

## 8. Duplicate URLs split value

The Killing Fields story demonstrated that identical/similar content on multiple URLs can split:

- pageviews,
- comments,
- social/email traffic,
- search signals,
- attribution.

Canonical hygiene is a revenue concern. Consolidate duplicates and route all distribution to the canonical URL.

## 9. Reader quality can reveal hidden winners

Low raw reach does not mean bad content.

Some GatorBait stories showed low reach but several minutes of engagement and high deep-scroll rates. Those are underdistributed assets and should be considered for packaging/distribution tests.

Use age-adjusted reach plus engagement, not views alone.

## 10. Search impressions are inventory

When an existing page already ranks on page one but has weak CTR, title/meta packaging may be a higher-return action than publishing another similar article.

SEO work increases monetizable pageviews.

## 11. Email targeting can outperform raw list size

Recent campaigns showed that engaged/targeted cohorts can materially outperform generic broad sends.

Use:

**engaged test → measure → expand when justified**

Do not confuse "aggressive" with "send everything to everyone."

Consent and suppression status remain hard gates.

## 12. Contact capture without consent is a leak

A historical audit found many contacts stored with non-subscribed/NOT_SET status because signup/form configuration was inconsistent.

Re-audit forms periodically.

A valid email address is not permission to market.

## 13. Email automation quality matters

Past defects included subject/preview variables exposing bad text or raw image URLs.

Always preview:

- sender,
- subject,
- preview text,
- hero,
- CTA,
- destination,
- footer,
- mobile rendering.

## 14. Social metrics can lag

Wix/platform insight feeds do not always update immediately.

Do not treat missing/zero social metrics as proof of failure until the feed has had enough time to populate. Use GA4 UTM traffic as an independent check.

## 15. Attribution needs explicit ownership

A large block of GA4 traffic was classified as Unassigned even though most of it was identifiable Wix email traffic such as `so / mail` and `so / mail_lp`.

Always preserve raw source/medium, add explicit UTMs on new controllable links, and normalize owned-channel reporting carefully.

## 16. AdSense and Google Ads are different jobs

AdSense = GatorBait earns from publisher inventory.

Google Ads = GatorBait spends money buying traffic.

Do not install/buy Google Ads when the business objective is publisher monetization.

The existing public ads.txt publisher entry and Wix Monetize with AdSense app are part of publisher monetization.

## 17. Monetization must preserve UX

Unused desktop margin space can become inventory, but do not fill every blank pixel.

Measure:

- viewability,
- page RPM,
- engagement,
- pages/session,
- mobile Web Vitals,
- subscription conversion.

Remove placements that damage the larger business.

## 18. External revenue may be invisible to Wix

The ItemOrder merchandise shop lives outside Wix, so Wix-native revenue totals can understate company revenue and purchases may not fire Wix pixels.

Do not treat one dashboard's revenue total as the company ledger.

## 19. CI/monitoring itself can break

A production-health workflow previously failed because its required marker was stale, creating a false alarm.

Monitoring needs maintenance too.

When health checks fail, first distinguish:

- production failure,
- authentication/environment failure,
- stale test expectation.

## 20. Security and payments need periodic re-audit

A historical audit found a card-testing/fraud signature and public member-directory concerns.

These are not current-state claims. They are standing audit lanes:

- signup abuse,
- failed payment/card-testing patterns,
- chargebacks,
- public member exposure,
- login/account routes,
- payment security controls.

Never weaken controls to increase signup volume.

## 21. Human approval stays on genuinely consequential actions

Routine reversible production repair can be fast.

Money movement, destructive customer-data actions, domain/DNS changes, paid advertising, payment-policy changes, and materially risky public communications deserve explicit authorization.

## 22. Learning must be measured

Only promote a lesson into doctrine when it is:

- repeated,
- measured,
- or clearly structural.

Store one-off incidents as historical evidence, not permanent commandments.

When a rule becomes stale, update the rule rather than layering an exception forever.

## 23. Continuous learning must stay bounded

The controller should learn continuously from verified operating evidence, but learning is not the same as self-authorization.

Use a compact recursive loop:

**observe → verify → record → detect recurrence → review → promote → reuse**

Rules:

- record every health/incident cycle deterministically,
- count separate incident episodes instead of inflating a lesson from repeated polling of one outage,
- track recovery as evidence too,
- surface repeated patterns as review candidates,
- do not auto-promote candidates into doctrine,
- do not let learned state authorize production writes, spending, destructive actions, or public communications,
- keep the evidence store bounded so stale history does not become permanent context,
- promote only repeated, measured, or clearly structural patterns,
- retire or revise lessons when live evidence contradicts them.

A learning loop should reduce repeated mistakes and unnecessary work, not create another autonomous controller.


## 24. Preserve a known-good presentation baseline

When a production surface is visually stable, pin the exact presentation revision before further experiments.

For the GatorBait Front Page, do not mix CSS/JS refs from different commits, do not expose the retired Wix homepage shell underneath the newsroom surface, and do not stack new flash/jump patches over the known-good prepaint + mount sequence.

Content can remain live and dynamic while presentation assets stay pinned.

## 25. One trigger should have one outbound email owner

Two active automations on the same `wix_blog-new_blog_post` trigger create duplicate sends, conflicting links, and attribution noise.

Use stable automation IDs, not friendly names, and keep exactly one intended outbound story-alert workflow active.

## 26. Dashboard-managed Google tags should not be duplicated in custom code

If GA4/Google tagging is managed through Wix dashboard integrations, do not also inject manual `gtag.js`, Tag Manager, or parallel route-specific loaders.

Duplicate tag layers distort analytics and complicate consent/debugging. For AdSense, keep one verified loader only; do not add parallel loaders without measured evidence.

## 27. Persistent alerts need ownership, not repetition

Repeated scheduled checks of the same unresolved defect should not become repeated owner-facing alerts.

Use one persistent work item with current evidence, owner, next action, verification method and blocker. Update it only when the evidence, diagnosis, action or ownership materially changes. Notify Brenden only for a meaningful state change, verified repair, material revenue change, new revenue-impacting action or a real human blocker.

This turns monitoring into operations instead of notification noise.

## 28. Recursive quality control must be bounded

Recursive QC means re-reading live state and testing the previous outcome, not stacking patches.

For a meaningful change:

**observe → compare → diagnose → act once → verify primary → verify independently → record → recheck next cycle**

Keep one production mutation attempt per cycle. If verification fails, record the failure and escalate or wait for the next evidence cycle rather than layering another unverified fix. Reuse verified repairs before adding dependencies or new architecture.

## 29. Stabilization phase: design, operations and revenue

**Owner decision recorded September 23, 2026**, not a claim of an experiment proving causation: keep recursive learning focused on design, ops and how GatorBait makes money; settle the Magazine page instead of reopening the build.

Reuse the existing scheduled lanes and their cadence:

- **Design Review:** Magazine is the refinement priority. Preserve the approved free sports-news homepage and shared mobile shell. Research supports a concrete defect or business hypothesis, not another theme-shopping exercise.
- **Publishing & Email QC:** owns publication completion, freshness, canonical links, image quality and actual delivery evidence. A changed `lastPublishedDate` on the same post is not a new publication or resend trigger.
- **Revenue Watch:** owns monetization evidence and attribution. Separate advertising revenue, membership, merchandise and sponsor revenue; unavailable channels remain unknown. Compare like-for-like periods, story age and source coverage, including costs when available.
- **Trend Sweep:** support only these three focus areas with directly applicable maintenance/research; no generic new-stack recommendations. Existing editorial draft tasks are not cancelled by this focus decision.

Each meaningful iteration records the hypothesis, source/time window, baseline, smallest proposed change, owner, primary business measure, reader/consent guardrails and outcome: retain, reject, inconclusive or verified recovery. Do not relabel observational correlation as an A/B result. Promote repeated or structural lessons only after review; retire contradicted lessons. Leave healthy state alone.

Scheduled lanes remain read-only for live Wix, production assets and routing. They may research, prepare bounded proposals and record meaningful outcomes, not publish, send, deploy, change consent or self-authorize fixes. The active controller retains any authorized production write. No extra scheduler, duplicate issue or independent writer.

## 30. AdSense connection, serving, consent and revenue are separate gates

The September 23 incident in **issue #30** demonstrated why byte-equivalent loaders must be checked by content, not names. Disabling a duplicate reduced ownership ambiguity; it did not certify consent, all-page coverage, fill or revenue. A label such as "Verification" does not make an advertising-serving script essential.

Keep Wix as the single AdSense integration owner. Evaluate coverage across eligible editorial pages, including the public Magazine surface; "can be connected to every page" is a coverage goal, not evidence that each page serves an ad. Preserve existing account, checkout, consent and premium-access promises until separately reviewed. Do not force ads into excluded surfaces or add a repo-side loader.

Verify in order: current integration identity → consent behavior → public request/visible placement → actual impressions/revenue with post-change data coverage. A script or ad iframe alone does not establish a paid impression. Pre-change or stale GA4 zeros do not establish post-change failure. Track unresolved consent classification in the existing issue without repeated unchanged alerts.

Google's placement controls are documented at https://support.google.com/adsense/answer/9261307 and https://support.google.com/adsense/answer/9262311. Sitewide eligibility does not guarantee fill; evaluate page groups and reader experience rather than maximizing ad count everywhere.

## 31. Keep the accepted newsletter baseline; measure revenue separately

Brenden accepted the September 23 curated newsletter approach. Reuse that design and **GatorBait Magazine Newsletter** identity, with Buddy leading curated packages and distinct supporting stories. Do not redesign or resend merely to rename a sent edition.

Evidence is retained in issue #3, including comments 5802119540 and 5802940849. Its increasing unique engagement is a useful baseline, not proof that the template caused sales or outperforms every alternative. Preserve provider timestamps, unique-versus-total definitions, audience and delivered denominator; conflicting counts remain unresolved until reconciled.

A confirmed curated newsletter is not proof of automatic Story Alert delivery. Track post ID plus workflow/message/campaign identity. Keep unavailable triggered-email results **UNVERIFIED**, never fictional failures, and do not republish or resend as a diagnostic.

## 32. Magazine refinement needs a finish line

Refine the existing separate Magazine implementation under `docs/CREATIVE-DIRECTION-2026-09-23.md`; no replacement homepage, new theme stack or copy of each article.

Acceptance gates: current Buddy cover/lead; remaining Magazine stories newest-first; one canonical URL and primary editorial home; original photo credits and intentional portrait/landscape framing; readable mobile type; no orphan white boxes or duplicate story cards; one latest-game gallery at most; working article/Join/Store/TV paths; shared navigation/footer; and no new layout shift or overflow. Reserve intentional image/ad geometry without retaining broken-image or empty-card scaffolding. Any ad integration must pass consent and reader-experience checks through the existing Wix owner.

Verify the actual public Wix runtime at desktop and 390/430px where available. Isolated fixtures do not certify the full mobile shell, and logged-out reachability does not certify authenticated membership. Once acceptance is verified, record the exact approved revision and rollback and hold it. Later design changes require a demonstrated defect or measurable business case, not novelty.

## 33. Presentation embeds must stay consent category ESSENTIAL

On Sept. 26, 2026 the homepage (`fdc2127a`) and Magazine (`1dd74333`) embeds were PATCHed with `embedData.category: "FUNCTIONAL"` copied from the Wix API example. Wix defers non-essential embeds until its consent manager runs, so neither was server-rendered: the native Wix homepage/Magazine and native header painted for 1-2 s on phones before the custom surface replaced them. The first-paint probe (`automation/vision/first-paint.mjs`) measured it.

Every Update Custom Embed call must re-send the category read in the same GET, never a hard-coded one. First-party layout, routing and navigation code with no tracking is `ESSENTIAL`; only analytics/advertising tags use `ANALYTICS`/`ADVERTISING`.

## 34. Homepage controls must not be same-site links; test fixtures must use the real origin

On Sept. 26, 2026 the game-day "Rosters & numbers" control shipped as `<a href="https://www.gatorbaitmedia.com/_files/…pdf">` and relied on `preventDefault()` in a bubbling click listener to open the roster panel instead. The home core (`fdc2127a`) has a capture-phase click handler for no-jump navigation. It turns every same-site link to a non-home path into `location.assign()` with `stopImmediatePropagation()`. So live, the panel never opened: TinyFish's browser showed the PDF, and headless CI just downloaded it. The local fixture passed because it served the page from a test origin, which made the PDF link cross-site.

Any homepage control that opens something in place must be a `<button>`. Only real navigation belongs in `<a>`. Fixtures for interactive homepage features must serve the page on `https://www.gatorbaitmedia.com/` (Playwright route) with every home part loaded, and live QC should click the control, not just find it.
