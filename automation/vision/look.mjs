// Loads the live GatorBait site in a real browser on a GitHub Actions runner,
// which can reach gatorbaitmedia.com, and writes back screenshots plus a
// structured report. This session's sandbox is blocked from the site by network
// policy, so CI is the only way to actually see what visitors see.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const OUT = 'automation/vision/latest';
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { name: 'home', url: 'https://www.gatorbaitmedia.com/' },
  { name: 'blog', url: 'https://www.gatorbaitmedia.com/gatorbait-media-blogs' },
  // A real article page. The blog index is a list; this is where readers
  // actually read, and where the layout rules in docs/BLOG-LAYOUT-RULES.md
  // have to hold.
  { name: 'article', url: 'https://www.gatorbaitmedia.com/post/saturday-s-bill-comes-due-gators-ole-miss-and-the-promise-that-started-it-all' },
];

// 390 and 430 are the widths the Magazine/homepage acceptance gates name.
// 320 stays because Wix actually serves a 320px layout to the narrowest phones,
// which is below every breakpoint the embeds define.
const PROFILES = [
  { name: 'mobile', device: devices['iPhone 13'] },
  // The user agent matters as much as the viewport: without a mobile UA, Wix
  // serves these profiles the DESKTOP page in a narrow window and reports a
  // 980px layout viewport. That measures nothing about the phone experience.
  { name: 'phone390', device: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
  { name: 'phone430', device: { ...devices['iPhone 14 Pro Max'], viewport: { width: 430, height: 932 } } },
  { name: 'desktop', device: { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 } },
];

// Runs in the page. Reports what actually rendered, not what the CSS claims.
function audit() {
  const out = { url: location.href, width: innerWidth, findings: [] };

  const header = document.querySelector('#SITE_HEADER');
  const pages = document.querySelector('#SITE_PAGES');
  const live = document.querySelector('#gbm-live');

  out.rootClasses = document.documentElement.className || '(none)';
  out.hasNewsroom = !!live;
  out.newsroomChildren = live ? live.children.length : 0;
  out.nativePagesVisible = pages ? getComputedStyle(pages).display !== 'none' : null;

  // Both visible at once is the layer conflict, rendered.
  if (live && live.children.length && out.nativePagesVisible) {
    out.findings.push('BOTH newsroom and native #SITE_PAGES are visible — layer conflict');
  }

  if (header) {
    const cs = getComputedStyle(header);
    out.header = {
      height: Math.round(header.getBoundingClientRect().height),
      cssHeight: cs.height,
      overflow: cs.overflow,
      scrollHeight: header.scrollHeight,
      clientHeight: header.clientHeight,
    };
    // Fixed height + content taller than the box = clipped content.
    if (header.scrollHeight > header.clientHeight + 2) {
      out.findings.push(
        `Header content is clipped: scrollHeight ${header.scrollHeight} > clientHeight ${header.clientHeight}`
      );
    }
  }

  // Anything spilling past the viewport horizontally.
  const overflowing = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > innerWidth + 2 || r.left < -2)) {
      if (overflowing.length < 8) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          cls: (el.className && String(el.className).slice(0, 60)) || null,
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
  });
  out.horizontalOverflow = overflowing;
  // Only a finding when it actually widens the document. An element parked
  // past the right edge is usually a closed off-canvas drawer doing its job,
  // and flagging those as defects is a false positive.
  out.pageScrollsSideways = document.documentElement.scrollWidth > innerWidth + 2;
  if (overflowing.length && out.pageScrollsSideways) {
    out.findings.push(`${overflowing.length}+ elements push the page wider than the screen`);
  } else if (overflowing.length) {
    out.offscreenOnly = overflowing.length;
  }

  // Tap targets smaller than the 44px guideline.
  let small = 0;
  document.querySelectorAll('a,button,[role="button"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 24)) small++;
  });
  out.smallTapTargets = small;
  if (small > 10) out.findings.push(`${small} tap targets under 44px`);

  // Knowing a retired name is on the page is not enough to remove it. Report
  // WHERE: the element holding the text, so the owner can be identified.
  // Case-sensitive on purpose - "sidelines" is an ordinary football word and
  // matching it loosely produces false positives.
  const RETIRED = ['Monday Chomp', 'Quick Chomps', 'Sidelines', 'Rob Browne'];
  const retiredFound = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let tn;
  while ((tn = walker.nextNode())) {
    const parent = tn.parentElement;
    if (!parent) continue;
    const tag = parent.nodeName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
    const value = tn.nodeValue || '';
    for (const term of RETIRED) {
      const at = value.indexOf(term);
      if (at === -1) continue;
      if (retiredFound.some((f) => f.term === term)) continue;
      const box = parent.getBoundingClientRect();
      retiredFound.push({
        term,
        tag: tag.toLowerCase(),
        id: parent.id || null,
        cls: (parent.className && String(parent.className).slice(0, 70)) || null,
        // Where it sits, so a desktop-only widget is distinguishable from body copy.
        top: Math.round(box.top + scrollY),
        visible: box.width > 0 && box.height > 0 && getComputedStyle(parent).visibility !== 'hidden',
        context: value.slice(Math.max(0, at - 60), at + 80).replace(/\s+/g, ' ').trim(),
        ancestry: (() => {
          const chain = [];
          let el = parent;
          for (let i = 0; i < 4 && el && el !== document.body; i++) {
            chain.push(el.nodeName.toLowerCase() + (el.id ? '#' + el.id : '') +
              (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : ''));
            el = el.parentElement;
          }
          return chain.join(' < ');
        })(),
      });
    }
  }
  out.retiredBranding = retiredFound.map((f) => f.term);
  out.retiredBrandingWhere = retiredFound;
  if (retiredFound.length) {
    out.findings.push('Retired branding present: ' + out.retiredBranding.join(', '));
  }

  // Does a reader see journalism above the fold, or only furniture? Scoped to
  // the rendered newsroom so header navigation cannot pass this check for it.
  if (live && live.children.length) {
    const heads = [];
    live.querySelectorAll('h1,h2,h3,h4,a').forEach((el) => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t.length < 20) return;
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 8) return;
      if (getComputedStyle(el).visibility === 'hidden') return;
      heads.push({ el, text: t.slice(0, 90), top: Math.round(r.top + scrollY), tag: el.tagName.toLowerCase() });
    });
    heads.sort((a, b) => a.top - b.top);
    out.viewportHeight = innerHeight;
    out.firstHeadline = heads[0] || null;

    // Sitting inside the viewport box is not the same as being readable. The
    // consent banner is fixed to the bottom of the screen and covers whatever
    // is under it, so ask the page what is actually painted at that point
    // rather than trusting the rectangle. An earlier version of this check
    // passed a headline that the cookie wall was sitting on top of.
    let occludedBy = null;
    if (heads[0]) {
      const el = heads[0].el;
      const r = el.getBoundingClientRect();
      const x = Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2));
      const y = Math.min(innerHeight - 2, Math.max(2, r.top + Math.min(r.height / 2, 10)));
      const hit = document.elementFromPoint(x, y);
      if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) {
        occludedBy = (hit.id && '#' + hit.id) ||
          (hit.className && '.' + String(hit.className).trim().split(/\s+/)[0]) ||
          hit.tagName.toLowerCase();
      }
      delete heads[0].el;
    }
    out.firstHeadlineOccludedBy = occludedBy;
    out.headlineInViewport = !!(heads[0] && heads[0].top + 20 <= innerHeight);
    out.headlineReadable = out.headlineInViewport && !occludedBy;

    if (!heads[0]) {
      out.findings.push('No story text rendered in the newsroom at all');
    } else if (!out.headlineInViewport) {
      out.findings.push(
        `No story text on the first screen: headline starts at ${heads[0].top}px in a ${innerHeight}px viewport`
      );
    } else if (occludedBy) {
      out.findings.push(
        `First headline is covered: it sits at ${heads[0].top}px in a ${innerHeight}px viewport but \`${occludedBy}\` is painted over it`
      );
    }

    // The first <img> in the tree is often a 0x0 lazy placeholder, which
    // measures nothing. Take the tallest one actually painted in the first
    // two screens instead — that is the photograph a reader sees.
    let leadImg = null, leadH = 0;
    live.querySelectorAll('img').forEach((im) => {
      const b = im.getBoundingClientRect();
      if (b.height > leadH && b.width > 40 && b.top < innerHeight * 2) { leadH = b.height; leadImg = im; }
    });
    if (leadImg) {
      const r = leadImg.getBoundingClientRect();
      out.leadImage = { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top + scrollY) };
      if (r.height > innerHeight * 0.6) {
        out.findings.push(
          `Lead image is ${Math.round(r.height)}px tall in a ${innerHeight}px viewport (${Math.round((r.height / innerHeight) * 100)}% of the screen)`
        );
      }
    }
  }

  // Line length is the single biggest readability lever on an article page.
  // Estimate characters per line from the rendered column width and font size:
  // an average glyph runs about half the font size in these faces.
  const paras = [...document.querySelectorAll('p')]
    .filter((el) => (el.textContent || '').trim().length > 180);
  if (paras.length) {
    const widths = paras.slice(0, 12).map((el) => {
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize) || 16;
      return Math.round(el.getBoundingClientRect().width / (fs * 0.5));
    }).sort((a, b) => a - b);
    const measure = widths[Math.floor(widths.length / 2)];
    out.bodyMeasure = measure;
    out.bodyParagraphs = paras.length;
    if (measure > 85) {
      out.findings.push(`Body measure is ~${measure} characters per line; over 85 tires the eye`);
    } else if (measure < 45) {
      out.findings.push(`Body measure is ~${measure} characters per line; under 45 breaks the rhythm`);
    }
  }

  // A phone profile that ends up in a desktop layout viewport is measuring the
  // wrong page. Say so rather than publishing the number.
  out.layoutViewport = innerWidth;
  out.docScrollWidth = document.documentElement.scrollWidth;
  return out;
}

