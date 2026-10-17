// GatorBait Pick 'Em: pure scoring logic shared by score.mjs and the unit tests.
// Nothing here touches the network or Wix. Emails are used only as an in-memory identity key
// and never appear in any returned object that is meant to be published.

import { createHash } from 'node:crypto';

export const POINTS = { exact: 3, winner: 1 };

// Wix Forms field targets on the "GatorBait Pick 'Em" form (see README, step 2).
export const FIELDS = {
  email: 'email_pickem',
  consent: 'subscribe_pickem',
  callsign: 'callsign',
  game: 'game_id',
  florida: 'pick_florida',
  opponent: 'pick_opponent',
  tiebreak: 'tiebreak_rush',
};

// ---- callsign rules (the embed carries a compact copy; this one is authoritative) ----
const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', $: 's', '!': 'i', '|': 'i' };
// Substring matches: long or unambiguous stems only, so "Scunthorpe"-style false hits stay rare.
const BAD_STEMS = ['fuck', 'shit', 'cunt', 'bitch', 'nigg', 'fagg', 'whore', 'slut', 'rape', 'nazi', 'kkk', 'retard', 'twat', 'wank', 'jizz', 'pussy', 'dildo', 'bastard', 'asshole', 'motherf', 'cocksuck', 'porn'];
// Whole-token matches: short words that appear inside innocent words (class, peacock, Dickens).
const BAD_TOKENS = ['ass', 'cock', 'dick', 'fag', 'tit', 'tits', 'cum', 'hoe', 'ho', 'damn', 'piss', 'crap', 'sex', 'kys'];
// Impersonation: nobody but staff gets to look official on the board.
const RESERVED = ['buddymartin', 'gatorbait', 'gatorbaitmedia', 'admin', 'moderator', 'official', 'ufgators', 'floridagators'];

export function normCallsign(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim();
}

