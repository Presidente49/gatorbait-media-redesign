# Live site vision — 2026-09-24T04:09:09.434Z

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

type actually rendering:
- `heading|Georgia|19px|700` (527 chars)
- `heading|Georgia|20px|700` (366 chars)
- `body|Arial|14px|400` (135 chars)
- `heading|Georgia|23px|700` (110 chars)
- `heading|Georgia|18px|700` (110 chars)
- `heading|Georgia|31px|700` (72 chars)
- `heading|Georgia|28px|700` (57 chars)
- `heading|Arial|18px|800` (28 chars)
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

type actually rendering:
- `heading|Georgia|21px|700` (284 chars)
- `heading|Georgia|27px|700` (24 chars)

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

type actually rendering:
- `body|-apple-system|16px|400` (5881 chars)
- `heading|Georgia|25px|700` (82 chars)
body measure: ~36 characters per line across 23 paragraphs

**Findings**
- 33 tap targets under 44px
- Body measure is ~36 characters per line; under 45 breaks the rhythm

Console errors:
- `[Report Only] Refused to frame 'https://www.google.com/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'self'".
`
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

type actually rendering:
- `heading|Georgia|19px|700` (527 chars)
- `heading|Georgia|20px|700` (366 chars)
- `body|Arial|14px|400` (135 chars)
- `heading|Georgia|23px|700` (110 chars)
- `heading|Georgia|18px|700` (110 chars)
- `heading|Georgia|31px|700` (72 chars)
- `heading|Georgia|28px|700` (57 chars)
- `heading|Arial|18px|800` (28 chars)
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

type actually rendering:
- `heading|Georgia|21px|700` (284 chars)
- `heading|Georgia|27px|700` (24 chars)

**Findings**
- 24 tap targets under 44px

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## article · phone390
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 33

type actually rendering:
- `body|-apple-system|16px|400` (5881 chars)
- `heading|Georgia|25px|700` (82 chars)
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

type actually rendering:
- `heading|Georgia|19px|700` (527 chars)
- `heading|Georgia|20px|700` (366 chars)
- `body|Arial|14px|400` (135 chars)
- `heading|Georgia|23px|700` (110 chars)
- `heading|Georgia|18px|700` (110 chars)
- `heading|Georgia|31px|700` (72 chars)
- `heading|Georgia|28px|700` (57 chars)
- `heading|Arial|18px|800` (28 chars)
readable story text on the first screen: true (first headline at 415px of 694px — "Sumrall Cussing: His Wife Wants Him To Please Stop. Damn!")
lead image 292x230px at y=125

**Findings**
- 20 tap targets under 44px

Console errors:
- `Failed to load resource: the server responded with a status of 429 ()`
- `Failed to load resource: net::ERR_CERT_COMMON_NAME_INVALID`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 1 -> 1

## blog · phone430
HTTP 200 · viewport 320px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 24

type actually rendering:
- `heading|Georgia|21px|700` (284 chars)
- `heading|Georgia|27px|700` (24 chars)

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

type actually rendering:
- `body|-apple-system|16px|400` (5881 chars)
- `heading|Georgia|25px|700` (82 chars)
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
tap targets under 44px: 14

type actually rendering:
- `heading|Georgia|20px|700` (707 chars)
- `heading|Georgia|23px|700` (637 chars)
- `body|roboto-bold|14px|400` (214 chars)
- `body|Arial|15px|400` (135 chars)
- `heading|Georgia|31px|700` (72 chars)
- `heading|Georgia|35px|700` (57 chars)
- `heading|Arial|18px|800` (28 chars)
- `heading|Georgia|29px|700` (23 chars)
readable story text on the first screen: true (first headline at 323px of 900px — "Buster Faulkner's offense is anything but predictable")
lead image 340x425px at y=235

**Findings**
- 14 tap targets under 44px
- Body measure is ~0 characters per line; under 45 breaks the rhythm

Console errors:
- `pageerror: ReferenceError: wixTagManager is not defined`
- `Failed to load resource: the server responded with a status of 429 ()`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## blog · desktop
HTTP 200 · viewport 1280px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 38

type actually rendering:
- `heading|Georgia|23px|700` (751 chars)
- `heading|Georgia|34px|700` (24 chars)

**Findings**
- 38 tap targets under 44px
- Retired branding present: Rob Browne

**Retired branding, located**
- `Rob Browne` in `a.blog-navigation-container-color < li < ul.LnLd_R < nav.AsxoCK` at y=488, visible=true
  > Rob Browne Column

Console errors:
- `pageerror: ReferenceError: wixTagManager is not defined`
- `Failed to load resource: the server responded with a status of 429 ()`

**Candidate fix applied in CI (not live)**
- header box 0px -> 0px, content 0px -> 0px
- findings 2 -> 2

## article · desktop
HTTP 200 · viewport 1280px · root classes `gbm-tight-footer`
newsroom mounted: false (0 children) · native pages visible: true
header 0px rendered, overflow visible, content 0px
tap targets under 44px: 39

type actually rendering:
- `body|-apple-system|17px|400` (5881 chars)
- `heading|Georgia|36px|700` (82 chars)
- `heading|Georgia|18px|400` (13 chars)
- `heading|Georgia|16px|400` (10 chars)
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

type actually rendering:
- `heading|Newsreader|18px|600` (374 chars)
- `body|Barlow|18px|400` (135 chars)
- `body|Barlow|16px|400` (130 chars)
- `heading|Newsreader|21px|600` (81 chars)
- `heading|Newsreader|34px|700` (57 chars)
- `heading|Newsreader|24px|700` (53 chars)
- `heading|Barlow Condensed|19px|700` (6 chars)
images loaded: 7/7

No findings.

## PROPOSED front page · phone390
HTTP 200 · viewport 390px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 5

type actually rendering:
- `heading|Newsreader|18px|600` (374 chars)
- `body|Barlow|18px|400` (135 chars)
- `body|Barlow|16px|400` (130 chars)
- `heading|Newsreader|21px|600` (81 chars)
- `heading|Newsreader|34px|700` (57 chars)
- `heading|Newsreader|24px|700` (53 chars)
- `heading|Barlow Condensed|19px|700` (6 chars)
images loaded: 7/7

No findings.

## PROPOSED front page · phone430
HTTP 200 · viewport 430px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 5

type actually rendering:
- `heading|Newsreader|18px|600` (374 chars)
- `body|Barlow|18px|400` (135 chars)
- `body|Barlow|16px|400` (130 chars)
- `heading|Newsreader|21px|600` (81 chars)
- `heading|Newsreader|35px|700` (57 chars)
- `heading|Newsreader|24px|700` (53 chars)
- `heading|Barlow Condensed|19px|700` (6 chars)
images loaded: 7/7

No findings.

## PROPOSED front page · desktop
HTTP 200 · viewport 1280px · root classes `(none)`
newsroom mounted: false (0 children) · native pages visible: null
tap targets under 44px: 3

type actually rendering:
- `heading|Newsreader|22px|600` (374 chars)
- `body|Barlow|18px|400` (135 chars)
- `body|Barlow|16px|400` (130 chars)
- `heading|Newsreader|26px|600` (81 chars)
- `heading|Newsreader|66px|700` (57 chars)
- `heading|Newsreader|34px|700` (53 chars)
- `heading|Barlow Condensed|19px|700` (6 chars)
images loaded: 7/7

No findings.