const report = { capturedAt: new Date().toISOString(), runs: [], urlChecks: [] };

// The proposed front page, rendered here because this is the only place the
// Wix image CDN is reachable. Screenshot lands beside the live-site shots so
// the two can be compared directly.
const PROPOSED = 'flagship/front-page/index.html';

// Two questions this session could not answer from its sandbox, both of which
// changed decisions tonight. CI can just ask.
const URL_CHECKS = [
  // Does jsDelivr serve the fixed commit? This blocked the newsroom fix.
  'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@32127d938ad41b0f78517a0abdec32bf11d576ce/newsroom-preview/wix-live.js',
  // Control: the commit that was live and working.
  'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@d03d9d1e0350c55be03df1a8ebed0180c9a74c5d/newsroom-preview/wix-live.js',
  // Are the sitemaps still served? sitemap-index.xml points at these.
  'https://presidente49.github.io/gatorbait-media-redesign/news-sitemap.xml',
  'https://presidente49.github.io/gatorbait-media-redesign/posts-sitemap.xml',
  'https://presidente49.github.io/gatorbait-media-redesign/sitemap-index.xml',
];

for (const url of URL_CHECKS) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const body = await res.text();
    report.urlChecks.push({ url, status: res.status, bytes: body.length });
  } catch (err) {
    report.urlChecks.push({ url, status: 'ERROR', error: String(err).slice(0, 160) });
  }
}

