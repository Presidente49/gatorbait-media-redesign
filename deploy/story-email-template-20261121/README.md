# Automatic story email: brand spelling and footer buttons (Nov. 21, 2026)

Owner direction: Brenden, Nov. 21 ("Fix that"), after the site-ops audit showed the automatic story email had lost its Store and Subscribe buttons and spelled the brand as two words.

## What changed

Wix automation `e4ff0da9-65bb-440f-b5a5-5ed94ac3fb31` ("Notify when a blog post is published"), email action `923601ea-11e6-975b-c01e-42db2a0af372`. Content only. The automation was not switched on or off, its trigger and audience were not touched, and nothing was sent.

- "GET GATOR BAIT IN YOUR INBOX" is now "GET GATORBAIT IN YOUR INBOX".
- The line under it lost its dash: "The best Gator stories, clips and columns, in your email first."
- SIGN UP FOR THE EMAIL goes to the email signup form.
- Two buttons are back under it: SHOP THE GATORBAIT STORE and SUBSCRIBE TO GATORBAIT (the links from the Oct. 19 footer, `deploy/confirmed-signup-email-footer-20261019/`).
- The street address from the Oct. 19 template was not restored. The footer still reads "Ocala, Florida".

Subject (`${title} | GatorBait Media`), preheader, masthead, title, image, description and READ THE STORY are unchanged.

## Files

- `rollback/content-before.json`: the exact content before the edit (composer 9,523 characters).
- `content-after.json`: the content now saved (composer 10,152 characters).

## Checks

Wix's own preview of the saved content, with a real story's title, description, link and cover: title resolved, one-word brand, four buttons, no unresolved `${...}`, no street address. Rendered at 390 and 700 px with no sideways scroll.

Not checked: a real send. The next new post is the first one that uses this content.

## Rollback

POST `rollback/content-before.json` to `https://www.wixapis.com/emails-automations/v1/automations/e4ff0da9-65bb-440f-b5a5-5ed94ac3fb31/email-actions/923601ea-11e6-975b-c01e-42db2a0af372/email-content`. The call replaces the content in full.
