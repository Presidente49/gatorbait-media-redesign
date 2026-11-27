#!/usr/bin/env node
// Native Editor handoff only. Writing this file does not publish server-rendered content.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const hash = value => createHash('sha256').update(value).digest('hex');
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', middot: '·', copy: '©' };
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (all, name) => {
  if (!name.startsWith('#')) return entities[name.toLowerCase()] ?? all;
  const number = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
  return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : '�';
});
export const normalize = value => String(value ?? '').normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();

// A conservative, dependency-free HTML reader. Never interprets script/JSON/template
// strings as nodes; malformed, unsupported markup fails closed in the ship gate.
export function parseHtml(html) {
  const root = { tag: '#document', attrs: {}, children: [], parent: null };
  const stack = [root], voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const raw = new Set(['script', 'style', 'textarea', 'title']);
  let position = 0;
  while (position < html.length) {
    const parent = stack.at(-1);
    if (raw.has(parent.tag)) {
      const close = new RegExp(`</${parent.tag}\\s*>`, 'ig'); close.lastIndex = position;
      const match = close.exec(html), end = match ? match.index : html.length;
      if (parent.tag === 'title') parent.children.push(decode(html.slice(position, end)));
      position = match ? close.lastIndex : end; stack.pop(); continue;
    }
    if (html.startsWith('<!--', position)) { const end = html.indexOf('-->', position + 4); position = end < 0 ? html.length : end + 3; continue; }
    if (html[position] !== '<') {
      let end = html.indexOf('<', position); if (end < 0) end = html.length;
      parent.children.push(decode(html.slice(position, end))); position = end; continue;
    }
    let end = position + 1, quote = '';
    for (; end < html.length; end++) {
      const character = html[end];
      if (quote) { if (character === quote) quote = ''; }
      else if (character === '"' || character === "'") quote = character;
      else if (character === '>') break;
    }
    const token = html.slice(position + 1, end); position = Math.min(end + 1, html.length);
    const closing = token.match(/^\s*\/\s*([\w:-]+)/);
    if (closing) {
      const tag = closing[1].toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === tag) { stack.length = i; break; }
      continue;
    }
    const opening = token.match(/^\s*([a-z][\w:-]*)/i); if (!opening) continue;
    const tag = opening[1].toLowerCase(), attrs = {};
    const attribute = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    attribute.lastIndex = opening[0].length;
    for (let match; (match = attribute.exec(token));) attrs[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? '');
    const node = { tag, attrs, children: [], parent }; parent.children.push(node);
    if (!voids.has(tag) && !/\/\s*$/.test(token)) stack.push(node);
  }
  return root;
}
export const nodes = root => [root, ...root.children.filter(x => typeof x !== 'string').flatMap(nodes)];
export const nativeText = node => ['script', 'style', 'template', 'textarea'].includes(node.tag) ? '' : node.children.map(x => typeof x === 'string' ? x : nativeText(x)).join(' ');
export function canonical(value, base) {
  const url = new URL(value, base);
  if (url.protocol !== 'https:' || url.origin !== new URL(base).origin || url.username || url.password) throw new Error(`Not a canonical site HTTPS URL: ${value}`);
  url.hash = ''; url.search = ''; url.pathname = url.pathname.replace(/\/+$/, '') || '/'; return url.href;
}
export function imageKey(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Images must use HTTPS');
  const media = url.pathname.match(/^\/media\/([^/]+)/);
  return media ? `${url.origin}/media/${decodeURIComponent(media[1])}` : url.href;
}
export function cliArgs(argv, allowed) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--help') { result.help = true; continue; }
    if (!allowed.includes(key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Unknown flag or missing value: ${key}`);
    result[key.slice(2)] = argv[++i];
  }
  return result;
}
export async function loadIssue(options) {
  if (!options.issue) throw new Error('--issue is required');
  const bytes = await readFile(resolve(options.issue)), data = JSON.parse(bytes);
  const base = options['base-url'] || 'https://www.gatorbaitmedia.com';
  if (new URL(base).protocol !== 'https:') throw new Error('--base-url must be HTTPS');
  const source = [data.lead, data.feature, ...(data.features?.items || []), ...(data.exclusives?.items || [])].filter(Boolean);
  if (!source.length) throw new Error('No lead/feature/features/exclusives articles found');
  const stories = source.map((item, index) => {
    let url = item.url;
    if (!url && item.html) {
      const original = nodes(parseHtml(item.html)).filter(n => n.tag === 'a' && /read\s+(the\s+)?original/i.test(nativeText(n)));
      if (original.length === 1) url = original[0].attrs.href;
    }
    const author = String(item.author || item.byline || '').replace(/^by\s+/i, '').trim();
    if (!item.title?.trim() || !author || !url) throw new Error(`Article ${index + 1} needs title, verified author and canonical URL`);
    return { position: index + 1, title: item.title.trim(), author, url: canonical(url, base) };
  });
  if (new Set(stories.map(x => x.url)).size !== stories.length || new Set(stories.map(x => normalize(x.title))).size !== stories.length) throw new Error('Duplicate article URL or title');
  const title = data.issue?.pageTitle || data.pageTitle;
  const date = data.issue?.date, name = data.issue?.name, headline = data.cover?.headline;
  if (!title || !date || !name || !headline || !data.cover?.image) throw new Error('Issue requires pageTitle, issue name/date and cover headline/image');
  const image = data.cover.image;
  if (!image.url && (!image.id || !image.ext)) throw new Error('Cover image needs a permanent HTTPS URL or media id/ext');
  const cover = image.url || `https://static.wixstatic.com/media/${image.id}${image.id?.includes('~') ? '' : '~mv2.' + image.ext}`;
  imageKey(cover);
  let tags = data.seoTags || [];
  if (options['seo-json']) {
    const seo = JSON.parse(await readFile(resolve(options['seo-json']), 'utf8'));
    tags = Array.isArray(seo) ? seo : seo.itemSeoTags?.tags || seo.tags;
    if (!Array.isArray(tags)) throw new Error('--seo-json must contain tags or itemSeoTags.tags');
  }
  const tagValue = key => tags.find(x => !x.disabled && (x.type === 'title' ? key === 'title' : (x.props?.name || x.props?.property) === key));
  const configuredTitle = tagValue('title')?.children;
  if (configuredTitle && normalize(configuredTitle) !== normalize(title)) throw new Error('SEO title does not match the source issue pageTitle');
  const description = tagValue('description')?.props?.content || `Read the ${name} edition for ${date}: ${stories.length} articles, led by ${stories[0].title} by ${stories[0].author}.`;
  const ogImage = options['og-image'] || tagValue('og:image')?.props?.content || data.ogImage;
  if (!ogImage) throw new Error('Supply approved --seo-json or --og-image; do not infer the social share image from a portrait cover');
  imageKey(ogImage);
  return { data, sourceSha256: hash(bytes), title, description, date, name, headline, cover, ogImage, tags, stories, base, canonical: canonical(options.url || '/magazine', base) };
}
export function snapshot(model) {
  const { data, stories } = model, image = data.cover.image;
  const details = [data.game?.kickoff, data.game?.tv, data.game?.venue].filter(Boolean).join(' · ');
  const pdf = data.pdf?.url ? `<p><a href="${escape(canonical(data.pdf.url, model.base))}">${escape(data.pdf.label || 'Download the magazine (PDF)')}</a>${data.pdf.note ? ' — ' + escape(data.pdf.note) : ''}</p>` : '';
  const body = `<main id="magazine-native-current-issue" aria-labelledby="magazine-native-title">\n<header><p>GatorBait Magazine · ${escape(model.date)}</p><h1 id="magazine-native-title">${escape(model.headline)}</h1><p>${escape(details)}</p><figure><img src="${escape(model.cover)}" width="${Number(image.width) || 1024}" height="${Number(image.height) || 1536}" alt="${escape(image.alt || model.headline)}"><figcaption>${escape(image.credit || '')}</figcaption></figure><p>${escape(model.description)}</p>${pdf}</header>\n<section aria-labelledby="magazine-native-contents"><h2 id="magazine-native-contents">In this issue</h2><ol>\n${stories.map(story => `<li><article><h3><a href="${escape(story.url)}">${escape(story.title)}</a></h3><p>By ${escape(story.author)}</p></article></li>`).join('\n')}\n</ol></section></main>\n`;
  const meta = (key, value) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`;
  const head = [`<title>${escape(model.title)}</title>`, meta('description', model.description), `<link rel="canonical" href="${escape(model.canonical)}">`, meta('og:title', model.title), meta('og:description', model.description), meta('og:image', model.ogImage), meta('og:url', model.canonical), meta('twitter:card', 'summary_large_image'), meta('twitter:title', model.title), meta('twitter:description', model.description), meta('twitter:image', model.ogImage)];
  return { fragment: body, html: `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n${head.join('\n')}\n</head><body>\n${body}</body></html>\n` };
}
async function main() {
  const options = cliArgs(process.argv.slice(2), ['--issue', '--out-dir', '--out', '--fragment', '--manifest', '--seo-json', '--og-image', '--base-url', '--url']);
  if (options.help) { console.log('node tools/magazine-native-snapshot.mjs --issue issue.json --out-dir DIR --seo-json approved-tags.json\nAlternative: --og-image approved-https-image. Optional explicit --out/--fragment/--manifest. Produces an Editor handoff; does not publish or prove server HTML.'); return; }
  if (options['out-dir']) {
    await mkdir(resolve(options['out-dir']), { recursive: true });
    options.out ||= resolve(options['out-dir'], 'snapshot.html');
    options.fragment ||= resolve(options['out-dir'], 'snapshot.fragment.html');
    options.manifest ||= resolve(options['out-dir'], 'manifest.json');
  }
  if (!options.out) throw new Error('--out is required');
  const model = await loadIssue(options), generated = snapshot(model);
  await writeFile(resolve(options.out), generated.html);
  if (options.fragment) await writeFile(resolve(options.fragment), generated.fragment);
  const receipt = { status: 'PREPARED_NOT_PUBLISHED', issueId: model.data.id, issueSha256: model.sourceSha256, articleCount: model.stories.length, stories: model.stories, htmlSha256: hash(generated.html), fragmentSha256: hash(generated.fragment), videos: 0 };
  if (options.manifest) await writeFile(resolve(options.manifest), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
