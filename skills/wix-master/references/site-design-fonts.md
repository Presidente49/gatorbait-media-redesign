# Site design, theme and fonts

Researched 2026-09-28 from official Wix sources. Re-check the live Editor before acting. Wix renames panels often.

## How Wix typography works (Studio)

- **Site Styles → Typography** has two parts. **Fonts** lists every font used by the text styles. Changing a font there "automatically updates all of the text styles that were using the old font" and "any themed text elements that used the previous font". **Text styles** are 9 styles (Heading 1–6, Paragraph 1–3), each with font, weight, size (fluid min/max), spacing and color.
  Source: https://support.wix.com/en/article/studio-editor-working-with-site-typography
- **Design overrides.** If a text element's design is changed after a style is applied, it stops following the style. Fix: select it → Style dropdown → **Reset Changes** (or **Update Styles** to push the override into the style sitewide). Same source.
- The Classic Wix Editor calls this **Site Design → Text Theme** (Heading font + Paragraph font). Our site is Studio, so use Site Styles. Source: https://support.wix.com/en/article/wix-editor-working-with-text-themes
- Internally, theme fonts are the `font_0 … font_10` tokens / `--font_N` CSS variables that Wix emits in server-rendered CSS. Every native app widget that says "inherits your site theme" reads them.

## What inherits the theme (the reason serif "reverts")

| Surface | Font source | Can our CSS override reliably? |
|---|---|---|
| Blog post body/headings | Theme text styles. Studio blog text = **Paragraph 2**; Post page widget Design can override per text type | No. Fix in theme + Post widget Design |
| Blog feed / category feed | Blog widget Settings → Design → Posts | No |
| Pricing Plans page | Plans widget Settings → Design → Text Style (per text type), else theme | No |
| Pricing Plans **checkout** | "It is not possible to customize the checkout page's layout, design, or text." Inherits theme | No. Theme only |
| eCom checkout designer | Colors / logo / corners only, "select a color from your site's theme" | No font control |
| Members Area, My Account, login/signup | Widget Design panels, else theme | Partly |
| First paint before our loader | Wix's server-rendered theme CSS | No. Theme only |

Sources:
- Blog post fonts come from the global text theme; "your blog text is Paragraph 2 text": https://support.wix.com/en/article/wix-blog-customizing-your-blog-post-page
- Post page default text style (Editor → Blog Pages → Post → Settings → Design → Text Style & Color): https://support.wix.com/en/article/wix-blog-customizing-your-blog-text-fonts-and-color
- One body font for all posts: https://support.wix.com/en/article/wix-blog-request-choosing-different-fonts-for-different-posts
- Pricing Plans Design → Text Style: https://support.wix.com/en/article/customizing-the-design-of-your-pricing-plans-page
- Plans checkout not customizable: https://support.wix.com/en/article/pricing-plans-request-ability-to-customize-the-checkout-page
- Checkout design (colors from theme): https://support.wix.com/en/article/wix-stores-customizing-the-checkout-page
- Spacing not editable on Menu, Forms, Blog, Store, Search, Events, Bookings, Ratings: https://support.wix.com/en/article/wix-editor-working-with-text-themes

## Can theme fonts be read or changed by API?

**No public REST/SDK API was found** for site theme fonts or text styles. `SearchWixRESTDocumentation` for "site theme fonts / site styles" returned only cookie-banner fonts, checkout branding (colors) and site properties. None of them write the theme. Treat theme typography as **Editor-only**. The live `font_N` values can be *read* by inspecting the published page's CSS (`getComputedStyle`, or grep the HTML for `--font_`). That is observation, not an API. The local `wix-editor-local` MCP (`wix_theme`) drives the Editor UI and is a production write surface. Use it only under an explicit controller task, never from a monitor.

## Barlow in Studio: owner steps

1. Open the Studio Editor for gatorbaitmedia.com.
2. **Before touching anything:** Studio menu → Site → **Site History**. Note the last *Published* entry and whether any *Saved* entries come after it (unpublished drafts). See publishing-safety.md.
3. Left bar → **Site Styles** → **Typography**.
4. Under **Fonts**, click each font that isn't Barlow → pick **Barlow** (Google font in the Wix library. If it's missing, Font dropdown → **Upload fonts** WOFF2 of Barlow 400/500/700/800) → **Update**.
5. Under **Text styles**, open Heading 1–6: font Barlow, weight 800 (H1–H3) / 700 (H4–H6). Open Paragraph 1–3: Barlow 400 (P2 = blog body; 500 acceptable for UI paragraphs). Back arrow.
6. Blog Pages → Post → Post widget → Settings → Design → Text style & color → Barlow for paragraphs and headings. Blog feed widget → Design → Posts → Barlow.
7. Plans & Pricing page → Plans widget → Settings → Design → Text Style → Barlow (both tabs incl. Highlighted).
8. Members Area pages → My Account and login bar widgets → Design → Barlow where a picker exists.
9. (Optional) Studio menu → Site → **Performance** → "Optimize loading with fallback fonts". It shows a fast fallback while Barlow loads. Check that the fallback isn't a serif on a cold load before keeping it.
10. **Publish** (see the warning) → verify → record in issue #34.

Fallback fonts path source: https://support.wix.com/en/article/studio-editor-working-with-site-typography . Upload fonts (TTF/OTF/WOFF/WOFF2): https://support.wix.com/en/article/studio-editor-using-different-text-fonts

## Can this be done without publishing unrelated drafts?

Wix has no partial publish. Publish (Editor button or `site-publisher/v1/site/publish`) "makes any changes previously saved on the site available". So:

- If Site History shows **no saved entries after the last publish**, the theme change is the only delta. Safe.
- If there **are** unknown saved drafts: the owner either (a) reviews them and accepts them, or (b) restores the last *published* version from Site History first (this discards later saved changes, so star/rename the draft version first so it can be restored later), then makes the font change, then publishes. Option (b) is destructive to the draft and needs Brenden's explicit yes.

Sources: https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/publish-site , https://support.wix.com/en/article/viewing-and-managing-your-site-history

## Custom CSS in Studio (what it can and can't reach)

- Studio `global.css` (Code panel) styles only the listed global/semantic classes (Button, Text, Rich text box, Menu, Header, Footer, Repeater, Section …). Blog, Pricing Plans and Members widgets are **not** in that list. Sources: https://support.wix.com/en/article/studio-editor-about-css-editing , https://dev.wix.com/docs/velo/api-reference/$w/styling-elements-with-css.md
- `global.css` "overrides selections you make in other panels", but only for the classes it can target. It needs a publish.
- Our Barlow loader embed (custom code) runs after Wix's SSR CSS, so it can't prevent the first-paint serif. It's a belt-and-braces layer, not the fix.

## Verification recipe

On a cold incognito load with `?cb=<ts>`, for `/`, one `/post/…`, `/plans-pricing`, `/account/my-account`, and the plan checkout start page: collect `getComputedStyle(el).fontFamily` for `h1,h2,h3,p,button,a` and assert every value starts with `Barlow`. Also screenshot the first 500 ms (or run `automation/vision/first-paint.mjs` if it's on the branch) to catch the flash.
