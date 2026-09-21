# Incident — homepage flipping between layers — 2026-09-21

## Summary

The newsroom loader was re-enabled on the live homepage after a measured fix to
its suppression loop. The homepage then flipped visibly between the native Wix
site and several other renderings. The embed was disabled again within minutes.

The fix was real and measured. It addressed the wrong problem.

## Timeline (UTC, 2026-09-21)

| Time | Event |
|---|---|
| ~19:0x | Embed `fdc2127a` updated to revision **37**: fixed UI script inlined, `enabled: false`. Write verified byte-identical, 9,924 of 15,000 chars. |
| ~19:1x | Revision **38**: `enabled: true`. |
| ~19:2x | Owner reported the homepage "jumping hard-core between the Wix site and three other things". |
| ~19:2x | Revision **39**: `enabled: false`. Site returned to its prior state. |

No content, post, member or setting was altered. The only mutation was this
embed's HTML and its enabled flag.

## Root cause

**Six scripts were rewriting the same homepage.**

An audit of the 10 enabled custom embeds found five that mutate homepage
structure, before the newsroom loader was added as a sixth:

| Embed | Touches | Observers | Late timers |
|---|---|---|---|
| Compact Optimized Logo + Header v11 | `SITE_HEADER`, hides elements | 1 | 12s |
| Light Theme v1 | `SITE_PAGES`, `SITE_HEADER`, hides elements | — | — |
| Sports Feed Cards v10 | `SITE_PAGES`, `SITE_HEADER` | 1 | 10s |
| Compact Mobile Typography v3 | `SITE_PAGES`, `SITE_HEADER` | — | — |
| Site Fixer v7.1 | injects content | 1 | 1.5s, 3.5s, 15s |
| Policies & Compliance v1 | adds `gbm-legal` | 1 | 2.2s, 15s |

Four MutationObservers and six delayed re-injections, all on one page.

These five style the **native Wix homepage**. The newsroom loader **replaces**
the native homepage. They are two mutually exclusive strategies for the same
surface. Running both guarantees visible flipping regardless of how well either
is implemented.

This violates the standing rule in `CLAUDE.md`: *one production writer*.

## Contributing cause

Two of the conflicting embeds — Logo + Header v11 and Sports Feed Cards v10 —
were re-enabled earlier the same day while restoring a missing logo. They were
restored into a homepage that was about to receive a full replacement layer,
and no check was made for whether the two strategies could coexist.

## What the fix did and did not do

The suppression fix was correct on its own terms. `suppressAppInvite()` read
`innerText` on every element in the body, forcing a synchronous reflow per
element, on seven timers out to 60 seconds. Replacing it with a `TreeWalker`
over text nodes reading `textContent` measured **154.7ms → 5.2ms per pass, a
29.7× improvement**, hiding the same element.

That work stands. It was never the cause of what the owner saw.

## Lesson

**A component measured in isolation is not a verified system.**

The benchmark ran against a synthetic 6,008-element DOM with no other embeds
present. It proved the function got faster. It could not have revealed that
five other scripts were competing for the same page, because none of them were
in the test.

## Rule

Before enabling any embed whose scope is the homepage:

1. List every enabled embed and check which reference `SITE_PAGES` or
   `SITE_HEADER`, add a root class, or install a `MutationObserver`.
2. Confirm **exactly one** enabled embed owns homepage structure. A replacement
   layer and a native-homepage styling layer must never both be on.
3. Enable the change with `enabled: false` first, verify the stored HTML, then
   flip — as was done here. That part worked and should stay.
4. Treat a live report from the owner as the verification of record. An API
   read-back confirms what was written, never what a visitor sees.

## Current state

- `fdc2127a` — `GBM - Newsroom Loader v12`, revision 39, **disabled**. The
  fixed UI script is stored inside it and no longer depends on a CDN commit.
- The five native-homepage layers remain enabled and unchanged.
- The homepage is stable and serving native Wix content.

## Open question

Whether the newsroom loader works correctly with the four native-homepage
styling layers **off**. That is the untested hypothesis. It requires one live
flip with the owner watching, and has not been attempted.
