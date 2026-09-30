// Pure archive builder. Ownership is NOT authorship. Callers must supply
// reviewed visible credits and the complete expected set for a declared window.
const SITE = 'https://www.gatorbaitmedia.com';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function canonicalStory(value) {
  try {
    const u = new URL(value, SITE);
    if (u.protocol !== 'https:' || !/^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) || !/^\/post\/[^/]+\/?$/.test(u.pathname) || u.username || u.password || u.port) return null;
    return SITE + u.pathname.replace(/\/$/, '');
  } catch { return null; }
}
export function buildWriterArchive({ writer, posts, expectedUrls, windowLabel, complete }) {
  if (!writer?.name || writer.kind !== 'person' || /staff|editorial desk/i.test(writer.name)) throw new Error('Real named writers only; staff links to the homepage.');
  if (!complete || !windowLabel || !Array.isArray(expectedUrls) || !expectedUrls.length) throw new Error('A complete, declared verification window is required.');
  const expected = expectedUrls.map(canonicalStory);
  if (expected.some(x => !x) || new Set(expected).size !== expected.length) throw new Error('Invalid or duplicate expected canonical URLs.');
  const seen = new Set();
  const entries = posts.map(p => {
    if (p.visibleAuthor !== writer.name || p.creditVerified !== true || !p.creditEvidence) throw new Error('Unverified or mismatched visible authorship.');
    const url = canonicalStory(p.url);
    if (!url || seen.has(url)) throw new Error('Invalid or duplicate archive URL.');
    seen.add(url);
    if (!p.title || !Number.isFinite(Date.parse(p.firstPublishedDate))) throw new Error('Title and original publication date are required.');
    return { ...p, url };
  }).sort((a,b) => Date.parse(b.firstPublishedDate) - Date.parse(a.firstPublishedDate) || a.url.localeCompare(b.url));
  const missing = expected.filter(u => !seen.has(u));
  const extra = [...seen].filter(u => !expected.includes(u));
  if (missing.length || extra.length) throw new Error(`Archive parity failed: ${missing.length} missing, ${extra.length} extra.`);
  return { writer, entries, windowLabel, precision: 1, recall: 1 };
}
export function renderWriterArchive(archive) {
  const cards = archive.entries.map(p => {
    // Use only explicitly credited editorial photos; never guess image rights.
    const image = p.image && /^https:\/\/static\.wixstatic\.com\/media\//.test(p.image.src) && p.image.alt && p.image.credit
      ? `<figure><img src="${esc(p.image.src)}" alt="${esc(p.image.alt)}" width="640" height="360" loading="lazy"><figcaption>${esc(p.image.credit)}</figcaption></figure>` : '';
    return `<li><a class="wa-card" href="${esc(p.url)}">${image}<h2>${esc(p.title)}</h2><time datetime="${esc(p.firstPublishedDate)}">${esc(new Date(p.firstPublishedDate).toLocaleDateString('en-US',{timeZone:'America/New_York',year:'numeric',month:'short',day:'numeric'}))}</time></a></li>`;
  });
  // All links are native HTML, including entries after the first 12; no JS-only
  // navigation, invented bio, author portrait, or second Article schema.
  return `<section class="wa"><h1>Stories by ${esc(archive.writer.name)}</h1><a class="wa-site" href="${SITE}/">gatorbaitmedia.com</a><p class="wa-window">${esc(archive.windowLabel)}</p><ul>${cards.slice(0,12).join('')}</ul>${cards.length > 12 ? `<details><summary>More stories by ${esc(archive.writer.name)}</summary><ul>${cards.slice(12).join('')}</ul></details>` : ''}</section>`;
}
export const archiveCss = `.wa{box-sizing:border-box;max-width:960px;margin:auto;padding:24px 16px;font:18px/1.5 Barlow,sans-serif;color:#172440}.wa h1{font-size:clamp(24px,4vw,32px);line-height:1.15;margin:0 0 6px}.wa-site{display:inline-block;padding:8px 0}.wa-window,.wa time,.wa figcaption{font-size:14px}.wa ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.wa li{min-width:0}.wa-card{display:block;color:inherit;text-decoration:none;overflow-wrap:anywhere;padding:4px}.wa h2{font-size:20px;line-height:1.3;margin:8px 0}.wa figure{margin:0}.wa img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.wa a:focus-visible,.wa summary:focus-visible{outline:3px solid #0021a5;outline-offset:3px}.wa summary{min-height:44px;cursor:pointer;padding:8px;box-sizing:border-box}.wa a:hover h2{text-decoration:underline}@media(max-width:600px){.wa ul{grid-template-columns:1fr}.wa h2{font-size:19px}}`;
