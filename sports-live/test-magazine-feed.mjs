// Unit tests for the Magazine feed picker (sports-live/src/magazine-feed.js) and the refresh script. No network.
// Run: node --test sports-live/test-magazine-feed.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPicker, parseRss, readFeed, refresh } from './refresh-magazine-feed.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const P = loadPicker();
const ISSUE_TEXT = readFileSync(join(here, 'magazine-issue-pregame.json'), 'utf8');
const ISSUE = JSON.parse(ISSUE_TEXT);
const CREDITS = JSON.parse(readFileSync(join(here, 'front-page.config.json'), 'utf8')).credits;
const NOW = Date.parse('2026-10-03T13:00:00Z');
const H = 3600000;

let n = 0;
const img = (credited = true) => {
  const id = 'd3cfa5_' + (++n).toString(16).padStart(32, '0');
  if (credited) CREDITS_T[id] = 'Photo by Chris Spears, GatorBait Media';
  return { src: `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fit/w_1000,h_800,al_c,q_80/file.png`, width: 1600, height: 900, alt: 'Featured image for x' };
};
const CREDITS_T = {};
const post = (title, author, hoursAgo, extra = {}) => ({ title, author, url: 'https://www.gatorbaitmedia.com/post/' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), firstPublishedDate: new Date(NOW - hoursAgo * H).toISOString(), excerpt: title + ' excerpt text that is long enough to read.', image: img(), ...extra });
const pick = (posts, issue = ISSUE) => P.mfPick(issue, posts, NOW, CREDITS_T);

test('Buddy newest leads', () => {
  const r = pick([post('Buddy Column', 'Buddy Martin', 1), post('Franz Column', 'Franz Beard', 3), post('Eddie Column', 'Eddie Gilley', 4)]);
  assert.equal(r.leadChanged, true);
  assert.equal(r.lead.url, '/post/buddy-column');
  assert.equal(r.lead.author, 'Buddy Martin');
  assert.match(r.lead.html, /^<p>Buddy Column excerpt/);
});

test('Buddy wins a tie within 12 hours, not beyond', () => {
  const tie = pick([post('Franz Newer', 'Franz Beard', 1), post('Buddy Older', 'Buddy Martin', 12.5)]);
  assert.equal(tie.lead.url, '/post/buddy-older');
  const noTie = pick([post('Franz Newer B', 'Franz Beard', 1), post('Buddy Much Older', 'Buddy Martin', 13.5)]);
  assert.equal(noTie.lead.url, '/post/franz-newer-b');
  const loren = pick([post('Loren Preview', 'Loren Meadows', 0.5), post('Buddy Eleven', 'Buddy Martin', 11)]);
  assert.equal(loren.lead.url, '/post/buddy-eleven');
});

test('staff and news items never lead', () => {
  const r = pick([post('Staff News', 'GatorBait Staff', 0.2), post('BREAKING: Injury news', 'Buddy Martin', 0.5), post('Brenden News', 'Brenden Martin', 0.6), post('Eddie Feature', 'Eddie Gilley', 5)]);
  assert.equal(r.lead.url, '/post/eddie-feature');
  assert.ok(r.items.some((c) => c.url === '/post/staff-news'), 'staff news still runs as a card');
  assert.equal(r.items.find((c) => c.url === '/post/staff-news').kicker, 'News · GatorBait Staff');
  const none = pick([post('Only Staff', 'GatorBait Staff', 1), post('Only Staff 2', 'GatorBait Staff', 2)]);
  assert.equal(none.leadChanged, false, 'no named writer: the curated lead stays');
  assert.equal(none.lead, ISSUE.lead);
});

