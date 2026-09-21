# Live site vision — 2026-09-21T20:03:35.078Z

## home · mobile
HTTP 200 · viewport 320px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: true
header 122px rendered, overflow visible, content 124px
tap targets under 44px: 8

**Findings**
- Header content is clipped: scrollHeight 124 > clientHeight 117
- 1+ elements overflow horizontally
- Retired branding present: Monday Chomp

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

## blog · mobile
HTTP 200 · viewport 320px · root classes `gbm-blog gbm-tight-footer gbm-latest-clean gbm-hide-blog-follow`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 26

**Findings**
- 8+ elements overflow horizontally

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

## home · desktop
HTTP 200 · viewport 1280px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: true
header 149px rendered, overflow visible, content 148px
tap targets under 44px: 8

**Findings**
- Header content is clipped: scrollHeight 148 > clientHeight 144
- Retired branding present: Monday Chomp

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

## blog · desktop
HTTP 200 · viewport 1280px · root classes `gbm-blog`
newsroom mounted: false (0 children) · native pages visible: true
header 149px rendered, overflow visible, content 148px
tap targets under 44px: 64

**Findings**
- Header content is clipped: scrollHeight 148 > clientHeight 144
- Retired branding present: Rob Browne

Console errors:
- `pageerror: ReferenceError: wixTagManager is not defined`
- `Failed to load resource: the server responded with a status of 429 ()`
