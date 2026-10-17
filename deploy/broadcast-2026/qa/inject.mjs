// Broadcast S4 candidate harness: loads real production pages in Chromium and swaps
// selected custom embeds for local candidate files before the page runs.
// Read-only against the site. Usage is from qa/run.mjs.
import { readFileSync } from 'node:fs';

// Find the end of a JSON string literal that starts right after the opening quote at `i`.
function jsonStringEnd(s, i) {
  for (let k = i; k < s.length; k++) {
    const c = s[k];
    if (c === '\\') { k++; continue; }
    if (c === '"') return k;
  }
  return -1;
}

// candidates: { '<id8>': { oldHtml, newHtml } }
export function swapEmbeds(doc, candidates) {
  const report = {};
  for (const [id8, { oldHtml, newHtml }] of Object.entries(candidates)) {
    let raw = 0, json = 0;
    if (oldHtml && doc.includes(oldHtml)) { doc = doc.replace(oldHtml, () => newHtml); raw = 1; }
    const re = new RegExp(`\\{"id":"${id8}-[0-9a-f-]{27}","embedType"`);
    const m = re.exec(doc);
    if (m) {
      const k = doc.indexOf('"html":"', m.index) + 8;
      const end = jsonStringEnd(doc, k);
      if (k > 7 && end > k) {
        doc = doc.slice(0, k) + JSON.stringify(newHtml).slice(1, -1).replace(/\//g, '\\/').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + doc.slice(end);
        json = 1;
      }
    }
    report[id8] = { raw, json };
  }
  return { doc, report };
}

export function loadCandidates(map) {
  const out = {};
  for (const [id8, [oldPath, newPath]] of Object.entries(map)) {
    out[id8] = { oldHtml: readFileSync(oldPath, 'utf8'), newHtml: readFileSync(newPath, 'utf8') };
  }
  return out;
}

export async function routeCandidates(page, candidates, log = () => {}) {
  await page.route(/^https:\/\/www\.gatorbaitmedia\.com\/[^?#]*(\?[^#]*)?$/, async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const resp = await route.fetch();
    const body = await resp.text();
    const { doc, report } = swapEmbeds(body, candidates);
    log(route.request().url(), report);
    await route.fulfill({ response: resp, body: doc, headers: { ...resp.headers(), 'content-type': 'text/html; charset=utf-8' } });
  });
}
