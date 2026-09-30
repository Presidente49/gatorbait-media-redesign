#!/usr/bin/env node
/* The Scout: an opponent scouting sheet built from ESPN's public JSON, with every number cited to the URL it came from.
 *
 * Reads sports-live/scoreboard.json for the next opponent, then reads five ESPN documents:
 *   summary?event=<next eventId>          season leaders + per-game team stats for both teams, last five, predictor, venue, weather
 *   teams/<oppId>                         rank, record, SEC standing
 *   teams/<oppId>/schedule?season=<y>     every result and remaining game
 *   summary?event=<opp last final>        line score, team stats, game leaders, scoring plays
 *   teams/57                              Florida rank/record cross-check
 * Writes scout-<opponent>.json and scout-<opponent>.md (and preview.html with --html). Nothing here touches the feed or Wix.
 *
 *   node scout.mjs --from-dir espn --html          # build from saved ESPN JSON (this container cannot reach ESPN directly)
 *   node scout.mjs --save-dir espn --html          # live: fetch from ESPN and keep the raw JSON alongside the sheet
 * Exit 2 on any fetch/parse/consistency failure; nothing is written then.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football';
const FLA = '57';
const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : []).filter(Boolean));
const scoreboardPath = path.resolve(ROOT, args.scoreboard || 'sports-live/scoreboard.json');

/* ---------- fetching: live or from a folder of saved responses ---------- */
function fileFor(url) {
  let m;
  if ((m = url.match(/teams\/(\d+)\/schedule\?season=(\d+)/))) return `schedule-${m[1]}-${m[2]}.json`;
  if ((m = url.match(/teams\/(\d+)$/))) return `team-${m[1]}.json`;
  if ((m = url.match(/summary\?event=(\d+)/))) return `summary-${m[1]}.json`;
  throw new Error('no file mapping for ' + url);
}
async function getJson(url) {
  if (args['from-dir']) {
    const p = path.resolve(HERE, String(args['from-dir']), fileFor(url));
    if (!fs.existsSync(p)) throw new Error(`missing saved response ${p} for ${url}`);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  const r = await fetch(url, { headers: { 'User-Agent': 'GatorBait-Scout/1 (+https://www.gatorbaitmedia.com)', Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  const doc = await r.json();
  if (args['save-dir']) { const d = path.resolve(HERE, String(args['save-dir'])); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, fileFor(url)), JSON.stringify(doc) + '\n'); }
  return doc;
}

/* ---------- helpers ---------- */
const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const ET = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
function apDate(iso) { const p = Object.fromEntries(ET.formatToParts(new Date(iso)).map(x => [x.type, x.value])); return `${MONTHS[+p.month - 1]} ${+p.day}`; }
function apTime(iso) { const p = Object.fromEntries(ET.formatToParts(new Date(iso)).map(x => [x.type, x.value])); return `${p.hour}${p.minute === '00' ? '' : ':' + p.minute} ${p.dayPeriod.toLowerCase().replace('am', 'a.m.').replace('pm', 'p.m.')} ET`; }
const num = v => { const n = typeof v === 'object' && v ? v.displayValue ?? v.value : v; return n == null || n === '' ? null : Number(n); };
const rank = c => { const r = c?.curatedRank?.current ?? c?.rank; return r && r >= 1 && r <= 25 ? +r : null; };
const NAMES = {}; // ESPN team id -> location, learned from documents that carry it; lastFive and scoringPlays objects carry only displayName
const KNOWN = []; // opponent names from sports-live/scoreboard.json, for ESPN objects that carry only displayName
const loc = t => t?.location || (t?.id && NAMES[String(t.id)]) || KNOWN.find(n => String(t?.displayName || '').startsWith(n + ' ')) || t?.displayName || '';
const learn = t => { if (t?.id && t?.location) NAMES[String(t.id)] = t.location; };
const rec = (c, type) => (c.record || c.records || []).find(r => r.type === type)?.summary ?? null;
const ranked = (r, n) => (r ? `No. ${r} ` : '') + n;
const avg = (xs) => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length * 10) / 10 : null;
function fail(msg) { console.error('scout: ' + msg + '; nothing written'); process.exit(2); }

/* ---------- build ---------- */
async function main() {
  const sb = JSON.parse(fs.readFileSync(scoreboardPath, 'utf8'));
  if (!sb.next?.eventId || !sb.next.opponent) fail('scoreboard.json has no next game');
  const season = sb.season, nextId = String(sb.next.eventId);
  KNOWN.push(...sb.schedule.map(g => g.opponent));
  const S = {}; // sources: short key -> ESPN URL
  const src = (key, url) => { S[key] = url; return key; };
  const U = {
    next: src('S1', `${API}/summary?event=${nextId}`),
  };
  const nextSum = await getJson(S.S1);
  const comp = nextSum.header.competitions[0];
  comp.competitors.forEach(c => learn(c.team));
  const oppC = comp.competitors.find(c => String(c.team.id) !== FLA), flaC = comp.competitors.find(c => String(c.team.id) === FLA);
  if (!oppC || !flaC) fail('next-game summary does not contain Florida and an opponent');
  const oppId = String(oppC.team.id), opp = loc(oppC.team);
  if (opp !== sb.next.opponent) fail(`ESPN opponent ${opp} != scoreboard next ${sb.next.opponent}`);
  U.team = src('S2', `${API}/teams/${oppId}`);
  U.sched = src('S3', `${API}/teams/${oppId}/schedule?season=${season}&seasontype=2`);
  U.fla = src('S5', `${API}/teams/${FLA}`);
  const [teamDoc, schedDoc, flaDoc] = await Promise.all([getJson(S.S2), getJson(S.S3), getJson(S.S5)]);
  const team = teamDoc.team;

  // Results: one row per game on the opponent's schedule.
  (schedDoc.events || []).forEach(ev => ev.competitions[0].competitors.forEach(c => learn(c.team)));
  const games = (schedDoc.events || []).map(ev => {
    const c = ev.competitions[0], me = c.competitors.find(x => String(x.team.id) === oppId), them = c.competitors.find(x => x !== me);
    const st = c.status?.type || {}, a = num(me.score), b = num(them.score), fin = st.state === 'post' && st.completed;
    return { eventId: String(ev.id), date: c.date || ev.date, opponent: loc(them.team), opponentId: String(them.team.id), opponentRank: rank(them), home: me.homeAway === 'home' && !c.neutralSite, neutral: !!c.neutralSite,
      status: fin ? 'final' : st.state === 'in' ? 'in-progress' : 'scheduled', score: fin && a != null && b != null ? { opp: a, them: b } : null, result: fin && a != null ? (a > b ? 'W' : a < b ? 'L' : 'T') : null,
      margin: fin && a != null ? a - b : null, venue: c.venue?.fullName || null, tv: c.broadcasts?.[0]?.media?.shortName || null, source: 'S3' };
  }).sort((x, y) => x.date.localeCompare(y.date));
  const finals = games.filter(g => g.status === 'final');
  const W = finals.filter(g => g.result === 'W').length, L = finals.filter(g => g.result === 'L').length;
  const record = team.record?.items?.find(i => i.type === 'total')?.summary || rec(oppC, 'total');
  if (record !== `${W}-${L}`) fail(`computed record ${W}-${L} != ESPN record ${record}`);
  const lastFinal = finals[finals.length - 1];
  if (!lastFinal) fail('opponent has no completed game');
  U.last = src('S4', `${API}/summary?event=${lastFinal.eventId}`);
  const lastSum = await getJson(S.S4);

  // Season per-game team stats (both teams) and season leaders, from the pregame summary.
  const stat = (t, name) => num(nextSum.boxscore.teams.find(x => String(x.team.id) === t)?.statistics.find(s => s.name === name)?.displayValue);
  const STATS = ['totalPointsPerGame', 'totalPointsPerGameAllowed', 'yardsPerGame', 'yardsPerGameAllowed', 'passingYardsPerGame', 'passingYardsPerGameAllowed', 'rushingYardsPerGame', 'rushingYardsPerGameAllowed'];
  const perGame = Object.fromEntries(STATS.map(k => [k, { opp: stat(oppId, k), fla: stat(FLA, k), source: 'S1' }]));
  const computedPpg = avg(finals.map(g => g.score.opp)), computedPapg = avg(finals.map(g => g.score.them));
  if (computedPpg !== perGame.totalPointsPerGame.opp || computedPapg !== perGame.totalPointsPerGameAllowed.opp) fail(`schedule points ${computedPpg}/${computedPapg} disagree with summary per-game ${perGame.totalPointsPerGame.opp}/${perGame.totalPointsPerGameAllowed.opp}`);
  const leadersOf = (doc, t, key) => Object.fromEntries((doc.leaders || []).find(l => String(l.team.id) === t)?.leaders.map(c => [c.name, c.leaders.slice(0, 1).map(x => ({ name: x.athlete.displayName, pos: x.athlete.position?.abbreviation || null, jersey: x.athlete.jersey || null, line: x.displayValue, source: key }))[0]]) || []);
  const leaders = { opp: leadersOf(nextSum, oppId, 'S1'), fla: leadersOf(nextSum, FLA, 'S1') };

  // Last game: line score, team stats, game leaders, scoring plays.
  const lc = lastSum.header.competitions[0], lme = lc.competitors.find(c => String(c.team.id) === oppId), lthem = lc.competitors.find(c => c !== lme);
  const lstat = (t, name) => lastSum.boxscore.teams.find(x => String(x.team.id) === t)?.statistics.find(s => s.name === name)?.displayValue ?? null;
  const KEYS = ['firstDowns', 'totalYards', 'netPassingYards', 'rushingYards', 'yardsPerRushAttempt', 'thirdDownEff', 'turnovers', 'totalPenaltiesYards', 'possessionTime'];
  const lines = c => (c.linescores || []).map(x => num(x));
  const lq = { opp: lines(lme), them: lines(lthem) };
  if (lq.opp.reduce((a, b) => a + b, 0) !== num(lme.score) || lq.them.reduce((a, b) => a + b, 0) !== num(lthem.score)) fail('last-game line scores do not add up');
  const lastGame = { eventId: lastFinal.eventId, date: lc.date, opponent: loc(lthem.team), opponentRank: rank(lthem), home: lme.homeAway === 'home', result: lastFinal.result, score: { opp: num(lme.score), them: num(lthem.score) },
    quarters: lq, venue: lastSum.gameInfo?.venue?.fullName || null, attendance: lastSum.gameInfo?.attendance ?? null, recordAfter: rec(lme, 'total'),
    teamStats: Object.fromEntries(KEYS.map(k => [k, { opp: lstat(oppId, k), them: lstat(String(lthem.team.id), k) }])), leaders: { opp: leadersOf(lastSum, oppId, 'S4'), them: leadersOf(lastSum, String(lthem.team.id), 'S4') },
    scoringPlays: (lastSum.scoringPlays || []).map(p => ({ q: p.period.number, clock: p.clock.displayValue, team: loc(p.team), text: p.text, score: `${p.awayScore}-${p.homeScore}` })), source: 'S4' };

  // Common opponents: Florida's schedule is the repo feed (ESPN-built), the opponent's is S3.
  const common = games.filter(g => sb.schedule.some(f => f.opponent === g.opponent)).map(g => {
    const f = sb.schedule.find(x => x.opponent === g.opponent);
    const say = (x, mine, theirs, home, status, date) => status === 'final' ? `${mine > theirs ? 'W' : 'L'} ${mine}-${theirs} (${home ? 'home' : 'away'}, ${apDate(date)})` : `${home ? 'vs.' : 'at'} ${x}, ${apDate(date)}`;
    return { opponent: g.opponent, florida: say(g.opponent, f.score?.fla, f.score?.opp, f.home, f.status, f.date), [opp.toLowerCase()]: say(g.opponent, g.score?.opp, g.score?.them, g.home, g.status, g.date), sources: ['S3', 'scoreboard.json'] };
  });

  const lastFive = Object.fromEntries((nextSum.lastFiveGames || []).map(x => [String(x.team.id) === oppId ? 'opp' : 'fla', x.events.map(e => ({ eventId: e.id, result: e.gameResult, score: e.score, opponent: loc(e.opponent), date: e.gameDate, at: e.atVs === '@', source: 'S1' }))]));
  const pred = nextSum.predictor || {};
  const out = {
    generatedAt: new Date().toISOString(), season, feedUpdatedAt: sb.updatedAt, dataMode: args['from-dir'] ? 'saved-espn-json' : 'live-espn',
    game: { eventId: nextId, kickoffIso: comp.date, date: apDate(comp.date), time: apTime(comp.date), venue: nextSum.gameInfo?.venue?.fullName || null, city: [nextSum.gameInfo?.venue?.address?.city, nextSum.gameInfo?.venue?.address?.state].filter(Boolean).join(', ') || null,
      tv: comp.broadcasts?.[0]?.media?.shortName || null, floridaHome: flaC.homeAway === 'home', weather: nextSum.gameInfo?.weather ? { temperature: nextSum.gameInfo.weather.temperature, precipitationPct: nextSum.gameInfo.weather.precipitation, gustMph: nextSum.gameInfo.weather.gust } : null,
      predictor: pred.homeTeam ? { opp: num(String(pred.homeTeam.id) === oppId ? pred.homeTeam.gameProjection : pred.awayTeam.gameProjection), fla: num(String(pred.homeTeam.id) === FLA ? pred.homeTeam.gameProjection : pred.awayTeam.gameProjection), label: pred.header } : null, source: 'S1' },
    opponent: { id: oppId, name: opp, displayName: oppC.team.displayName, rank: team.rank ?? rank(oppC), record, conf: rec(oppC, 'vsconf'), standing: team.standingSummary || null, color: team.color || null, sources: ['S2', 'S1'] },
    florida: { rank: flaDoc.team.rank ?? rank(flaC), record: flaDoc.team.record?.items?.find(i => i.type === 'total')?.summary, conf: rec(flaC, 'vsconf'), standing: flaDoc.team.standingSummary || null, sources: ['S5', 'S1'] },
    results: games, pointsFor: finals.reduce((a, g) => a + g.score.opp, 0), pointsAgainst: finals.reduce((a, g) => a + g.score.them, 0), pointsSource: 'S3', perGame, leaders, lastGame, lastFive, commonOpponents: common,
    seriesHistory: null, notes: [
      'seriesHistory is null: the ESPN site API documents read here carry no head-to-head history; add it only from a source on the allowed list.',
      'opponentRank on results rows is the rank ESPN attaches to the row when read, not the rank at kickoff.',
      'Every number carries a source key; the sources map gives the URL. Florida results come from sports-live/scoreboard.json, itself built from ESPN by automation/scoreboard_feed.py.',
    ], sources: Object.fromEntries(Object.entries(S).sort()),
  };
  const slug = opp.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  fs.writeFileSync(path.join(HERE, `scout-${slug}.json`), JSON.stringify(out, null, 1) + '\n');
  fs.writeFileSync(path.join(HERE, `scout-${slug}.md`), markdown(out));
  if (args.html) fs.writeFileSync(path.join(HERE, 'preview.html'), html(out));
  console.log(JSON.stringify({ opponent: opp, record, rank: out.opponent.rank, games: games.length, finals: finals.length, lastGame: `${lastGame.result} ${lastGame.score.opp}-${lastGame.score.them} ${lastGame.home ? 'vs.' : 'at'} ${lastGame.opponent}`, common: common.map(c => c.opponent), files: [`scout-${slug}.json`, `scout-${slug}.md`].concat(args.html ? ['preview.html'] : []) }));
}

/* ---------- markdown ---------- */
const STAT_LABEL = { totalPointsPerGame: 'Points per game', totalPointsPerGameAllowed: 'Points allowed per game', yardsPerGame: 'Yards per game', yardsPerGameAllowed: 'Yards allowed per game', passingYardsPerGame: 'Passing yards per game', passingYardsPerGameAllowed: 'Passing yards allowed', rushingYardsPerGame: 'Rushing yards per game', rushingYardsPerGameAllowed: 'Rushing yards allowed',
  firstDowns: 'First downs', totalYards: 'Total yards', netPassingYards: 'Net passing yards', rushingYards: 'Rushing yards', yardsPerRushAttempt: 'Yards per rush', thirdDownEff: 'Third down', turnovers: 'Turnovers', totalPenaltiesYards: 'Penalties-yards', possessionTime: 'Possession' };
const LEAD = { passingYards: 'Passing', rushingYards: 'Rushing', receivingYards: 'Receiving', sacks: 'Sacks', totalTackles: 'Tackles' };
function markdown(d) {
  const o = d.opponent, g = d.game, N = o.name, lg = d.lastGame, c = k => `[${k}]`;
  const L = [];
  L.push(`# Scouting sheet: ${ranked(o.rank, N)}`, '', `${ranked(d.florida.rank, 'Florida')} (${d.florida.record}, ${d.florida.conf} SEC) ${c('S5')}${c('S1')} ${g.floridaHome ? 'vs.' : 'at'} ${ranked(o.rank, N)} (${o.record}, ${o.conf} SEC, ${o.standing}) ${c('S2')}${c('S1')}, ${g.date}, ${g.time}, ${g.venue}, ${g.city}${g.tv ? ', ' + g.tv : ''} ${c('S1')}.`, '',
    `Built ${d.generatedAt.slice(0, 16).replace('T', ' ')}Z from ${d.dataMode === 'live-espn' ? 'live ESPN JSON' : 'ESPN JSON saved in espn/'}; Florida results from sports-live/scoreboard.json (updated ${d.feedUpdatedAt}). Bracketed keys are the sources listed at the end.`, '');
  L.push(`## Results (${o.record}) ${c('S3')}`, '', '| Date | Opponent | Site | Result | Margin |', '|---|---|---|---|---|');
  for (const r of d.results) L.push(`| ${apDate(r.date)} | ${ranked(r.opponentRank, r.opponent)} | ${r.neutral ? 'Neutral' : r.home ? 'Home' : 'Away'} | ${r.status === 'final' ? `${r.result} ${r.score.opp}-${r.score.them}` : r.tv || 'Scheduled'} | ${r.margin == null ? '' : (r.margin > 0 ? '+' : '') + r.margin} |`);
  L.push('', `Points for ${d.pointsFor}, against ${d.pointsAgainst} in ${d.results.filter(r => r.status === 'final').length} games ${c('S3')}.`, '');
  L.push(`## Season per game, ${N} vs. Florida ${c('S1')}`, '', `| Stat | ${N} | Florida |`, '|---|---|---|');
  for (const [k, v] of Object.entries(d.perGame)) L.push(`| ${STAT_LABEL[k]} | ${v.opp} | ${v.fla} |`);
  L.push('', `## ${N} season leaders ${c('S1')}`, '');
  for (const [k, v] of Object.entries(d.leaders.opp)) L.push(`- ${LEAD[k] || k}: ${v.name}${v.pos ? ', ' + v.pos : ''}, ${v.line}`);
  L.push('', `## Florida season leaders ${c('S1')}`, '');
  for (const [k, v] of Object.entries(d.leaders.fla)) L.push(`- ${LEAD[k] || k}: ${v.name}${v.pos ? ', ' + v.pos : ''}, ${v.line}`);
  L.push('', `## Last game: ${lg.result} ${lg.score.opp}-${lg.score.them} ${lg.home ? 'vs.' : 'at'} ${ranked(lg.opponentRank, lg.opponent)}, ${apDate(lg.date)} ${c('S4')}`, '', `${lg.venue}${lg.attendance ? ', attendance ' + lg.attendance.toLocaleString('en-US') : ''}. ${N} ${lg.recordAfter} after the game.`, '',
    `| Quarter | ${lg.quarters.opp.map((_, i) => i + 1).join(' | ')} | Final |`, `|---|${lg.quarters.opp.map(() => '---|').join('')}---|`, `| ${N} | ${lg.quarters.opp.join(' | ')} | ${lg.score.opp} |`, `| ${lg.opponent} | ${lg.quarters.them.join(' | ')} | ${lg.score.them} |`, '',
    `| Stat | ${N} | ${lg.opponent} |`, '|---|---|---|');
  for (const [k, v] of Object.entries(lg.teamStats)) L.push(`| ${STAT_LABEL[k]} | ${v.opp} | ${v.them} |`);
  L.push('', `Game leaders, ${N}:`, '');
  for (const [k, v] of Object.entries(lg.leaders.opp)) L.push(`- ${LEAD[k] || k}: ${v.name}, ${v.line}`);
  L.push('', 'Scoring:', '');
  for (const p of lg.scoringPlays) L.push(`- Q${p.q} ${p.clock}, ${p.team}: ${p.text.trim()} (${p.score})`);
  L.push('', `## Common opponents ${c('S3')} + scoreboard.json`, '');
  if (!d.commonOpponents.length) L.push('None.');
  for (const x of d.commonOpponents) L.push(`- ${x.opponent}: Florida ${x.florida}; ${N} ${x[N.toLowerCase()]}`);
  L.push('', `## Last five, both teams ${c('S1')}`, '', `- ${N}: ${d.lastFive.opp.map(e => `${e.result} ${e.score} ${e.at ? 'at' : 'vs.'} ${e.opponent} (${apDate(e.date)})`).join('; ')}`, `- Florida: ${d.lastFive.fla.map(e => `${e.result} ${e.score} ${e.at ? 'at' : 'vs.'} ${e.opponent} (${apDate(e.date)})`).join('; ')}`, '');
  if (g.predictor) L.push(`## ESPN ${g.predictor.label} ${c('S1')}`, '', `Florida ${g.predictor.fla}%, ${N} ${g.predictor.opp}%.`, '');
  if (g.weather) L.push(`## Forecast at read time ${c('S1')}`, '', `${g.weather.temperature} F, ${g.weather.precipitationPct}% precipitation, gusts ${g.weather.gustMph} mph.`, '');
  L.push('## Series history', '', 'Not available from the ESPN documents read; omitted rather than sourced elsewhere.', '', '## Notes', '', ...d.notes.map(n => '- ' + n), '', '## Sources', '', ...Object.entries(d.sources).map(([k, u]) => `- [${k}] ${u}`), '- [scoreboard.json] sports-live/scoreboard.json (ESPN via automation/scoreboard_feed.py)', '');
  return L.join('\n');
}

/* ---------- preview.html: the same sheet, Swamp Night palette, Barlow ---------- */
const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function html(d) {
  const o = d.opponent, g = d.game, N = o.name, lg = d.lastGame, s = k => `<sup><a href="#${k}">${k}</a></sup>`;
  const tile = (label, a, b, k) => `<div class="t"><small>${label}</small><b>${a}</b><i>Florida ${b}</i>${s(k)}</div>`;
  const rows = d.results.map(r => `<tr${r.eventId === g.eventId ? ' class="nx"' : ''}><td>${apDate(r.date)}</td><td>${esc(ranked(r.opponentRank, r.opponent))}</td><td>${r.neutral ? 'N' : r.home ? 'H' : 'A'}</td><td class="r${r.result === 'W' ? ' w' : r.result === 'L' ? ' l' : ''}">${r.status === 'final' ? `${r.result} ${r.score.opp}-${r.score.them}` : esc(r.tv || '')}</td></tr>`).join('');
  const lead = (obj, k) => Object.entries(obj).map(([key, v]) => `<li><span>${LEAD[key] || key}</span><b>${esc(v.name)}${v.pos ? ', ' + v.pos : ''}${s(k)}</b><em>${esc(v.line)}</em></li>`).join('');
  const stats = Object.entries(lg.teamStats).map(([k, v]) => `<tr><td>${STAT_LABEL[k]}</td><td class="r">${esc(v.opp)}</td><td class="r">${esc(v.them)}</td></tr>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Scout: ${esc(N)}</title>
<meta name="description" content="Research dept.: ${esc(N)} scouting sheet built by scout.mjs from ESPN public JSON; every number cites its ESPN URL.">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;800&family=Barlow:wght@400;600&display=swap" rel="stylesheet">
<style>:root{--navy:#07122e;--blue:#0021a5;--org:#fa4616;--ink:#f3f5fa;--dim:#aab3cc;--line:#1c2a55}*{box-sizing:border-box;margin:0}body{background:var(--navy);color:var(--ink);font:15px/1.4 Barlow,sans-serif;padding:20px 16px 40px}main{max-width:640px;margin:0 auto}h1,h2,.t b,.q b{font-family:"Barlow Condensed",sans-serif;text-transform:uppercase;letter-spacing:.02em}.k{color:var(--org);font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase}h1{font-size:46px;line-height:.95;font-weight:800;margin:4px 0 8px}.dek{color:var(--dim);font-size:15px}h2{font-size:22px;font-weight:800;margin:26px 0 8px;padding-top:12px;border-top:1px solid var(--line)}table{width:100%;border-collapse:collapse}td{padding:5px 4px;border-top:1px solid var(--line)}td.r{text-align:right;white-space:nowrap}.w{color:var(--org);font-weight:600}.l{color:var(--dim)}tr.nx td{background:var(--blue)}.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}@media(max-width:480px){.tiles{grid-template-columns:1fr 1fr}}.t{background:var(--blue);border-radius:6px;padding:10px 8px}.t small{display:block;color:var(--dim);font-size:11px;letter-spacing:.06em;text-transform:uppercase}.t b{display:block;font-size:30px;line-height:1.05}.t i{font-style:normal;font-size:12px;color:var(--dim)}ul{list-style:none;padding:0}li{display:grid;grid-template-columns:76px 1fr;gap:2px 8px;padding:5px 0;border-top:1px solid var(--line)}li span{color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.06em;padding-top:3px}li em{font-style:normal;color:var(--dim);grid-column:2}.q{display:grid;grid-template-columns:90px repeat(${lg.quarters.opp.length},1fr) 56px;gap:4px;text-align:center;margin:8px 0}.q b{background:var(--blue);border-radius:4px;padding:6px 0;font-size:20px}.q span{text-align:left;align-self:center;font-weight:600}sup a{color:var(--org);text-decoration:none;font-size:10px;margin-left:2px}.src{font-size:12px;color:var(--dim);word-break:break-all}.src a{color:var(--ink)}p{margin:6px 0}</style></head>
<body><main>
<p class="k">The Scout · built by scout.mjs · ${esc(d.generatedAt.slice(0, 10))}</p>
<h1>${esc(ranked(o.rank, N))}</h1>
<p class="dek">${o.record}, ${o.conf} SEC, ${esc(o.standing)}${s('S2')}. ${esc(ranked(d.florida.rank, 'Florida'))} (${d.florida.record}${s('S5')}) ${g.floridaHome ? 'vs.' : 'at'} ${esc(N)}, ${g.date}, ${g.time}, ${esc(g.venue)}${g.tv ? ', ' + esc(g.tv) : ''}${s('S1')}.${g.predictor ? ` ESPN ${esc(g.predictor.label)}: Florida ${g.predictor.fla}%${s('S1')}.` : ''}</p>
<h2>Per game, season</h2>
<div class="tiles">${tile('Points', d.perGame.totalPointsPerGame.opp, d.perGame.totalPointsPerGame.fla, 'S1')}${tile('Points allowed', d.perGame.totalPointsPerGameAllowed.opp, d.perGame.totalPointsPerGameAllowed.fla, 'S1')}${tile('Yards', d.perGame.yardsPerGame.opp, d.perGame.yardsPerGame.fla, 'S1')}${tile('Yards allowed', d.perGame.yardsPerGameAllowed.opp, d.perGame.yardsPerGameAllowed.fla, 'S1')}</div>
<h2>Results, ${o.record}</h2>
<table>${rows}</table>
<p class="dek">Points for ${d.pointsFor}, against ${d.pointsAgainst}${s('S3')}. Row ranks are ESPN's at read time, not at kickoff.</p>
<h2>${esc(N)} leaders</h2><ul>${lead(d.leaders.opp, 'S1')}</ul>
<h2>Last game: ${lg.result} ${lg.score.opp}-${lg.score.them} ${lg.home ? 'vs.' : 'at'} ${esc(ranked(lg.opponentRank, lg.opponent))}</h2>
<p class="dek">${apDate(lg.date)}, ${esc(lg.venue)}${lg.attendance ? ', attendance ' + lg.attendance.toLocaleString('en-US') : ''}${s('S4')}</p>
<div class="q"><span>${esc(N)}</span>${lg.quarters.opp.map(q => `<b>${q}</b>`).join('')}<b>${lg.score.opp}</b><span>${esc(lg.opponent)}</span>${lg.quarters.them.map(q => `<b>${q}</b>`).join('')}<b>${lg.score.them}</b></div>
<table><tr><td></td><td class="r">${esc(N)}</td><td class="r">${esc(lg.opponent)}</td></tr>${stats}</table>
<ul>${lead(lg.leaders.opp, 'S4')}</ul>
<h2>Common opponents</h2>
${d.commonOpponents.length ? '<ul>' + d.commonOpponents.map(x => `<li><span>${esc(x.opponent)}</span><b>Florida ${esc(x.florida)}${s('S3')}</b><em>${esc(N)} ${esc(x[N.toLowerCase()])}</em></li>`).join('') + '</ul>' : '<p class="dek">None.</p>'}
<h2>Sources</h2>
<p class="src">${Object.entries(d.sources).map(([k, u]) => `<span id="${k}">[${k}] <a href="${esc(u)}">${esc(u)}</a></span>`).join('<br>')}<br>Florida results: sports-live/scoreboard.json (ESPN via automation/scoreboard_feed.py). Series history: not in these ESPN documents, omitted.</p>
</main></body></html>
`;
}

main().catch(e => fail(e.message));
