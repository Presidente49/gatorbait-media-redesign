# GatorBait Master Control — Meta Control Plane

## Goal

Give Master Control reliable access to GatorBait's Meta surfaces without confusing:

- paid Meta Ads
- organic Facebook Page content
- Instagram professional content
- Wix-created social posts
- native field posts made directly in Facebook/Instagram
- public fallback/social research

Use the least-fragile provider path for each job.

## Routing order

### 1. Real-time organic Facebook / field posts

Preferred:

**Windsor.ai `facebook_organic`**

Why:

- OAuth is handled by a connected integration rather than hand-managed Page tokens
- supports organic reads
- supports `create_post` and `create_photo_post`
- is the best fit for monitoring native Gator Bait Media Page posts created directly from the field

Current state as of 2026-09-19:

**available but not authorized**

OAuth authorization requires Brenden to complete Meta's browser consent screen.

After authorization:

1. call Windsor `get_connectors`
2. identify the Page/account whose name/ID resolves to **Gator Bait Media**
3. call `get_fields`
4. read recent posts, timestamps, URLs, media, reach/engagement fields exposed by the connector
5. compare those posts with Wix-controller posts and GA4 referral/UTM traffic
6. distinguish native/external Page posts from controller-origin posts

### 2. Instagram professional account

Preferred:

**Windsor.ai `instagram`**

Current state:

**available but not authorized**

Use it for owner-level Instagram reads/publishing after OAuth.

The existing Wix Instagram authorization is invalid and must be reauthorized separately if Wix publishing is still desired.

### 3. Wix Social Publisher

Use for:

- controller-created Facebook posts
- controller-created Instagram posts after Instagram is reconnected
- known canonical links/UTMs
- Wix post insight summaries
- connected Page target inventory
- publication state

Do not use Wix as the real-time truth source for posts Chris or another field contributor creates natively inside Facebook/Instagram.

Wix's own docs state native social posts are imported on a delayed periodic sync and cannot be requested on demand.

### 4. Paid Meta / Facebook Ads

Use:

**Windsor `facebook` / dedicated Facebook Ads namespace**

This connector is already connected.

It is for:

- ad campaigns
- ad sets
- ads
- budgets
- Meta paid performance
- boosting where explicitly authorized

Do not mistake this for the organic Page feed.

No paid action occurs without explicit owner authorization.

## Current GatorBait Facebook targets

Wix currently verifies these Facebook targets:

- Gator Bait Media — `192930054063033` — default
- Best Fridays in Football — `101360751735365`
- The Buddy Martin Show — `164984480218367`

When the task says **GatorBait Facebook**, default to the Gator Bait Media Page unless the content clearly belongs to a show-specific Page.

## Instagram Wix repair

Wix currently reports:

- Facebook status: `VALID`
- Instagram status: `INVALID`
- Meta error: OAuth code `190`, subcode `460`

Repair procedure:

1. obtain a fresh Wix Instagram connect URL through the Wix Accounts API
2. Brenden completes Meta browser authorization
3. poll Wix long-lived token status until `VALID`
4. list Instagram accounts and confirm the expected professional account
5. test with a non-destructive read before relying on publishing

Never store Wix's OAuth connect URL in Git because it contains transient state.

## Direct local Graph API fallback

Use only if the managed OAuth connectors cannot perform the necessary job.

### Facebook Pages MCP

Reviewed candidate:

`lanternrow/facebook-pages-mcp`

Observed characteristics:

- current release line in June 2026
- Meta Graph API v25
- Page info
- Page-level insights
- published posts
- post insights
- comments
- video insights
- full Page feed
- text/link/photo publishing
- rate-limit header tracking
- native fetch / small dependency surface

Credential requirements include a Meta Page access token and Page ID.

Because direct tokens create more operational/security responsibility than managed Windsor OAuth, this is a fallback rather than the first production path.

### Instagram MCP

Reviewed candidate:

`mcpware/instagram-mcp`

Observed characteristics:

- official Instagram Graph API integration
- professional/business account support
- media reads
- media insights
- content publishing
- account/Page discovery
- optional DM features requiring higher Meta permissions
- security work including encrypted environment-secret support in recent repo history

Use only with securely managed local credentials.

### Official Meta SDK references

For owned adapter work, prefer Meta's maintained SDKs as implementation references:

- `facebook/facebook-python-business-sdk`
- `facebook/facebook-nodejs-business-sdk`

If GatorBait later builds its own `gatorbait-meta-mcp`, make it a thin, least-privilege wrapper around official Graph endpoints/SDK behavior, not scraping.

## Rejected production patterns

Do not use:

- cookie/session scraping
- browser scraping as the primary Meta backend
- Instagram private APIs
- personal-session reuse
- repos that require handing access tokens to third-party hosted servers
- MCPs whose own documentation says live Graph behavior has not been verified, unless they are explicitly being tested in an isolated non-production environment

## Chris Spears field workflow

Chris should be able to remain on the field.

If Chris posts directly to the Gator Bait Media Facebook Page:

1. Windsor Facebook Organic reads the latest native Page post
2. identify post timestamp/media/caption/URL
3. preserve Chris Spears credit where appropriate
4. compare engagement/reach with current field-post baseline
5. determine whether the photo/post belongs in:
   - the live game gallery
   - homepage imagery
   - a game update/article
   - email
   - a second social channel
6. do not duplicate a native post blindly
7. where useful, turn the owned-site gallery/article into the canonical destination and use social to drive traffic back to GatorBait

The site asset should preserve the original photography rather than regenerate it unless the user explicitly asks for a graphic/derivative.

## Attribution

Where GatorBait controls the outbound link:

- canonical GatorBait URL
- explicit `utm_source`
- explicit `utm_medium`
- explicit `utm_campaign`
- optional `utm_content`

Native photo-only field posts may not have a site link. Treat them as awareness assets until a tracked site CTA is deliberately attached.

## Live checks before recommendations

Before recommending another social push:

- inspect current post age
- impressions/reach
- interactions/comments/shares
- current site referrals
- current article engagement
- whether an existing post is still accumulating
- whether Wix/social insight data is delayed

Do not recommend reposting based on editorial instinct alone.

## Credential rules

Never commit:

- Page access tokens
- user access tokens
- system-user tokens
- app secrets
- OAuth codes
- browser cookies
- session data

Use managed OAuth wherever possible.

For local direct-Meta fallbacks, keep secrets in local protected config/keychain and pass them at process runtime only.

## Truth hierarchy for Meta

1. direct live organic provider connection (Windsor Organic or owned Graph adapter)
2. current Meta/Wix connection-status read
3. current Wix controller-created post data
4. current third-party social analytics connector
5. delayed imported/native-post data
6. public web/search
7. assumptions

Do not claim a native Facebook field post is absent merely because Wix has not imported it yet.
