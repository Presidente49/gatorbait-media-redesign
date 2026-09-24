# Live site vision — 2026-09-24T03:54:36.286Z

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
readable story text on the first screen: false (first headline at 415px of 545px — "Sumrall Cussing: His Wife Wants Him To Please Stop. Damn!") — covered by `.mQxxMq`
lead image 292x230px at y=125

**Findings**
- 20 tap targets under 44px
- First headline is covered: it sits at 415px in a 545px viewport but `.mQxxMq` is painted over it

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

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

## article · mobile
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 33
body measure: ~36 characters per line across 23 paragraphs

**Findings**
- 33 tap targets under 44px
- Body measure is ~36 characters per line; under 45 breaks the rhythm

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## home · phone390
HTTP 200 · viewport 320px · root classes `gbm-gazette-live gbm-standalone-live`
newsroom mounted: true (3 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 20
readable story text on the first screen: true (first headline at 415px of 693px — "Sumrall Cussing: His Wife Wants Him To Please Stop. Damn!")
lead image 292x230px at y=125

**Findings**
- 20 tap targets under 44px

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## blog · phone390
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

## article · phone390
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 33
body measure: ~36 characters per line across 23 paragraphs

**Findings**
- 33 tap targets under 44px
- Body measure is ~36 characters per line; under 45 breaks the rhythm

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## home · phone430
HTTP 200 · viewport 320px · root classes `gbm-gazette-live gbm-standalone-live`
newsroom mounted: true (3 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 20
readable story text on the first screen: true (first headline at 415px of 694px — "Sumrall Cussing: His Wife Wants Him To Please Stop. Damn!")
lead image 292x230px at y=125

**Findings**
- 20 tap targets under 44px

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## blog · phone430
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

## article · phone430
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 33
body measure: ~36 characters per line across 23 paragraphs

**Findings**
- 33 tap targets under 44px
- Body measure is ~36 characters per line; under 45 breaks the rhythm

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## home · desktop
HTTP 200 · viewport 1280px · root classes `gbm-gazette-live gbm-standalone-live`
newsroom mounted: true (3 children) · native pages visible: false
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 19
readable story text on the first screen: true (first headline at 323px of 900px — "Buster Faulkner's offense is anything but predictable")
lead image 340x425px at y=235

**Findings**
- 19 tap targets under 44px
- Body measure is ~0 characters per line; under 45 breaks the rhythm

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## blog · desktop
HTTP 200 · viewport 1280px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 41

**Findings**
- 41 tap targets under 44px

Console errors:
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## article · desktop
HTTP 200 · viewport 1280px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 39
body measure: ~87 characters per line across 23 paragraphs

**Findings**
- 39 tap targets under 44px
- Body measure is ~87 characters per line; over 85 tires the eye

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

## PROPOSED front page · phone390
HTTP 200 · viewport 390px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 5
images loaded: 7/7

No findings.

## PROPOSED front page · phone430
HTTP 200 · viewport 430px · root classes `(none)`
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
