# GatorBait Magazine — downloadable issue builder

Builds a self-contained, magazine-format issue carrying **whole articles**, for
sale as a numbered issue. Distinct from the curated teaser email in
`newsletter/`, which links out to the site.

## Product rules

- **No outbound links.** Link decorations are stripped and the words kept, so a
  source citation survives as text the way it would in print. The issue must
  read correctly with no network and no live site.
- **Whole articles**, not excerpts or "read more" teasers.
- **Web furniture removed**: trailing "More From…" link lists and subscribe
  pitches do not belong in something a reader paid for.
- Real photography with its credit. Wix stays the system of record for every
  article; `build-cache/` is a transient build input, safe to delete.

## Where the text comes from, and why not the feed

`fetch_feed.py` tests the obvious route first: the public blog feed at
`/blog-feed.xml`. **It does not work, and this is measured, not assumed.**
Run 35952474280 pulled 25 items and every one returned **0 body characters** —
Wix publishes `<description>` excerpts and no `content:encoded`. The longest
excerpt was 500 characters against articles running 2,500–15,900.

So bodies come from the Blog API `POST /blog/v3/posts/query` with
`fieldsets: ["URL", "RICH_CONTENT"]`, which returns real structure:
`PARAGRAPH`, `BLOCKQUOTE`, `HEADING` and `IMAGE` nodes, with `BOLD`/`ITALIC`/
`LINK` decorations on the text runs.

Do **not** use `CONTENT_TEXT` for layout. It returns each story as one
unbroken blob with zero newlines and the photo credit and byline mashed into
the opening sentence — verified on post `b3adef75`.

The API needs credentials, which never go near CI or a commit, so the fetch is
run from an authenticated session and the normalized result is written to
`build-cache/posts/<id>.json`. CI then builds and renders without secrets.

## Image provenance — read this before selling an issue

Every build prints each photograph's URL under "photography in this issue".
**Look at them.** The first render of the Ole Miss issue put a frame carrying a
visible `© Tim Casey / GatorCountry.com` watermark on the cover and again as
the lead story's hero. A competitor's copyright notice on the cover of an issue
you charge for is a licensing problem, not a design nit, and no automated check
can read a watermark baked into pixels. A person has to look.

The build does enforce what it can:

- **no outbound links** anywhere in the issue, or the build fails
- **no image used twice** inside one issue, or the build fails — the rule from
  `docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md` §4.3
- the cover story does not repeat the cover frame as its own hero; it opens on
  its first inline photograph instead

## Open-source worth adopting: Paged.js

Chromium's `page.pdf()` paginates, but gives no page numbers, no running
headers and no margin boxes — the things that separate a magazine from a
printout. [Paged.js](https://github.com/pagedjs/pagedjs) (MIT, ~1.5k stars)
polyfills the CSS Paged Media and Generated Content modules and supports all
three. It is a build-time npm dependency running inside the CI Chromium that is
already here: no service, no account, no recurring cost.
[Vivliostyle](https://vivliostyle.org/) solves the same problem via a CLI and is
the alternative if Paged.js disappoints.
