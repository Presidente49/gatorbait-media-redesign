# Cookie Consent Production State — 2026-09-14

## Live state

The GatorBait Wix cookie-consent banner is enabled with:

- app enabled: `true`
- banner enabled: `true`
- audience: `all_visitors`
- contributor policy acknowledgement: `true`
- Decline All: enabled
- revisit settings: enabled
- revisit button position: bottom left
- privacy policy type: page on site
- privacy policy page: `policies`
- theme: dark

## Important Wix API failure pattern

A partial `Update Cookie Banner Settings` call containing only `{ settings: { enabled: true } }` reset other previously configured banner fields to defaults in the mutation response, including policy acknowledgement, Decline All, privacy-policy destination and theme.

Do **not** treat this endpoint as a patch-like partial update even though individual schema properties are optional. For production changes, explicitly send the complete set of settings that must remain stable, then inspect the returned `settings` object before declaring success.

The corrective update explicitly restored all visitor-control and privacy-policy fields listed above.

## Operations rule

Future agents must read the current settings before changing the cookie banner and preserve every relevant field in the update request. Never claim consent configuration is fixed solely because the app is installed; `appEnabled` and `enabled` are separate states.
