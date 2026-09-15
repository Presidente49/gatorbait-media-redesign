# Incident — Homepage blank / newsroom boot failure — 2026-09-15

## Summary

The GatorBait public site appeared blank because two enabled HEAD custom embeds could hide the native Wix page while waiting for the repo-backed newsroom layer to initialize.

The domain and Wix content were not deleted. The underlying native homepage remained available.

## Root cause

### 1. Newsroom Prepaint Guard

Embed ID: `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51`

The guard applied `visibility:hidden` to normal body children while waiting for `#gbm-live` to contain content.

Mitigation on 2026-09-15:
- renamed `GBM - Newsroom Prepaint Guard v1 (OFF - fail-safe restore)`
- revision `8`
- `enabled=false`

### 2. Standalone Newsroom Live loader

Embed ID: `2cc2735e-055b-4844-892d-0aa7a53b5d7c`

The loader added `gbm-newsroom-boot`, hid the Wix header/pages/footer, and expected the external repo JS to create and populate `#gbm-live`.

The timeout only removed the boot class when `#gbm-live` did not exist. If the container existed but failed to populate, the page could remain hidden indefinitely.

Mitigation on 2026-09-15:
- renamed `GBM - Standalone Newsroom Live v1 (OFF - outage fail-safe)`
- revision `16`
- `enabled=false`

## Recovery verification

After disabling both hiding layers, the public homepage returned readable native Wix content, including current story cards.

## Permanent rule: fail open

No future newsroom/custom-shell implementation may hide the native Wix site before the replacement experience is confirmed mounted with meaningful content.

Required pattern:

1. Keep native Wix visible during asset download and initialization.
2. Build the replacement newsroom without hiding the existing page.
3. Confirm the replacement root exists **and contains meaningful rendered content**.
4. Only then apply the class/state that suppresses the native homepage.
5. If initialization errors or exceeds a short timeout, remove any replacement state and leave native Wix visible.
6. Never use a first-paint guard whose failure mode is a blank site.
7. Never use permanent high-frequency DOM polling to maintain route state.

Availability beats visual polish. A brief native-page flash is preferable to a blank production site.

## Legacy newsletter / AI-agent issue discovered during incident

The native Wix homepage still contains legacy source text including `The Monday Chomp` and an old `BRENDEN@GATORBAITMEDIA.COM` contact string. Browser-side scripts can rename/hide this for human visitors, but crawlers and AI agents reading raw Wix markup can still encounter it.

The site's Wix `llms.txt` was therefore replaced on 2026-09-15 with current guidance:
- current newsletter = **GatorBait Weekly**
- `The Monday Chomp` = retired legacy label
- `Quick Chomps` = retired; use `Quick Reads`
- canonical contact = `brenden@gatorademedia.com`
- current public destinations and editorial lanes documented
- agents instructed to prefer live Wix/API data and `llms.txt` over stale legacy markup

The legacy native Wix text should still be removed at the editor/source level when an editor-capable workflow is available. Do not treat browser-side renaming as source cleanup.

## Re-enable conditions for repo-backed newsroom

Do not re-enable embed `2cc2735e-055b-4844-892d-0aa7a53b5d7c` until a fail-open loader has been implemented and tested against:
- external CSS unavailable
- external JS unavailable
- JS exception before mount
- `#gbm-live` created but empty
- slow mobile connection
- route transition away from `/`

The recovery path must always be the native Wix site, not a blank page.
