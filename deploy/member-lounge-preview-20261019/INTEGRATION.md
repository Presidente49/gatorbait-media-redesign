# Wix member-lounge integration

Owner authorized moving ahead with the expandable-card lounge, Oct.19. This package is a working design preview; no native page, permissions, group or pricing-plan settings have changed.

## Installation target

Use one Wix-native Members Area page, proposed slug `/lounge`, with native Site Members permissions and Wix login. Initial scope: approved signed-in members. Preserve the existing native permissions on linked private groups. A public preview, collapsed panel, CSS rule, local storage or frontend login flag never grants or enforces membership access.

Keep the current magazine and phone PDF public, per owner instruction. Do not add a paid-plan gate or promise paid benefits merely because a visitor is signed in. Gold VIP Lounge and Insider Board currently read PRIVATE / ADMIN_APPROVAL, not verified PAID_PLANS. Any future paid-plan assignment is a distinct membership/access change with current owner direction and native enforcement evidence required.

## Existing platform responsibilities

- Wix authenticates the visitor and protects the native page/group data.
- The lounge UI supplies expandable, keyboard-operable navigation cards. Its public static preview contains only public content and links.
- Native Groups handles discussion membership and moderation. No message fixtures or invented activity counts.
- Native My Account handles account/subscription tools. No direct pricing, billing, charges or cancellation actions in this preview.
- Magazine, current PDF and Chris's gallery stay at their existing canonical destinations. No duplicate story or magazine embed.

## Access dependency

This cloud session has no callable Wix Editor/page-creation tool. The Mac controller's `wix-editor-local` session is the existing documented installation path. Do not create a parallel headless site, API workaround or second membership service to bypass this dependency. A site publish can push unrelated saved Editor drafts; prepare/review the precise Editor batch before any authorized publish.

## Acceptance before a live release

1. Inspect the current Editor page inventory and use the existing intended member page if present; do not duplicate by name.
2. Configure native page permissions and navigation with the current owner-approved access scope. Verify signed-out denial/login and approved-member access in separate sessions; if access scope later includes plan checks, verify expired/non-entitled denial too.
3. Open/close every card by touch and keyboard. Verify focus, link targets, readable text, credit links and no overflow at390/430/1366/1920. Test the owner's physical iPhone when available.
4. Verify existing private-group restrictions independently. A successful admin view is not an unauthorized-reader denial test.
5. Verify public magazine/PDF still work without membership, real photos use permanent Wix assets and no new automation/subscriber email is triggered.
6. Record the actual native page ID, access settings, widths, release status and rollback in issue34. Until then, call this a preview, not a live members-only lounge.

## Rollback

Preview is additive files only. Native integration rollback must restore the prior page permissions/navigation saved immediately before installation. Do not delete members, groups or content. No new paid service or subscription is required for this package.

## Presentation boundary

The standalone preview includes its own masthead and preview banner; reconcile those with the native Wix header at installation. It is over the15000-character Custom Embeds cap: do not paste the whole document into a custom-code embed. Use the appropriate native HTML/custom element or an approved external presentation asset within the native protected page, and validate its sizing/navigation there. Never move private messages or member data into this public preview.
