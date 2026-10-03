# Spaces by Wix (member app)

GatorBait's member app is Spaces by Wix (internally "WixOneApp"). It isn't a branded native app.

## How people join

- **Invite code / link:** Owner: Wix app → site → Manage → **Mobile App** → More Actions → **Share invite code**, or Invite new members (SMS / share sheet). Dashboard: Mobile App → Growth and marketing tools → **Send Campaign** (email invite).
- **Automated invite email:** Wix app → Mobile App → Growth tools → **Enable Email Invite** → toggle "Enable Invite Email Automation". Each new Members Area signup gets an invite. Needs the Members Area.
- **Member side:** Spaces → My Profile → Actions → **Join a site** → enter code. The link opens the store if the app isn't installed. Members can also invite others.
- **Discoverability:** site search in Spaces, a mobile invite banner, a "Download My App" element, and sharing posts to Spaces' Discover tab.
- **Join approval:** if "Join approval" is on, members stay *Pending* until approved (Wix app → Manage → Settings → Your Mobile App → Join approval).
Sources: https://support.wix.com/en/article/inviting-people-to-join-your-site-on-the-wix-member-apps , https://support.wix.com/en/article/wix-member-appsjoining-a-site-on-the-wix-member-apps , https://support.wix.com/en/article/wix-mobile-apps-how-members-use-the-spaces-app , https://support.wix.com/en/article/wix-mobile-apps-5-essential-site-discoverability-tools-to-get-more-members-on-your-spaces-app , https://support.wix.com/en/article/wix-mobile-apps-customizing-member-permissions-in-your-own-mobile-app

## Sending push / broadcasts (owner only)

1. **Custom push notification:** Dashboard → **Mobile App** → Push notifications → **Create Notification** → message → action (an item, a screen, or a custom screen) → recipients (**contacts, labels or segments**) → Send. Also from the Wix owner app / Wix Studio app. Shows opened / delivered stats and supports resend.
   Source: https://support.wix.com/en/article/wix-mobile-apps-sending-customized-push-notifications
2. **Announcement as push:** Wix app → Manage → Marketing → **Mobile Announcements** → Create → title/body/media → Next → keep "Send announcement as a push notification to all members" on → Publish. With the toggle off, it's in-app only.
   Sources: https://support.wix.com/en/article/wix-mobile-apps-sending-an-announcement-as-a-push-notification-in-your-app , https://support.wix.com/en/article/wix-mobile-apps-creating-and-managing-announcements
3. **Automatic push:** new blog posts notify members "who use the Spaces by Wix app ... and have enabled notifications". The owner chooses which notification types are sent, and each member can turn them off (see blog.md).

Every push is an outbound send to readers. It needs Brenden's yes, one sender, and no test pushes to the whole list.

## Why members don't get push

In order of likelihood:
1. They never joined the site in Spaces (a website member isn't automatically a Spaces member).
2. The phone's OS notification permission for Spaces is off.
3. Spaces → My Profile → Settings → Notifications → [site] → Push → "Allow All Push Notifications" is off, or that activity's toggle is off.
4. The member left or hid the site in Spaces.
5. The notification type isn't one the owner enabled.
Sources: https://support.wix.com/en/article/wix-mobile-apps-managing-your-notification-settings-in-the-spaces-app , https://support.wix.com/en/article/wix-mobile-apps-managing-your-sites-on-the-spaces-app

## API

- **No public API was found for pushing to site members** in Spaces. The Wix **Notifications API** (`POST /notifications/v3/notify`) sends to *Wix users* (owner and collaborators: dashboard feed, owner app), not to site members, and needs an app-defined template.
  Source: https://dev.wix.com/docs/api-reference/business-management/notifications/notifications/introduction
- Pre-installed automations for apps can use a "Send a push notification" action. That's for app developers, not site owners.
  Source: https://dev.wix.com/docs/build-apps/develop-your-app/extensions/backend-extensions/automations/pre-installed-automations/add-a-pre-installed-automation-to-your-app
- So Spaces push is **dashboard / owner-app only**. Agents can draft the copy and target segment. The owner sends.

## Access control in the app

Tab/screen permissions by badge or pricing plan: Wix app → Mobile App → Edit → Screens → More Actions → Set screen permissions. Use this to keep paid content paid in the app too.
