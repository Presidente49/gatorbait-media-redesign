# Mobile image repair and audit — September 23, 2026

Owner requested full Buddy photo, smaller mobile article photo, major-page/navigation review, Spaces connectivity.

## Published
Shared design embed 7fee4de6-1886-475e-a3f3-b9c68161c242 revision23→24; publish200.
Homepage lead image object-fit:contain (verified in live rendered DOM); mobile image frame230px.
Buddy article image-viewer-pwtw9126 width capped180px on screens≤820px, preserving intrinsic654×909 aspect ratio (~250px tall). No post republish/email trigger.
Original image unchanged. Exact rollback snapshot included; restore only this change after current revision read.

## Checks
- Public live desktop: homepage Buddy lead/full-photo contain; Magazine separate cover/contents; Latest native headline feed; TV, Join, Contact, Policies and account routes load expected public surfaces with shared header/footer and no horizontal overflow.
- Account native login dialog exists. No login/payment/contact submission performed.
- Isolated shared mobile-shell fixture: Menu aria-expanded true on open and false after close at390px and430px. This is a component test, not full Wix/iOS.
- Magazine remains on older Saturday cover; current feed freshness remains an open issue, not fixed by image styling.
- Browser provides no viewport/device-emulation capability. Full native Wix mobile, physical-iPhone, CLS measurement, and current-revision photo screenshots remain unverified.
- Spaces settings/app screens could not be verified through exposed APIs; dashboard browser signed out. Wix Blog/canonical URLs unchanged. Do not claim Spaces passed based on web rendering.
- Wix support: custom website page contents do not automatically synchronize to Spaces screens; member app does not support custom website code. Existing app navigation needs its own authenticated check.

## Required release gate from now on
Every design change must record390px and430px checks separately from desktop: header/menu open-close/link destination, logo tap, no horizontal overflow, image framing, footer reachability, homepage vs Magazine vs Latest roles, article/TV/Join/Contact/Policies/account routes. Test current revision; label fixture vs live-device evidence. Verify Spaces Blog/current story, membership/login, app tabs and notification deep links separately. Never mark untested checks passed.
