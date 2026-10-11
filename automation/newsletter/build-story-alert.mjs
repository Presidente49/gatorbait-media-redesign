#!/usr/bin/env node
// Build a GatorBait Gazette per-story alert (one story, one email) from newsletter/templates/gatorbait-gazette-alert-v1.mjml.
// Draft-only tooling: this script reads a post, fills the template, compiles, checks, and writes files. It never calls Wix
// and never sends anything. See docs/GAZETTE-STORY-ALERT.md for the campaign recipe and the pre-send checklist.
//
// Usage:
//   node automation/newsletter/build-story-alert.mjs --json post.json [--out DIR] [--subject "Custom subject"]
//   node automation/newsletter/build-story-alert.mjs --url https://www.gatorbaitmedia.com/post/<slug> [flags below to fill gaps]
//   flags: --title --excerpt --cover --credit --author --category --date (YYYY-MM-DD, ET) --slug --alt --subject
// JSON keys: title, excerpt, cover_image_url, cover_credit, author, category, date, slug, url, cover_alt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const TEMPLATE = path.join(ROOT, 'newsletter', 'templates', 'gatorbait-gazette-alert-v1.mjml');
const SITE = 'https://www.gatorbaitmedia.com';
const UTM_SOURCE = 'gatorbait_gazette_alert';
const EXCERPT_MAX = 240;

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    o[k] = v;
  }
  return o;
}
const fail = (msg) => { console.error('FAIL: ' + msg); process.exit(1); };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const decodeEntities = (s) => String(s)
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;|&apos;/g, "'").replace(/&#x27;/gi, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&nbsp;/g, ' ');
const clean = (s) => decodeEntities(String(s || '')).replace(/\s+/g, ' ').trim();

// AP-style month abbreviations; March, April, May, June, July are spelled out.
const AP_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function apDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) fail('date must be YYYY-MM-DD (Eastern date of publication); got "' + iso + '"');
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return `${DAYS[d.getUTCDay()]}, ${AP_MONTHS[d.getUTCMonth()]} ${+m[3]}, ${m[1]}`;
}

function trimExcerpt(text) {
  const t = clean(text);
  if (t.length <= EXCERPT_MAX) return t;
  const cut = t.slice(0, EXCERPT_MAX);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (lastStop > 120) return cut.slice(0, lastStop + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-]$/, '') + '...';
}

function metaFromHtml(html) {
  const pick = (re) => { const m = re.exec(html); return m ? clean(m[1]) : ''; };
  const prop = (name) => pick(new RegExp('<meta[^>]+(?:property|name)=["\']' + name + '["\'][^>]*content=["\']([^"\']*)["\']', 'i'))
    || pick(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']' + name + '["\']', 'i'));
  return {
    title: prop('og:title') || pick(/<title>([^<]*)<\/title>/i),
    excerpt: prop('og:description') || prop('description'),
    cover_image_url: prop('og:image'),
    author: prop('article:author') || prop('author'),
    category: prop('article:section'),
    date: (prop('article:published_time') || '').slice(0, 10),
  };
}