test('duplicates removed; cards never repeat the lead or a story linked elsewhere on the page', () => {
  const a = post('Buddy Lead', 'Buddy Martin', 1);
  const dupAbs = post('Eddie Card', 'Eddie Gilley', 2);
  const dupRel = { ...dupAbs, url: '/post/eddie-card/', firstPublishedDate: new Date(NOW - 2.5 * H).toISOString() };
  const cover = post('Cover Story', 'Franz Beard', 3, { url: 'https://www.gatorbaitmedia.com' + ISSUE.cover.url });
  const shots = post('Best Shots', 'Brenden Martin', 3.5, { url: 'https://www.gatorbaitmedia.com' + ISSUE.shots.url });
  const r = pick([a, dupAbs, dupRel, a, cover, shots, post('Franz Card', 'Franz Beard', 6), post('Staff Card', 'GatorBait Staff', 7)]);
  const urls = Array.from(r.items, (c) => c.url);
  assert.deepEqual(urls, ['/post/eddie-card', '/post/franz-card', '/post/staff-card']);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.includes(r.lead.url) && !urls.includes(ISSUE.cover.url) && !urls.includes(ISSUE.shots.url));
  assert.ok(r.items.length <= ISSUE.cards.items.length);
});

test('no-image and uncredited posts are skipped from cards; card shape and credit kept', () => {
  const noImg = post('No Image', 'Eddie Gilley', 2, { image: { src: '' } });
  const unc = post('Uncredited', 'Franz Beard', 2.5, { image: img(false) });
  const r = pick([post('Buddy L', 'Buddy Martin', 1), noImg, unc, post('Card One', 'Franz Beard', 3), post('Card Two', 'Loren Meadows', 4), post('Card Three', 'Carlton Reese', 5)]);
  assert.deepEqual(Array.from(r.items, (c) => c.url), ['/post/card-one', '/post/card-two', '/post/card-three']);
  const keys = (o) => Object.keys(o).sort().join();
  for (const c of r.items) {
    assert.equal(keys(c), keys(ISSUE.cards.items[1]));
    assert.equal(keys(c.image), keys(ISSUE.cards.items[1].image));
    assert.ok(c.image.credit);
  }
});

test('stories already in the issue keep their curated objects', () => {
  const coaches = ISSUE.cards.items[1];
  const r = pick([post('Buddy L2', 'Buddy Martin', 1), { title: 'x', author: 'Buddy Martin', url: 'https://www.gatorbaitmedia.com' + coaches.url, firstPublishedDate: '2026-10-01T17:24:33Z', excerpt: 'feed text', image: img() }]);
  assert.equal(r.items[0], coaches);
});

test('lead body comes from the post text when the feed carries it, sanitized, never another story', () => {
  const html = '<p>First <a href="https://evil.example/x">bad</a> and <a href="https://www.gatorbaitmedia.com/post/ok">ok</a> paragraph with <script>x</script>enough words.</p><figure><img src="x"></figure><p>Second paragraph with enough words in it.</p>';
  const r = pick([post('Buddy Full', 'Buddy Martin', 1, { html })]);
  assert.equal(r.lead.html, '<p>First bad and <a href="/post/ok">ok</a> paragraph with xenough words.</p><p>Second paragraph with enough words in it.</p>');
  assert.equal(r.lead.title, 'Buddy Full');
});

test('runtime parser shape: fake Wix RSS feed through the same picker', () => {
  const xml = readFileSync(join(here, 'fixtures/blog-feed-2026-10-03.xml'), 'utf8');
  const posts = parseRss(xml);
  assert.equal(posts.length, 20);
  assert.deepEqual(Object.keys(posts[0]).sort(), ['author', 'excerpt', 'firstPublishedDate', 'html', 'image', 'title', 'url']);
  const r = P.mfPick(ISSUE, posts, NOW, CREDITS);
  // Buddy's "Wizards" photo has no verified credit, so the freshest credited column (Eddie) leads.
  assert.equal(r.lead.url, '/post/something-s-got-to-give');
  assert.equal(r.lead.author, 'Eddie Gilley');
  assert.ok(r.lead.image.credit);
  assert.deepEqual(Array.from(r.items, (c) => c.url), ['/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators', '/post/when-it-came-to-finding-a-quarterback-sumrall-trusted-buster-and-it-paid-off', '/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it']);
  assert.ok(!r.items.some((c) => /wizards/.test(c.url)), 'uncredited photo never runs on the Magazine');
  assert.ok(!r.items.some((c) => c.url === ISSUE.cover.url), 'Soothsayer is the cover; no second copy as a card');
  const json = P.mfPick(ISSUE, readFeed(readFileSync(join(here, 'fixtures/feed-2026-10-03.json'), 'utf8')), NOW, CREDITS);
  assert.deepEqual(JSON.parse(JSON.stringify(json.lead)), JSON.parse(JSON.stringify(r.lead)), 'RSS and posts.json agree');
});

