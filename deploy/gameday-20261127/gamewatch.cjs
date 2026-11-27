#!/usr/bin/env node
/*
 gamewatch — live feed for one ESPN event. Appends one line per real change to events.log:
 kickoff, every score change (with the scoring play), end of each quarter, halftime, final,
 delays, and pregame line moves. State survives restarts (state.json). Read-only.
 Usage: node gamewatch.cjs <eventId> [sport-path]
*/
const fs = require('fs'); const path = require('path'); const https = require('https');
const EVENT = process.argv[2] || '401856759';
const SPORT = process.argv[3] || 'football/college-football';
const DIR = __dirname; const LOG = path.join(DIR, 'events.log'); const STATE = path.join(DIR, 'state.json');
const HOSTS = ['site.api.espn.com', 'site.web.api.espn.com'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const et = () => new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', second: '2-digit' }) + ' ET';
function get(host, p) { return new Promise((res, rej) => { const rq = https.get({ host, path: p, headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, timeout: 20000 }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { if (r.statusCode !== 200) return rej(new Error('http ' + r.statusCode)); try { res(JSON.parse(s)); } catch (e) { rej(new Error('bad json')); } }); }); rq.on('timeout', () => rq.destroy(new Error('timeout'))); rq.on('error', rej); }); }
async function fetchJson(p) { let err; for (const h of HOSTS) { try { return await get(h, p); } catch (e) { err = e; } } throw err; }
function emit(line) { const l = `[${et()}] ${line}`; fs.appendFileSync(LOG, l + '\n'); }
let st = {}; try { st = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
const save = () => fs.writeFileSync(STATE, JSON.stringify(st));
async function lastScoringPlay() { try { const s = await fetchJson(`/apis/site/v2/sports/${SPORT}/summary?event=${EVENT}`); const sp = (s.scoringPlays || []); const p = sp[sp.length - 1]; if (!p) return ''; return `${p.team && p.team.abbreviation ? p.team.abbreviation + ' ' : ''}${p.type && p.type.text ? p.type.text + ': ' : ''}${p.text || ''} (Q${p.period && p.period.number}, ${p.clock && p.clock.displayValue})`; } catch (e) { return ''; } }
(async () => {
  emit(`WATCH START event ${EVENT}`);
  let fails = 0, warned = false, finalAt = 0;
  for (;;) {
    let wait = 30000;
    try {
      const j = await fetchJson(`/apis/site/v2/sports/${SPORT}/scoreboard/${EVENT}`);
      if (warned) { emit('FEED OK again'); warned = false; } fails = 0;
      const c = j.competitions[0]; const s = c.status; const type = s.type || {};
      const a = c.competitors.find(x => x.homeAway === 'away'), h = c.competitors.find(x => x.homeAway === 'home');
      const sc = `${a.team.abbreviation} ${a.score}, ${h.team.abbreviation} ${h.score}`;
      const key = { state: type.state, name: type.name, period: s.period, a: String(a.score), h: String(h.score) };
      const odds = (c.odds || [])[0]; const line = odds ? `${odds.details || ''} O/U ${odds.overUnder || ''} (${(odds.provider || {}).name || ''})` : '';
      if (st.state === undefined) { emit(`STATE ${type.description || type.name}: ${sc}${line ? ' | line ' + line : ''} | kickoff ${j.date}`); }
      else {
        if (type.state === 'pre' && line && st.line && line !== st.line) emit(`PREGAME line move: ${st.line} -> ${line}`);
        if (type.name !== st.name) {
          if (type.state === 'in' && st.state === 'pre') emit(`KICKOFF: game is live. ${sc}`);
          else if (type.name === 'STATUS_HALFTIME') emit(`HALFTIME: ${sc}`);
          else if (type.completed || type.state === 'post') { emit(`FINAL: ${sc} (${type.detail || type.description})`); finalAt = finalAt || Date.now(); }
          else if (/DELAY|POSTPON|CANCEL|SUSPEND/i.test(type.name || '')) emit(`ALERT ${type.description}: ${sc} | ${type.detail || ''}`);
          else if (type.name === 'STATUS_END_PERIOD') emit(`END Q${s.period}: ${sc}`);
          else if (st.name === 'STATUS_HALFTIME' && type.state === 'in') emit(`SECOND HALF under way: ${sc}`);
          else if (type.state === 'in' && st.state === 'in') { /* back in progress after a break: no event */ }
          else emit(`STATUS ${type.description || type.name}: ${sc}`);
        }
        if (type.state === 'in' && st.state === 'in' && s.period !== st.period && type.name !== 'STATUS_HALFTIME' && st.name !== 'STATUS_END_PERIOD' && st.name !== 'STATUS_HALFTIME') emit(s.period > 4 ? `OVERTIME (period ${s.period}): ${sc}` : `END Q${st.period}: ${sc}`);
        if ((key.a !== st.a || key.h !== st.h) && type.state !== 'pre') { const play = await lastScoringPlay(); emit(`SCORE: ${sc} | Q${s.period} ${s.displayClock}${play ? ' | ' + play : ''}`); }
      }
      st = Object.assign({}, key, { line: line || st.line, at: Date.now() }); save();
      const kick = Date.parse(j.date); const until = kick - Date.now();
      if (type.state === 'pre') wait = until > 45 * 60000 ? 180000 : 30000;
      else if (type.state === 'in') wait = 20000;
      else { finalAt = finalAt || Date.now(); if (Date.now() - finalAt > 6 * 60000) { emit('WATCH END (final confirmed)'); process.exit(0); } wait = 60000; }
    } catch (e) {
      fails++; if (fails >= 6 && !warned) { emit(`FEED ERROR: ESPN not answering (${String(e.message || e).slice(0, 60)}); still retrying`); warned = true; }
      wait = 30000;
    }
    await sleep(wait);
  }
})();
