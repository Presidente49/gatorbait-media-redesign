// Blue restore (Oct. 18): rebuild the All News / section targets from the S2 blue sources,
// keeping the functional fixes that shipped after S2 (phone fill in c4b41f6a, chronology in 53e15504).
// Usage: node deploy/broadcast-restore-20261018/build.mjs   (run from the repo root)
import fs from 'fs';

const D = 'deploy/broadcast-restore-20261018/';
const djb2 = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).padStart(8, '0');
};
const apply = (s, pairs) => pairs.reduce((acc, [a, b]) => {
  if (acc.split(a).length !== 2) throw new Error('anchor not unique: ' + a.slice(0, 40));
  return acc.replace(a, () => b);
}, s);

// 602fb362: the S2 depth pass exactly as it was live (rev 17) before Swamp Night.
const t602 = fs.readFileSync('deploy/swamp-night-20261017/rollback/602fb362-rev17.html', 'utf8');

// c4b41f6a: blue rev 2 + the phone fill that live rev 4 added on top of the Swamp Night rev 3.
// The fill is taken verbatim from live rev 4 so the logic is byte-identical to production.
const rev4 = fs.readFileSync(D + 'rollback/c4b41f6a-rev4.html', 'utf8');
const fillJs = rev4.slice(rev4.indexOf('\nvar R=null,RF=0,RD={};') + 1, rev4.indexOf('\nfunction tick(){\n'));
// rev 2 + fill is 15,199 chars, so six base rules in gbm-sn-css that the S2 skin (gbm-bc-s2,
// `html body #gbm-sn ...`, higher specificity) overrides in every property are dropped. No rendered change.
let tc4 = apply(fs.readFileSync('deploy/swamp-night-20261017/rollback/c4b41f6a-rev2.html', 'utf8'), [
  ['\nfunction tick(){\n', '\n' + fillJs + '\nfunction tick(){\n'],
  ["\nvar k=s+'|'", "\nfill(lp);\nvar k=s+'|'"],
  ['#gbm-sn .sn-top{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;padding:18px 0 12px}', ''],
  ['#gbm-sn h1{margin:0;color:var(--n);font:800 38px/1 "Barlow Condensed",Barlow,Arial,sans-serif;text-transform:uppercase;letter-spacing:.005em}', ''],
  ['#gbm-sn .sn-2 a{font-size:14px;color:#c9d3e6;padding:12px 12px 8px}#gbm-sn .sn-2 a[aria-current=page]{color:#fff}', ''],
  ['#gbm-sn .sn-top{padding:14px 16px 10px}#gbm-sn h1{font-size:30px}', ''],
]);

// 53e15504: live rev 12 already is the blue-neutral one. Its <style> is byte-identical to the
// S2-era rev 11, and news-chronology.js (pinned commit 312018f) carries no CSS, only the
// newest-first sort. The blue look comes from c4b41f6a + 602fb362. Keep it unchanged.
const t535 = fs.readFileSync(D + 'rollback/53e15504-rev12.html', 'utf8');

const out = { '602fb362': t602, c4b41f6a: tc4, '53e15504': t535 };
for (const [id, html] of Object.entries(out)) {
  if (html.length > 15000) throw new Error(`${id} target is ${html.length} chars`);
  fs.writeFileSync(`${D}${id}-target.html`, html);
  console.log(id, html.length, djb2(html));
}
