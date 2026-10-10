#!/usr/bin/env node
// Playwright QA for the Pick 'Em embed. Serves fixture.html + pickem.html at https://www.gatorbaitmedia.com/pick-em
// through page.route (nothing reaches the live site; Wix API calls are answered by the fixture's in-page mock).
//   node deploy/pickem/qa.mjs           -> asserts, writes shots/pickem-*.png, exits 1 on any failure
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(join(execSync('npm root -g').toString().trim(), 'playwright'));
const EMBED = readFileSync(join(HERE, 'pickem.html'), 'utf8');
const CONFIG = readFileSync(join(HERE, 'pickem-config.html'), 'utf8');
const FIXTURE = readFileSync(join(HERE, 'fixture.html'), 'utf8');
const SHOTS = join(HERE, 'shots');
mkdirSync(SHOTS, { recursive: true });
const ORIGIN = 'https://www.gatorbaitmedia.com';
const CONSENT = 'Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime.';

let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failures++; };

// ---- static checks ----
ok(EMBED.length < 15000, `embed is ${EMBED.length} chars (< 15,000 Wix custom-code limit)`);
ok(EMBED.length + CONFIG.length < 15000 || CONFIG.length < 1500, `config embed is ${CONFIG.length} chars`);
try { new Function(EMBED.split('<script>')[1].split('</script>')[0]); ok(true, 'embed script parses'); } catch (e) { ok(false, 'embed script parses: ' + e.message); }
ok(!/#0{3}\b|color:#000|color:black/i.test(EMBED), 'no pure-black text');

function lum(hex) { const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
for (const [fg, bg, min, what] of [['ffffff', '0021A5', 4.5, 'white on Gator blue'], ['0b1b45', 'ffffff', 4.5, 'ink on white'], ['4a5670', 'ffffff', 4.5, 'muted on white'], ['b3261e', 'ffffff', 4.5, 'error on white'], ['0021A5', 'ffffff', 4.5, 'blue links on white'], ['ffffff', 'FA4616', 3, 'white 22px/800 on orange button (WCAG large text)']]) {
  const r = cr(fg, bg); ok(r >= min, `contrast ${what}: ${r.toFixed(2)}:1 (min ${min})`);
}

function page(cfg = {}, extra = '') {
  const conf = `<script>window.GBM_PICKEM=Object.assign(${JSON.stringify({ gameId: '2026-10-10-south-carolina', opp: 'South Carolina', week: 'Homecoming week', label: 'Sat., Oct. 10 · Ben Hill Griffin Stadium · Kickoff TBA', lockAt: '2026-10-10T16:00:00Z', formId: 'TEST-FORM-ID', season: 2026 })},${JSON.stringify(cfg)});${extra}</script>`;
  return FIXTURE.replace('<!--CONFIG-->', conf).replace('<!--EMBED-->', EMBED);
}

const browser = await chromium.launch();
async function open(width, { path = '/pick-em', cfg = {}, extra = "window.GBM_PICKEM_NOW='2026-10-06T12:00:00Z';", query = '', slot = false, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width < 500 ? 2 : 1, isMobile: width < 500, hasTouch: width < 500 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  let html = page(cfg, extra);
  if (slot) html = html.replace('<main id="SITE_PAGES">', '<main id="SITE_PAGES"><div id="gbm-pickem-slot"></div>');
  await p.route(`${ORIGIN}/**`, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: html }));
  await p.goto(`${ORIGIN}${path}${query}`);
  await p.waitForTimeout(450);
  return { p, ctx, errors };
}
const reqs = (p, re) => p.evaluate((src) => window.__pk.reqs.filter((r) => new RegExp(src).test(r.url)), re.source);
async function noOverflow(p) { return p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth); }

