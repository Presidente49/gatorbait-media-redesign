# Magazine screenshot audit — September 23, 2026

User supplied IMG_4581, IMG_4579, IMG_4577 showing magazine blank tail, touched-link underlining, and a long article capture.

## Root cause and repair
Live DOM isolated pageBackground_nh0hy and its child background layers extending 936px below their zero-height native Wix host. The replacement magazine renders before that host; overflow continued 864px after the footer. Existing magazine embed only hid SITE_PAGES, not its decorative background sibling.

Updated existing magazine embed 1dd74333-ee02-40da-9c93-cf8fd787c129 revision22 ->23:
- Hide only pageBackground_nh0hy while gbm-magazine-page exists.
- Limit editorial-title hover underlining to hover-capable fine pointers; do not underline an entire lead excerpt.
- Allow magazine masthead logo/text to fit narrow mobile widths with bounded sizing.

No extra runtime script, polling, global content clipping or new embed. No article copy, paywall, ad configuration, menus or homepage changes.

## Verification
Public /magazine?gbm_check=mag23 readback: repaired rule loaded, background display none, document height2120 vs previously2984 at1363px viewport. Footer bottom2119.640625: no blank tail. Scroll width1348: no horizontal overflow.
Existing Eddie article /post/florida-after-auburn-5-signs-sumrall-gators-rising: height2680, footer bottom2680.296875, no horizontal overflow. AdSense slot unfilled with zero height. Do not call ad fill fixed.
Physical iPhone and a newly resized mobile browser session were not available for this pass. Mobile-specific rules were inspected, not claimed as device-tested. The long screenshot alone cannot establish an article typography defect or justify deleting text.
Wix editor dashboard remains unauthenticated; existing presentation source was directly accessible through Wix API.

Rollback: restore deploy/magazine-audit/rollback-revision22.html into that embed using fresh current revision.