async function loadInput(args) {
  let post = {};
  if (args.json) post = JSON.parse(fs.readFileSync(args.json === 'true' ? 0 : args.json, 'utf8'));
  if (args.url) {
    post.url = post.url || args.url;
    const res = await fetch(args.url, { headers: { 'user-agent': 'gatorbait-story-alert-builder' } });
    if (!res.ok) fail('could not fetch ' + args.url + ' (' + res.status + ')');
    const found = metaFromHtml(await res.text());
    for (const [k, v] of Object.entries(found)) if (v && !post[k]) post[k] = v;
  }
  const map = { title: 'title', excerpt: 'excerpt', cover: 'cover_image_url', credit: 'cover_credit', author: 'author', category: 'category', date: 'date', slug: 'slug', alt: 'cover_alt' };
  for (const [flag, key] of Object.entries(map)) if (args[flag]) post[key] = args[flag];
  if (!post.slug && post.url) post.slug = new URL(post.url).pathname.replace(/^\/post\//, '').replace(/\/$/, '');
  if (!post.url && post.slug) post.url = `${SITE}/post/${post.slug}`;
  return post;
}

function validate(post) {
  const need = ['title', 'excerpt', 'author', 'category', 'date', 'slug', 'url'];
  const missing = need.filter((k) => !clean(post[k]));
  if (missing.length) fail('missing required field(s): ' + missing.join(', ') + ' (pass in JSON or flags; for --url the page metadata did not supply them)');
  const u = new URL(post.url);
  if (u.protocol !== 'https:' || u.hostname !== 'www.gatorbaitmedia.com' || !u.pathname.startsWith('/post/')) fail('url must be a https://www.gatorbaitmedia.com/post/... permalink; got ' + post.url);
  if (u.search || u.hash) fail('url must be the bare canonical permalink with no query string or fragment');
  if (post.cover_image_url) {
    if (!/^https:\/\/static\.wixstatic\.com\/media\//.test(post.cover_image_url) && !process.env.ALLOW_EXTERNAL_COVER) {
      fail('cover must be a production Wix Media Manager URL (https://static.wixstatic.com/media/...) per the media permanence gate; set ALLOW_EXTERNAL_COVER=1 only for local tests');
    }
    if (!clean(post.cover_credit)) console.warn('WARN: no cover_credit; the credit line will be omitted. Staff photos should read "Photo by <name>, GatorBait Media".');
  } else {
    console.warn('WARN: no cover image; the alert ships text-led without a picture.');
  }
}

function subjectFor(post, override) {
  const subject = clean(override || post.title);
  const letters = subject.replace(/[^A-Za-z]/g, '');
  const upper = letters.replace(/[^A-Z]/g, '');
  const words = subject.split(' ');
  const allCapsWords = words.filter((w) => w.replace(/[^A-Za-z]/g, '').length > 3 && w === w.toUpperCase()).length;
  if ((letters.length > 8 && upper.length / letters.length > 0.7) || allCapsWords >= 3) {
    fail('subject "' + subject + '" is all caps (or has 3+ shouting words). Pass --subject with sentence case.');
  }
  if (subject.length > 110) console.warn('WARN: subject is ' + subject.length + ' characters; phones cut it near 60-70. Consider --subject.');
  return subject;
}

function utmUrl(base, slug, content) {
  const campaign = 'story_alert_' + slug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80);
  // &#38; (numeric) is the entity check-links.mjs accepts; never &amp; before a UTM key.
  return `${base}?utm_source=${UTM_SOURCE}&#38;utm_medium=email&#38;utm_campaign=${campaign}&#38;utm_content=${content}`;
}

function applyConditionals(src, flags) {
  return src.replace(/<!--#if (\w+)-->([\s\S]*?)<!--\/#if \1-->/g, (_, name, body) => (flags[name] ? body : ''));
}

function fill(template, post) {
  const hasCover = !!post.cover_image_url;
  const hasCredit = hasCover && !!clean(post.cover_credit);
  let src = applyConditionals(template, { cover: hasCover, credit: hasCredit });
  const excerpt = trimExcerpt(post.excerpt);
  const values = {
    title: esc(clean(post.title)),
    excerpt: esc(excerpt),
    cover_image_url: esc(post.cover_image_url || ''),
    cover_credit: esc(clean(post.cover_credit || '')),
    cover_alt: esc(clean(post.cover_alt || post.title) + (hasCredit ? '. ' + clean(post.cover_credit) : '')),
    author: esc(clean(post.author)),
    author_upper: esc(clean(post.author).toUpperCase()),
    category: esc(clean(post.category)),
    category_upper: esc(clean(post.category).toUpperCase()),
    date: esc(apDate(post.date)),
    date_upper: esc(apDate(post.date).toUpperCase()),
    url_headline: utmUrl(post.url, post.slug, 'headline'),
    url_cover: utmUrl(post.url, post.slug, 'cover'),
    url_cta: utmUrl(post.url, post.slug, 'read_full_story'),
    url_site: utmUrl(SITE, post.slug, 'footer_home'),
  };
  src = src.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in values)) fail('template uses unknown token ' + m);
    return values[k];
  });
  return { src, excerpt };
}

async function loadMjml() {
  const candidates = ['mjml', pathToFileURL(path.join(ROOT, 'vendor/colorlib-email-templates/node_modules/mjml/lib/index.js')).href, process.env.MJML_MODULE].filter(Boolean);
  for (const c of candidates) {
    try { const m = await import(c); return m.default || m; } catch { /* try next */ }
  }
  fail('mjml not found. Run "npm i --no-save mjml@4" or set MJML_MODULE to its entry file (the pinned vendor copy works after tools/fetch-pinned-sources.sh newsletter).');
}

