# GatorBait Media landing-page QC — 2026-09-13

Production site: https://www.gatorbaitmedia.com/

## Incident

The landing page flashed because three independently injected layers competed during first paint:

1. `GBM - Dark Magazine Theme v8` was enabled at the same time as `GBM - Light Theme v1`.
2. `GBM - Front Page v2 (boot)` explicitly animated `#gbm-fp` from opacity 0 to 1.
3. `GBM - Homepage Patches v1` ran a DOM patch every 200 ms forever.

The repository file `custom-css-LIVE.css` is the retired dark-theme source. Do not paste or re-enable it on the live site while the light theme is active.

## Production corrections

- Disabled custom embed `0293e8b3-998d-4e94-881c-f9481749f5f4` (dark theme).
- Updated `2f57bc6b-e05f-4a96-adf3-cb02e2b18e51` to a stable, no-fade boot.
- Updated `26c99b00-4eec-45b5-8e4e-e3bc7b80b421` to bounded retries rather than a permanent 200 ms interval.
- Updated `3dc5a5ef-5160-4539-8e6d-1c5c4b972c78` with safer hero line height and tracking on desktop and mobile.
- Updated `65e7c571-ab91-4e8a-98f9-ca6cac3407f6` so the login label has light text on the navy button.

## Verified live

- Homepage title and Campbell lead story render.
- Body background remains white.
- Dark-theme style is absent.
- Homepage animation is `none`.
- Boot class clears after load.
- No horizontal overflow at the tested desktop viewport.
- Seven homepage images found; zero missing alt attributes.
- Login button contrast is light text on navy.
- The only remaining console error is the Restream player's expected `NoLiveVideoFound` state while no broadcast is live.
