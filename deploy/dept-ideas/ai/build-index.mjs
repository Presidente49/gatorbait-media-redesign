#!/usr/bin/env node
// Builds deploy/dept-ideas/ai/index.json: every document Ask GatorBait may answer from.
// Sources: gazette-live/posts.json (stories), sports-live/scoreboard.json (schedule, results, standings)
// and history.json (curated, cited facts + trivia). Nothing else. Run: node deploy/dept-ideas/ai/build-index.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokens } from './tokenize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..', '..');
const posts = JSON.parse(readFileSync(join(repo, 'gazette-live/posts.json'), 'utf8'));
const sb = JSON.parse(readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8'));
const hist = JSON.parse(readFileSync(join(here, 'history.json'), 'utf8'));

const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
function etDate(iso) {
  const d = new Date(iso); const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' }).formatToParts(d).forEach((p) => { o[p.type] = p.value; });
  return `${o.weekday}, ${MON[Number(o.month) - 1]} ${o.day}, ${o.year}`;
}
function etClock(iso) {
  const d = new Date(iso); const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(d).forEach((p) => { o[p.type] = p.value; });
  return `${o.hour}:${o.minute} ${o.dayPeriod === 'AM' ? 'a.m.' : 'p.m.'} ET`;
}
const rk = (r) => (r ? `No. ${r} ` : '');
const docs = [];

// Stories: title + excerpt + author + date. The Worker never sees full article bodies; it links to them.
for (const p of posts.posts || []) {
  if (!p.url || !p.title) continue;
  docs.push({ id: 'story:' + p.url.split('/post/')[1], type: 'story', title: p.title, url: p.url, author: p.author || 'GatorBait Staff',
    date: p.firstPublishedDate, text: `${p.title}. ${p.excerpt || ''} (By ${p.author || 'GatorBait Staff'}, GatorBait Media, ${etDate(p.firstPublishedDate)}.)` });
}

// Scoreboard: one doc per game plus record, next game and standings. Text is written out so the model reads a sentence, not JSON.
const t = sb.team;
docs.push({ id: 'sb:record', type: 'scoreboard', title: `Florida ${sb.season} record`, url: 'https://www.gatorbaitmedia.com/', date: sb.updatedAt,
  text: `As of ${etDate(sb.updatedAt)}, the ${sb.season} Florida Gators are ${t.record} overall and ${t.conf} in the SEC, ranked No. ${t.rank} (ESPN feed).` });
if (sb.next) {
  const n = sb.next;
  docs.push({ id: 'sb:next', type: 'scoreboard', title: `Next game: ${n.home ? 'vs.' : 'at'} ${n.opponent}`, url: n.previewUrl || 'https://www.gatorbaitmedia.com/', date: n.kickoffIso,
    text: `Florida's next game is ${n.home ? 'at home against' : 'on the road at'} ${rk(n.opponentRank)}${n.opponent} on ${etDate(n.kickoffIso)} at ${etClock(n.kickoffIso)}${n.tv ? ' on ' + n.tv : ''}${n.venue ? ', ' + n.venue : ''}.` });
}
for (const g of sb.schedule || []) {
  const where = g.home ? 'at home' : 'on the road';
  const line = g.status === 'final' && g.score
    ? `Florida ${g.score.fla > g.score.opp ? 'beat' : 'lost to'} ${rk(g.opponentRank)}${g.opponent} ${g.score.fla}-${g.score.opp} ${where} on ${etDate(g.date)}${g.tv ? ' (' + g.tv + ')' : ''}.`
    : `Florida plays ${rk(g.opponentRank)}${g.opponent} ${where} on ${etDate(g.date)}${g.tv ? ' on ' + g.tv : ''}; kickoff time ${/T0[45]:00/.test(g.date) ? 'not yet announced' : etClock(g.date)}.`;
  docs.push({ id: 'sb:game:' + g.eventId, type: 'scoreboard', title: `${g.status === 'final' ? 'Result' : 'Schedule'}: ${g.home ? 'vs.' : 'at'} ${g.opponent}`, url: g.storyUrl || 'https://www.gatorbaitmedia.com/', date: g.date, text: line });
}
if (sb.last && sb.last.quarters) {
  const l = sb.last;
  docs.push({ id: 'sb:last-quarters', type: 'scoreboard', title: `Quarter scores: Florida ${l.score.fla}, ${l.opponent} ${l.score.opp}`, url: l.recapUrl || 'https://www.gatorbaitmedia.com/', date: l.date,
    text: `Quarter-by-quarter, Florida ${l.score.fla}, ${rk(l.opponentRank)}${l.opponent} ${l.score.opp} at ${l.venue}: Florida scored ${l.quarters.fla.join(', ')} by quarter; ${l.opponent} scored ${l.quarters.opp.join(', ')}.` });
}
if (sb.standings && sb.standings.length) {
  docs.push({ id: 'sb:standings', type: 'scoreboard', title: 'SEC standings', url: 'https://www.gatorbaitmedia.com/', date: sb.updatedAt,
    text: `SEC standings as of ${etDate(sb.updatedAt)} (conference record, overall): ` + sb.standings.map((s) => `${s.team} ${s.confRecord} (${s.overall})`).join('; ') + '.' });
}

// History: curated and cited.
for (const f of hist.facts) docs.push({ id: 'hist:' + f.id, type: 'history', title: f.topic, url: f.sources[0], date: hist.updated, text: f.text, sources: f.sources });

// Term frequencies and document frequencies for the Worker's BM25 scoring.
const df = {};
for (const d of docs) {
  const tf = {};
  for (const w of tokens(d.title + ' ' + d.title + ' ' + d.text + ' ' + (d.author || ''))) tf[w] = (tf[w] || 0) + 1;
  d.tf = tf; d.len = Object.values(tf).reduce((a, b) => a + b, 0);
  for (const w in tf) df[w] = (df[w] || 0) + 1;
}
const avgLen = docs.reduce((a, d) => a + d.len, 0) / docs.length;
// Trivia pool: curated questions plus one generated from each final on the scoreboard (score questions have a known answer in our feed).
const trivia = hist.trivia.map((q) => ({ ...q, source: 'history' }));
for (const g of (sb.schedule || []).filter((g) => g.status === 'final' && g.score)) {
  const right = `${g.score.fla}-${g.score.opp}`;
  const wrong = [[g.score.fla - 7, g.score.opp], [g.score.fla, g.score.opp + 7], [g.score.fla + 3, g.score.opp - 3]].map((s) => `${s[0]}-${s[1]}`);
  const options = [right, ...wrong].sort();
  trivia.push({ id: 'g-' + g.eventId, q: `What was the final score when Florida played ${rk(g.opponentRank)}${g.opponent} on ${etDate(g.date).replace(/^\w+, /, '')}?`, options, answer: options.indexOf(right),
    why: `Florida ${g.score.fla > g.score.opp ? 'won' : 'lost'} ${right} ${g.home ? 'at The Swamp' : 'on the road'} (ESPN scoreboard feed).`, source: 'scoreboard', url: g.storyUrl || null });
}

const out = { built: new Date().toISOString(), scoreboardUpdated: sb.updatedAt, counts: { stories: docs.filter((d) => d.type === 'story').length, scoreboard: docs.filter((d) => d.type === 'scoreboard').length, history: docs.filter((d) => d.type === 'history').length, trivia: trivia.length }, avgLen, df, docs, trivia };
writeFileSync(join(here, 'index.json'), JSON.stringify(out));
console.log(`index.json: ${out.counts.stories} stories, ${out.counts.scoreboard} scoreboard docs, ${out.counts.history} history facts, ${trivia.length} trivia questions, ${Object.keys(df).length} terms`);
