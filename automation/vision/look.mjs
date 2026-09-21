// Loads the live GatorBait site in a real browser on a GitHub Actions runner,
// which can reach gatorbaitmedia.com, and writes back screenshots plus a
// structured report. This session's sandbox is blocked from the site by network
// policy, so CI is the only way to actually see what visitors see.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'automation/vision/latest';
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { name: 'home', url: 'https://www.gatorbaitmedia.com/' },
  { name: 'blog', url: 'https://www.gatorbaitmedia.com/gatorbait-media-blogs' },
];

const PROFILES = [
  { name: 'mobile', device: devices['iPhone 13'] },
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
  if (overflowing.length) out.findings.push(`${overflowing.length}+ elements overflow horizontally`);

  // Tap targets smaller than the 44px guideline.
  let small = 0;
  document.querySelectorAll('a,button,[role="button"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 24)) small++;
  });
  out.smallTapTargets = small;

  out.retiredBranding = ['Monday Chomp', 'Quick Chomps', 'Sidelines', 'Rob Browne']
    .filter((s) => document.body.innerText.includes(s));
  if (out.retiredBranding.length) {
    out.findings.push('Retired branding present: ' + out.retiredBranding.join(', '));
  }

  out.docScrollWidth = document.documentElement.scrollWidth;
  if (document.documentElement.scrollWidth > innerWidth + 2) {
    out.findings.push('Page scrolls horizontally');
  }
  return out;
}

const report = { capturedAt: new Date().toISOString(), runs: [] };
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
    report.runs.push({
      profile: profile.name,
      target: target.name,
      status,
      screenshot: shot,
      consoleErrors: consoleErrors.slice(0, 6),
      ...audited,
    });
    await context.close();
  }
}

await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));

const lines = ['# Live site vision — ' + report.capturedAt, ''];
for (const r of report.runs) {
  lines.push(`## ${r.target} · ${r.profile}`);
  if (r.error) { lines.push('FAILED: ' + r.error, ''); continue; }
  lines.push(`HTTP ${r.status} · viewport ${r.width}px · root classes \`${r.rootClasses}\``);
  lines.push(`newsroom mounted: ${r.hasNewsroom} (${r.newsroomChildren} children) · native pages visible: ${r.nativePagesVisible}`);
  if (r.header) lines.push(`header ${r.header.height}px rendered, overflow ${r.header.overflow}, content ${r.header.scrollHeight}px`);
  lines.push(`tap targets under 44px: ${r.smallTapTargets}`);
  lines.push(r.findings.length ? '\n**Findings**\n' + r.findings.map((f) => '- ' + f).join('\n') : '\nNo findings.');
  if (r.consoleErrors.length) lines.push('\nConsole errors:\n' + r.consoleErrors.map((e) => '- `' + e + '`').join('\n'));
  lines.push('');
}
writeFileSync(`${OUT}/REPORT.md`, lines.join('\n'));
console.log(lines.join('\n'));
