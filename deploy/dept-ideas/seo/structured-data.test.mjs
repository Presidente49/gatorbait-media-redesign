// Shape tests for the Game Graph JSON-LD generator. Run: node --test deploy/dept-ideas/seo/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHomepageGraph, buildArticleEvent, buildSportsEvent, gameStartDate, kickoffKnown, loadInputs, matchGame, orderStories, toJsonLd, toScriptTag, toWixSeoTag, validate, generate, EMBED_BUDGET, WIX_EMBED_MAX } from './structured-data.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { posts, scoreboard } = loadInputs(repo);
const NOW = new Date('2026-09-30T12:00:00Z');
const byOpp = (o) => scoreboard.schedule.find((g) => g.opponent === o);

test('real inputs load and validate as a whole graph', () => {
  const doc = buildHomepageGraph({ posts, scoreboard, now: NOW });
  const v = validate(doc);
  assert.deepEqual(v.errors, []);
  assert.equal(doc['@context'], 'https://schema.org');
  const types = doc['@graph'].map((n) => n['@type']);
  assert.deepEqual(types, ['NewsMediaOrganization', 'WebSite', 'SportsTeam', 'SportsOrganization', 'Place', 'CollectionPage', 'ItemList']);
  const ids = new Set(doc['@graph'].map((n) => n['@id']));
  for (const ref of ['#sec', '#ben-hill-griffin-stadium', '#florida-gators']) assert.ok(ids.has(`https://www.gatorbaitmedia.com/${ref}`), `${ref} node present for @id references`);
});

test('every scheduled game becomes a SportsEvent with ESPN id, teams and a status', () => {
  const doc = buildHomepageGraph({ posts, scoreboard, now: NOW });
  const list = doc['@graph'][6].itemListElement;
  assert.equal(list.length, scoreboard.schedule.length);
  for (const li of list) {
    const ev = li.item;
    assert.equal(ev['@type'], 'SportsEvent');
    assert.match(ev.sameAs, /espn\.com\/college-football\/game\/_\/gameId\/\d+$/);
    const side = (x) => x.name || x['@id'];
    assert.ok(side(ev.homeTeam) && side(ev.awayTeam) && side(ev.homeTeam) !== side(ev.awayTeam));
    assert.equal(ev.eventStatus, 'https://schema.org/EventScheduled');
  }
  // every subjectOf on the homepage resolves to a story node in the same graph or is a feed URL
  const storyIds = new Set(doc['@graph'][5].mainEntity.itemListElement.map((li) => li.item['@id']));
  for (const li of list) if (li.item.subjectOf) assert.ok(li.item.subjectOf['@id'].startsWith('https://www.gatorbaitmedia.com/post/'));
  assert.ok([...storyIds].length >= 1);
});

test('no invented kickoff: TBA games get a date-only startDate, announced ones keep the ESPN time', () => {
  const sc = byOpp('South Carolina'); // 2026-10-10T04:00:00Z, tv null (kickoff window not set until Oct. 3 games finish)
  assert.equal(kickoffKnown(sc), false);
  assert.equal(gameStartDate(sc), '2026-10-10');
  const mizzou = byOpp('Missouri');
  assert.equal(kickoffKnown(mizzou), true);
  assert.equal(gameStartDate(mizzou), '2026-10-03T19:30:00Z');
  const uga = byOpp('Georgia'); // 19:30Z on ABC: announced
  assert.equal(gameStartDate(uga), '2026-10-31T19:30:00Z');
});

test('home games carry Ben Hill Griffin; the next road game carries the ESPN venue; unknown road venues are omitted', () => {
  const home = buildSportsEvent(byOpp('Ole Miss'), { standalone: true });
  assert.equal(home.location.name, 'Ben Hill Griffin Stadium');
  assert.equal(home.homeTeam.name, 'Florida Gators');
  assert.equal(buildSportsEvent(byOpp('Ole Miss')).location['@id'], 'https://www.gatorbaitmedia.com/#ben-hill-griffin-stadium');
  const road = buildSportsEvent(byOpp('Missouri'), { standalone: true, venueByEventId: { [scoreboard.next.eventId]: scoreboard.next.venue } });
  assert.equal(road.location.name, 'Memorial Stadium');
  assert.equal(road.awayTeam.name, 'Florida Gators');
  assert.equal(road.homeTeam.name, 'Missouri');
  const unknown = buildSportsEvent(byOpp('Texas'));
  assert.equal(unknown.location, undefined);
});

test('finals carry the score in description; exactly one canonical story per game', () => {
  const ev = buildSportsEvent(byOpp('Ole Miss'));
  assert.equal(ev.description, 'Final: Florida 52, Ole Miss 28. Florida won.');
  assert.equal(ev.subjectOf['@id'], 'https://www.gatorbaitmedia.com/post/postgame-analysis-florida-gators-52-ole-miss-rebel-28');
  assert.ok(!Array.isArray(ev.subjectOf));
  assert.equal(buildSportsEvent(byOpp('Auburn')).subjectOf, undefined); // no story in the feed: nothing invented
});

