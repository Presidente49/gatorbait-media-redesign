# Pre-change snapshot — AdSense consent fix, 2026-09-24

Captured read-only immediately before the first mutation. Rollback restores
exactly these values. Re-read the live revision before rolling back; do not
assume the revision below is still current.

## Embed being changed

| Field | Value before change |
|---|---|
| id | `af338ad4-8c84-4708-8859-f1d6a0121c13` |
| name | `AdSense Verification` |
| revision | `1` |
| enabled | `true` |
| position | `HEAD` |
| domain | `gatorbaitmedia.com` |
| **embedData.category** | **`ESSENTIAL`** |
| **loadOnce** | **`true`** |
| html length | 147 characters |
| html hash (whitespace-stripped, 31-mul) | `84402828` |

## Change being made, and why

`category: ESSENTIAL -> ADVERTISING` and `loadOnce: true -> false`.
The html is **not** modified.

This embed is byte-identical to `Google AdSense Auto Ads`
(`2da582cf-6935-4255-b248-e14add7e82a8`, revision 8, **disabled**), which
carries category `ADVERTISING` — same 147 characters, same hash `84402828`.
The same Google ad loader was therefore running under a name that reads as
verification and a category that loads before consent, while the honestly
named copy sat switched off.

`loadOnce: true` meant the loader ran only on initial site rendering and not
across Wix's SPA navigation, so article-to-article reading did not re-run it.

Authorized by Brenden on 2026-09-24 ("Fix consent properly"), who was told
in advance that consent-gating may reduce measured ad loads.

## Context at time of change

Of 17 enabled embeds, 16 were `ESSENTIAL` and 1 was `ADVERTISING`
(`GBM - FB Pixel ViewContent (articles) v1`, `loadOnce: false` — correctly
configured, and the model this change follows).

## Rollback

PATCH the embed back to `category: ESSENTIAL`, `loadOnce: true`, passing the
then-current revision. Nothing else was touched: no embed was enabled or
disabled, no html changed, no account connection altered.