const browser = await chromium.launch();

for (const profile of PROFILES) {
  for (const target of TARGETS) {
    const context = await browser.newContext(profile.device);
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)));

    let status = null;
    try {
      const res = await page.goto(target.url, { waitUntil: 'load', timeout: 45000 });
      status = res ? res.status() : null;
      // Let the late-firing embed timers do their worst before we look.
      await page.waitForTimeout(6000);
    } catch (err) {
      report.runs.push({ profile: profile.name, target: target.name, error: String(err).slice(0, 300) });
      await context.close();
      continue;
    }

    const shot = `${OUT}/${target.name}-${profile.name}.jpg`;
    await page.screenshot({ path: shot, type: 'jpeg', quality: 62, fullPage: false });

    const audited = await page.evaluate(audit);

    // Candidate fixes are tried against the REAL page here, in CI, and only
    // judged from the resulting screenshot. Nothing is applied to the site.
    let candidate = null;
    const CAND = 'automation/vision/candidate.css';
    if (existsSync(CAND)) {
      const css = readFileSync(CAND, 'utf8');
      await page.addStyleTag({ content: css });
      await page.waitForTimeout(1200);
      const afterShot = `${OUT}/${target.name}-${profile.name}-candidate.jpg`;
      await page.screenshot({ path: afterShot, type: 'jpeg', quality: 62, fullPage: false });
      const afterAudit = await page.evaluate(audit);
      candidate = {
        screenshot: afterShot,
        headerBefore: audited.header || null,
        headerAfter: afterAudit.header || null,
        findingsBefore: audited.findings.length,
        findingsAfter: afterAudit.findings.length,
        resolved: audited.findings.filter(function (f) { return !afterAudit.findings.includes(f); }),
        introduced: afterAudit.findings.filter(function (f) { return !audited.findings.includes(f); }),
      };
    }
    report.runs.push({
      profile: profile.name,
      target: target.name,
      status,
      screenshot: shot,
      consoleErrors: consoleErrors.slice(0, 6),
      candidate,
      ...audited,
    });
    await context.close();
  }
}

