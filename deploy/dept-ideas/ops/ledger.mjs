#!/usr/bin/env node
// Sunday Ledger: one weekly ops report for GatorBait Media, built from what is actually connected.
//
//   node deploy/dept-ideas/ops/ledger.mjs --inputs <dir> --out <dir> [--week-ending YYYY-MM-DD] [--redact] [--fetch-qc]
//
// Inputs are the raw JSON answers of the connector reads the Routine makes before running this
// (Windsor.ai GA4 / Search Console / Facebook organic / Instagram, the GitHub Actions run list) plus
// two files already in the repo: gazette-live/posts.json (stories, unioned over the week's git
// history so the 20-deep feed does not lose Monday) and sports-live/scoreboard.json (games, ESPN).
// Missing input files are reported as "not available" with the reason in inputs/sources.json;
// nothing is invented. --redact replaces every audience number with "n" so the sample can live in
// the public repo. --fetch-qc reads the latest live-presentation-qc runs from the public GitHub API
// (no token) when inputs/live-qc.json is absent. Read-only: writes only ledger-<date>.md/.json/.html.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const flag = k => argv.includes(k);
const REDACT = flag('--redact');
const REPO = opt('--repo', process.cwd());
const OUT = opt('--out', join(process.cwd(), 'ledger'));
const INPUTS = opt('--inputs', join(OUT, 'inputs'));
const TZ = 'America/New_York';

// ---------- dates (all week math in Eastern time) ----------
const etParts = d => { const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d); const g = t => p.find(x => x.type === t).value; return `${g('year')}-${g('month')}-${g('day')}`; };
const etDate = iso => { const t = Date.parse(iso); return Number.isFinite(t) ? etParts(new Date(t)) : null; };
const addDays = (ymd, n) => { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dow = ymd => new Date(ymd + 'T12:00:00Z').getUTCDay();
function lastSunday() { let d = etParts(new Date()); if (dow(d) === 0) d = addDays(d, -1); while (dow(d) !== 0) d = addDays(d, -1); return d; }
const END = opt('--week-ending', lastSunday());
if (dow(END) !== 0) { console.error(`--week-ending ${END} is not a Sunday`); process.exit(2); }
const START = addDays(END, -6), PSTART = addDays(START, -7), PEND = addDays(START, -1);
const inWeek = ymd => ymd && ymd >= START && ymd <= END;
const inPrior = ymd => ymd && ymd >= PSTART && ymd <= PEND;
const MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const ap = ymd => { const [y, m, d] = ymd.split('-').map(Number); return `${MON[m - 1]} ${d}`; };
const apYear = ymd => `${ap(ymd)}, ${ymd.slice(0, 4)}`;
const etClock = iso => new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso)).replace(' AM', ' a.m.').replace(' PM', ' p.m.');

// ---------- formatting, with redaction ----------
const num = v => REDACT ? 'n' : (v == null ? '—' : Math.round(v).toLocaleString('en-US'));
const pct = v => REDACT ? 'n%' : (v == null ? '—' : `${(v * 100).toFixed(1)}%`);
const pos = v => REDACT ? 'n' : (v == null ? '—' : v.toFixed(1));
const delta = (cur, prev) => { if (REDACT) return 'n%'; if (!prev) return 'n/a'; const d = (cur - prev) / prev; return `${d >= 0 ? '+' : ''}${(d * 100).toFixed(0)}%`; };
const sum = (rows, k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map(r => `| ${r.map(esc).join(' | ')} |`)].join('\n');

// ---------- inputs ----------
const readJson = p => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const input = name => { const j = readJson(join(INPUTS, name)); return j ? (Array.isArray(j.result) ? j.result : j) : null; };
const sources = readJson(join(INPUTS, 'sources.json')) || { answered: {}, refused: {}, notes: [] };
const missing = [];
const need = (name, label) => { const v = input(name); if (!v) missing.push(label); return v; };

// ---------- games: sports-live/scoreboard.json (ESPN via the game-day desk) ----------
const sb = readJson(join(REPO, 'sports-live/scoreboard.json')) || {};
const games = (sb.schedule || []).filter(g => inWeek(etDate(g.date)) && g.status === 'final');
const next = sb.next || null;