test('refresh is byte-preserving and idempotent', () => {
  const posts = readFeed(readFileSync(join(here, 'fixtures/feed-2026-10-03.json'), 'utf8'));
  const once = refresh(ISSUE_TEXT, posts, NOW, CREDITS);
  assert.notEqual(once.text, ISSUE_TEXT);
  const twice = refresh(once.text, posts, NOW, CREDITS);
  assert.equal(twice.text, once.text);
  assert.equal(twice.res.leadChanged || twice.res.cardsChanged, false);
  const changed = ISSUE_TEXT.split('\n').filter((l, i, a) => !once.text.includes(l));
  assert.ok(changed.every((l) => /^ {1,}/.test(l)), 'only indented value lines change');
  for (const k of Object.keys(ISSUE)) if (k !== 'lead' && k !== 'cards') assert.deepEqual(once.after[k], ISSUE[k]);
  assert.equal(once.after.cards.label, ISSUE.cards.label);
  const empty = refresh(ISSUE_TEXT, [], NOW, CREDITS);
  assert.equal(empty.text, ISSUE_TEXT, 'an empty feed keeps the baked issue');
});

test('--check and --dry-run never write; --check fails when behind', () => {
  const run = (...a) => { try { return { code: 0, out: execFileSync('node', [join(here, 'refresh-magazine-feed.mjs'), '--feed', 'sports-live/fixtures/feed-2026-10-03.json', '--now', '2026-10-03T13:00:00Z', ...a], { cwd: join(here, '..'), encoding: 'utf8', stdio: 'pipe' }) }; } catch (e) { return { code: e.status, out: e.stdout }; } };
  assert.equal(run('--dry-run').code, 0);
  assert.equal(run('--check').code, 1);
  assert.equal(run('--check', '--issue', 'sports-live/magazine-issue-pregame.proposed.json').code, 0);
  assert.equal(readFileSync(join(here, 'magazine-issue-pregame.json'), 'utf8'), ISSUE_TEXT);
});

test('live score line', () => {
  const k = '2026-10-03T19:30:00Z', at = (iso) => Date.parse(iso);
  const sb = { next: { opponent: 'Missouri' }, live: { clock: '5:32', period: 2, score: { fla: 14, opp: 7 } } };
  assert.equal(P.mfScoreLine(sb, 'Missouri', k, at('2026-10-03T20:30:00Z')), 'FLA 14 MIZ 7 · Q2 5:32');
  assert.equal(P.mfScoreLine({ ...sb, live: { clock: 'Halftime', period: 2, score: { fla: 21, opp: 10 } } }, 'Missouri', k, at('2026-10-03T21:00:00Z')), 'FLA 21 MIZ 10 · Half');
  assert.equal(P.mfScoreLine(sb, 'Missouri', k, at('2026-10-03T13:00:00Z')), '', 'before the window the countdown keeps the slot');
  assert.equal(P.mfScoreLine({ next: { opponent: 'Georgia' }, live: sb.live }, 'Missouri', k, at('2026-10-03T20:30:00Z')), '', 'another game never shows');
  assert.equal(P.mfScoreLine({ last: { opponent: 'Missouri', status: 'final', date: k, score: { fla: 31, opp: 24 } }, next: null }, 'Missouri', k, at('2026-10-03T23:30:00Z')), 'Final: FLA 31 MIZ 24');
  assert.equal(P.mfScoreLine(null, 'Missouri', k, at('2026-10-03T20:30:00Z')), '');
});

