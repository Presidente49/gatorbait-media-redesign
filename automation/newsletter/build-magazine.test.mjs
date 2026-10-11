import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderMagazine, compileMagazine } from './build-magazine.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const template = fs.readFileSync(new URL('../../newsletter/templates/gatorbait-magazine-colorlib-v1.mjml', import.meta.url), 'utf8');
const fixtureFile = fileURLToPath(new URL('../../newsletter/templates/gatorbait-magazine-synthetic.json', import.meta.url));
const fixture = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
const render = (input = structuredClone(fixture), options = { synthetic: true }) => renderMagazine(template, input, options);
const decode = text => text.replaceAll('&#38;', '&').replaceAll('&amp;', '&');

test('reusable Barlow shell contains no fixed old issue, assets or account links', () => {
  assert.doesNotMatch(template, /Newsreader|\bInter\b|Ole Miss|September 2026|wixstatic\.com|itemorder\.com|utm_campaign=/);
  assert.match(template, /font-family="Barlow, Arial, Helvetica, sans-serif"/);
  const { source, report } = render();
  assert.doesNotMatch(source, /\{\{|\}\}|\$\{|&amp;utm_/);
  assert.deepEqual(report, { draftOnly: true, synthetic: true, storyCount: 8, imageCount: 2, trackedLinks: 11 });
  assert.equal((source.match(/<mj-image\b/g) || []).length, 2);
  assert.equal((source.match(/<mj-button\b(?![^>]*\/>)/g) || []).length, 11);
  const hrefs = [...source.matchAll(/<mj-button\b[^>]*href="([^"]+)"/g)].map(match => new URL(decode(match[1])));
  assert.equal(new Set(hrefs.map(link => link.searchParams.get('utm_content'))).size, 11);
  for (const link of hrefs) {
    assert.equal(link.hostname, 'example.invalid');
    assert.equal(link.searchParams.get('utm_source'), 'gatorbait_magazine_newsletter');
    assert.equal(link.searchParams.get('utm_medium'), 'email');
    assert.equal(link.searchParams.get('utm_campaign'), 'synthetic_fixture_only');
  }
});

test('a new issue changes copy, date and tracking without rewriting the layout', () => {
  const next = structuredClone(fixture);
  next.issue.date = '2100-02-01';
  next.issue.tracking_key = 'second_synthetic_fixture';
  next.lead.title = 'A different synthetic lead';
  next.lead.author = 'Different Fixture Writer';
  const { source } = render(next);
  assert.match(source, /Feb\. 1, 2100/);
  assert.match(source, /A different synthetic lead/);
  assert.match(source, /DIFFERENT FIXTURE WRITER/);
  assert.match(source, /utm_campaign=second_synthetic_fixture/);
  assert.doesNotMatch(source, /Jan\. 1, 2100|Synthetic headline 1|utm_campaign=synthetic_fixture_only/);
});

test('text and attributes escape markup while missing fields/tokens fail closed', () => {
  const input = structuredClone(fixture);
  input.lead.title = '<script>alert("fixture")</script> & copy';
  input.lead.alt = 'Photo "quoted" <tag>';
  const { source } = render(input);
  assert.doesNotMatch(source, /<script>|<tag>/);
  assert.match(source, /&lt;script&gt;/);
  assert.match(source, /&quot;quoted&quot;/);
  delete input.inside[1].author;
  assert.throws(() => render(input), /Missing inside\.1\.author/);
  assert.throws(() => renderMagazine(template + '{{unknown.field}}', fixture, { synthetic: true }), /Unknown template/);
});

test('duplicate stories and transformed duplicate media identities are rejected', () => {
  const stories = structuredClone(fixture);
  stories.inside[1].url = stories.lead.url + '/';
  assert.throws(() => render(stories), /Duplicate story/);
  const photos = structuredClone(fixture);
  photos.feature.image = photos.lead.image + '/v1/fill/w_100';
  assert.throws(() => render(photos), /Duplicate image/);
});

test('missing slots, invalid dates, unsafe URLs and placeholder text fail closed', () => {
  const mutations = [
    input => input.inside.pop(),
    input => { input.issue.date = '2100-02-29'; },
    input => { input.lead.url = 'javascript:alert(1)'; },
    input => { input.lead.url = 'https://user:password@example.invalid/post/fixture'; },
    input => { input.lead.url += '?token=fixture'; },
    input => { input.lead.title = '{{unresolved}}'; },
    input => { input.feature.credit = ''; },
    input => { input.issue.tracking_key = 'Bad tracking key'; },
    input => { input.utilities[0].url = 'https://www.gatorbaitmedia.com/magazine'; },
  ];
  for (const mutate of mutations) {
    const input = structuredClone(fixture); mutate(input);
    assert.throws(() => render(input));
  }
});

test('synthetic fixture cannot enter the real draft path; photos need explicit evidence', () => {
  assert.throws(() => render(fixture, {}), /Fixture URL/);
  const input = structuredClone(fixture);
  for (const row of [input.lead, ...input.game_file.stories, input.feature, ...input.inside]) {
    row.url = row.url.replace('example.invalid', 'www.gatorbaitmedia.com');
  }
  for (const row of [input.lead, input.feature]) row.image = row.image.replace('example.invalid', 'static.wixstatic.com');
  for (const row of input.utilities) row.url = row.url.replace('example.invalid', 'www.gatorbaitmedia.com');
  assert.throws(() => render(input, {}), /Missing photo evidence/);
  for (const row of [input.lead, input.feature]) { row.rightsVerified = true; row.mediaPermanent = true; }
  assert.equal(render(input, {}).report.synthetic, false);
});

test('strict MJML compilation resolves all issue fields and retains the newsletter identity', { skip: !process.env.MJML_MODULE }, async () => {
  const html = await compileMagazine(render().source);
  assert.match(html, /GATORBAIT MAGAZINE NEWSLETTER/);
  assert.match(html, /Synthetic headline 8/);
  assert.doesNotMatch(html, /Newsreader|\bInter\b|\{\{|\}\}/);
  assert.equal((html.match(/<img\b/g) || []).length, 2);
});

test('CLI writes only private local drafts and rejects checkout/symlink output', { skip: !process.env.MJML_MODULE }, () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gatorbait-newsletter-test-'));
  const builder = fileURLToPath(new URL('./build-magazine.mjs', import.meta.url));
  const run = output => spawnSync(process.execPath, [builder, '--json', fixtureFile, '--out', output, '--synthetic'], { encoding: 'utf8' });
  try {
    const output = path.join(temp, 'draft');
    const result = run(output);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(fs.readdirSync(output).sort(), ['magazine.html', 'magazine.mjml', 'validation.json']);
    for (const file of fs.readdirSync(output)) assert.equal(fs.statSync(path.join(output, file)).mode & 0o777, 0o600);
    assert.equal(run(root).status, 1);
    const alias = path.join(temp, 'checkout-alias');
    fs.symlinkSync(root, alias);
    assert.equal(run(alias).status, 1);
    fs.symlinkSync(path.join(root, 'newsletter/templates/gatorbait-magazine-colorlib-v1.mjml'), path.join(output, 'symlink-target'));
    fs.unlinkSync(path.join(output, 'magazine.mjml'));
    fs.symlinkSync(path.join(output, 'symlink-target'), path.join(output, 'magazine.mjml'));
    assert.equal(run(output).status, 1);
    assert.equal(fs.readFileSync(new URL('../../newsletter/templates/gatorbait-magazine-colorlib-v1.mjml', import.meta.url), 'utf8'), template);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
