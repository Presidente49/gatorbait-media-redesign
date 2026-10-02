# Magazine reader upgrades

Owner authorization: implement the discussed magazine ideas now. Scope is the magazine only, based on live embed revision 55 and immutable source 2898f1b2755eb8adf41825fe274929695a43015c. Preserve Swamp Night, one site logo, Buddy first, six complete articles, actual dates/bylines and existing roster links.

Candidate build: 929bf23b. Remote source commit: b7ddf5f33d68b7ab7b88616c2533006a7c207d82. CDN SHA-256 equals the local bundle: 719be31b270d8b5eef013144ea0bc15c3e90ec3971f5d0f6c3aa58518c92d414.

Implemented:
- Edition-local Reading Passport. It records a story ending only after its heading was encountered and its ending remained visible for two seconds in a visible tab. This is an ending reached signal, not proof of comprehension or engaged reading time. Storage stays in the reader's browser; unavailable storage leaves ordinary contents navigation intact.
- Cover uses overlapping grid cells, allowing the text to grow instead of clipping inside a fixed absolute overlay. Swamp Night styling and real photography remain.
- Five verified inline image credits. Buster's composite preserves Chris Spears/GatorBait Media and UAA component attribution. Woods' existing graphic credit moves into figcaption.
- Buddy's article-end watch action goes to the owner-approved Buddy Martin Show live destination; subscribing remains separate. A matching exact episode can be supplied through `showEpisode: {show,title,url}` with a full YouTube watch URL. No unverified Lowdown episode/playlist is invented.
- Five Beats renderer contract: `fiveBeats: {approved:true,title,photos:[five entries]}`. Every entry needs an image id/ext, descriptive alt, factual caption, credit and an existing on-site `sourceUrl`. Unapproved, incomplete or unattributed sets do not render. This edition does not yet contain an approved five-image package.
- Full-story print treatment and internal contents anchors retained. No email is sent.
- Build now fails when canonical title, published version or normalized body differs. Six current Wix payloads were freshly retrieved before this candidate; a seeded factual correction was rejected. Refresh the snapshot from Wix before future releases; the saved payload cannot by itself establish future freshness.

Validation: syntax, deterministic build check, 6/6 canonical copy/version parity and seeded correction rejection pass. GitHub browser-QC candidate step passed at 320/390/430/1366 pixels using one bundle: six articles, five figcaptions, no horizontal overflow, cover growth under enlarged text, progress and reload persistence. The PDF is exported by the same run. Artifact visual inspection and final live-state check follow before release. Local browser execution was blocked by socket permissions; source/CSS inspection is not reported as mobile rendering.

Research checked October 1, 2026: Sports Illustrated's Digital Covers pairs photography-led feature packages with named writers and clear narratives (recent September 25/24/22 stories); The Players' Tribune separates featured stories, visual stories and editor's picks. These are design benchmarks, not a verified number-one popularity ranking. No publisher assets or code were copied.

- https://www.si.com/digital-covers
- https://www.theplayerstribune.com/
- https://developers.google.com/search/docs/appearance/ai-features
- https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/

Product hypothesis: a recognizable edition cover, complete readable stories and clear continuation will improve next-article clicks and satisfaction. Baseline analytics are unknown. For a later measured comparison, establish the baseline and sample size first, then precommit a test for a 10% relative increase in next-article click rate without lower satisfaction or active reading time. No traffic lift is claimed from a design change alone. Search clicks, observed AI citations and AI-referred visits remain distinct; Bing account access is unverified. No extra AI markup, duplicate Wix Article schema, robots or canonical settings are introduced.

Release: preserve the exact revision-55 embed as rollback. Read the current embed immediately before patching; abort on any unexpected pointer or revision. Change only the magazine's immutable source pin after reviewing proofs. No homepage, payment, paywall or account-permission changes.

## Verified release

Wix embed revision 56 is enabled and pins the tested commit above. Fresh public response `/magazine?gbm-qc=929bf23b` renders build 929bf23b, six complete stories, five inline figcaptions, both Buddy watch links to `/live`, and no horizontal overflow at desktop. The ordinary URL in the existing browser still serves cached build acb63378; record this as propagation/cache lag, not as a fully converged live rollout.

Candidate proof artifact 11205377641 from run 36954825616 passed all four browser sizes, correction gate and template contracts. PDF inspected: 21 pages, all six images, five visible inline credits, six contents links to resolved internal story destinations. Cover fits on PDF page 1. Screenshot review caught and corrected inherited two-column cover styling before release. No claim of measured reader lift.

Separate production audit in first run 36954279862 failed four checks because the existing cookie-consent panel overlapped the first headline. These failures occurred on the pre-release live build; no privacy panel settings were changed in this magazine patch. Keep this separate from candidate browser QA success.
