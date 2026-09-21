# Live site vision — 2026-09-21T20:06:04.024Z

## URL checks

| URL | Status | Bytes |
|---|---:|---:|
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@32127d938ad41b0f7851` | 200 | 13922 |
| `cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@d03d9d1e0350c55be03d` | 200 | 16641 |
| `presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml` | 200 | 24479 |
| `presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml` | 200 | 8470 |
| `presidente49.github.io/gatorbait-media-redesign/sitemap-index.xml` | 200 | 436 |

## home · mobile
HTTP 200 · viewport 320px · root classes `gbm-standalone-live`
newsroom mounted: true (4 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 26

**Findings**
- 8+ elements overflow horizontally

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

## blog · mobile
HTTP 200 · viewport 320px · root classes `gbm-blog`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 18

**Findings**
- 1+ elements overflow horizontally

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

## home · desktop
HTTP 200 · viewport 1280px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: true
header 115px rendered, overflow visible, content 120px
tap targets under 44px: 13

**Findings**
- Header content is clipped: scrollHeight 120 > clientHeight 115
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
