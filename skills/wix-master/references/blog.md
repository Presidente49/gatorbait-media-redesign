# Wix Blog

~4,570 posts. The homepage and Magazine read `/blog-feed.xml`, so every post publish changes public surfaces and may fire notifications. Treat a post publish as outbound.

## Limits and objects

- Max 100,000 posts. Max 400 KB per post. A post can be in up to 10 categories. Draft posts vs published posts are separate objects in the API.
Source: https://dev.wix.com/docs/api-reference/business-solutions/blog/introduction?apiView=SDK

## Roles

| Action | Owner/Admin | Blog Editor | Blog Writer | Guest Writer | Managed Writer |
|---|---|---|---|---|---|
| Access Editor | Yes | No | No | No | No |
| Create post | Yes | Yes | Yes | Yes | No (can be assigned as author) |
| Publish | Yes | Yes | Own only | **No, needs approval** | No |
| Manage others' posts | Yes | Yes | No | No | No |
| Create/manage categories | Yes | Yes | No | No | No |
| Create tags | Yes | Yes | Yes | Yes | No |
| Pin / feature | Yes | Yes | No | No | No |

- Editors, Writers and Guest Writers become **site members** automatically. Managed writers don't, which makes them the right choice for bylines like "GatorBait Staff" with no login.
- Add via Roles & Permissions → Invite People → Blog Roles, or Blog → Writers → Add Writer. Writer profile pages come from the Members Area.
Sources: https://support.wix.com/en/article/wix-blog-adding-writers-and-editors-in-wix-blog , https://support.wix.com/en/article/wix-blog-adding-profile-pages-for-your-blog-writers , https://support.wix.com/en/article/roles-permissions-overview

## Paywall (post ↔ plan)

- **Per post:** Blog → open post → **Monetize** (left toolbar) → toggle plans. Or create a plan from there. Or Pricing Plans → plan → Connect benefits → Choose Posts.
- **Whole blog:** Editor → Pages & Menu → Blog Pages → Post page (and optionally Blog page) → Settings → **Permissions** → Members only → "Only selected members or paying customers" → select plans. This locks every post. High risk.
- Guest checkout can't grant online content. Buyers must be members.
Sources: https://support.wix.com/en/article/wix-blog-creating-blog-post-subscriptions , https://support.wix.com/en/article/pricing-plans-limiting-your-blog-to-members-who-purchased-a-pricing-plan , https://support.wix.com/en/article/pricing-plans-connecting-a-plan-to-content-services-in-the-wix-app

## New-post notifications (the whole picture)

Who can get them: blog **members**, **subscribers** from a subscribe form, and **Spaces app** users with push enabled.

- **Email:** runs through Wix **Automations** (Blog → More Actions → Blog settings → Manage your notifications & emails). The pre-installed automation is only partly editable. Duplicate it to customize. Sent to all members or to followers of an author.
- **Push:** to Spaces/native-app members who enabled notifications. Members control their own toggles.
- **Can't** notify for specific posts only, or to specific members only (Wix FAQ).
- **Excluded recipients:** bad or out-of-date addresses; anyone who marked a notification as spam; previously undeliverable addresses; unsubscribed (email link or My Account → Settings); contacts whose site language differs from the post's; blocked members; **the post's own author**; and **inactive** contacts, meaning those who didn't open a number of notifications in a row. They reactivate by opening a recent one.
- Blog notification emails count against the **Email Marketing monthly allowance**. If the limit is hit, some notifications don't send.
Source: https://support.wix.com/en/article/wix-blog-sending-new-post-notifications-to-members-and-site-subscribers

GatorBait specifics: two "new blog post" automations have been active (double-notify risk, site-ops). Identify by automation ID + origin + action ID, keep one outbound owner, and read execution evidence before any resend (Master Control publishing playbook). A changed `lastPublishedDate` isn't a new post (LESSONS #36).

## Post SEO and settings

Per post: Blog → post → Settings → SEO (slug, title, description, index toggle, social). Patterns for all posts: SEO Settings → Blog Posts (seo.md). Slug changes auto-create a 301.

## Design

Post and feed design is Editor-only (site-design-fonts.md). Text styled in the post composer overrides the template for that post only.
