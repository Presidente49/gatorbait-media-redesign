# Source-component design gate

Run from the repository root with an existing Python Playwright environment and installed browser:

```sh
python3 newsroom-v2/qa/design_gate.py --executable /usr/bin/chromium --out /tmp/gbm-design-qa
```

Omit `--executable` when the Playwright-managed browser is installed. To test WebKit use `--browser webkit`; a missing engine returns BLOCKED, not PASS. This script never installs a browser or package and does not navigate to production.

It checks responsive widths, computed headline size, descendant bounds (not merely hidden overflow), newest-first selection, repeated-injection idempotence, header-slot ordering, missing-writer data, missing sport data, unmeasured popularity labels, empty data and missing-adapter recovery. It records source SHA-256 hashes and screenshots.

The harness uses `page.set_content`. It replaces one exact homepage-detection line in an in-memory copy to simulate activation on about:blank. A changed detection line blocks the harness for review. Native routing, the actual mobile shell/menu, feed HTTP behavior, image loading, authentication, consent, advertising, CLS and physical iPhone behavior are NOT certified. The test header is only a 60px fixture slot and fixture stories/brand art are synthetic. No live preview uses these fixtures.

Exit 0: component checks pass. Exit 1: at least one check fails. Exit 2: tools/source/harness unavailable. A PASS is never permission to publish.

The full sources are tested except the explicitly simulated activation line. No CSS is rewritten by the harness. Production selection, CDN pins and Wix embeds are unchanged by this work.
