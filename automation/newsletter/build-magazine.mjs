#!/usr/bin/env node
// Local draft renderer only. No provider API, network fetch, campaign creation or send.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TEMPLATE = path.join(ROOT, 'newsletter/templates/gatorbait-magazine-colorlib-v1.mjml');
const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const text = (value, key, max = 500) => {
  if (typeof value !== 'string' || !value.trim()) throw Error(`Missing ${key}`);
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]|\{\{|\}\}|\$\{/.test(clean)) throw Error(`Invalid ${key}`);
  return clean;
};
const exactSlots = (value, length, key) => {
  if (!Array.isArray(value) || value.length !== length) throw Error(`Expected ${length} ${key} slots`);
  return value;
};

function dateLabel(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error('Invalid issue.date');
  const date = new Date(value + 'T12:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw Error('Invalid issue.date');
  return `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function url(value, key, { synthetic, article = false, image = false }) {
  const raw = text(value, key, 1500);
  let parsed;
  try { parsed = new URL(raw); } catch { throw Error(`Invalid ${key}`); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.port) throw Error(`Unsafe ${key}`);
  if (synthetic && parsed.hostname !== 'example.invalid') throw Error(`Synthetic ${key} must use example.invalid`);
  if (!synthetic && (parsed.hostname === 'example.invalid' || parsed.hostname.endsWith('.invalid'))) throw Error(`Fixture URL in ${key}`);
  if (article && (!/^\/post\/[^/]+\/?$/.test(parsed.pathname) || (!synthetic && parsed.hostname !== 'www.gatorbaitmedia.com'))) throw Error(`Noncanonical ${key}`);
  if (image && !synthetic && (parsed.hostname !== 'static.wixstatic.com' || !parsed.pathname.startsWith('/media/'))) throw Error(`Nonpermanent ${key}`);
  return parsed.href;
}

function imageIdentity(value) {
  const parsed = new URL(value);
  const media = parsed.pathname.match(/^\/media\/([^/]+)/);
  return media ? parsed.origin + '/media/' + media[1] : parsed.href;
}

export function renderMagazine(template, input, { synthetic = false } = {}) {
  const issue = input?.issue;
  const trackingKey = text(issue?.tracking_key, 'issue.tracking_key', 80);
  if (!/^[a-z][a-z0-9_]{2,79}$/.test(trackingKey)) throw Error('Invalid issue.tracking_key');
  const values = new Map();
  const put = (key, value, max) => values.set(key, escape(text(value, key, max)));
  put('issue.title', issue.title, 180);
  put('issue.preheader', issue.preheader, 240);
  put('issue.dateline', text(issue.label, 'issue.label', 120) + ' · ' + dateLabel(issue.date));
  put('game_file.title', input.game_file?.title, 140);
  const articleUrls = new Set(), images = new Set();
  const tracked = (canonical, slot) => {
    const link = new URL(canonical);
    link.search = new URLSearchParams({ utm_source: 'gatorbait_magazine_newsletter', utm_medium: 'email', utm_campaign: trackingKey, utm_content: slot.replaceAll('.', '_') }).toString();
    // Numeric ampersands survive the existing source-import/link checks.
    return escape(link.href).replaceAll('&amp;', '&#38;');
  };
  const story = (row, slot, photo = false) => {
    put(slot + '.title', row?.title, 180);
    put(slot + '.excerpt', row?.excerpt, 700);
    put(slot + '.cta', row?.cta, 70);
    const author = text(row?.author, slot + '.author', 120);
    put(slot + '.author', author.toUpperCase());
    if (!slot.startsWith('inside.')) put(slot + '.kicker', author.toUpperCase() + ' · ' + text(row?.kicker, slot + '.kicker', 120).toUpperCase());
    const canonical = url(row?.url, slot + '.url', { synthetic, article: true });
    if (articleUrls.has(canonical.replace(/\/$/, ''))) throw Error('Duplicate story URL');
    articleUrls.add(canonical.replace(/\/$/, ''));
    values.set(slot + '.url', tracked(canonical, slot));
    if (!photo) return;
    const image = url(row?.image, slot + '.image', { synthetic, image: true });
    const identity = imageIdentity(image);
    if (images.has(identity)) throw Error('Duplicate image identity');
    images.add(identity);
    if (!synthetic && (row.rightsVerified !== true || row.mediaPermanent !== true)) throw Error(`Missing photo evidence for ${slot}`);
    const credit = text(row?.credit, slot + '.credit', 200);
    const alt = text(row?.alt, slot + '.alt', 400);
    put(slot + '.credit', credit);
    put(slot + '.alt', alt.includes(credit) ? alt : alt + '. ' + credit, 650);
    values.set(slot + '.image', escape(image));
  };
  story(input.lead, 'lead', true);
  exactSlots(input.game_file?.stories, 2, 'game_file').forEach((row, i) => story(row, 'game_file.' + i));
  story(input.feature, 'feature', true);
  exactSlots(input.inside, 4, 'inside').forEach((row, i) => story(row, 'inside.' + i));
  exactSlots(input.utilities, 3, 'utility').forEach((row, i) => {
    const slot = 'utilities.' + i;
    put(slot + '.cta', row?.cta, 70);
    values.set(slot + '.url', tracked(url(row?.url, slot + '.url', { synthetic }), slot));
  });
  const source = template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    if (!values.has(key)) throw Error(`Unknown template token ${key}`);
    return values.get(key);
  });
  if (/\{\{|\}\}|\$\{|&amp;utm_/i.test(source)) throw Error('Unresolved or malformed template output');
  return { source, report: { draftOnly: true, synthetic, storyCount: articleUrls.size, imageCount: images.size, trackedLinks: 11 } };
}

export async function compileMagazine(source) {
  const candidates = [process.env.MJML_MODULE, 'mjml', pathToFileURL(path.join(ROOT, 'vendor/colorlib-email-templates/node_modules/mjml/lib/index.js')).href].filter(Boolean);
  let compile;
  for (const candidate of candidates) {
    try { const module = await import(candidate); compile = module.default || module; break; } catch { /* try the next local compiler */ }
  }
  if (!compile) throw Error('Local MJML compiler unavailable; set MJML_MODULE to its entry file');
  const result = compile(source, { validationLevel: 'strict', minify: false });
  if (result.errors?.length || !result.html) throw Error('Strict MJML validation failed');
  if (/\{\{|\}\}|\$\{/.test(result.html)) throw Error('Unresolved rendered template');
  return result.html;
}

function writeDraft(directory, source, html, report) {
  const requested = path.resolve(directory);
  const inside = target => target === ROOT || target.startsWith(ROOT + path.sep);
  if (inside(requested)) throw Error('Draft output must be outside the public checkout');
  fs.mkdirSync(requested, { recursive: true, mode: 0o700 });
  const output = fs.realpathSync(requested);
  if (inside(output)) throw Error('Draft output resolves into the public checkout');
  for (const [name, body] of [['magazine.mjml', source], ['magazine.html', html], ['validation.json', JSON.stringify(report, null, 2) + '\n']]) {
    const file = path.join(output, name);
    if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink()) throw Error('Draft output cannot overwrite a symlink');
    const descriptor = fs.openSync(file, fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_WRONLY | fs.constants.O_NOFOLLOW, 0o600);
    try { fs.fchmodSync(descriptor, 0o600); fs.writeFileSync(descriptor, body); } finally { fs.closeSync(descriptor); }
  }
}

async function main(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--synthetic') args.synthetic = true;
    else if (['--json', '--out'].includes(flag) && argv[i + 1] && !argv[i + 1].startsWith('--')) args[flag.slice(2)] = argv[++i];
    else throw Error('Usage: build-magazine.mjs --json INPUT --out PRIVATE_DIRECTORY [--synthetic]');
  }
  if (!args.json || !args.out) throw Error('Both --json and --out are required');
  const input = JSON.parse(fs.readFileSync(args.json, 'utf8'));
  const { source, report } = renderMagazine(fs.readFileSync(TEMPLATE, 'utf8'), input, args);
  const html = await compileMagazine(source);
  writeDraft(args.out, source, html, report);
  console.log(JSON.stringify({ ...report, strictMjml: true }));
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main(process.argv.slice(2)).catch(() => { console.error('Draft build failed; check required input, safe output directory and local compiler. No provider action was attempted.'); process.exitCode = 1; });
}
