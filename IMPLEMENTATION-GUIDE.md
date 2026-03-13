# GatorBait Media - Site Redesign Implementation Guide
## ESPN+/Athletic Dark Theme - Step-by-Step

---

## STEP 1: Add Custom CSS (5 minutes)

This is the single most impactful change - it transforms the entire site to dark theme.

### Option A: Via Wix Settings > Custom Code (Recommended)
1. In the Wix Editor, click **Settings** in the top menu
2. Click **Custom Code** (under Advanced)
3. Click **+ Add Custom Code**
4. Name it: GatorBait Dark Theme
5. Paste the CSS file contents wrapped in style tags
6. Set placement: **Head**
7. Set pages: **All pages**
8. Click **Apply**

### Option B: Via Velo Global CSS
1. In Dev Mode, look at the left sidebar for **Styles** folder
2. Open global.css
3. Paste the entire contents of custom-css.css
4. Save

---

## STEP 2: Change Site Background Color (2 minutes)

1. Click on an empty area of the page (not on any element)
2. A **Page Design** panel should appear on the right
3. Click **Page Background**
4. Click **Color**
5. Enter: #1a1a2e
6. Click **Apply to Other Pages** > Select **All Pages**

---

## STEP 3: Redesign the Header (10 minutes)

### 3a. Change Header Background
1. Click on the header strip at the top of the page
2. In the settings panel, click **Change Strip Background**
3. Select **Color** and enter: #1a1a2e (deep navy)

### 3b. Update the Logo
1. Click the current GatorBait logo image in the header
2. If it looks good on dark background, keep it
3. If not, upload a version with transparent background or white text

### 3c. Change Navigation Text Colors
1. Click on each navigation link in the header
2. Change color to #FFFFFF (white)
3. Set font to **Montserrat**, size **14px**, **UPPERCASE**
4. Set hover color to #F47521 (Gators orange)

### 3d. Add Subscribe Button
1. Click the + (Add) button in the left toolbar
2. Select **Button**, place it in the header, right side
3. Text: SUBSCRIBE
4. Design: Background #F47521, text #FFFFFF, Montserrat Bold, rounded corners 6px
5. Link to your pricing/membership page
6. Give it the ID subscribeBtn (in Properties panel)

### 3e. Make Header Sticky
1. Click the header
2. Click the **Settings** gear icon
3. Enable **Freeze Header**

---

## STEP 4: Add Hero Section (10 minutes)

1. Click + (Add) > **Strip** > Choose a full-width strip
2. Place it directly below the header
3. Set strip background to your best/latest article image
4. Add a dark overlay: Strip Background > Color > #000000 at 50% opacity
5. Add text elements on top:
   - Headline: Bebas Neue or Impact, 48px, white
   - Subhead: Montserrat, 14px, #A0A0B0
   - CTA Button: READ MORE - background #F47521, white text

---

## STEP 5: Fix Content Feed / Blog Layout (5 minutes)

The custom CSS handles most blog card restyling automatically. Verify:
1. Blog cards have dark backgrounds (#1E1E38)
2. Titles are white, descriptions are light gray
3. Author names and dates are in muted gray
4. If the Wix Blog widget has its own settings, set Background: Transparent

---

## STEP 6: Redesign Footer (10 minutes)

### 6a. Change Footer Background
1. Click the footer strip
2. Change background to #16213E
3. Add a top border: 2px solid #F47521

### 6b. Footer Content (4 columns)
- Column 1 - About: Logo, tagline, copyright
- Column 2 - Quick Links: Home, Football, Basketball, Recruiting, Magazine
- Column 3 - Podcasts: The Buddy Martin Show, Powered by Sidelines.live
- Column 4 - Connect: Social icons, Newsletter signup, Contact

### 6c. Update Copyright
Give the text element the ID copyrightText to enable auto-updating via Velo.

---

## STEP 7: Add Velo Code (2 minutes)

1. Click Dev Mode in the top menu
2. Open masterPage.js
3. Paste the contents of the masterPage.js file
4. This adds: dynamic copyright year + subscribe button hover effects

---

## STEP 8: Mobile Optimization (5 minutes)

1. Click the mobile view icon (phone icon) in the top toolbar
2. Check: Header (logo scales, nav becomes hamburger), Hero (readable text), Blog cards (stack vertically), Footer (columns stack)
3. Adjust any elements that don't look right
4. Use "Hide on Mobile" option for elements that clutter mobile view

---

## STEP 9: Preview and Test (3 minutes)

1. Click Preview in the top right
2. Test desktop: Navigate all pages, check blog posts, test Subscribe button, verify dark theme
3. Switch to mobile preview and repeat
4. Check: Florida Gators News, The Buddy Martin Show, Message Boards, Magazine

---

## STEP 10: Publish (1 minute)

1. Click Publish in the top right
2. Confirm publish
3. Visit www.gatorbaitmedia.com in an incognito browser to verify
4. Check on your phone too

---

## Color Reference

| Element | Color Code | Notes |
|---------|-----------|-------|
| Page/Header Background | #1A1A2E | Deep navy |
| Footer Background | #16213E | Slightly lighter navy |
| Card Background | #1E1E38 | Blog card bg |
| Card Border | #2A2A4A | Subtle borders |
| Accent Orange | #F47521 | CTAs, highlights, hover |
| Accent Blue | #0021A5 | Links, secondary |
| Primary Text | #FFFFFF | Headlines, nav |
| Body Text | #E0E0E8 | Article text |
| Muted Text | #A0A0B0 | Metadata, dates |

## Font Reference

| Use | Font | Size |
|-----|------|------|
| Headlines | Bebas Neue / Impact | 36-48px |
| Navigation | Montserrat | 14px uppercase |
| Subheads | Montserrat | 22-28px |
| Body Text | Georgia | 17px |
| Metadata | Montserrat | 13px |

---

*Total estimated time: ~45 minutes for full implementation*
*Files included: masterPage.js, custom-css.css, site-preview.html*
