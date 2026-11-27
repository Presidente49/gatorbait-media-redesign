#!/usr/bin/env node
// Ship gate: inspect the ordinary HTTP response, never a browser-mutated DOM.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { randomUUID } from 'node:crypto';
import { cliArgs, loadIssue, parseHtml, nodes, nativeText, normalize, canonical, imageKey, hash } from './magazine-native-snapshot.mjs';

export function checkNativeSource(html, model) {
  const tree = parseHtml(html), all = nodes(tree);
  const inNative = node => { for (let p = node; p; p = p.parent) if (['script', 'style', 'template', 'textarea'].includes(p.tag)) return false; return true; };
  const visible = all.filter(inNative), body = visible.find(n => n.tag === 'body');
  const under = (node, ancestor) => { for (let p = node; p; p = p.parent) if (p === ancestor) return true; return false; };
  const bodyNodes = body ? visible.filter(n => under(n, body)) : [];
  const headings = bodyNodes.filter(n => /^h[1-6]$/.test(n.tag));
  const expectedTitles = new Set(model.stories.map(s => normalize(s.title)));
  const failures = [], checks = {};
  const assert = (name, passed) => { checks[name] = Boolean(passed); if (!passed) failures.push(name); };
  const meta = key => visible.filter(n => n.tag === 'meta' && (n.attrs.name || n.attrs.property) === key).map(n => n.attrs.content || '');
  const oneMeta = (key, expected) => meta(key).length === 1 && normalize(meta(key)[0]) === normalize(expected);
  assert('nativeBodyExists', body);
  assert('title', visible.filter(n => n.tag === 'title').length === 1 && normalize(nativeText(visible.find(n => n.tag === 'title') || { children: [] })) === normalize(model.title));
  for (const key of ['description', 'og:description', 'twitter:description']) assert(key, oneMeta(key, model.description));
  for (const key of ['og:title', 'twitter:title']) assert(key, oneMeta(key, model.title));
  for (const key of ['og:image', 'twitter:image']) assert(key, meta(key).length === 1 && (() => { try { return imageKey(meta(key)[0]) === imageKey(model.ogImage); } catch { return false; } })());
  const canonicals = visible.filter(n => n.tag === 'link' && n.attrs.rel?.split(/\s+/).includes('canonical'));
  assert('canonical', canonicals.length === 1 && (() => { try { return canonical(canonicals[0].attrs.href, model.base) === model.canonical; } catch { return false; } })());
  assert('og:url', oneMeta('og:url', model.canonical));
  assert('issueHeadline', headings.some(n => normalize(nativeText(n)) === normalize(model.headline)));
  const bodyText = normalize(nativeText(body || { children: [] })).replace(/[.,]/g, '');
  const dateVariants = [model.date], parsedDate = new Date(model.date);
  if (!Number.isNaN(parsedDate.valueOf())) for (const month of ['long', 'short']) dateVariants.push(new Intl.DateTimeFormat('en-US', { month, day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(parsedDate));
  assert('issueDate', dateVariants.some(date => bodyText.includes(normalize(date).replace(/[.,]/g, ''))));
  assert('nativeCover', bodyNodes.some(n => n.tag === 'img' && (() => { try { return imageKey(n.attrs.src) === imageKey(model.cover); } catch { return false; } })()));
  const articles = model.stories.map(story => {
    const matches = headings.filter(n => normalize(nativeText(n)) === normalize(story.title));
    let linkedByline = false;
    for (const heading of matches) {
      for (let container = heading; container && container !== body; container = container.parent) {
        const children = nodes(container).filter(inNative);
        const storyHeadings = children.filter(n => /^h[1-6]$/.test(n.tag) && expectedTitles.has(normalize(nativeText(n))));
        if (storyHeadings.length !== 1) break;
        const linked = children.some(n => n.tag === 'a' && n.attrs.href && (() => { try { return canonical(n.attrs.href, model.base) === story.url; } catch { return false; } })());
        const author = children.some(n => ['p', 'span', 'small', 'div'].includes(n.tag) && [normalize(story.author), normalize('By ' + story.author)].includes(normalize(nativeText(n))));
        if (linked && author) { linkedByline = true; break; }
      }
    }
    return { ...story, nativeHeadingCount: matches.length, linkedByline, pass: matches.length === 1 && linkedByline };
  });
  assert('allArticlesNativeWithBylinesAndCanonicalLinks', articles.every(a => a.pass));
  const articleHeadings = headings.filter(n => expectedTitles.has(normalize(nativeText(n))));
  assert('articleOrder', articleHeadings.length === model.stories.length && articleHeadings.every((n, i) => normalize(nativeText(n)) === normalize(model.stories[i].title)));
  const staleHeadings = headings.filter(n => {
    if (expectedTitles.has(normalize(nativeText(n)))) return false;
    for (let p = n.parent; p && p !== body; p = p.parent) if (['item-container', 'feed-item'].includes(p.attrs['data-hook'])) return true;
    return nodes(n).some(x => x.tag === 'a' && /\/post\//.test(x.attrs.href || ''));
  }).map(n => nativeText(n).trim());
  assert('noStaleNativeArticleHeadings', staleHeadings.length === 0);
  assert('noNativeVideoEmbeds', !bodyNodes.some(n => n.tag === 'video' || (n.tag === 'iframe' && /youtube|vimeo|video\./i.test(n.attrs.src || ''))));
  return { checks, failures, articles, staleHeadings, pass: failures.length === 0 };
}
async function main() {
  const options = cliArgs(process.argv.slice(2), ['--issue', '--url', '--html', '--out', '--save-html', '--seo-json', '--og-image', '--base-url']);
  if (options.help) { console.log('node tools/check-magazine-native-source.mjs --issue issue.json --seo-json approved-tags.json [--url https://www.gatorbaitmedia.com/magazine] [--out receipt.json] [--save-html served.html]\n--html capture.html is an offline diagnostic only: never a public release PASS. No browser DOM rewriting, script fulfillment or retries.'); return; }
  const model = await loadIssue(options);
  let html, responseEvidence;
  if (options.html) { html = await readFile(resolve(options.html), 'utf8'); responseEvidence = { mode: 'OFFLINE_DIAGNOSTIC', path: resolve(options.html) }; }
  else {
    const url = options.url || model.canonical;
    // curl honors the execution environment's configured HTTPS proxy. Node fetch
    // does not do so on all supported Node versions; never disable TLS checks.
    const marker = '\nGBM_HTTP_' + randomUUID() + '\n';
    const { stdout } = await promisify(execFile)('curl', ['--location', '--max-time', '30', '--silent', '--show-error', '--compressed', '--user-agent', 'Mozilla/5.0 GatorBait-native-source-check/1.0', '--header', 'Accept: text/html', '--write-out', marker + '%{json}', url], { maxBuffer: 32 * 1024 * 1024, encoding: 'utf8' });
    const split = stdout.lastIndexOf(marker);
    if (split < 0) throw new Error('Ordinary HTTP response metadata missing');
    const response = JSON.parse(stdout.slice(split + marker.length));
    html = stdout.slice(0, split);
    responseEvidence = { mode: 'ORDINARY_PUBLIC_HTTP', transport: 'curl', url, finalUrl: response.url_effective, status: response.http_code, contentType: response.content_type };
    if (options['save-html']) await writeFile(resolve(options['save-html']), html);
  }
  const result = checkNativeSource(html, model);
  if (!options.html && (responseEvidence.status !== 200 || !responseEvidence.contentType?.includes('text/html') || canonical(responseEvidence.finalUrl, model.base) !== model.canonical)) result.failures.push('ordinaryHttpResponse');
  result.pass = result.failures.length === 0;
  const receipt = { checkedAt: new Date().toISOString(), issueId: model.data.id, issueSha256: model.sourceSha256, expectedArticles: model.stories.length, response: responseEvidence, htmlBytes: Buffer.byteLength(html), htmlSha256: hash(html), ...result, releaseReady: !options.html && result.pass };
  if (options.out) await writeFile(resolve(options.out), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
  if (!receipt.pass) process.exitCode = 1;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(JSON.stringify({ releaseReady: false, error: error.message })); process.exitCode = 1; });