// ---------- stories: union of gazette-live/posts.json snapshots committed during the week ----------
function storiesForWeek() {
  const byUrl = new Map();
  const take = j => { for (const p of (j?.posts || [])) if (p.url && !byUrl.has(p.url)) byUrl.set(p.url, p); };
  take(readJson(join(REPO, 'gazette-live/posts.json')));
  let shas = [];
  try {
    shas = execFileSync('git', ['log', '--format=%H', `--since=${START}T00:00:00-04:00`, `--until=${addDays(END, 2)}T00:00:00-04:00`, '--', 'gazette-live/posts.json'], { cwd: REPO, encoding: 'utf8' }).split('\n').filter(Boolean);
    for (const sha of shas) { try { take(JSON.parse(execFileSync('git', ['show', `${sha}:gazette-live/posts.json`], { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 24 }))); } catch {} }
  } catch {}
  const all = [...byUrl.values()].map(p => ({ ...p, et: etDate(p.firstPublishedDate) })).sort((a, b) => Date.parse(b.firstPublishedDate) - Date.parse(a.firstPublishedDate));
  const oldest = all.length ? all[all.length - 1].et : null;
  return { list: all.filter(p => inWeek(p.et)), snapshots: shas.length, oldest };
}
const stories = storiesForWeek();
const byAuthor = {}; for (const s of stories.list) byAuthor[s.author || 'Unknown'] = (byAuthor[s.author || 'Unknown'] || 0) + 1;

// ---------- GA4 (Windsor.ai googleanalytics4) ----------
const ga = need('ga4-daily.json', 'GA4 daily');
let gaWeek = null, gaPrior = null, gaGap = [];
if (ga) {
  const w = ga.filter(r => inWeek(r.date)), p = ga.filter(r => inPrior(r.date));
  const days = new Set(w.map(r => r.date));
  for (let d = START; d <= END; d = addDays(d, 1)) { const row = w.find(r => r.date === d); if (!row || row.sessions < 5) gaGap.push(d); }
  const agg = rows => ({ sessions: sum(rows, 'sessions'), users: sum(rows, 'active_users'), newUsers: sum(rows, 'newusers'), views: sum(rows, 'screen_page_views'), engaged: sum(rows, 'engaged_sessions'), days: rows.length });
  gaWeek = agg(w); gaPrior = agg(p); gaWeek.reported = days.size;
}
const gaPages = input('ga4-pages.json') || [];
const gaChannels = input('ga4-channels.json') || [];
const gaDevices = input('ga4-devices.json') || [];

// ---------- Search Console (Windsor.ai searchconsole) ----------
const gsc = need('gsc-daily.json', 'Search Console daily');
let gscWeek = null, gscPrior = null;
if (gsc) {
  const agg = rows => { const clicks = sum(rows, 'clicks'), imp = sum(rows, 'impressions'); return { clicks, imp, ctr: imp ? clicks / imp : null, position: rows.length ? rows.reduce((a, r) => a + r.position * r.impressions, 0) / (imp || 1) : null }; };
  gscWeek = agg(gsc.filter(r => inWeek(r.date))); gscPrior = agg(gsc.filter(r => inPrior(r.date)));
}
const gscQueries = input('gsc-queries.json') || [];
const gscPages = input('gsc-pages.json') || [];

// ---------- Facebook organic (Windsor.ai facebook_organic) ----------
const fb = need('fb-pages-daily.json', 'Facebook page daily');
const fbPages = {};
if (fb) for (const r of fb) {
  const k = r.account_name; fbPages[k] ||= { w: { imp: 0, reach: 0, eng: 0, video: 0 }, p: { imp: 0, reach: 0, eng: 0, video: 0 } };
  const b = inWeek(r.date) ? fbPages[k].w : inPrior(r.date) ? fbPages[k].p : null; if (!b) continue;
  b.imp += r.page_impressions || 0; b.reach += r.page_impressions_unique || 0; b.eng += r.page_post_engagements || 0; b.video += r.page_video_views || 0;
}
const fbPosts = (input('fb-posts.json') || []).filter(r => inWeek(etDate(r.post_created_time)));
const fbPostCount = {}; for (const r of fbPosts) fbPostCount[r.account_name] = (fbPostCount[r.account_name] || 0) + 1;