// --- proposed front page, same devices, real photos -----------------------
if (existsSync(PROPOSED)) {
  for (const profile of PROFILES) {
    const context = await browser.newContext(profile.device);
    const page = await context.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    try {
      await page.goto('file://' + process.cwd() + '/' + PROPOSED, {
        waitUntil: 'networkidle',
        timeout: 45000,
      });
      await page.waitForTimeout(2500);
      const shot = `${OUT}/proposed-${profile.name}.jpg`;
      await page.screenshot({ path: shot, type: 'jpeg', quality: 68, fullPage: false });
      const a = await page.evaluate(audit);
      // Did the Wix photos actually load, or are we looking at empty frames?
      const imgs = await page.evaluate(() =>
        [...document.images].map((i) => ({ ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth }))
      );
      report.runs.push({
        profile: profile.name,
        target: 'PROPOSED front page',
        status: 200,
        screenshot: shot,
        imagesLoaded: imgs.filter((i) => i.ok).length + '/' + imgs.length,
        consoleErrors: errs.slice(0, 4),
        ...a,
      });
    } catch (err) {
      report.runs.push({ profile: profile.name, target: 'PROPOSED front page', error: String(err).slice(0, 240) });
    }
    await context.close();
  }
}

await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));

const lines = ['# Live site vision — ' + report.capturedAt, ''];
lines.push('## URL checks', '', '| URL | Status | Bytes |', '|---|---:|---:|');
for (const c of report.urlChecks) {
  lines.push('| `' + c.url.replace('https://', '').slice(0, 78) + '` | ' + c.status + ' | ' + (c.bytes ?? '—') + ' |');
}
lines.push('');
for (const r of report.runs) {
  lines.push(`## ${r.target} · ${r.profile}`);
  if (r.error) { lines.push('FAILED: ' + r.error, ''); continue; }
  lines.push(`HTTP ${r.status} · viewport ${r.width}px · root classes \`${r.rootClasses}\``);
  lines.push(`newsroom mounted: ${r.hasNewsroom} (${r.newsroomChildren} children) · native pages visible: ${r.nativePagesVisible}`);
  if (r.header) lines.push(`header ${r.header.height}px rendered, overflow ${r.header.overflow}, content ${r.header.scrollHeight}px`);
  lines.push(`tap targets under 44px: ${r.smallTapTargets}`);
  if (r.bodyMeasure) lines.push(`body measure: ~${r.bodyMeasure} characters per line across ${r.bodyParagraphs} paragraphs`);
  if (r.headlineReadable !== undefined) {
    lines.push(
      `readable story text on the first screen: ${r.headlineReadable}` +
      (r.firstHeadline ? ` (first headline at ${r.firstHeadline.top}px of ${r.viewportHeight}px — "${r.firstHeadline.text}")` : '') +
      (r.firstHeadlineOccludedBy ? ` — covered by \`${r.firstHeadlineOccludedBy}\`` : '')
    );
  }
  if (r.leadImage) lines.push(`lead image ${r.leadImage.width}x${r.leadImage.height}px at y=${r.leadImage.top}`);
  if (r.imagesLoaded) lines.push(`images loaded: ${r.imagesLoaded}`);
  lines.push(r.findings.length ? '\n**Findings**\n' + r.findings.map((f) => '- ' + f).join('\n') : '\nNo findings.');
  if (r.retiredBrandingWhere && r.retiredBrandingWhere.length) {
    lines.push('\n**Retired branding, located**');
    for (const f of r.retiredBrandingWhere) {
      lines.push(`- \`${f.term}\` in \`${f.ancestry}\` at y=${f.top}, visible=${f.visible}`);
      lines.push(`  > ${f.context}`);
    }
  }
  if (r.consoleErrors.length) lines.push('\nConsole errors:\n' + r.consoleErrors.map((e) => '- `' + e + '`').join('\n'));
  if (r.candidate) {
    const c = r.candidate;
    lines.push('\n**Candidate fix applied in CI (not live)**');
    if (c.headerBefore && c.headerAfter) {
      lines.push(`- header box ${c.headerBefore.clientHeight}px -> ${c.headerAfter.clientHeight}px, content ${c.headerBefore.scrollHeight}px -> ${c.headerAfter.scrollHeight}px`);
    }
    lines.push(`- findings ${c.findingsBefore} -> ${c.findingsAfter}`);
    if (c.resolved.length) lines.push('- RESOLVED: ' + c.resolved.join('; '));
    if (c.introduced.length) lines.push('- INTRODUCED: ' + c.introduced.join('; '));
  }
  lines.push('');
}
writeFileSync(`${OUT}/REPORT.md`, lines.join('\n'));
console.log(lines.join('\n'));
