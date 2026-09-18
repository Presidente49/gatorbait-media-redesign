# Editorial design references

Updated: 2026-09-18

This is the design-reference shortlist for GatorBait Media. It records what to borrow and what not to install so future work does not restart the template search or replace a stable Wix site with an incompatible stack.

## Decision

Keep the existing Wix site and native Wix Blog as production. Do not vendor, fork, embed, or rebuild around any of the repositories below. They are reference material for layout, information hierarchy, accessibility, and editorial presentation.

A repository qualifies for another review only when it solves a verified production problem that cannot be solved safely in Wix. Popularity alone is not a reason to add a dependency.

## Reference shortlist

| Reference | Observed GitHub activity | License | Useful patterns | Decision |
|---|---:|---|---|---|
| [BBC Simorgh](https://github.com/bbc/simorgh) | About 1.7k stars | No clear repository license detected | Strong accessibility, resilient article pages, restrained navigation | Study patterns only; far too large and operationally complex for this Wix site |
| [Wagtail news template](https://github.com/wagtail/news-template) | About 188 stars; active in 2026 | BSD-3-Clause | Lead-story hierarchy, card grids, section landing pages | Best newsroom layout reference; Django/Wagtail code does not belong in Wix |
| [Netlify Next.js Blog Theme](https://github.com/netlify-templates/nextjs-blog-theme) | 578 stars; pushed 2026-09-15 when reviewed | MIT | Narrow readable prose column, explicit SEO component, responsive post page, previous/next continuation | Strong article-page reference; borrow the hierarchy and interaction patterns, do not install the Next.js stack into Wix |
| [Giraffe](https://github.com/AGDholo/giraffe) | About 92 stars | MIT | Compact magazine cards and responsive Vue layouts | Visual reference only; Vite/Vuetify would duplicate the live frontend |
| [Pixel Blogger Template](https://github.com/puikinsh/Pixel-Blogger-Template) | About 191 stars | GPL-3.0 | Simple editorial density and chronological feeds | Do not copy code; Blogger and GPL are a poor fit |
| [Wix CMS Next.js template](https://github.com/wix-incubator/wix-cms-nextjs-template) | About 43 stars | MIT | Official Wix headless CMS connection | Reconsider only if the company deliberately funds a headless rebuild |
| [Newspack workspace](https://github.com/Automattic/newspack-workspace) | Active production publishing project | GPL | Membership and newsroom product ideas | WordPress stack; product reference only |

Star counts are a dated signal, not a quality score. Verify current activity, security posture, license, and maintenance status before any future adoption.

## Daily trend review

Review relevant GitHub activity regularly for useful changes in sports-publisher article design, editorial UX, SEO/schema, image/media workflows, social/email automation, analytics and low-cost newsroom tooling.

The review is a discovery process, not an installation queue. A trending repository, high star count or new release is not permission to add software to production. Surface only changes that solve a real GatorBait problem, and run them through the adoption gate below before introducing any dependency or service.

## Native Wix template references

- [Sports Blog (Dynamic)](https://www.wix.com/website-template/view/html/wh-1319)
- [Football Blog (Green)](https://www.wix.com/website-template/view/html/wh-1379)

Use these to compare responsive proportions and Wix-native behavior. Do not create a replacement site or apply a template wholesale to production.

## Approved GatorBait pattern

1. A compact official masthead and shallow primary navigation.
2. One dominant current story with a strong photograph.
3. A small secondary story grid in reverse chronological order.
4. Consistent image boxes using one landscape ratio per module.
5. Short section labels, visible dates and accurate bylines.
6. GatorBait TV and GatorBait Magazine as clear destinations.
7. A short newsletter signup and compact footer.
8. Mobile typography that fits at 390 px without clipping or horizontal scroll.

## Reject by default

- Full frontend-framework migrations for a styling change.
- New font libraries, icon packs, page builders, animation packages or carousel dependencies.
- Imported templates that create duplicate Wix apps, navigation, schemas or routes.
- Theme code with global element selectors, first-paint fades, permanent observers or short polling intervals.
- Repositories without a clear license when code reuse is proposed.
- Dark broadcast-dashboard styling, pale-blue headings, category-feed pages as primary destinations, and empty content modules.

## Adoption gate

Before adding any repository, package, app or code bundle, record:

1. The verified production problem.
2. Why Wix-native behavior cannot solve it safely.
3. License and maintenance evidence.
4. Page-weight and runtime cost.
5. Mobile and accessibility impact.
6. Rollback procedure.
7. Public verification after the change.

If those seven items cannot be answered, do not add it.


## Live competitor benchmark

The repository/reference shortlist above is only one input. The controller must also compare GatorBait's live reader experience against current direct competitors.

Primary live comparison set:

- Gators Online / On3
- GatorCountry
- FloridaGators.com
- Swamp247 / 247Sports when accessible
- a relevant best-in-class national sports/news product for the specific pattern under review

Use docs/CONTINUOUS-DESIGN-BENCHMARK.md as the standing process.

The purpose is continuous product learning: identify useful current patterns in hierarchy, mobile behavior, imagery, utility modules, video, conversion and continuation. Do not copy layouts wholesale and do not add dependencies simply because a competitor uses them.