// ---------- Instagram (Windsor.ai instagram) ----------
const ig = need('ig-daily.json', 'Instagram daily');
const igAcc = {};
if (ig) for (const r of ig) {
  const k = r.account_name; igAcc[k] ||= { w: { reach: 0, views: 0, inter: 0 }, p: { reach: 0, views: 0, inter: 0 } };
  const b = inWeek(r.date) ? igAcc[k].w : inPrior(r.date) ? igAcc[k].p : null; if (!b) continue;
  b.reach += r.reach || 0; b.views += r.views || 0; b.inter += r.total_interactions || 0;
}
const igMediaRaw = readJson(join(INPUTS, 'ig-media.json'));
const igMedia = (igMediaRaw?.result || []).filter(r => r.media_id && inWeek(etDate(r.timestamp)));
const igCounts = igMediaRaw?.counts || null;

// ---------- site health: live-presentation-qc runs ----------
async function qcRuns() {
  const local = readJson(join(INPUTS, 'live-qc.json'));
  if (local?.runs) return local.runs;
  if (!flag('--fetch-qc')) return null;
  try {
    const r = await fetch('https://api.github.com/repos/Presidente49/gatorbait-media-redesign/actions/workflows/live-presentation-qc.yml/runs?per_page=30', { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'gatorbait-sunday-ledger' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return null;
    return (await r.json()).workflow_runs.map(x => ({ id: x.id, run_number: x.run_number, event: x.event, status: x.status, conclusion: x.conclusion, head_branch: x.head_branch, head_sha: x.head_sha, created_at: x.created_at, html_url: x.html_url }));
  } catch { return null; }
}
const runs = await qcRuns();
const latest = runs?.[0] || null;
const runsInWeek = (runs || []).filter(r => inWeek(etDate(r.created_at)));
const conclusions = {}; for (const r of runsInWeek) conclusions[r.conclusion || r.status] = (conclusions[r.conclusion || r.status] || 0) + 1;
const scoreboardAge = sb.updatedAt ? Math.round((Date.now() - Date.parse(sb.updatedAt)) / 36e5) : null;

// ---------- attention items (rule-based, no model) ----------
const flags = [];
if (gaGap.length) flags.push(`GA4 reported no usable data for ${gaGap.length} of 7 days (${gaGap.map(ap).join(', ')}). The site totals below are incomplete; check the GA4 tag on the Wix site and the Windsor GA4 connection before trusting a week-over-week line.`);
if (gaChannels.length) {
  const total = sum(gaChannels, 'sessions'); const direct = gaChannels.find(c => c.session_default_channel_group === 'Direct');
  if (direct && total && direct.sessions / total > 0.4 && direct.engaged_sessions / direct.sessions < 0.2) flags.push(`Direct is ${pct(direct.sessions / total)} of sessions with an engaged rate of ${pct(direct.engaged_sessions / direct.sessions)}. That pattern is bot or referrer-stripped traffic, not readers; do not quote the sessions total to anyone until it is explained.`);
}
for (const [k, v] of Object.entries(fbPages)) if (v.p.reach && v.w.reach / v.p.reach < 0.5) flags.push(`Facebook ${k}: reach ${delta(v.w.reach, v.p.reach)} vs. the prior week.`);
for (const [k, v] of Object.entries(igAcc)) if (igCounts && igCounts[k] === 0) flags.push(`Instagram ${k}: no posts this week.`);
if (latest && latest.conclusion !== 'success') flags.push(`Latest live-presentation-qc run (#${latest.run_number}) finished ${latest.conclusion}: ${latest.html_url}`);
if (scoreboardAge != null && scoreboardAge > 48) flags.push(`scoreboard.json is ${scoreboardAge} hours old.`);
if (stories.oldest && stories.oldest > START) flags.push(`Story list reaches back only to ${ap(stories.oldest)}: the newest-20 feed and its ${stories.snapshots} snapshots this week do not cover ${ap(START)}${stories.oldest > addDays(START, 1) ? ` through ${ap(addDays(stories.oldest, -1))}` : ''}. Stories before that are missing from the count.`);
if (!Object.keys(sources.answered || {}).some(k => k.includes('youtube'))) flags.push('YouTube: no connected read path (see Sources). The Buddy Martin Show channel is not in this ledger.');

// ---------- write markdown ----------
const L = [];
L.push(`# Sunday Ledger: week of ${ap(START)} to ${apYear(END)}`);
L.push('');
L.push(`GatorBait Media weekly ops report. Generated ${apYear(etParts(new Date()))} at ${etClock(new Date().toISOString())} ET${REDACT ? '. **Redacted sample: every audience number is printed as "n".**' : ' from live connector reads.'} Prior week is ${ap(PSTART)} to ${ap(PEND)}.`);
L.push('');
L.push('## Attention');
L.push(flags.length ? flags.map(f => `- ${f}`).join('\n') : '- Nothing flagged.');
L.push('');
L.push('## Games (ESPN via sports-live/scoreboard.json)');
L.push(games.length ? games.map(g => `- ${ap(etDate(g.date))}: Florida ${g.score.fla}, ${g.opponentRank ? `No. ${g.opponentRank} ` : ''}${g.opponent} ${g.score.opp} (${g.home ? 'home' : 'away'}${g.venue ? `, ${g.venue}` : ''}). Record ${sb.team?.record || '?'}${sb.team?.rank ? `, ranked No. ${sb.team.rank}` : ''}.${g.recapUrl ? ` [Recap](${g.recapUrl})` : ''}${g.galleryUrl ? ` · [Gallery](${g.galleryUrl})` : ''}`).join('\n') : '- No game this week.');
if (next) L.push(`- Next: Florida ${next.home ? 'vs.' : 'at'} ${next.opponentRank ? `No. ${next.opponentRank} ` : ''}${next.opponent}, ${ap(etDate(next.kickoffIso))}, ${etClock(next.kickoffIso)} ET${next.tv ? ` on ${next.tv}` : ''}.${next.previewUrl ? ` [Preview](${next.previewUrl})` : ''}`);
L.push('');
L.push(`## Stories published (${stories.list.length}, from gazette-live/posts.json and its ${stories.snapshots} snapshots this week)`);
L.push(Object.entries(byAuthor).sort((a, b) => b[1] - a[1]).map(([a, n]) => `${a} ${n}`).join(' · ') || 'none');
L.push('');
L.push(stories.list.map(s => `- ${ap(s.et)} · ${s.author || 'Staff'} · [${esc(s.title)}](${s.url})`).join('\n') || '- No stories found in the window.');
L.push('');
L.push('## Site (GA4, Windsor.ai)');
if (gaWeek) {
  L.push(table(['Metric', 'This week', 'Prior week', 'Change'], [
    ['Sessions', num(gaWeek.sessions), num(gaPrior.sessions), delta(gaWeek.sessions, gaPrior.sessions)],
    ['Active users', num(gaWeek.users), num(gaPrior.users), delta(gaWeek.users, gaPrior.users)],
    ['New users', num(gaWeek.newUsers), num(gaPrior.newUsers), delta(gaWeek.newUsers, gaPrior.newUsers)],
    ['Page views', num(gaWeek.views), num(gaPrior.views), delta(gaWeek.views, gaPrior.views)],
    ['Engaged sessions', num(gaWeek.engaged), num(gaPrior.engaged), delta(gaWeek.engaged, gaPrior.engaged)],
    ['Days with data', String(7 - gaGap.length) + ' of 7', String(gaPrior.days) + ' of 7', ''],
  ]));
  if (gaPages.length) { L.push(''); L.push('Top pages by views:'); L.push(gaPages.slice(0, 8).map(p => `- ${num(p.screen_page_views)} · ${p.page_path}`).join('\n')); }
  if (gaChannels.length) { L.push(''); L.push('Channels (sessions, engaged): ' + gaChannels.map(c => `${c.session_default_channel_group} ${num(c.sessions)} (${num(c.engaged_sessions)})`).join(' · ')); }
  if (gaDevices.length) { L.push(''); L.push('Devices: ' + gaDevices.map(d => `${d.devicecategory} ${num(d.sessions)}`).join(' · ')); }
} else L.push('Not available this week (no ga4-daily.json input).');
L.push('');
L.push('## Search (Google Search Console, Windsor.ai)');
if (gscWeek) {
  L.push(table(['Metric', 'This week', 'Prior week', 'Change'], [
    ['Clicks', num(gscWeek.clicks), num(gscPrior.clicks), delta(gscWeek.clicks, gscPrior.clicks)],
    ['Impressions', num(gscWeek.imp), num(gscPrior.imp), delta(gscWeek.imp, gscPrior.imp)],
    ['CTR', pct(gscWeek.ctr), pct(gscPrior.ctr), ''],
    ['Avg. position', pos(gscWeek.position), pos(gscPrior.position), ''],
  ]));
  if (gscQueries.length) { L.push(''); L.push('Top queries (clicks): ' + gscQueries.slice(0, 8).map(q => `${q.query} ${num(q.clicks)}`).join(' · ')); }
  if (gscPages.length) { L.push(''); L.push('Top pages (clicks):'); L.push(gscPages.slice(0, 6).map(p => `- ${num(p.clicks)} · ${p.page.replace('https://www.gatorbaitmedia.com', '') || '/'}`).join('\n')); }
} else L.push('Not available this week (no gsc-daily.json input).');
L.push('');
L.push('## Facebook (organic, Windsor.ai)');
if (fb) {
  L.push(table(['Page', 'Posts', 'Impressions', 'Reach', 'Engagements', 'Video views', 'Reach vs. prior'], Object.entries(fbPages).sort((a, b) => b[1].w.reach - a[1].w.reach).map(([k, v]) => [k, String(fbPostCount[k] || 0), num(v.w.imp), num(v.w.reach), num(v.w.eng), num(v.w.video), delta(v.w.reach, v.p.reach)])));
  const top = [...fbPosts].sort((a, b) => (b.post_impressions || 0) - (a.post_impressions || 0)).slice(0, 5);
  if (top.length) { L.push(''); L.push('Top posts by impressions:'); L.push(top.map(p => `- ${num(p.post_impressions)} · ${p.account_name} · ${ap(etDate(p.post_created_time))} · ${esc((p.post_message_oneline || '').slice(0, 90))}`).join('\n')); }
} else L.push('Not available this week (no fb-pages-daily.json input).');
L.push('');
L.push('## Instagram (Windsor.ai)');
if (ig) {
  L.push(table(['Account', 'Posts', 'Reach', 'Views', 'Interactions', 'Reach vs. prior'], Object.entries(igAcc).sort((a, b) => b[1].w.reach - a[1].w.reach).map(([k, v]) => [k, igCounts ? String(igCounts[k] ?? '?') : '?', num(v.w.reach), num(v.w.views), num(v.w.inter), delta(v.w.reach, v.p.reach)])));
  const top = [...igMedia].sort((a, b) => (b.media_reach || 0) - (a.media_reach || 0)).slice(0, 5);
  if (top.length) { L.push(''); L.push('Top posts by reach:'); L.push(top.map(m => `- ${num(m.media_reach)} · ${m.account_name} · ${m.media_type} · [${esc((m.media_caption || '').slice(0, 80))}](${m.media_permalink})`).join('\n')); }
} else L.push('Not available this week (no ig-daily.json input).');
L.push('');
L.push('## YouTube');
L.push('Not connected on any read path this session; see Sources. Nothing reported.');
L.push('');
L.push('## Site health (live-presentation-qc, GitHub Actions)');
if (runs) {
  L.push(`- Latest run: #${latest.run_number} ${latest.conclusion} on ${latest.head_branch} at ${latest.head_sha.slice(0, 7)}, ${ap(etDate(latest.created_at))} ${etClock(latest.created_at)} ET. [Run](${latest.html_url})`);
  L.push(`- Runs dated in the week: ${runsInWeek.length}${runsInWeek.length ? ' (' + Object.entries(conclusions).map(([k, n]) => `${k} ${n}`).join(', ') + ')' : ''}. The run list read covers the newest ${runs.length} runs only.`);
} else L.push('- Not available (no live-qc.json input and --fetch-qc not set).');
L.push(`- scoreboard.json updated ${sb.updatedAt ? `${apYear(etDate(sb.updatedAt))} ${etClock(sb.updatedAt)} ET` : 'unknown'}; posts.json snapshots this week: ${stories.snapshots}.`);
L.push('');
L.push('## Sources');
L.push(table(['Connector', 'Status'], [
  ...Object.entries(sources.answered || {}).map(([k, v]) => [k, `answered (${v.calls} read${v.calls === 1 ? '' : 's'}${v.account ? ', ' + v.account : ''}${v.accounts ? ', ' + v.accounts.length + ' accounts' : ''})`]),
  ...Object.entries(sources.refused || {}).map(([k, v]) => [k, `refused: ${v}`]),
]));
if (missing.length) L.push(`\nInputs missing this run: ${missing.join(', ')}.`);
if (sources.notes?.length) L.push('\n' + sources.notes.map(n => `- ${n}`).join('\n'));
L.push('');
L.push('Read-only. This report changed nothing on the site, the socials or the repo. No follower, subscriber or revenue figures are collected.');

const md = L.join('\n') + '\n';
mkdirSync(OUT, { recursive: true });
const base = `ledger-${END}${REDACT ? '-redacted' : ''}`;
writeFileSync(join(OUT, base + '.md'), md);
if (!REDACT) writeFileSync(join(OUT, base + '.json'), JSON.stringify({ week: { start: START, end: END }, games, next, stories: stories.list, ga4: { week: gaWeek, prior: gaPrior, gap: gaGap, pages: gaPages, channels: gaChannels, devices: gaDevices }, gsc: { week: gscWeek, prior: gscPrior, queries: gscQueries, pages: gscPages }, facebook: { pages: fbPages, postCount: fbPostCount, posts: fbPosts.length }, instagram: { accounts: igAcc, counts: igCounts }, qc: { latest, inWeek: runsInWeek.length, conclusions }, flags, sources }, null, 1));

// ---------- optional HTML rendering (Barlow, navy/orange) ----------
if (flag('--html')) {
  const inline = s => esc2(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  const esc2 = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\\\|/g, '&#124;');
  const H = []; let list = false, tbl = null;
  const flush = () => { if (list) { H.push('</ul>'); list = false; } if (tbl) { H.push('</table>'); tbl = null; } };
  for (const line of md.split('\n')) {
    if (line.startsWith('| ')) { const cells = line.slice(1, -1).split(' | ').map(c => c.trim()); if (!tbl) { tbl = 1; H.push('<table><tr>' + cells.map(c => `<th>${inline(c)}</th>`).join('') + '</tr>'); } else if (!/^\|?-+/.test(cells[0])) H.push('<tr>' + cells.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>'); continue; }
    if (line.startsWith('|')) continue;
    if (line.startsWith('- ')) { if (tbl) flush(); if (!list) { H.push('<ul>'); list = true; } H.push(`<li>${inline(line.slice(2))}</li>`); continue; }
    flush();
    if (line.startsWith('# ')) H.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith('## ')) H.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.trim()) H.push(`<p>${inline(line)}</p>`);
  }
  flush();
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sunday Ledger ${END}</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;800&family=Barlow+Condensed:wght@700&display=swap" rel="stylesheet">
<style>:root{--navy:#0021a5;--orange:#fa4616;--ink:#101828;--dim:#667085;--line:#e4e7ec;--bg:#fff}@media(prefers-color-scheme:dark){:root{--ink:#f2f4f7;--dim:#98a2b3;--line:#2b3340;--bg:#0b1220}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 Barlow,system-ui,sans-serif;padding:20px 16px 48px}main{max-width:760px;margin:0 auto}
h1{font-family:"Barlow Condensed",Barlow,sans-serif;font-weight:700;font-size:34px;line-height:1.05;margin:0 0 6px;color:var(--navy)}@media(prefers-color-scheme:dark){h1{color:#fff}}
h2{font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--orange);margin:26px 0 8px;font-weight:800}
p{margin:0 0 10px}ul{margin:0 0 10px;padding-left:20px}li{margin:3px 0}a{color:var(--navy)}@media(prefers-color-scheme:dark){a{color:#9db4ff}}
table{border-collapse:collapse;width:100%;margin:6px 0 12px;font-size:14px}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}th{font-weight:600;color:var(--dim)}
.wrap{overflow-x:auto}</style></head><body><main class="wrap">${H.join('\n')}</main></body></html>`;
  writeFileSync(join(OUT, base + '.html'), html);
}
console.log(`wrote ${join(OUT, base + '.md')}${REDACT ? ' (redacted)' : ''}; ${stories.list.length} stories, ${games.length} game(s), ${flags.length} attention item(s), inputs missing: ${missing.length ? missing.join(', ') : 'none'}`);
