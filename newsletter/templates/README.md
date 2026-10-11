# Magazine layout and issue data

`gatorbait-magazine-colorlib-v1.mjml` is a reusable Barlow layout. It retains the masthead, lead cover, two-column game file, secondary photo story, four-card editorial grid, utility strip and footer. Issue data supplies eight stories, two distinct credited photos, three utility links, a dated label and a tracking key. No old issue or account-specific link is a default.

The original September issue is preserved byte-for-byte as a private local fixture outside this public checkout. Git history is unchanged. It is evidence of the prior layout, not an input for a new edition.

`gatorbait-magazine-synthetic.json` contains invented copy, a visibly synthetic date and reserved `example.invalid` links. Render it locally with an installed MJML compiler:

```sh
MJML_MODULE=/path/to/mjml/lib/index.js node automation/newsletter/build-magazine.mjs \
  --json newsletter/templates/gatorbait-magazine-synthetic.json \
  --out /tmp/gatorbait-magazine-synthetic --synthetic
node --test automation/newsletter/build-magazine.test.mjs
```

`--synthetic` accepts only `example.invalid` URLs. Omit that flag for a real local draft: article URLs must be canonical public story links, photos must have explicit rights/permanence evidence and permanent media URLs, and all data must pass the separate editorial release checks. Real input and output belong in private storage outside the checkout. The renderer performs no fetch, campaign creation, adapter activation or email send. Its output contains only MJML, HTML and a count-only validation report, written with private file permissions.

Strict compilation and synthetic layout checks are source validation. Freshness, actual bylines, rights, provider preview, consent/suppression, the send governor, campaign-specific owner approval and provider delivery remain release requirements. Do not compile the unresolved layout directly or mistake the synthetic fixture for a current edition.
