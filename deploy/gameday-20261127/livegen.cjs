#!/usr/bin/env node
/*
 livegen — turns ESPN's live summary for one event into compact JSON for the live-updates post.
 Usage: node livegen.cjs <eventId> [--file summary.json] [--links "Game story|/post/slug;Halftime story|/post/slug"]
 Output (stdout): one JSON object {title, excerpt, updated, status, final, half, sections[], numbers[], links[]}
 Every number comes from ESPN's summary. Nothing is invented; a field ESPN does not give is left out.
*/
const https = require('https'); const fs = require('fs');
const EV = process.argv[2] || '401856759';
const fi = process.argv.indexOf('--file'); const FILE = fi > 0 ? process.argv[fi + 1] : null;
const li = process.argv.indexOf('--links'); const LINKS = li > 0 ? process.argv[li + 1].split(';').map(s => s.split('|')) : [];
const get = p => new Promise((res, rej) => { const r = https.get({ host: 'site.api.espn.com', path: p, headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 }, x => { let s = ''; x.on('data', d => s += d); x.on('end', () => { try { res(JSON.parse(s)); } catch (e) { rej(new Error('bad json ' + x.statusCode)); } }); }); r.on('timeout', () => r.destroy(new Error('timeout'))); r.on('error', rej); });
const ORD = ['', 'first', 'second', 'third', 'fourth'];
const nameOf = t => (t.location || t.shortDisplayName || t.displayName || '').replace(/ (Gators|Seminoles)$/, '');
const style = s => String(s || '').replace(/\s+/g, ' ').trim()
  .replace(/(\d+) Yd /g, '$1-yard ')
  .replace(/\b(Rushing|Passing|Receiving) Touchdown\b/g, m => m.toLowerCase())
  .replace(/\b(Field Goal|Interception Return|Fumble Return|Punt Return|Kickoff Return|Blocked Punt|Blocked Field Goal|Run|Pass|Rush|Kick|Safety|Return|Recovery|Reception)\b/g, m => m.toLowerCase())
  .replace(/\bKICK\b/g, 'kick').replace(/\bPASS\b/g, 'pass').replace(/\bRUN\b/g, 'run').replace(/Two-Point Conversion/g, 'two-point conversion').replace(/\(Two-Point/gi, '(two-point')
  .replace(/\s+\)/g, ')');
