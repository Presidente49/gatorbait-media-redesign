// Read-only walk of the Pricing Plans checkout in a real browser, for review from sessions that cannot reach the site.
// Usage: PLAN="ALL ACCESS ANNUAL" WIDTHS=390,1366 RUN_ID=<id> node automation/vision/checkout-probe.mjs
// Per width it opens /plans-pricing, lists the plan cards, picks the requested plan and follows the flow as far
// as it goes without paying, entering a real card or creating an account: a login/sign-up wall ends that branch.
// When a billing address form is reachable it records the inputs (label, placeholder, required, autocomplete
// style) and what the Continue/Pay button and validation messages do when "123 Main St" is typed and tabbed away
// without picking a suggestion, when the first suggestion is picked, and when only a 5-digit ZIP is typed.
// Console errors and failed network requests are captured throughout. Nothing is submitted.
// Output: build/checkout-probe/<step>-<width>.jpg plus metrics.json.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const PLAN = (process.env.PLAN || 'ALL ACCESS ANNUAL').trim();
const widths = (process.env.WIDTHS || '390,1366').split(',').map(Number).filter(Boolean);
const RUN_ID = process.env.RUN_ID || String(Date.now());
const OUT = 'build/checkout-probe';
mkdirSync(OUT, { recursive: true });
const BASE = 'https://www.gatorbaitmedia.com';
const IOS_UA = devices['iPhone 13'].userAgent;
const DESKTOP_UA = devices['Desktop Chrome'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: DESKTOP_UA, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

const ACTION_BTN = /continue|pay now|^pay$|pay \$|place order|buy now|complete|checkout|next|submit|purchase|start/i;
const ADDRESS_RE = /address|street|city|zip|postal|state|province|country|apt|suite|unit|region/i;

const shot = (page, name, w, full = false) => page.screenshot({ path: `${OUT}/${name}-${w}.jpg`, type: 'jpeg', quality: 70, fullPage: full }).catch((e) => String(e).slice(0, 120));

async function dismissCookies(page) {
  const sels = ['[data-hook="consent-banner-apply-button"]', '[data-hook="consent-banner-accept-button"]', '#consent-banner button', 'button:has-text("Accept")', 'button:has-text("Got it")', 'button:has-text("Agree")', 'button:has-text("OK")'];
  for (const s of sels) {
    const el = page.locator(s).first();
    if (await el.isVisible().catch(() => false)) { await el.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(600); return s; }
  }
  return null;
}

// Every visible form control in every frame, with the label a person would see.
async function formFields(page) {
  const out = [];
  for (const f of page.frames()) {
    const rows = await f.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const labelOf = (el) => {
        let t = '';
        if (el.id) { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) t = l.textContent; }
        if (!t) { const l = el.closest('label'); if (l) t = l.textContent; }
        if (!t && el.getAttribute('aria-labelledby')) t = el.getAttribute('aria-labelledby').split(/\s+/).map((i) => document.getElementById(i)?.textContent || '').join(' ');
        if (!t) t = el.getAttribute('aria-label') || '';
        return t.replace(/\s+/g, ' ').trim().slice(0, 60);
      };
      return [...document.querySelectorAll('input,select,textarea,[role="combobox"]')].filter((el) => vis(el) && el.type !== 'hidden').map((el) => ({
        tag: el.tagName.toLowerCase(), type: el.type || null, name: el.name || null, id: (el.id || '').slice(0, 60), hook: el.getAttribute('data-hook'), label: labelOf(el), placeholder: (el.placeholder || '').slice(0, 60),
        required: el.required || el.getAttribute('aria-required') === 'true', autocomplete: el.getAttribute('autocomplete'), role: el.getAttribute('role'), ariaAutocomplete: el.getAttribute('aria-autocomplete'), ariaInvalid: el.getAttribute('aria-invalid'), value: (el.value || '').slice(0, 40), disabled: el.disabled || false,
      }));
    }).catch(() => []);
    for (const r of rows) out.push({ frame: f === page.mainFrame() ? 'main' : (f.url() || '').replace(/^https?:\/\//, '').slice(0, 80), ...r });
  }
  return out;
}

// Continue/Pay-style buttons and visible validation text, across frames.
async function buttonState(page) {
  const buttons = [], validation = [];
  for (const f of page.frames()) {
    const r = await f.evaluate((re) => {
      const RE = new RegExp(re, 'i');
      const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const txt = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      const buttons = [...document.querySelectorAll('button,[role="button"],input[type="submit"],a[data-hook*="button"]')].filter(vis).map((b) => ({ text: txt(b).slice(0, 50), hook: b.getAttribute('data-hook'), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' || /disabled/i.test(b.className), cls: String(b.className).slice(0, 60) })).filter((b) => RE.test(b.text) || /checkout|pay|continue|submit/i.test(b.hook || ''));
      const validation = [...document.querySelectorAll('[role="alert"],[aria-live],[data-hook*="error"],[data-hook*="validation"],[class*="error"],[class*="Error"],[class*="invalid"]')].filter(vis).map((e) => txt(e).slice(0, 140)).filter(Boolean);
      const invalid = [...document.querySelectorAll('[aria-invalid="true"]')].filter(vis).map((e) => e.name || e.id || e.getAttribute('aria-label') || e.placeholder || e.tagName);
      return { buttons, validation: [...new Set(validation)].slice(0, 12), invalid };
    }, ACTION_BTN.source).catch(() => ({ buttons: [], validation: [], invalid: [] }));
    buttons.push(...r.buttons); validation.push(...r.validation, ...r.invalid.map((i) => `aria-invalid: ${i}`));
  }
  return { buttons, validation: [...new Set(validation)] };
}

async function pageKind(page) {
  const k = { url: page.url().slice(0, 160) };
  for (const f of page.frames()) {
    const r = await f.evaluate(() => {
      const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      const body = (document.body?.innerText || '').replace(/\s+/g, ' ');
      return {
        password: [...document.querySelectorAll('input[type="password"]')].some(vis),
        email: [...document.querySelectorAll('input[type="email"]')].some(vis),
        authText: /log in|sign up|sign in|create account|continue with google|continue with facebook/i.test(body),
        checkoutText: /order summary|billing|payment method|card number|checkout/i.test(body),
        addressFields: [...document.querySelectorAll('input,select')].filter(vis).filter((el) => /address|street|zip|postal|city/i.test([el.name, el.id, el.placeholder, el.getAttribute('aria-label'), el.getAttribute('autocomplete')].join(' '))).length,
        placesLoaded: Boolean(window.google?.maps?.places) || [...document.scripts].some((s) => /maps\.googleapis\.com.*places|places\.js/i.test(s.src)),
        pacContainer: document.querySelectorAll('.pac-container').length,
        dialogs: [...document.querySelectorAll('[role="dialog"]')].filter(vis).map((d) => (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120)),
        textSample: body.slice(0, 300),
      };
    }).catch(() => null);
    if (!r) continue;
    const key = f === page.mainFrame() ? 'main' : (f.url() || '').replace(/^https?:\/\//, '').slice(0, 80);
    k[key] = r;
  }
  return k;
}

const findInput = (fields, re, not = /line ?2|apt|suite|unit|\b2\b/i) => fields.find((f) => (f.tag === 'input' || f.role === 'combobox') && re.test([f.label, f.placeholder, f.name, f.id, f.autocomplete, f.hook].join(' ')) && !not.test([f.label, f.placeholder, f.name, f.autocomplete].join(' ')));

// Locate a field (from formFields) as a Playwright locator in its frame.
function locate(page, field) {
  const f = field.frame === 'main' ? page.mainFrame() : page.frames().find((x) => (x.url() || '').replace(/^https?:\/\//, '').slice(0, 80) === field.frame);
  if (!f) return null;
  if (field.id) return f.locator(`#${CSS_escape(field.id)}`).first();
  if (field.name) return f.locator(`[name="${field.name}"]`).first();
  if (field.hook) return f.locator(`[data-hook="${field.hook}"]`).first();
  if (field.placeholder) return f.getByPlaceholder(field.placeholder).first();
  return null;
}
const CSS_escape = (s) => s.replace(/([^\w-])/g, '\\$1');

async function suggestions(page) {
  let n = 0; const texts = [];
  for (const f of page.frames()) {
    const r = await f.evaluate(() => {
      const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(el).display !== 'none'; };
      const items = [...document.querySelectorAll('.pac-item,[role="option"],[role="listbox"] li,[data-hook*="suggestion"],[data-hook*="option"]')].filter(vis);
      return items.map((i) => (i.innerText || i.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80));
    }).catch(() => []);
    n += r.length; texts.push(...r);
  }
  return { count: n, items: texts.slice(0, 5) };
}

async function clickFirstSuggestion(page) {
  for (const f of page.frames()) {
    const l = f.locator('.pac-item, [role="option"], [role="listbox"] li, [data-hook*="suggestion"]').first();
    if (await l.isVisible().catch(() => false)) { await l.click({ timeout: 3000 }).catch(() => {}); return 'click'; }
  }
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  return 'keyboard';
}

const browser = await chromium.launch();
const metrics = { plan: PLAN, runId: RUN_ID, at: new Date().toISOString(), widths: [] };
for (const w of widths) {
  const ctx = await browser.newContext(profile(w));
  const page = await ctx.newPage();
  const consoleErrors = [], failedRequests = [], pageErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200)); });
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
  page.on('requestfailed', (r) => failedRequests.push({ url: r.url().replace(/^https?:\/\//, '').slice(0, 140), err: (r.failure()?.errorText || '').slice(0, 60) }));
  page.on('response', (r) => { if (r.status() >= 400) failedRequests.push({ url: r.url().replace(/^https?:\/\//, '').slice(0, 140), status: r.status() }); });
  const m = { width: w, steps: [], plans: [], consoleErrors, pageErrors, failedRequests };
  const step = (name, extra = {}) => { const s = { step: name, url: page.url().slice(0, 160), at: new Date().toISOString(), ...extra }; m.steps.push(s); console.log(`[${w}] ${name} ${s.url}`); return s; };
  try {
    // 1. Plans page.
    const res = await page.goto(`${BASE}/plans-pricing?cb=${encodeURIComponent(RUN_ID)}`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(4000);
    const cookie = await dismissCookies(page);
    await page.waitForTimeout(500);
    await shot(page, '01-plans', w, true);
    m.plans = await page.evaluate(() => {
      const vis = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      const txt = (el) => (el.innerText || '').replace(/\s+/g, ' ').trim();
      const btns = [...document.querySelectorAll('button,a[role="button"],a')].filter(vis).filter((b) => /select|buy|choose|join|subscribe|get started|start|sign up|purchase/i.test(txt(b)) || /select|buy|plan/i.test(b.getAttribute('data-hook') || ''));
      const seen = new Set();
      return btns.map((b) => {
        let card = b; for (let i = 0; i < 8 && card.parentElement; i++) { card = card.parentElement; if (/\$\s?\d/.test(txt(card)) && card.querySelectorAll('button,a').length <= 4) break; }
        if (seen.has(card)) return null; seen.add(card);
        const t = txt(card);
        const name = card.querySelector('[data-hook*="name"],[data-hook*="title"],h1,h2,h3,h4')?.innerText?.replace(/\s+/g, ' ').trim() || t.split(/\$/)[0].slice(0, 60);
        return { name: name.slice(0, 60), price: (t.match(/\$\s?[\d,.]+(\s*\/?\s*\w+)?/) || [''])[0].slice(0, 30), button: txt(b).slice(0, 40), hook: b.getAttribute('data-hook'), href: (b.getAttribute('href') || '').slice(0, 100), text: t.slice(0, 160) };
      }).filter(Boolean).slice(0, 12);
    });
    step('plans', { http: res && res.status(), cookieBanner: cookie, planCount: m.plans.length });

    // 2. Pick the plan.
    const pick = m.plans.findIndex((p) => p.text.toLowerCase().includes(PLAN.toLowerCase()) || p.name.toLowerCase().includes(PLAN.toLowerCase()));
    const chosen = pick >= 0 ? m.plans[pick] : m.plans[0];
    if (!chosen) throw new Error('no plan buttons found');
    m.chosenPlan = { ...chosen, matched: pick >= 0 };
    const btn = page.locator(chosen.hook ? `[data-hook="${chosen.hook}"]` : 'button, a').filter({ hasText: chosen.button });
    // Several cards share a button label: take the nth one, counting earlier cards with the same label.
    let target = btn.nth(pick >= 0 ? m.plans.slice(0, pick).filter((p) => p.button === chosen.button && (chosen.hook ? p.hook === chosen.hook : true)).length : 0);
    if (!(await target.isVisible().catch(() => false))) target = page.getByRole('button', { name: new RegExp(chosen.button, 'i') }).first();
    await target.scrollIntoViewIfNeeded().catch(() => {});
    await Promise.all([page.waitForNavigation({ timeout: 15000 }).catch(() => null), target.click({ timeout: 8000 })]);
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(6000);
    await dismissCookies(page);
    await shot(page, '02-after-select', w, true);
    let kind = await pageKind(page);
    const isAuth = (k) => Object.values(k).some((v) => v && typeof v === 'object' && (v.password || (v.authText && v.dialogs?.length) || (v.email && v.authText && !v.addressFields)));
    step('after-select', { kind, authWall: isAuth(kind) });
    if (isAuth(kind)) { step('stopped-at-auth-wall'); m.outcome = 'auth-wall'; }
    else {
      // 3. Checkout / billing form.
      let fields = await formFields(page);
      let state = await buttonState(page);
      step('checkout-initial', { fieldCount: fields.length, fields: fields.slice(0, 40), ...state });
      // Some checkouts hide the address behind a "Continue" from an email/contact step; probe one level deeper if no address field yet.
      let street = findInput(fields, /street|address/i);
      if (!street) {
        const cont = page.locator('button').filter({ hasText: /continue|next/i }).first();
        if (await cont.isVisible().catch(() => false) && !(await cont.isDisabled().catch(() => true))) {
          await cont.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(4000);
          await shot(page, '03-after-continue', w, true);
          fields = await formFields(page); state = await buttonState(page);
          step('after-continue', { fieldCount: fields.length, fields: fields.slice(0, 40), ...state, kind: await pageKind(page) });
          street = findInput(fields, /street|address/i);
        }
      }
      if (!street) { m.outcome = 'no-address-form'; step('no-address-form'); }
      else {
        m.outcome = 'address-form';
        const addr = fields.filter((f) => ADDRESS_RE.test([f.label, f.placeholder, f.name, f.id, f.autocomplete, f.hook].join(' ')));
        step('address-form', { street, addressFields: addr, autocompleteHints: { role: street.role, ariaAutocomplete: street.ariaAutocomplete, autocompleteAttr: street.autocomplete, placesLoaded: Object.values(kind).some((v) => v?.placesLoaded), pacContainer: Object.values(kind).reduce((a, v) => a + (v?.pacContainer || 0), 0) } });
        const loc = locate(page, street);
        if (!loc) throw new Error('street locator missing');
        // 3a. Type and Tab away without picking a suggestion.
        await loc.click({ timeout: 5000 });
        await loc.fill('');
        await loc.pressSequentially('123 Main St', { delay: 60 });
        await page.waitForTimeout(2500);
        const sugg = await suggestions(page);
        await shot(page, '04-typed-suggestions', w);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(1500);
        const afterTab = await buttonState(page);
        await shot(page, '05-typed-tab-no-pick', w, true);
        step('typed-tab-no-pick', { suggestions: sugg, ...afterTab, fields: (await formFields(page)).filter((f) => ADDRESS_RE.test([f.label, f.placeholder, f.name, f.id, f.autocomplete].join(' '))).map((f) => ({ label: f.label || f.placeholder || f.name, value: f.value, ariaInvalid: f.ariaInvalid })) });
        // 3b. Type and pick the first suggestion.
        await loc.click({ timeout: 5000 });
        await loc.fill('');
        await loc.pressSequentially('123 Main St', { delay: 60 });
        await page.waitForTimeout(2500);
        const sugg2 = await suggestions(page);
        const how = sugg2.count ? await clickFirstSuggestion(page) : 'none-available';
        await page.waitForTimeout(2000);
        const afterPick = await buttonState(page);
        await shot(page, '06-picked-suggestion', w, true);
        step('picked-suggestion', { suggestions: sugg2, how, ...afterPick, fields: (await formFields(page)).filter((f) => ADDRESS_RE.test([f.label, f.placeholder, f.name, f.id, f.autocomplete].join(' '))).map((f) => ({ label: f.label || f.placeholder || f.name, value: f.value, ariaInvalid: f.ariaInvalid })) });
        // 3c. ZIP alone.
        const zipF = findInput(await formFields(page), /zip|postal/i, /^$/);
        if (zipF) {
          const zl = locate(page, zipF);
          for (const f of (await formFields(page)).filter((f) => ADDRESS_RE.test([f.label, f.placeholder, f.name, f.id, f.autocomplete].join(' ')) && f.tag === 'input' && f.value)) { const l = locate(page, f); if (l) await l.fill('').catch(() => {}); }
          if (zl) { await zl.click({ timeout: 5000 }); await zl.fill(''); await zl.pressSequentially('32601', { delay: 60 }); await page.keyboard.press('Tab'); await page.waitForTimeout(1500); }
          const afterZip = await buttonState(page);
          await shot(page, '07-zip-only', w, true);
          step('zip-only', { zipField: zipF, ...afterZip, fields: (await formFields(page)).filter((f) => ADDRESS_RE.test([f.label, f.placeholder, f.name, f.id, f.autocomplete].join(' '))).map((f) => ({ label: f.label || f.placeholder || f.name, value: f.value, ariaInvalid: f.ariaInvalid })) });
        } else step('zip-only', { note: 'no zip field found' });
        // Payment form presence (never filled).
        const payFrames = page.frames().map((f) => f.url()).filter((u) => /pay|cashier|card|paypal|stripe/i.test(u)).map((u) => u.replace(/^https?:\/\//, '').slice(0, 100));
        step('payment-form', { paymentFrames: payFrames, ...(await buttonState(page)) });
      }
    }
  } catch (e) {
    m.error = String(e).slice(0, 400);
    await shot(page, '99-error', w, true);
    console.log(`[${w}] error ${m.error}`);
  }
  metrics.widths.push(m);
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/metrics.json`, JSON.stringify(metrics, null, 1));
console.log(JSON.stringify({ widths: metrics.widths.map((x) => ({ width: x.width, outcome: x.outcome, error: x.error, steps: x.steps.map((s) => s.step), plans: x.plans.map((p) => `${p.name} | ${p.price} | ${p.button}`), consoleErrors: x.consoleErrors.length, failed: x.failedRequests.length })) }, null, 1));