test('lead story is the newest Buddy Martin piece within seven days, then newest-first', () => {
  const order = orderStories(posts, NOW, 8);
  assert.equal(order[0].author, 'Buddy Martin');
  assert.match(order[0].url, /put-down-the-poll/);
  const rest = order.slice(1).map((p) => new Date(p.firstPublishedDate).getTime());
  for (let i = 1; i < rest.length; i++) assert.ok(rest[i - 1] >= rest[i], 'rest is newest-first');
  const stale = orderStories(posts, new Date('2026-11-01T00:00:00Z'), 3);
  assert.notEqual(stale[0].author, 'Buddy Martin'); // seven-day window expired: newest story leads
});

test('story stubs never have a blank author; staff maps to the organization, columnists to Person with profile url', () => {
  const doc = buildHomepageGraph({ posts, scoreboard, now: NOW });
  const items = doc['@graph'][5].mainEntity.itemListElement.map((li) => li.item);
  for (const a of items) {
    assert.equal(a['@type'], 'NewsArticle');
    assert.ok(a.author.name || a.author['@id']);
    assert.ok(a.headline.length > 0 && a.headline.length <= 110);
  }
  const buddy = items.find((a) => a.author.name === 'Buddy Martin');
  assert.equal(buddy.author['@type'], 'Person');
  assert.equal(buddy.author.url, 'https://www.gatorbaitmedia.com/gatorbait-media-blogs/tags/buddy-martin');
});

test('article pages get a SportsEvent only (Wix already renders NewsArticle), matched to the nearest game', () => {
  const buddy = posts.find((p) => /put-down-the-poll/.test(p.url));
  const ev = buildArticleEvent(buddy, scoreboard);
  assert.equal(ev['@type'], 'SportsEvent');
  assert.equal(ev.name, 'Florida Gators at No. 25 Missouri');
  assert.equal(ev.subjectOf.url, buddy.url);
  assert.equal(ev.subjectOf.author.name, 'Buddy Martin');
  assert.equal(ev.location.name, 'Memorial Stadium');
  assert.equal(ev.homeTeam.name, 'Missouri');
  assert.deepEqual(validate(ev).errors, []);
  const recap = posts.find((p) => /postgame-analysis-florida-gators-52-ole-miss/.test(p.url));
  assert.equal(matchGame(recap, scoreboard).opponent, 'Ole Miss'); // direct storyUrl match wins
  const senate = posts.find((p) => /senate-passes/.test(p.url));
  assert.equal(buildArticleEvent(senate, scoreboard), null); // not a game story: nothing emitted
  const poll = posts.find((p) => /bound-for-the-cfb-top-ten/.test(p.url)); // excerpt cites FPI odds vs. Texas; title has no opponent
  assert.equal(buildArticleEvent(poll, scoreboard), null);
  const woods = posts.find((p) => /woods-chipper/.test(p.url));
  assert.equal(buildArticleEvent(woods, scoreboard).name, 'No. 4 Ole Miss at Florida Gators');
  const tag = toWixSeoTag(ev);
  assert.equal(tag.type, 'script');
  assert.equal(tag.props.type, 'application/ld+json');
  assert.deepEqual(JSON.parse(tag.children)['@type'], 'SportsEvent');
});

test('serialization is script-safe and the homepage embed fits the Wix custom embed limit with headroom', () => {
  assert.equal(toJsonLd({ a: '</script>' }), '{"a":"\\u003c/script>"}');
  const { embed, homepage } = generate({ posts, scoreboard, now: NOW });
  assert.ok(embed.startsWith('<!-- GBM_SEO_GAME_GRAPH'));
  assert.ok(embed.length <= EMBED_BUDGET && EMBED_BUDGET < WIX_EMBED_MAX, `embed ${embed.length} chars`);
  const tag = toScriptTag(homepage, 'gbm-game-graph');
  const inner = tag.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
  assert.deepEqual(JSON.parse(inner), homepage); // round-trips
});

test('validator catches the failure modes we care about', () => {
  assert.deepEqual(validate({ '@context': 'https://schema.org', '@type': 'SportsEvent', name: 'x', startDate: 'Oct 3', homeTeam: { name: 'A' }, awayTeam: { name: 'A' }, eventStatus: 's' }).errors, [
    'graph[0]: bad startDate Oct 3', 'graph[0]: team plays itself']);
  assert.ok(validate({ '@type': 'NewsArticle', headline: 'h', url: 'u', datePublished: 'd', author: { '@type': 'Person', name: '' } }).errors.some((e) => /blank author|@context/.test(e)));
});
