// node --test deploy/pickem/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { callsignProblem, scorePick, rankWeek, validEntriesForGame, buildBoard, boardItems, finalFromSummary, assertNoPrivateData, normalizeEntry } from '../lib.mjs';
import { main, fetchFinals, flattenSubmissions, ESPN_SUMMARY } from '../score.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const fx = (n) => JSON.parse(readFileSync(join(HERE, 'fixtures', n), 'utf8'));
const GAMES = JSON.parse(readFileSync(join(HERE, '..', 'games.json'), 'utf8'));
const SC = GAMES.games[0];
const ROWS = flattenSubmissions(fx('submissions.json'));
const FINAL = finalFromSummary(fx('summary-final.json'));

test('ESPN summary: final score and Florida rushing yards', () => {
  assert.deepEqual({ f: FINAL.florida, o: FINAL.opponent, r: FINAL.floridaRushYds }, { f: 31, o: 17, r: 182 });
  assert.equal(FINAL.eventId, '401856714');
  assert.equal(finalFromSummary(fx('summary-pre.json')), null, 'not complete -> null, never a guessed score');
  const noBox = fx('summary-final.json'); delete noBox.boxscore;
  assert.equal(finalFromSummary(noBox).floridaRushYds, null);
  assert.throws(() => finalFromSummary({}), /competitions/);
});

test('scoring: 3 exact, 1 winner, 0 wrong side', () => {
  const f = { florida: 31, opponent: 17 };
  assert.equal(scorePick({ florida: 31, opponent: 17 }, f).points, 3);
  assert.equal(scorePick({ florida: 45, opponent: 3 }, f).points, 1);
  assert.equal(scorePick({ florida: 17, opponent: 31 }, f).points, 0);
  assert.equal(scorePick({ florida: 20, opponent: 24 }, { florida: 21, opponent: 24 }).points, 1, 'correct loser pick still earns the winner point');
});

test('callsign filter: profanity, leetspeak, reserved names, and no false hits', () => {
  for (const bad of ['Sh1tHead', 'F.U.C.K', 'big ass', 'BuddyMartin', 'GatorBait HQ', 'x', 'a'.repeat(21), '<script>']) assert.ok(callsignProblem(bad), bad);
  for (const ok of ['Gamecock Fan', 'Classy Gator', 'Dickens', 'Chomp 2026', "O'Neal_Fan", 'Swamp-Thing']) assert.equal(callsignProblem(ok), null, ok);
});

test('one entry per email per game, kickoff lock, validation', () => {
  const { entries, rejected } = validEntriesForGame(ROWS, SC);
  assert.deepEqual(entries.map((e) => e.callsign).sort(), ['Ace', 'Bolt', 'ChompKing', 'Gamecock Fan', 'ace'].sort());
  assert.deepEqual(rejected, { duplicate: 1, late: 1, callsign: 1, 'tie-pick': 1, status: 1 });
  const chomp = entries.find((e) => e.callsign === 'ChompKing');
  assert.deepEqual([chomp.florida, chomp.opponent], [28, 14], 'first entry counts, the later re-pick is ignored');
});

test('weekly ranking: tiebreaker on Florida rushing yards, then earliest entry', () => {
  const { entries } = validEntriesForGame(ROWS, SC);
  const ranked = rankWeek(entries, FINAL);
  assert.deepEqual(ranked.slice(0, 2).map((r) => [r.callsign, r.points, r.tiebreakDiff]), [['Ace', 3, 7], ['Bolt', 3, 8]]);
  const noTb = rankWeek([{ ...entries[0], tiebreak: null, createdAt: '2026-10-06T00:00:00.000Z' }, { ...entries[1] }], FINAL);
  assert.equal(noTb[0].callsign, 'Bolt', 'a tied entry with a tiebreaker beats one without');
});

test('season board: public names only, duplicate callsigns disambiguated, no email anywhere', () => {
  const board = buildBoard({ season: 2026, games: GAMES.games, rows: ROWS, finals: { [SC.gameId]: FINAL }, now: '2026-10-11T04:00:00Z' });
  assert.equal(board.lastWeek.winner.callsign, 'Ace');
  assert.equal(board.lastWeek.entries, 5);
  assert.equal(board.lastWeek.exactHits, 2);
  assert.deepEqual(board.leaderboard.map((r) => [r.rank, r.callsign, r.points]), [[1, 'Ace', 3], [2, 'Bolt', 3], [3, 'ChompKing', 1], [3, 'ace (2)', 1], [5, 'Gamecock Fan', 0]]);
  assert.doesNotThrow(() => assertNoPrivateData(board));
  assert.ok(!JSON.stringify(board).includes('example.com'));
  const items = boardItems(board);
  assert.equal(items.dataCollectionId, 'PickEmBoard');
  assert.deepEqual(items.dataItems.map((i) => i.id), ['2026-ace', '2026-bolt', '2026-chompking', '2026-ace-2', '2026-gamecock-fan']);
  assert.throws(() => assertNoPrivateData({ x: 'a@b.co' }), /email/);
});

test('board before the final: week is open, then awaiting-final after lock', () => {
  const open = buildBoard({ season: 2026, games: GAMES.games, rows: ROWS, finals: {}, now: '2026-10-08T00:00:00Z' });
  assert.equal(open.weeks[0].status, 'open');
  assert.equal(open.leaderboard.length, 0);
  assert.equal(open.lastWeek, null);
  const locked = buildBoard({ season: 2026, games: GAMES.games, rows: ROWS, finals: {}, now: '2026-10-10T17:00:00Z' });
  assert.equal(locked.weeks[0].status, 'awaiting-final');
});

test('flat CMS/CSV rows normalize the same as form submissions', () => {
  const e = normalizeEntry({ _id: 'x', _createdDate: '2026-10-06T00:00:00Z', email_pickem: ' A@B.COM ', callsign: ' Gator  Gal ', game_id: SC.gameId, pick_florida: '27', pick_opponent: '13' });
  assert.deepEqual([e.email, e.callsign, e.florida, e.opponent, e.tiebreak], ['a@b.com', 'Gator Gal', 27, 13, null]);
});

test('fetchFinals uses site.web.api.espn.com and skips unlocked games', async () => {
  const urls = [];
  const fake = async (u) => { urls.push(u); return { ok: true, json: async () => fx('summary-final.json') }; };
  assert.deepEqual(await fetchFinals({ games: GAMES.games, finals: {}, now: '2026-10-09T00:00:00Z', fetchImpl: fake }), {});
  const got = await fetchFinals({ games: GAMES.games, finals: {}, now: '2026-10-11T04:00:00Z', fetchImpl: fake });
  assert.equal(urls[0], ESPN_SUMMARY + '401856714');
  assert.match(urls[0], /^https:\/\/site\.web\.api\.espn\.com\//);
  assert.equal(got[SC.gameId].florida, 31);
});

test('CLI writes board.json and PickEmBoard items from a saved final', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pickem-'));
  writeFileSync(join(dir, 'finals.json'), JSON.stringify({ [SC.gameId]: FINAL }));
  const board = await main(['--entries', join(HERE, 'fixtures', 'submissions.json'), '--finals', join(dir, 'finals.json'), '--out', join(dir, 'board.json'), '--items', join(dir, 'items.json'), '--now', '2026-10-11T04:00:00Z']);
  assert.equal(JSON.parse(readFileSync(join(dir, 'board.json'), 'utf8')).leaderboard[0].callsign, board.leaderboard[0].callsign);
  assert.equal(JSON.parse(readFileSync(join(dir, 'items.json'), 'utf8')).dataItems.length, 5);
});
