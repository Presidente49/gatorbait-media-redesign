# Live site vision — 2026-09-21T20:07:44.120Z

## URL checks

| URL | Status | Bytes |
|---|---:|---:|
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@32127d938ad41b0f7851` | 200 | 13922 |
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@d03d9d1e0350c55be03d` | 200 | 16641 |
| `presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml` | 200 | 24479 |
| `presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml` | 200 | 8470 |
| `presidente49.github.io/gatorbait-media-redesign/sitemap-index.xml` | 200 | 436 |

## home · mobile
HTTP 200 · viewport 320px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: true
header 103px rendered, overflow visible, content 110px
tap targets under 44px: 8

**Findings**
- Header content is clipped: scrollHeight 110 > clientHeight 103
- 1+ elements overflow horizontally
- Retired branding present: Monday Chomp

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 103px -> 103px, content 110px -> 110px
- findings 3 -> 3

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

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

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

**Candidate fix applied in CI (not live)**
- header box 144px -> 144px, content 148px -> 148px
- findings 2 -> 2

## blog · desktop
HTTP 200 · viewport 1280px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: true
header 115px rendered, overflow visible, content 120px
tap targets under 44px: 51

**Findings**
- Header content is clipped: scrollHeight 120 > clientHeight 115

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 115px -> 115px, content 120px -> 120px
- findings 1 -> 1