function runCheck(label, args) {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  const out = (r.stdout + r.stderr).trim();
  console.log(`\n[${label}] ${r.status === 0 ? 'PASS' : 'FAIL'}\n${out.split('\n').map((l) => '  ' + l).join('\n')}`);
  return r.status === 0;
}

const args = parseArgs(process.argv.slice(2));
if (!args.json && !args.url) fail('give --json <file> or --url <post permalink>. See header of this file.');
const post = await loadInput(args);
validate(post);
const subject = subjectFor(post, args.subject);
const { src, excerpt } = fill(fs.readFileSync(TEMPLATE, 'utf8'), post);

const mjml = await loadMjml();
const compiled = await mjml(src, { validationLevel: 'strict', minify: false });
if (compiled.errors && compiled.errors.length) fail('MJML errors: ' + compiled.errors.map((e) => e.formattedMessage).join('; '));

const slugSafe = post.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const outDir = path.resolve(args.out || path.join(ROOT, 'build', 'newsletter', 'story-alert-' + slugSafe));
fs.mkdirSync(outDir, { recursive: true });
const mjmlFile = path.join(outDir, 'story-alert.mjml');
const htmlFile = path.join(outDir, 'story-alert.html');
fs.writeFileSync(mjmlFile, src);
fs.writeFileSync(htmlFile, compiled.html);

// Campaign API body for POST /email-marketing/v1/campaigns (a DRAFT). Editor type MJML is the documented programmatic format.
const campaignBody = {
  composer: { composerDataJson: JSON.stringify({ mjml: src }) },
  campaignEditorType: { value: 'MJML' },
  emailSubject: subject,
  emailPreheader: excerpt,
};
fs.writeFileSync(path.join(outDir, 'campaign-create-body.json'), JSON.stringify(campaignBody));
fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify({
  built_by: 'automation/newsletter/build-story-alert.mjs',
  post_url: post.url, slug: post.slug, subject, preheader: excerpt,
  utm_campaign: 'story_alert_' + post.slug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80),
  cover_present: !!post.cover_image_url,
}, null, 2));

// Gates
const problems = [];
for (const [name, text] of [['mjml', src], ['html', compiled.html]]) {
  if (/\{\{[^}]*\}\}|\$\{[^}]*\}/.test(text)) problems.push(`unresolved placeholder in ${name}`);
  if (/&amp;utm_/i.test(text) && name === 'mjml') problems.push('&amp; before a UTM key in mjml');
}
if ((compiled.html.match(/READ THE FULL STORY/g) || []).length !== 1) problems.push('expected exactly one READ THE FULL STORY button');
const hrefs = [...compiled.html.matchAll(/href="([^"]+)"/g)].map((m) => decodeEntities(m[1])).filter((h) => /^https:\/\/www\.gatorbaitmedia\.com/.test(h));
for (const h of hrefs) {
  const u = new URL(h);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) if (!u.searchParams.get(k)) problems.push(`${k} missing on ${h.slice(0, 90)}`);
}
const contents = hrefs.map((h) => new URL(h).searchParams.get('utm_content'));
if (new Set(contents).size !== contents.length) problems.push('utm_content values are not distinct per link: ' + contents.join(','));

console.log(`built ${path.relative(ROOT, outDir)}\n  subject: ${subject}\n  preheader: ${excerpt}\n  tracked links: ${hrefs.length}`);
let ok = problems.length === 0;
if (!ok) console.error('\nGATE PROBLEMS:\n- ' + problems.join('\n- '));
ok = runCheck('check-links source', ['automation/newsletter/check-links.mjs', mjmlFile]) && ok;
ok = runCheck('check-links rendered', ['automation/newsletter/check-links.mjs', '--rendered', htmlFile]) && ok;
ok = runCheck('validate-unique-images', ['automation/newsletter/validate-unique-images.mjs', mjmlFile]) && ok;
console.log('\n[run-stack-qc] not applicable: it enforces the Magazine Newsletter identity strings. The equivalent gates for a story alert are the checks above.');
console.log(ok ? '\nALL GATES PASS (draft only; nothing was sent)' : '\nGATES FAILED');
process.exit(ok ? 0 : 1);