const etClock = () => new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).replace(' AM', ' a.m.').replace(' PM', ' p.m.') + ' ET';
(async () => {
  const j = FILE ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : await get(`/apis/site/v2/sports/football/college-football/summary?event=${EV}`);
  const c = j.header.competitions[0]; const st = c.status; const ty = st.type || {};
  const away = c.competitors.find(x => x.homeAway === 'away'), home = c.competitors.find(x => x.homeAway === 'home');
  const A = nameOf(away.team), H = nameOf(home.team);
  const aScore = +away.score || 0, hScore = +home.score || 0;
  const line = (a, h) => (a === h ? `${A} ${a}, ${H} ${h}` : a > h ? `${A} ${a}, ${H} ${h}` : `${H} ${h}, ${A} ${a}`);
  // leader first in the score line, house style
  const scoreStr = (a, h) => (h >= a ? `${H} ${h}, ${A} ${a}` : `${A} ${a}, ${H} ${h}`);
  const done = !!ty.completed || ty.state === 'post'; const pre = ty.state === 'pre'; const halftime = ty.name === 'STATUS_HALFTIME';
  const period = st.period || 0; const clock = st.displayClock || '';
  // cumulative score after each completed quarter from linescores
  const ls = t => (t.linescores || []).map(x => +x.displayValue || +x.value || 0);
  const la = ls(away), lh = ls(home); const cum = n => [la.slice(0, n).reduce((s, v) => s + v, 0), lh.slice(0, n).reduce((s, v) => s + v, 0)];
  const plays = (j.scoringPlays || []).map(p => ({ q: p.period.number, clock: p.clock.displayValue, team: p.team && p.team.id === home.team.id ? H : A, text: style(p.text), a: p.awayScore, h: p.homeScore, type: p.type && p.type.text }));
  const sections = [];
  for (let q = Math.max(period, plays.reduce((m, p) => Math.max(m, p.q), 0)); q >= 1; q--) {
    const inQ = plays.filter(p => p.q === q).reverse();
    const qDone = done || q < period || (q === period && (ty.name === 'STATUS_END_PERIOD' || halftime));
    let head;
    if (q > 4) head = `Overtime: ${scoreStr(q === period ? aScore : cum(q)[0], q === period ? hScore : cum(q)[1])}`;
    else { const [a, h] = qDone && q <= la.length ? cum(q) : [aScore, hScore]; head = (q === 2 && qDone ? 'Halftime: ' : q !== 4 && qDone ? `End of the ${ORD[q]} quarter: ` : `${ORD[q][0].toUpperCase() + ORD[q].slice(1)} quarter: `) + scoreStr(a, h); }
    sections.push({ h: head, items: inQ.map(p => [`${p.team}, ${p.clock}: `, `${p.text}. ${scoreStr(p.a, p.h)}.`]) });
  }
  // team numbers (ESPN, through the current time) at halftime and final only
  const numbers = []; const bt = (j.boxscore && j.boxscore.teams) || [];
  const stat = (t, n) => { const s = (t.statistics || []).find(x => x.name === n); return s ? s.displayValue : null; };
  const numLine = t => { const bits = []; const ty2 = stat(t, 'totalYards'), ru = stat(t, 'rushingYards'), pa = stat(t, 'netPassingYards'), th = stat(t, 'thirdDownEff'), to = stat(t, 'turnovers'), pe = stat(t, 'totalPenaltiesYards'), tp = stat(t, 'possessionTime');
    if (ty2) bits.push(`${ty2} total yards (${ru || '?'} rushing, ${pa || '?'} passing)`); if (th) { const m = /^(\d+)-(\d+)$/.exec(th); bits.push(m ? `${m[1]} of ${m[2]} on third down` : `third down ${th}`); } if (to) bits.push(`${to} turnover${to === '1' ? '' : 's'}`); if (pe) { const m = /^(\d+)-(\d+)$/.exec(pe); bits.push(m ? `${m[1]} penalt${m[1] === '1' ? 'y' : 'ies'} for ${m[2]} yards` : `penalties ${pe}`); } if (tp) bits.push(`time of possession ${tp}`); return bits.join(', ') + '.'; };
  if ((done || halftime) && bt.length) { numbers.push(done ? 'Final team numbers (ESPN)' : 'Halftime team numbers (ESPN, through the first half)'); [away, home].forEach(x => { const t = bt.find(b => b.team.id === x.team.id); if (t) numbers.push([`${nameOf(x.team)}: `, numLine(t)]); }); }
  let status;
  if (pre) status = 'Kickoff is at 3:30 p.m. ET on ABC.'; else if (done) status = `Final: ${scoreStr(aScore, hScore)}.`; else if (halftime) status = `Halftime: ${scoreStr(aScore, hScore)}.`; else if (ty.name === 'STATUS_END_PERIOD') status = `End of the ${ORD[period]} quarter: ${scoreStr(aScore, hScore)}.`; else status = `${period > 4 ? 'Overtime' : ORD[period][0].toUpperCase() + ORD[period].slice(1) + ' quarter'}, ${clock} left: ${scoreStr(aScore, hScore)}.`;
  const title = done ? `Live updates: No. 20 Florida at Florida State (final: ${scoreStr(aScore, hScore)})` : 'Live updates: No. 20 Florida at Florida State';
  const excerpt = done ? `Final: ${scoreStr(aScore, hScore)}. The quarter-by-quarter record of No. 20 Florida at Florida State, with team numbers from ESPN.` : `${status.replace(/\.$/, '')}. Every score, the end of each quarter and the final from No. 20 Florida at Florida State, updated as the game goes.`;
  console.log(JSON.stringify({ event: EV, away: A, home: H, aScore, hScore, state: ty.name, period, clock, updated: etClock(), status, final: done, title, excerpt: excerpt.slice(0, 190), sections, numbers, links: LINKS, plays: plays.length }));
})().catch(e => { console.error('LIVEGEN ERROR', e.message); process.exit(1); });