// ---- layout + screenshots at 320 / 390 / 1366 ----
for (const w of [320, 390, 1366]) {
  const { p, ctx, errors } = await open(w);
  ok(await p.isVisible('#gbm-pk'), `${w}: Pick 'Em renders on /pick-em`);
  ok(!(await p.isVisible('#SITE_PAGES')), `${w}: native page content hidden`);
  ok(await p.isVisible('#SITE_FOOTER'), `${w}: sitewide footer still visible`);
  ok(await noOverflow(p), `${w}: no horizontal scroll`);
  ok(!(await p.isChecked('#pk-ok')), `${w}: consent checkbox unchecked by default`);
  ok((await p.textContent('.pk-c span')).trim() === CONSENT, `${w}: consent wording matches the site signup`);
  ok((await p.locator('#pk-board tbody tr').count()) === 5, `${w}: leaderboard rows from PickEmBoard`);
  const small = await p.evaluate(() => [...document.querySelectorAll('#gbm-pk .pk-st,#gbm-pk .pk-go,#gbm-pk .pk-in,#gbm-pk .pk-n,#gbm-pk .pk-c,#gbm-pk summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).map((e) => e.className || e.tagName));
  ok(small.length === 0, `${w}: all tap targets >= 44px ${small.join(',')}`);
  const unlabeled = await p.evaluate(() => [...document.querySelectorAll('#pk-f input:not(#pk-web)')].filter((i) => !(i.labels && i.labels.length) && !i.getAttribute('aria-labelledby')).map((i) => i.id));
  ok(unlabeled.length === 0, `${w}: every input has a label ${unlabeled.join(',')}`);
  if (w <= 390) {
    const btn = await p.locator('.pk-go').boundingBox();
    ok(btn.width >= w - 40, `${w}: submit spans the width (thumb reach)`);
  }
  await p.screenshot({ path: join(SHOTS, `pickem-${w}.png`), fullPage: true });
  ok(errors.length === 0, `${w}: no page errors ${errors.join(' | ')}`);
  await ctx.close();
}

// ---- behaviour at 390 ----
{
  const { p, ctx } = await open(390);
  await p.click('.pk-st[data-t="pk-fla"][data-d="1"]');
  ok((await p.inputValue('#pk-fla')) === '29', 'stepper + adds a point');
  await p.click('.pk-go');
  ok(/Callsign/.test(await p.textContent('#pk-msg')) && (await reqs(p, /form-submission/)).length === 0, 'missing callsign blocked before any request');
  await p.fill('#pk-opp', '29');
  await p.fill('#pk-cs', 'Swamp Fox'); await p.fill('#pk-em', 'fan@example.com');
  await p.click('.pk-go');
  ok(/no ties/.test(await p.textContent('#pk-msg')), 'tie pick blocked');
  await p.fill('#pk-opp', '17'); await p.fill('#pk-cs', 'Sh1t Talker');
  await p.click('.pk-go');
  ok(/different callsign/.test(await p.textContent('#pk-msg')) && (await reqs(p, /form-submission/)).length === 0, 'profane callsign blocked');
  await p.fill('#pk-cs', 'Buddy Martin');
  await p.click('.pk-go');
  ok(/different callsign/.test(await p.textContent('#pk-msg')), 'impersonation callsign blocked');
  await p.fill('#pk-cs', 'Swamp Fox'); await p.fill('#pk-em', 'not-an-email');
  await p.click('.pk-go');
  ok(/valid email/.test(await p.textContent('#pk-msg')), 'bad email blocked');
  await p.fill('#pk-em', 'Fan@Example.com'); await p.fill('#pk-tb', '165');
  await p.click('.pk-go');
  await p.waitForSelector('#pk-done');
  const sub = (await reqs(p, /form-submission-service\/v4\/submissions$/))[0];
  ok(!!sub, 'valid pick posts one Create Submission');
  ok(sub && sub.auth === 'TEST-VISITOR-TOKEN', 'submission carries the anonymous visitor token');
  ok(sub && sub.body.submission.formId === 'TEST-FORM-ID', 'submission targets the configured form');
  ok(sub && JSON.stringify(Object.keys(sub.body.submission.submissions).sort()) === JSON.stringify(['callsign', 'email_pickem', 'game_id', 'pick_florida', 'pick_opponent', 'subscribe_pickem', 'tiebreak_rush']), 'submission keys are exactly the form targets');
  ok(sub && sub.body.submission.submissions.subscribe_pickem === false, 'no consent box -> subscribe_pickem false');
  ok(sub && sub.body.submission.submissions.email_pickem === 'fan@example.com' && sub.body.submission.submissions.pick_florida === 29 && sub.body.submission.submissions.pick_opponent === 17, 'values normalized (email lower-case, numeric scores)');
  const stored = await p.evaluate(() => localStorage.getItem('gbm-pickem-2026-10-10-south-carolina'));
  ok(stored && !stored.includes('@'), 'browser keeps the pick but never the email');
  ok(/You're in: Florida 29, South Carolina 17/.test(await p.textContent('#pk-done')), 'confirmation shows the pick');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'pk-done'), 'focus moves to the confirmation');
  await p.screenshot({ path: join(SHOTS, 'pickem-entered-390.png'), fullPage: false });
  await p.reload(); await p.waitForTimeout(450);
  ok(/Your pick is in/.test(await p.textContent('#pk-main')), 'returning visitor sees their pick, no second form');
  await ctx.close();
}
{
  const { p, ctx } = await open(390);
  await p.fill('#pk-cs', 'Gator Gal'); await p.fill('#pk-em', 'gal@example.com'); await p.check('#pk-ok');
  await p.click('.pk-go'); await p.waitForSelector('#pk-done');
  ok((await reqs(p, /form-submission/))[0].body.submission.submissions.subscribe_pickem === true, 'consent box ticked -> subscribe_pickem true');
  ok(!('tiebreak_rush' in (await reqs(p, /form-submission/))[0].body.submission.submissions), 'blank tiebreaker is omitted');
  await ctx.close();
}
{
  const { p, ctx } = await open(390);
  await p.fill('#pk-cs', 'Bot'); await p.fill('#pk-em', 'bot@example.com'); await p.fill('#pk-web', 'http://spam.example');
  await p.click('.pk-go'); await p.waitForTimeout(200);
  ok((await reqs(p, /form-submission/)).length === 0, 'honeypot fill sends nothing (and shows a fake success)');
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { query: '?mode=fail' });
  await p.fill('#pk-cs', 'Retry Rex'); await p.fill('#pk-em', 'rex@example.com');
  await p.click('.pk-go'); await p.waitForTimeout(300);
  ok(/didn't go through/.test(await p.textContent('#pk-msg')) && !(await p.isDisabled('.pk-go')), 'API failure: friendly error, button re-enabled');
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { cfg: { formId: '' } });
  await p.fill('#pk-cs', 'Early Bird'); await p.fill('#pk-em', 'early@example.com');
  await p.click('.pk-go'); await p.waitForTimeout(200);
  ok(/opens soon/.test(await p.textContent('#pk-msg')) && (await reqs(p, /form-submission/)).length === 0, 'no formId configured: nothing is sent');
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { extra: "window.GBM_PICKEM_NOW='2026-10-10T16:00:01Z';" });
  ok(!(await p.isVisible('#pk-f')) && /Picks are locked/.test(await p.textContent('#pk-main')), 'after lockAt the form is gone (kickoff lock)');
  await p.screenshot({ path: join(SHOTS, 'pickem-locked-390.png'), fullPage: false });
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { cfg: { sponsor: { name: 'Swamp Burger Co.', url: 'https://example.com', prize: '$50 gift card' } } });
  const html = await p.innerHTML('.pk-sp');
  ok(/Swamp Burger Co\./.test(html) && /\$50 gift card/.test(html) && /rel="sponsored noopener"/.test(html), 'sponsor slot shows name, prize and a sponsored link');
  await p.screenshot({ path: join(SHOTS, 'pickem-sponsor-390.png'), fullPage: false });
  await ctx.close();
}
{
  const { p, ctx } = await open(390);
  ok(/Your business here/.test(await p.textContent('.pk-sp')), 'unsold slot reads "Your business here"');
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { query: '?mode=empty' });
  ok(/fills in after the first final/.test(await p.textContent('#pk-board')), 'empty board shows the starter line');
  await ctx.close();
}
{
  const { p, ctx } = await open(1366, { path: '/' });
  ok((await p.locator('#gbm-pk').count()) === 0 && (await p.isVisible('#SITE_PAGES')), 'other pages: embed stays out');
  await ctx.close();
}
{
  const { p, ctx } = await open(390, { path: '/', slot: true });
  ok((await p.locator('#gbm-pickem-slot #gbm-pk').count()) === 1 && (await p.isVisible('#SITE_PAGES')), 'slot mode renders inside #gbm-pickem-slot without hiding the page');
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