const BUDDY = 'Hey! No resting on your laurels, Scott Stricklin National championship. Shhhhh! Say it slowly. Then go lie down. By Buddy Martin Somewhere in Gainesville there’s a whistle with teeth marks in it. It belongs to Jon Sumrall, and it’s the only thing in the building that hasn’t celebrated. The Gators are 4-0 and ranked No. 8. Nobody in orange and blue is acting like it.';

test('teaser starts after the byline, two or three whole sentences, curly quotes kept', () => {
  const t = P.mfTeaser(BUDDY);
  assert.ok(t.startsWith('Somewhere in Gainesville there’s a whistle'), t);
  assert.ok(/[.!?…][’”]?$/.test(t), 'ends on a sentence boundary: ' + t);
  const n = (t.match(/[.!?](?=\s|$)/g) || []).length;
  assert.ok(n >= 2 && n <= 3, 'sentences: ' + n);
  assert.ok(!/By Buddy Martin|Stricklin/.test(t));
  assert.ok(P.mfTeaser('A caption here. BY FRANZ BEARD The column starts. Second line here.').startsWith('The column starts.'));
  assert.equal(P.mfTeaser('Plain excerpt with no byline. Still fine.'), 'Plain excerpt with no byline. Still fine.');
  assert.equal(P.mfTeaser('Trust was put to the test in January. Having spent December juggling two jobs while prepping to take over full time as…'), 'Trust was put to the test in January.', 'Wix truncation is not a sentence end');
  const long = P.mfTeaser('word '.repeat(120));
  assert.ok(long.endsWith('…') && !/\bwor…$/.test(long), 'no mid-word cut');
});

test('lead body never opens with a caption or byline', () => {
  const r = pick([post('Buddy Byline', 'Buddy Martin', 1, { excerpt: BUDDY })]);
  assert.ok(r.lead.html.startsWith('<p>Somewhere in Gainesville there’s a whistle'), r.lead.html);
  const html = '<p>Jon Sumrall on the sideline (Photo by Chris Spears)</p><p>By Buddy Martin</p><p>Somewhere in Gainesville there is a whistle with teeth marks.</p>';
  const h = pick([post('Buddy Html', 'Buddy Martin', 1, { html })]);
  assert.equal(h.lead.html, '<p>Somewhere in Gainesville there is a whistle with teeth marks.</p>');
});

test('lead needs a verified photo credit; Buddy tie rule among credited columns', () => {
  const r = pick([post('Buddy Uncredited', 'Buddy Martin', 1, { image: img(false) }), post('Eddie Credited', 'Eddie Gilley', 2)]);
  assert.equal(r.lead.url, '/post/eddie-credited');
  assert.ok(!r.items.some((c) => c.url === '/post/buddy-uncredited'));
  const alt = pick([post('Buddy Alt Credit', 'Buddy Martin', 3, { image: { ...img(false), alt: 'Sumrall at practice (Photo by Chris Spears, GatorBait Media)' } }), post('Franz Fresh', 'Franz Beard', 1)]);
  assert.equal(alt.lead.url, '/post/buddy-alt-credit', 'credit parsed from alt; Buddy wins the 12 h tie');
  assert.equal(alt.lead.image.credit, 'Photo by Chris Spears, GatorBait Media');
  const colon = pick([post('Loren Colon', 'Loren Meadows', 1, { image: { ...img(false), alt: 'Kickoff (Photo: Hannah White / UAA Communications)' } })]);
  assert.equal(colon.lead.image.credit, 'Photo: Hannah White / UAA Communications');
});
