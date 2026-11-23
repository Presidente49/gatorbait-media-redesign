# Free ebook placement: Jon Sumrall: Year One (live Nov. 23, 2026)

- **Reader address:** https://www.gatorbaitmedia.com/sumrall-year-one (a Wix redirect to `/?book=sumrall-year-one`).
- **What shows:** a full-screen panel over the page with the cover, a short blurb and the site's existing email signup. Script: `sports-live/book-sumrall-year-one.js`, loaded by one custom embed pinned to a commit, only when the address carries `?book=sumrall-year-one`.
- **Signup:** the existing "GatorBait Email List" Wix form (`6babfee8`), same consent sentence, box unchecked by default, nothing sent without it. Wix upserts the contact and sends its own confirmation email (double opt-in). No new form, automation or email.
- **Delivery:** right after a successful signup the panel shows "Open the book" linking to the PDF in Wix Media (`d3cfa5_6dd223d6392246348d9c55c433359096.pdf`, 27 pages). The browser remembers the signup (a timestamp only, no address), so a returning reader gets the button straight away.
- **Not done:** no email carries the PDF link; the file URL is public to anyone who has it.
- **Rollback:** disable the embed and delete the redirect.
