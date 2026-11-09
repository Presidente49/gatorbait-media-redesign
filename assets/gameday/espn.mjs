// Build a card JSON from one ESPN event. ESPN is the only source of facts here: scores, records, ranks,
// kickoff, venue, TV, line and team stats all come straight from the summary endpoint. Nothing is invented.
//   import { buildGame } from './espn.mjs'; const game = await buildGame('401856714');
const SUMMARY = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=';

// ESPN stat key -> card label. Pick three with --stats a,b,c (defaults below).
export const STAT_LABELS = {
  totalYards: 'Total yards', rushingYards: 'Rushing yards', netPassingYards: 'Passing yards',
  turnovers: 'Turnovers', firstDowns: 'First downs', thirdDownEff: 'Third downs',
  possessionTime: 'Time of possession', yardsPerRushAttempt: 'Yards per carry', yardsPerPass: 'Yards per pass',
  totalPenaltiesYards: 'Penalties-yards', completionAttempts: 'Comp-att',
};
export const DEFAULT_STATS = ['totalYards', 'rushingYards', 'turnovers'];

export async function fetchSummary(eventId) {
  const res = await fetch(SUMMARY + encodeURIComponent(eventId), { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error('ESPN summary ' + eventId + ' returned HTTP ' + res.status);
  return res.json();
}

function record(c, type) {
  const r = (c.record || []).find((x) => x.type === type);
  return r ? r.displayValue || r.summary : '';
}

export function mapGame(summary, opts = {}) {
  const focus = opts.focus || 'FLA';
  const hdr = summary.header;
  const comp = hdr.competitions[0];
  const st = comp.status.type;
  const conf = comp.conferenceCompetition ? 'SEC' : '';
  const teams = comp.competitors.map((c) => ({
    abbr: c.team.abbreviation,
    name: c.team.location,
    homeAway: c.homeAway,
    rank: c.rank && c.rank <= 25 ? c.rank : null,
    record: record(c, 'total'),
    confRecord: conf ? record(c, 'vsconf') : '',
    confName: conf,
    score: c.score != null ? Number(c.score) : null,
    linescores: (c.linescores || []).map((l) => Number(l.displayValue)),
    winner: !!c.winner,
  }));

  let status = st.state === 'pre' ? 'pregame' : st.completed ? 'final' : st.name === 'STATUS_HALFTIME' ? 'halftime' : 'live';
  let statusText = st.name === 'STATUS_HALFTIME' ? 'Halftime' : st.completed ? 'Final' : st.shortDetail;

  // Demo only: show a finished game as its halftime score (first two periods). Marked sample so nobody ships it.
  let sample = !!opts.sample;
  if (opts.asHalftime) {
    teams.forEach((t) => { t.score = (t.linescores[0] || 0) + (t.linescores[1] || 0); });
    status = 'halftime'; statusText = 'Halftime'; sample = true;
  }

  const wanted = opts.stats || DEFAULT_STATS;
  const box = (summary.boxscore && summary.boxscore.teams) || [];
  const byAbbr = {};
  box.forEach((t) => { byAbbr[t.team.abbreviation] = Object.fromEntries((t.statistics || []).map((s) => [s.name, s.displayValue])); });
  // A finished game shown as a demo halftime must not carry full-game stats.
  const stats = status === 'pregame' || opts.asHalftime ? [] : wanted.filter((k) => teams.every((t) => byAbbr[t.abbr] && byAbbr[t.abbr][k] != null)).map((k) => ({
    label: STAT_LABELS[k] || k,
    values: Object.fromEntries(teams.map((t) => [t.abbr, byAbbr[t.abbr][k]])),
  }));

  const venue = (summary.gameInfo && summary.gameInfo.venue) || {};
  const tv = (comp.broadcasts || []).filter((b) => b.type && b.type.shortName === 'TV').map((b) => b.media && b.media.shortName).filter(Boolean)[0] || '';
  const odds = (summary.pickcenter || [])[0];
  const week = hdr.week ? 'Week ' + (opts.week || hdr.week) : '';

  return {
    source: 'ESPN event ' + hdr.id,
    eventId: hdr.id,
    sample,
    status, statusText,
    kicker: opts.kicker || [conf || 'Football', week].filter(Boolean).join(' · '),
    date: comp.date,
    venue: venue.fullName || '',
    city: venue.address ? [venue.address.city, venue.address.state].filter(Boolean).join(', ').replace(', FL', ', Fla.') : '',
    tv,
    focus,
    teams: teams.map(({ linescores, ...t }) => t),
    stats,
    line: status === 'pregame' && odds ? { details: odds.details, overUnder: odds.overUnder } : null,
  };
}

export async function buildGame(eventId, opts = {}) {
  return mapGame(await fetchSummary(eventId), opts);
}
