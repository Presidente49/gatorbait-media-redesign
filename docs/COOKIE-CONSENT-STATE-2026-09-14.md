# Cookie Consent Production State — updated 2026-09-16

## Live state

The GatorBait Wix cookie-consent banner is enabled with:

- app enabled: `true`
- banner enabled: `true`
- audience: `all_visitors`
- contributor policy acknowledgement: `true`
- Decline All: enabled
- revisit settings: **disabled**
- privacy policy type: page on site
- privacy policy page: `policies`
- theme: `custom`
- primary color: `#0D1B2A`
- secondary color: `#FFFFFF`
- font: Arial, `12px`
- banner copy: `We use cookies for site performance and analytics.`

The banner still preserves **Accept All**, **Decline All**, **Settings**, and **Privacy Policy**.

## Repeated-popup rule

The public Cookie Banner Settings API exposes banner enabled state, audience, text, theme, Decline All, revisit controls, and privacy-policy settings. It does **not** expose a supported visitor-consent persistence duration control. The returned `expiryDate` field is documented as internal-use only and must not be treated as a configurable consent lifetime.

If a visitor accepts or declines and the full banner keeps resurfacing on subsequent pages, treat that as a native Wix/client consent-persistence issue. Do **not** suppress it with custom CSS/JavaScript, fake a local-storage acceptance state, or disable consent controls to hide the symptom.

## Important Wix API failure pattern

A partial `Update Cookie Banner Settings` call containing only `{ settings: { enabled: true } }` previously reset other configured banner fields to defaults in the mutation response, including policy acknowledgement, Decline All, privacy-policy destination, and theme.

Do **not** treat this endpoint as a patch-like partial update even though individual schema properties are optional. For production changes, read the complete current settings first, explicitly preserve every field that must remain stable, and inspect the returned `settings` object before declaring success.

## Operations rule

Future agents must read the current settings before changing the cookie banner. Never claim consent configuration is fixed solely because the app is installed; `appEnabled` and `enabled` are separate states. Do not re-enable the persistent revisit button unless Brenden explicitly requests it.
