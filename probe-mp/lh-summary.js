const fs = require('fs');
for (const f of ['lh1.json', 'lh2.json', 'lh3.json']) {
  if (!fs.existsSync(f)) { console.log('MISSING', f); continue; }
  const j = JSON.parse(fs.readFileSync(f)); const a = j.audits; const m = k => a[k] && a[k].displayValue;
  console.log('RUN', f, 'perf', Math.round(j.categories.performance.score * 100), 'FCP', m('first-contentful-paint'), 'LCP', m('largest-contentful-paint'), 'TBT', m('total-blocking-time'), 'CLS', m('cumulative-layout-shift'), 'SI', m('speed-index'), 'bytes', m('total-byte-weight'), 'dom', m('dom-size'));
  if (f !== 'lh2.json') continue;
  const lcp = a['largest-contentful-paint-element'];
  console.log('LCP_ELEMENT', JSON.stringify(lcp && lcp.details && lcp.details.items).slice(0, 900));
  console.log('NETWORK_TOP10');
  a['network-requests'].details.items.slice().sort((x, y) => y.transferSize - x.transferSize).slice(0, 10).forEach(x => console.log(x.transferSize, x.resourceType, x.url.slice(0, 170)));
  const tp = a['third-party-summary']; if (tp && tp.details) tp.details.items.slice(0, 10).forEach(x => console.log('3P', JSON.stringify(x.entity), x.transferSize, 'blocking', Math.round(x.blockingTime || 0)));
  for (const k of Object.keys(a)) {
    const x = a[k];
    if (x.score !== null && x.score < 0.9 && x.details && /opportunity|table|list/.test(x.details.type || '') && x.scoreDisplayMode !== 'notApplicable' && !/^(network|main-thread|metrics|diagnostics|resource-summary|screenshot|third-party-facades|largest-contentful-paint-element|layout-shift-elements)/.test(k)) {
      console.log('AUDIT', k, '|', x.displayValue || '', '| score', x.score, JSON.stringify((x.details.items || []).slice(0, 6).map(i => [(i.url || (i.node && i.node.snippet) || i.name || '').toString().slice(0, 110), i.wastedBytes || i.totalBytes || i.wastedMs || i.duration || ''])).slice(0, 700));
    }
  }
}
