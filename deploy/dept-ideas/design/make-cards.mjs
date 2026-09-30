#!/usr/bin/env node
/**
 * make-cards.mjs — GatorBait "Game Week" matchup card feed.
 *
 * Reads sports-live/scoreboard.json (ESPN-sourced, refreshed by the game-day desk)
 * and emits the exact request bodies the Canva MCP tools need, so the desk can
 * regenerate the weekly card with one call and no hand-typed facts.
 *
 *   node deploy/dept-ideas/design/make-cards.mjs                 # print everything
 *   node deploy/dept-ideas/design/make-cards.mjs --write         # also write cards/<ymd>-<opp>.json
 *   node deploy/dept-ideas/design/make-cards.mjs --design DXXXX  # include autofill + export bodies for a tagged design
 *
 * Output keys:
 *   fields          the seven card lines (AP style, ET, uppercase), source of truth for every path below
 *   createDesign    body for mcp__Canva__create-design   (works today; see PITCH.md Evidence for the design ID it produced)
 *   autofillDesign  body for mcp__Canva__autofill-design (needs a design/brand template whose text
 *                   elements are tagged with these field labels; see PITCH.md "What it needs from Brenden")
 *   exportDesign    body for mcp__Canva__export-design   (PNG, 1080x1350, lossless)
 *
 * No network. No git. Facts come only from scoreboard.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..', '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const src = opt('--scoreboard') || resolve(repo, 'sports-live', 'scoreboard.json');
const sb = JSON.parse(readFileSync(src, 'utf8'));

/* ---------- Time (America/New_York), mirrors sports-live/src/front-page.js ---------- */
const TZ = 'America/New_York';
const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const WDL = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };
function et(iso) {
  const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date(iso)).forEach((p) => { o[p.type] = p.value; });
  return { wd: o.weekday, h: Number(o.hour) % 24, m: Number(o.minute), mo: Number(o.month) - 1, d: Number(o.day), ymd: `${o.year}-${o.month}-${o.day}` };
}
function clock(iso) { const e = et(iso); const h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
function whenLine(iso) { const e = et(iso); return `${WDL[e.wd]}, ${MONTHS[e.mo]} ${e.d} · ${clock(iso)} ET`; }

/* ---------- Copy rules (AP style) ---------- */
const ranked = (rank, name) => (Number.isFinite(rank) && rank > 0 ? `No. ${rank} ` : '') + name;
const record = (team) => { const s = (sb.standings || []).find((r) => r.team === team); return s ? s.overall : ''; };

const n = sb.next;
if (!n || !Number.isFinite(Date.parse(n.kickoffIso))) { console.error('scoreboard.json has no upcoming game (next.kickoffIso); nothing to build.'); process.exit(2); }
const l = sb.last && sb.last.status === 'final' && sb.last.score ? sb.last : null;
const fla = ranked(sb.team.rank, sb.team.name);
const opp = ranked(n.opponentRank, n.opponent);
const oppRecord = n.opponentRecord || record(n.opponent);

const fields = {
  kicker: 'GAME WEEK',
  headline_1: fla.toUpperCase(),
  headline_2: `${n.home ? 'VS. ' : 'AT '}${opp}`.toUpperCase(),
  records: [sb.team.record, oppRecord].filter(Boolean).join(' · '),
  when: (whenLine(n.kickoffIso) + (n.tv ? ` · ${n.tv}` : '')).toUpperCase(),
  venue: (n.venue || '').toUpperCase(),
  last_week: l ? `LAST WEEK: ${sb.team.name} ${l.score.fla}, ${ranked(l.opponentRank, l.opponent)} ${l.score.opp}`.toUpperCase() : '',
  footer: 'GATORBAITMEDIA.COM',
};
const slug = `${et(n.kickoffIso).ymd}_matchup_florida-${n.opponent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/* ---------- Tool bodies ---------- */
const lines = ['kicker', 'headline_1', 'headline_2', 'records', 'when', 'venue', 'last_week', 'footer'].filter((k) => fields[k]);
const createDesign = {
  format: 'Instagram Post (Portrait)',
  brief: [
    'A 1080 x 1350 portrait college football weekly matchup card for GatorBait Media, sports-editorial style, not a generic sports template.',
    'Solid dark navy background (#07122E) with one bold orange (#FA4616) horizontal accent bar; all text white; every text element in the font Barlow Condensed (fallback Barlow), heavy weight, uppercase, tight leading.',
    'No photos, no stock images, no logos, no icons, no sparks, no glow, no gradients, no decorative shapes other than the single orange bar.',
    'Clean left-aligned typographic layout in this exact order, top to bottom, each line as its own separate text element:',
    '',
    ...lines.map((k, i) => `${i + 1}. ${k === 'headline_1' ? 'Large dominant headline line one: ' : k === 'headline_2' ? 'Headline line two: ' : k === 'kicker' ? 'Small kicker at top: ' : k === 'footer' ? 'Small footer line at the very bottom: ' : k === 'last_week' ? 'Small line just above the orange bar: ' : 'Medium line: '}${fields[k]}`),
    '',
    'Strong hierarchy, generous negative space, the headline dominates. Use the exact wording above verbatim and do not add any other text.',
  ].join('\n'),
};
const autofillDesign = {
  design_id: opt('--design') || '<tagged design or brand template id>',
  title: `GatorBait Game Week — ${fla} ${n.home ? 'vs.' : 'at'} ${opp}`,
  data: Object.fromEntries(lines.map((k) => [k, { type: 'text', text: fields[k] }])),
};
const exportDesign = { design_id: opt('--design') || '<design id>', format: { type: 'png', width: 1080, height: 1350, lossless: true } };

const out = { generatedFrom: src.replace(repo + '/', ''), scoreboardUpdatedAt: sb.updatedAt, eventId: n.eventId, slug, fields, createDesign, autofillDesign, exportDesign };
if (args.includes('--write')) {
  const dir = resolve(here, 'cards'); mkdirSync(dir, { recursive: true });
  const f = resolve(dir, `${slug}.json`); writeFileSync(f, JSON.stringify(out, null, 2) + '\n'); console.error('wrote ' + f.replace(repo + '/', ''));
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
