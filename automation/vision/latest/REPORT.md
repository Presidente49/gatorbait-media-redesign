# Live site vision — 2026-09-24T03:14:16.254Z

## URL checks

| URL | Status | Bytes |
|---|---:|---:|
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@32127d938ad41b0f7851` | 200 | 13922 |
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@d03d9d1e0350c55be03d` | 200 | 16641 |
| `presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml` | 200 | 24322 |
| `presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml` | 200 | 8425 |
| `presidente49.github.io/gatorbait-media-redesign/sitemap-index.xml` | 200 | 436 |

## home · mobile
HTTP 200 · viewport 320px · root classes `gbm-gazette-live gbm-standalone-live`
newsroom mounted: true (3 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 20

**Findings**
- 20 tap targets under 44px

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## blog · mobile
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 24

**Findings**
- 24 tap targets under 44px

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## home · desktop
HTTP 200 · viewport 1280px · root classes `gbm-gazette-live gbm-standalone-live`
newsroom mounted: true (3 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 19

**Findings**
- 19 tap targets under 44px

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## blog · desktop
HTTP 200 · viewport 1280px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 38

**Findings**
- 38 tap targets under 44px
- Retired branding present: Rob Browne

Console errors:
- `pageerror: ReferenceError: wixTagManager is not defined`
- `Failed to load resource: the server responded with a status of 429 ()`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## PROPOSED front page · mobile
HTTP 200 · viewport 390px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 5
images loaded: 7/7

No findings.

## PROPOSED front page · desktop
HTTP 200 · viewport 1280px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 3
images loaded: 7/7

No findings.