export function callsignProblem(raw) {
  const s = normCallsign(raw);
  if (s.length < 2 || s.length > 20) return 'length';
  if (!/^[A-Za-z0-9][A-Za-z0-9 _.'-]*$/.test(s)) return 'characters';
  const folded = s.toLowerCase().replace(/[0134578@$!|]/g, (c) => LEET[c] || c);
  const squashed = folded.replace(/[^a-z]/g, '');
  const tokens = folded.split(/[^a-z]+/).filter(Boolean);
  if (BAD_STEMS.some((w) => squashed.includes(w))) return 'language';
  if (tokens.some((t) => BAD_TOKENS.includes(t))) return 'language';
  if (RESERVED.some((w) => squashed.includes(w))) return 'reserved';
  return null;
}

export function normEmail(e) {
  const s = String(e ?? '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
}

const toInt = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

// Accepts a Wix Forms submission ({id, createdDate, submissions:{target: value}}) or a flat row
// (CSV/CMS export already keyed by field target). Returns null for rows that are not usable.
export function normalizeEntry(row, fields = FIELDS) {
  const v = row?.submissions ?? row ?? {};
  const created = row?.createdDate ?? row?._createdDate ?? v.createdDate ?? null;
  const e = {
    id: String(row?.id ?? row?._id ?? ''),
    createdAt: created ? new Date(created).toISOString() : null,
    email: normEmail(v[fields.email]),
    callsign: normCallsign(v[fields.callsign]),
    gameId: String(v[fields.game] ?? '').trim(),
    florida: toInt(v[fields.florida]),
    opponent: toInt(v[fields.opponent]),
    tiebreak: toInt(v[fields.tiebreak]),
    status: row?.status ?? 'CONFIRMED',
  };
  return e;
}

export function entryProblem(e, game) {
  if (!e) return 'empty';
  if (e.status && !['CONFIRMED', 'PAYMENT_CONFIRMED'].includes(e.status)) return 'status';
  if (!e.createdAt) return 'no-timestamp';
  if (!e.email) return 'email';
  if (e.gameId !== game.gameId) return 'other-game';
  if (Date.parse(e.createdAt) >= Date.parse(game.lockAt)) return 'late';
  if (callsignProblem(e.callsign)) return 'callsign';
  for (const n of [e.florida, e.opponent]) if (n === null || n < 0 || n > 99) return 'score';
  if (e.florida === e.opponent) return 'tie-pick';
  if (e.tiebreak !== null && (e.tiebreak < -200 || e.tiebreak > 800)) return 'tiebreak';
  return null;
}

// One entry per email per game: the earliest valid entry counts; later ones are reported as duplicates.
export function validEntriesForGame(rows, game, fields = FIELDS) {
  const accepted = new Map();
  const rejected = {};
  const all = rows.map((r) => normalizeEntry(r, fields)).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  for (const e of all) {
    if (e.gameId !== game.gameId) continue; // other weeks are not this week's rejects
    const why = entryProblem(e, game) ?? (accepted.has(e.email) ? 'duplicate' : null);
    if (why) { rejected[why] = (rejected[why] || 0) + 1; continue; }
    accepted.set(e.email, e);
  }
  return { entries: [...accepted.values()], rejected };
}

export function scorePick(e, final) {
  if (e.florida === final.florida && e.opponent === final.opponent) return { points: POINTS.exact, exact: true, winner: true };
  const pickedFla = e.florida > e.opponent;
  const flaWon = final.florida > final.opponent;
  return pickedFla === flaWon ? { points: POINTS.winner, exact: false, winner: true } : { points: 0, exact: false, winner: false };
}

// Weekly ranking: points, then closest Florida rushing-yards tiebreaker (entries without one rank after
// those with one), then the earliest entry.
export function rankWeek(entries, final) {
  const scored = entries.map((e) => {
    const s = scorePick(e, final);
    const diff = e.tiebreak === null || final.floridaRushYds === null || final.floridaRushYds === undefined ? null : Math.abs(e.tiebreak - final.floridaRushYds);
    return { ...e, ...s, tiebreakDiff: diff };
  });
  scored.sort((a, b) => b.points - a.points
    || (a.tiebreakDiff === null) - (b.tiebreakDiff === null)
    || (a.tiebreakDiff ?? 0) - (b.tiebreakDiff ?? 0)
    || a.createdAt.localeCompare(b.createdAt));
  return scored;
}

const hashKey = (email) => createHash('sha256').update(email).digest('hex');
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'fan';

// Season board. Identity is the email (in memory only); the public name is the callsign from the
// player's latest valid entry. Two different players who chose the same callsign get "(2)" on the later one.
export function buildBoard({ season, games, rows, finals, now = new Date().toISOString(), fields = FIELDS }) {
  const players = new Map();
  const weeks = [];
  for (const game of games) {
    const final = finals[game.gameId];
    const { entries, rejected } = validEntriesForGame(rows, game, fields);
    if (!final) { weeks.push({ gameId: game.gameId, opponent: game.opponent, status: Date.parse(now) >= Date.parse(game.lockAt) ? 'awaiting-final' : 'open', entries: entries.length, rejected }); continue; }
    const ranked = rankWeek(entries, final);
    for (const r of ranked) {
      const k = hashKey(r.email);
      const p = players.get(k) ?? { key: k, firstSeen: r.createdAt, callsign: r.callsign, points: 0, exact: 0, winners: 0, played: 0, weeklyWins: 0 };
      p.callsign = r.callsign; p.points += r.points; p.exact += r.exact ? 1 : 0; p.winners += r.winner ? 1 : 0; p.played += 1;
      players.set(k, p);
    }
    const top = ranked[0];
    if (top && top.points > 0) players.get(hashKey(top.email)).weeklyWins += 1;
    weeks.push({
      gameId: game.gameId, opponent: game.opponent, status: 'final',
      final: { florida: final.florida, opponent: final.opponent, floridaRushYds: final.floridaRushYds ?? null },
      entries: ranked.length, rejected,
      exactHits: ranked.filter((r) => r.exact).length,
      winnerHits: ranked.filter((r) => r.winner).length,
      winner: top && top.points > 0 ? { key: hashKey(top.email), points: top.points, pick: `${top.florida}-${top.opponent}`, tiebreakDiff: top.tiebreakDiff } : null,
    });
  }
  // Disambiguate shared callsigns by first appearance.
  const seen = new Map();
  const list = [...players.values()].sort((a, b) => a.firstSeen.localeCompare(b.firstSeen));
  for (const p of list) {
    const k = p.callsign.toLowerCase();
    const n = (seen.get(k) || 0) + 1; seen.set(k, n);
    p.display = n > 1 ? `${p.callsign} (${n})` : p.callsign;
  }
  list.sort((a, b) => b.points - a.points || b.exact - a.exact || b.weeklyWins - a.weeklyWins || a.firstSeen.localeCompare(b.firstSeen));
  let rank = 0, prev = null;
  const leaderboard = list.map((p, i) => {
    const sig = `${p.points}|${p.exact}|${p.weeklyWins}`;
    if (sig !== prev) { rank = i + 1; prev = sig; }
    return { rank, callsign: p.display, points: p.points, exact: p.exact, winners: p.winners, played: p.played, weeklyWins: p.weeklyWins };
  });
  const names = new Map(list.map((p) => [p.key, p.display]));
  for (const w of weeks) if (w.winner) { w.winner.callsign = names.get(w.winner.key); delete w.winner.key; }
  const lastFinal = [...weeks].reverse().find((w) => w.status === 'final') ?? null;
  return { season, updatedAt: now, scoring: POINTS, lastWeek: lastFinal, weeks, leaderboard };
}

// PickEmBoard CMS rows (Bulk Save Data Items body). Deterministic ids, so a weekly rerun replaces rows.
export function boardItems(board, collection = 'PickEmBoard') {
  return {
    dataCollectionId: collection,
    dataItems: board.leaderboard.map((r) => ({
      id: `${board.season}-${slug(r.callsign)}`,
      data: { season: board.season, rank: r.rank, callsign: r.callsign, points: r.points, exact: r.exact, winners: r.winners, played: r.played, weeklyWins: r.weeklyWins },
    })),
  };
}

// ESPN summary -> final score + Florida rushing yards. Returns null until the game is complete.
export function finalFromSummary(sm, floridaId = '57') {
  const comp = sm?.header?.competitions?.[0];
  if (!comp) throw new Error('summary has no header.competitions[0]');
  if (!comp.status?.type?.completed) return null;
  const score = (c) => { let s = c?.score; if (s && typeof s === 'object') s = s.displayValue ?? s.value; return s === undefined || s === null || s === '' ? null : Math.round(Number(s)); };
  const us = comp.competitors.find((c) => String(c.id ?? c.team?.id) === floridaId);
  const them = comp.competitors.find((c) => c !== us);
  if (!us || !them) throw new Error('summary does not include Florida and an opponent');
  const fla = score(us), opp = score(them);
  if (fla === null || opp === null) throw new Error('completed game without scores');
  const box = sm.boxscore?.teams?.find((t) => String(t.team?.id) === floridaId);
  const rush = box?.statistics?.find((s) => s.name === 'rushingYards');
  const rushYds = rush ? Number(rush.displayValue ?? rush.value) : null;
  return { florida: fla, opponent: opp, floridaRushYds: Number.isFinite(rushYds) ? rushYds : null, opponentName: them.team?.displayName ?? null, eventId: String(sm.header.id ?? '') };
}

// Guard used before anything is written for publication.
export function assertNoPrivateData(obj) {
  const s = JSON.stringify(obj);
  if (/@/.test(s)) throw new Error('refusing to publish: output contains an "@" (possible email)');
  return obj;
}
