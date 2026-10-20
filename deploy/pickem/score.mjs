#!/usr/bin/env node
// GatorBait Pick 'Em scorer. Reads an export of Wix Forms submissions, the season's games and the final
// scores (fetched from ESPN on request), and writes the public season board. Read-only toward Wix:
// it never calls a Wix API. Publishing the board (PickEmBoard bulk save) is a separate, controller-owned step.
//
//   node deploy/pickem/score.mjs --entries submissions.json [--games games.json] [--finals finals.json]
//        [--fetch] [--out board.json] [--items pickemboard-items.json] [--now 2026-10-11T03:00:00Z]
//
// --entries  Wix Forms QuerySubmissionsByNamespace response(s): one {submissions:[...]} object, an array of
//            such pages, or a plain array of submissions. A CMS/CSV export keyed by field target also works.
// --finals   JSON map gameId -> {florida, opponent, floridaRushYds}. Created/updated by --fetch.
// --fetch    For each locked game without a final, read ESPN's game summary (site.web.api.espn.com; the
//            site.api.espn.com host 403s from GitHub runners) and store the final once the game is complete.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBoard, boardItems, finalFromSummary, assertNoPrivateData } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ESPN_SUMMARY = 'https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=';

function args(argv) {
  const out = { games: join(HERE, 'games.json'), out: null, items: null, finals: null, fetch: false, now: null, entries: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--fetch') out.fetch = true;
    else if (a.startsWith('--')) out[a.slice(2)] = argv[++i];
  }
  return out;
}

export function flattenSubmissions(json) {
  const pages = Array.isArray(json) ? json : [json];
  return pages.flatMap((p) => (p && Array.isArray(p.submissions) ? p.submissions : p && Array.isArray(p.items) ? p.items : [p])).filter(Boolean);
}

export async function fetchFinals({ games, finals, now, fetchImpl = fetch }) {
  const out = { ...finals };
  for (const g of games) {
    if (out[g.gameId] || Date.parse(now) < Date.parse(g.lockAt)) continue;
    const res = await fetchImpl(ESPN_SUMMARY + g.espnEvent, { headers: { Accept: 'application/json', 'User-Agent': 'GatorBait-PickEm/1.0' } });
    if (!res.ok) throw new Error(`ESPN summary ${g.espnEvent}: HTTP ${res.status}`);
    const f = finalFromSummary(await res.json());
    if (f) out[g.gameId] = f;
  }
  return out;
}

export async function main(argv = process.argv.slice(2)) {
  const a = args(argv);
  if (!a.entries) throw new Error('--entries <file> is required');
  const cfg = JSON.parse(readFileSync(a.games, 'utf8'));
  const rows = flattenSubmissions(JSON.parse(readFileSync(a.entries, 'utf8')));
  const now = a.now || new Date().toISOString();
  let finals = a.finals && existsSync(a.finals) ? JSON.parse(readFileSync(a.finals, 'utf8')) : {};
  if (a.fetch) {
    finals = await fetchFinals({ games: cfg.games, finals, now });
    if (a.finals) writeFileSync(a.finals, JSON.stringify(finals, null, 2) + '\n');
  }
  const board = assertNoPrivateData(buildBoard({ season: cfg.season, games: cfg.games, rows, finals, now }));
  const json = JSON.stringify(board, null, 2) + '\n';
  if (a.out) writeFileSync(a.out, json); else process.stdout.write(json);
  if (a.items) writeFileSync(a.items, JSON.stringify(assertNoPrivateData(boardItems(board)), null, 2) + '\n');
  const w = board.lastWeek;
  process.stderr.write(w ? `${w.gameId}: final ${w.final.florida}-${w.final.opponent}, ${w.entries} valid entries, ${w.exactHits} exact, winner ${w.winner ? w.winner.callsign + ' (' + w.winner.points + ' pts)' : 'none'}\n` : 'no final yet\n');
  return board;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { process.stderr.write(`pickem score: ${e.message}\n`); process.exit(1); });
}
