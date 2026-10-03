#!/usr/bin/env python3
"""Florida football season stats: ESPN box scores -> snapshot JSON -> Wix embed.

Every number comes from ESPN. Team rows come from each game's box-score team
totals; whether a final was an SEC game comes from its box-score header. Player rows are the sum of ESPN's per-game player box scores. Nothing
is typed by hand, and a run that fails any consistency check writes nothing,
so the last good snapshot stays in place.

Outputs (only rewritten when the numbers change):
  deploy/wix-served/florida-stats.json   full season snapshot (all players)
  deploy/wix-served/florida-stats.html   Wix custom embed, under the 15,000-character cap

Usage:
  python automation/florida_stats.py               # refresh only when due (cheap no-op otherwise)
  python automation/florida_stats.py --force       # refetch schedule and every final now
  python automation/florida_stats.py --from-dir D  # build from saved ESPN JSON (tests, offline review)
  python automation/florida_stats.py --build-only  # rebuild the embed from the committed snapshot
  python automation/florida_stats.py --no-embed --out-json sports-live/florida-stats-full.json \
      --feed sports-live/florida-stats.json      # the 5-minute GitHub Actions job: the page reads the feed live
"""
import argparse, datetime as dt, json, pathlib, re, sys, time, urllib.request
from zoneinfo import ZoneInfo

TEAM_ID = '57'  # ESPN id for Florida
API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football'
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / 'deploy/wix-served/florida-stats.json'
OUT_HTML = ROOT / 'deploy/wix-served/florida-stats.html'
TEMPLATE = ROOT / 'automation/florida_stats_embed.html'
ET = ZoneInfo('America/New_York')
LIMIT = 15000
SCHEMA = 1
SRC_ESPN = 'https://www.espn.com/college-football/team/stats/_/id/57/florida-gators'
SRC_UF = 'https://floridagators.com/sports/football/stats'
MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
DAYS = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.']
TV_NAMES = {'SECN': 'SEC Network', 'SECN+': 'SEC Network+'}


class StatsError(Exception):
    """A consistency check failed; nothing is written."""


# ---------- fetching ----------

def fetch_json(url, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'GatorBait-Stats/1 (+https://www.gatorbaitmedia.com)', 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.load(r)
        except Exception as e:  # network or JSON error: retry, then give up without writing
            last = e
            time.sleep(2 * (i + 1))
    raise StatsError(f'fetch failed: {url}: {last}')


class Source:
    """ESPN reader. Live by default; --from-dir reads saved files named schedule-<type>.json and summary-<id>.json."""
    def __init__(self, season, folder=None):
        self.season, self.folder = season, folder and pathlib.Path(folder)

    def schedule(self, seasontype):
        if self.folder:
            p = self.folder / f'schedule-{seasontype}.json'
            return json.loads(p.read_text()) if p.exists() else {'events': []}
        return fetch_json(f'{API}/teams/{TEAM_ID}/schedule?season={self.season}&seasontype={seasontype}')

    def summary(self, event_id):
        if self.folder:
            return json.loads((self.folder / f'summary-{event_id}.json').read_text())
        return fetch_json(f'{API}/summary?event={event_id}')


# ---------- parsing ----------

def num(v):
    """ESPN display value -> number. '1,024' -> 1024, '-3' -> -3, '2.5' -> 2.5."""
    if isinstance(v, (int, float)):
        return v
    s = str(v).strip().replace(',', '')
    if s in ('', '-', '--'):
        return 0
    return float(s) if '.' in s else int(s)


def pair(v):
    """'16/23' or '16-23' -> (16, 23)."""
    a, b = re.split(r'[/-]', str(v).strip(), maxsplit=1)
    return int(a), int(b)


def clock(v):
    m, s = str(v).split(':')
    return int(m) * 60 + int(s)


def score_of(c):
    s = c.get('score')
    if isinstance(s, dict):
        s = s.get('displayValue', s.get('value'))
    return None if s in (None, '') else int(float(s))


def team_name(t):
    return t.get('location') or t.get('shortDisplayName') or t.get('displayName') or '?'


def parse_event(ev):
    comp = ev['competitions'][0]
    cs = comp['competitors']
    us = next(c for c in cs if str(c.get('id') or c['team']['id']) == TEAM_ID)
    them = next(c for c in cs if c is not us)
    st = comp.get('status') or ev.get('status') or {}
    typ = st.get('type', {})
    rank = (them.get('curatedRank') or {}).get('current') or them.get('rank')
    tv = [b.get('media', {}).get('shortName') or (b.get('names') or [''])[0] for b in comp.get('broadcasts') or []]
    return {
        'id': str(ev['id']),
        'k': comp.get('date') or ev['date'],
        'timeValid': ev.get('timeValid', True) is not False,
        'ha': 'n' if comp.get('neutralSite') else ('h' if us.get('homeAway') == 'home' else 'a'),
        'opp': team_name(them['team']),
        'oppId': str(them['team'].get('id', '')),
        'rk': int(rank) if rank and int(rank) <= 25 else None,
        'conf': comp.get('conferenceCompetition'),  # the schedule feed often omits it; finals use the box score
        'state': typ.get('state', 'pre'),
        'final': bool(typ.get('completed')) and typ.get('state') == 'post',
        'detail': typ.get('shortDetail') or typ.get('detail') or '',
        'us': score_of(us), 'them': score_of(them),
        'tv': next((TV_NAMES.get(t, t) for t in tv if t), ''),
        'venue': (comp.get('venue') or {}).get('fullName', ''),
    }


TEAM_KEYS = ['totalYards', 'rushingYards', 'rushingAttempts', 'netPassingYards', 'completionAttempts',
             'firstDowns', 'thirdDownEff', 'turnovers', 'totalPenaltiesYards', 'possessionTime']
CATS = {'passing', 'rushing', 'receiving', 'defensive', 'interceptions', 'kicking'}


def parse_summary(sm, event_id):
    """Pull the header score, both teams' box-score totals and Florida's player lines."""
    comp = sm['header']['competitions'][0]
    score = {str(c.get('id') or c['team']['id']): score_of(c) for c in comp['competitors']}
    completed = comp.get('status', {}).get('type', {}).get('completed')
    conf = comp.get('conferenceCompetition')
    teams = {}
    for t in sm['boxscore']['teams']:
        tid = str(t['team']['id'])
        teams[tid] = {s['name']: s.get('displayValue') for s in t.get('statistics', []) if s.get('name')}
    players = {}
    for block in sm['boxscore'].get('players', []):
        if str(block['team']['id']) != TEAM_ID:
            continue
        for cat in block.get('statistics', []):
            if cat.get('name') not in CATS:
                continue
            labels = [str(x).upper() for x in cat.get('labels') or []]
            rows = []
            for a in cat.get('athletes', []):
                ath = a.get('athlete', {})
                rows.append({'id': str(ath.get('id') or ath.get('displayName')), 'name': ath.get('displayName', '?'),
                             's': dict(zip(labels, a.get('stats', [])))})
            players[cat['name']] = {'rows': rows, 'totals': dict(zip(labels, cat.get('totals') or []))}
    if TEAM_ID not in teams:
        raise StatsError(f'event {event_id}: no Florida team box score')
    return {'score': score, 'completed': completed, 'conf': conf, 'teams': teams, 'players': players}


# ---------- checks ----------

def check_game(g, box):
    """Internal consistency between ESPN's schedule, header, team box and player box for one final."""
    eid, opp = g['id'], g['oppId']
    if not box['completed']:
        raise StatsError(f'event {eid}: schedule says final but summary is not completed')
    if box['score'].get(TEAM_ID) != g['us'] or box['score'].get(opp) != g['them']:
        raise StatsError(f'event {eid}: schedule score {g["us"]}-{g["them"]} != summary {box["score"]}')
    if None not in (g['conf'], box['conf']) and bool(g['conf']) != bool(box['conf']):
        raise StatsError(f'event {eid}: schedule and box score disagree on whether this is an SEC game')
    if opp not in box['teams']:
        raise StatsError(f'event {eid}: no opponent team box score')
    fl, pl = box['teams'][TEAM_ID], box['players']
    for cat, team_key in (('rushing', 'rushingYards'), ('receiving', 'netPassingYards'), ('passing', 'netPassingYards')):
        c = pl.get(cat)
        if not c or team_key not in fl:
            continue
        rows_sum = sum(num(r['s'].get('YDS', 0)) for r in c['rows'])
        if c['totals'].get('YDS') not in (None, '') and rows_sum != num(c['totals']['YDS']):
            raise StatsError(f'event {eid}: {cat} player yards {rows_sum} != ESPN total {c["totals"]["YDS"]}')
        if cat == 'rushing' and rows_sum != num(fl[team_key]):
            raise StatsError(f'event {eid}: rushing player yards {rows_sum} != team {fl[team_key]}')
    rec = pl.get('receiving')
    if rec and 'completionAttempts' in fl:
        catches = sum(num(r['s'].get('REC', 0)) for r in rec['rows'])
        if catches != pair(fl['completionAttempts'])[0]:
            raise StatsError(f'event {eid}: receptions {catches} != completions {fl["completionAttempts"]}')


# ---------- aggregation ----------

def is_team_row(name):
    return name.strip().lower() in ('team', 'florida', 'florida gators')


def season_players(boxes):
    tot = {}

    def acc(cat, r):
        return tot.setdefault(cat, {}).setdefault(r['id'], {'name': r['name'], 'g': 0})

    for box in boxes:
        for cat, c in box['players'].items():
            for r in c['rows']:
                if is_team_row(r['name']):
                    continue
                a, s = acc(cat, r), r['s']
                a['g'] += 1
                if cat == 'passing':
                    cm, at = pair(s.get('C/ATT', '0/0'))
                    a['c'] = a.get('c', 0) + cm; a['att'] = a.get('att', 0) + at
                    for k in ('YDS', 'TD', 'INT'):
                        a[k] = a.get(k, 0) + num(s.get(k, 0))
                elif cat in ('rushing', 'receiving'):
                    for k in ('CAR', 'REC', 'YDS', 'TD'):
                        if k in s:
                            a[k] = a.get(k, 0) + num(s[k])
                    if 'LONG' in s:
                        a['LONG'] = max(a.get('LONG', -99), num(s['LONG']))
                elif cat == 'defensive':
                    for k in ('TOT', 'SOLO', 'SACKS', 'TFL', 'PD'):
                        if k in s:
                            a[k] = a.get(k, 0) + num(s[k])
                elif cat == 'interceptions':
                    a['INT'] = a.get('INT', 0) + num(s.get('INT', 0))
                elif cat == 'kicking':
                    fm, fa = pair(s.get('FG', '0/0')); xm, xa = pair(s.get('XP', '0/0'))
                    a['fm'] = a.get('fm', 0) + fm; a['fa'] = a.get('fa', 0) + fa
                    a['xm'] = a.get('xm', 0) + xm; a['xa'] = a.get('xa', 0) + xa
                    a['PTS'] = a.get('PTS', 0) + num(s.get('PTS', 0))
                    if fm:
                        a['LONG'] = max(a.get('LONG', 0), num(s.get('LONG', 0)))
    # Interceptions are their own ESPN category; fold them into the defensive lines.
    for pid, a in tot.get('interceptions', {}).items():
        d = tot.setdefault('defensive', {}).setdefault(pid, {'name': a['name'], 'g': 0})
        d['INT'] = d.get('INT', 0) + a['INT']
    return tot


def fmt_int(n):
    return f'{int(round(n)):,}'


# Exact halves round to the even digit, as UF's official stat sheet does (2,131 / 4 = 532.8, 1,405 / 4 = 351.2).
def fmt1(n):
    return f'{n:.1f}'


def pct(made, att):
    return round(100 * made / att) if att else 0


def half(n):
    return str(int(n)) if float(n).is_integer() else f'{n:.1f}'


def leaders(tot):
    def top(cat, key, n):
        rows = list(tot.get(cat, {}).values())
        return sorted(rows, key=lambda a: (-a.get(key, 0), a['name']))[:n] if n else rows

    out = {}
    p = [a for a in top('passing', 'YDS', 0) if a.get('att')]
    out['pass'] = [[a['name'], f"{a['c']}-{a['att']}", fmt_int(a['YDS']), str(a['TD']), str(a['INT'])]
                   for a in sorted(p, key=lambda a: (-a['YDS'], a['name']))[:3]]
    out['rush'] = [[a['name'], str(a['CAR']), fmt_int(a['YDS']), fmt1(a['YDS'] / a['CAR']) if a['CAR'] else '0.0', str(a['TD']), str(a.get('LONG', 0))]
                   for a in top('rushing', 'YDS', 6) if a.get('CAR')]
    out['rec'] = [[a['name'], str(a['REC']), fmt_int(a['YDS']), fmt1(a['YDS'] / a['REC']) if a['REC'] else '0.0', str(a['TD']), str(a.get('LONG', 0))]
                  for a in top('receiving', 'YDS', 6) if a.get('REC')]
    d = sorted(tot.get('defensive', {}).values(), key=lambda a: (-a.get('TOT', 0), -a.get('TFL', 0), a['name']))
    out['def'] = [[a['name'], half(a.get('TOT', 0)), half(a.get('TFL', 0)), half(a.get('SACKS', 0)), str(a.get('INT', 0)), str(a.get('PD', 0))] for a in d[:6]]
    k = [a for a in tot.get('kicking', {}).values() if a.get('fa') or a.get('xa')]
    out['kick'] = [[a['name'], f"{a['fm']}-{a['fa']}", str(a.get('LONG', 0)) if a['fm'] else '–', f"{a['xm']}-{a['xa']}", str(a['PTS'])]
                   for a in sorted(k, key=lambda a: (-a['PTS'], a['name']))[:2]]
    # Season-wide defensive leaders by category, for the "also" line.
    def best(key):
        rows = [a for a in d if a.get(key, 0) > 0]
        if not rows:
            return None
        m = max(a[key] for a in rows)
        return [', '.join(sorted(a['name'] for a in rows if a[key] == m)), half(m)]
    out['defBest'] = {k: best(k) for k in ('SACKS', 'INT', 'TFL')}
    return out


def team_rows(games, boxes):
    """Florida vs. opponents season rows. A row is shown only if ESPN reported it for every final."""
    n = len(games)

    def side(box, g, us):
        return box['teams'][TEAM_ID if us else g['oppId']]

    def have(key):
        return all(key in b['teams'][TEAM_ID] and key in b['teams'][g['oppId']] for g, b in zip(games, boxes))

    def total(key, us, f=num):
        return sum(f(side(b, g, us)[key]) for g, b in zip(games, boxes))

    rows = []
    pts = (sum(g['us'] for g in games), sum(g['them'] for g in games))
    rows.append(['Points per game', fmt1(pts[0] / n), fmt1(pts[1] / n)])
    for key, label in (('totalYards', 'Total yards per game'), ('rushingYards', 'Rushing yards per game')):
        if have(key):
            rows.append([label, fmt1(total(key, True) / n), fmt1(total(key, False) / n)])
    if have('rushingYards') and have('rushingAttempts'):
        rows.append(['Yards per carry'] + [fmt1(total('rushingYards', u) / max(1, total('rushingAttempts', u))) for u in (True, False)])
    if have('netPassingYards'):
        rows.append(['Passing yards per game', fmt1(total('netPassingYards', True) / n), fmt1(total('netPassingYards', False) / n)])
    if have('completionAttempts'):
        cells = []
        for u in (True, False):
            c = sum(pair(side(b, g, u)['completionAttempts'])[0] for g, b in zip(games, boxes))
            a = sum(pair(side(b, g, u)['completionAttempts'])[1] for g, b in zip(games, boxes))
            cells.append(f'{c}-{a} ({pct(c, a)}%)')
        rows.append(['Completions-attempts'] + cells)
    if have('firstDowns'):
        rows.append(['First downs per game', fmt1(total('firstDowns', True) / n), fmt1(total('firstDowns', False) / n)])
    if have('thirdDownEff'):
        cells = []
        for u in (True, False):
            m = sum(pair(side(b, g, u)['thirdDownEff'])[0] for g, b in zip(games, boxes))
            a = sum(pair(side(b, g, u)['thirdDownEff'])[1] for g, b in zip(games, boxes))
            cells.append(f'{m}-{a} ({pct(m, a)}%)')
        rows.append(['Third-down conversions'] + cells)
    if have('turnovers'):
        rows.append(['Turnovers', str(total('turnovers', True)), str(total('turnovers', False))])
    if have('totalPenaltiesYards'):
        cells = []
        for u in (True, False):
            p = [pair(side(b, g, u)['totalPenaltiesYards']) for g, b in zip(games, boxes)]
            cells.append(f'{sum(x[0] for x in p)}-{sum(x[1] for x in p)}')
        rows.append(['Penalties-yards'] + cells)
    if have('possessionTime'):
        # Round Florida's average and give opponents the rest, so the pair still adds up to a full game.
        secs = [total('possessionTime', u, clock) for u in (True, False)]
        ours = round(secs[0] / n)
        cells = [f'{m}:{sec:02d}' for m, sec in (divmod(ours, 60), divmod(round(sum(secs) / n) - ours, 60))]
        rows.append(['Time of possession (avg.)'] + cells)
    to = (total('turnovers', False) - total('turnovers', True)) if have('turnovers') else None
    return rows, pts, to


# ---------- labels ----------

def et(iso):
    return dt.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(ET)


def ap_date(d, weekday=False):
    s = f'{MONTHS[d.month - 1]} {d.day}'
    return f'{DAYS[d.weekday()]}, {s}' if weekday else s


def ap_time(d):
    h = d.hour % 12 or 12
    m = '' if d.minute == 0 else f':{d.minute:02d}'
    return 'Noon' if (d.hour, d.minute) == (12, 0) else f'{h}{m} {"a.m." if d.hour < 12 else "p.m."}'


def live_status(detail):
    """ESPN '5:21 - 3rd' -> '3rd quarter'; 'Halftime' and 'End of 2nd' pass through.
    Dropping the clock means the feed changes on scores and quarters, not every tick."""
    part = re.sub(r'^\s*\d{1,2}:\d{2}\s*-\s*', '', detail or '').strip()
    return f'{part} quarter' if part in ('1st', '2nd', '3rd', '4th') else part


def opp_label(g):
    pre = {'h': 'vs.', 'a': 'at', 'n': 'vs.'}[g['ha']]
    return f"{pre} {'No. ' + str(g['rk']) + ' ' if g['rk'] else ''}{g['opp']}"


# ---------- snapshot ----------

def build_snapshot(season, events, boxes_by_id, schedule_team):
    events = sorted(events, key=lambda g: g['k'])
    finals = [g for g in events if g['final']]
    boxes = [boxes_by_id[g['id']] for g in finals]
    for g, b in zip(finals, boxes):
        check_game(g, b)
        if b['conf'] is not None:
            g['conf'] = b['conf']
    w = sum(1 for g in finals if g['us'] > g['them']); l = len(finals) - w
    cw = sum(1 for g in finals if g['conf'] and g['us'] > g['them']); cl = sum(1 for g in finals if g['conf']) - cw
    summary = str((schedule_team or {}).get('recordSummary') or '')
    m = re.match(r'\s*(\d+)-(\d+)', summary)
    if m and (int(m.group(1)), int(m.group(2))) != (w, l):
        raise StatsError(f'computed record {w}-{l} != ESPN recordSummary {summary}')
    log, run = [], [0, 0]
    for g in events:
        d = et(g['k'])
        row = {'id': g['id'], 'k': g['k'], 'd': ap_date(d, True), 'o': opp_label(g), 'n': g['ha'] == 'n'}
        if g['final']:
            win = g['us'] > g['them']; run[0 if win else 1] += 1
            row.update({'r': 'W' if win else 'L', 's': f"{g['us']}-{g['them']}", 'rec': f'{run[0]}-{run[1]}'})
        else:
            row.update({'t': ap_time(d) if g['timeValid'] else 'TBA', 'tv': g['tv']})
            if g['state'] == 'in' and g['us'] is not None and g['them'] is not None:
                row.update({'live': 1, 's': f"{g['us']}-{g['them']}", 'st': live_status(g['detail'])})
        log.append(row)
    data = {'v': SCHEMA, 'season': season, 'team': 'Florida', 'games': log, 'finals': [g['id'] for g in finals]}
    if finals:
        rows, pts, to = team_rows(finals, boxes)
        tot = season_players(boxes)
        last = finals[-1]
        data.update({
            'record': f'{w}-{l}', 'confRecord': f'{cw}-{cl}',
            'tiles': [t for t in (
                ['Record', f'{w}-{l}', f'{cw}-{cl} SEC'],
                ['Points per game', fmt1(pts[0] / len(finals)), f'{fmt1(pts[1] / len(finals))} allowed'],
                next((['Yards per game', r[1], f'{r[2]} allowed'] for r in rows if r[0] == 'Total yards per game'), None),
                ['Turnover margin', ('+' if to > 0 else '') + str(to), f"{len(finals)} game{'s' if len(finals) != 1 else ''}"] if to is not None else None,
            ) if t],
            'teamRows': rows, 'lead': leaders(tot),
            'through': f"{ap_date(et(last['k']))} {'vs.' if last['ha'] != 'a' else 'at'} {last['opp']}",
            'players': {cat: sorted(v.values(), key=lambda a: a['name']) for cat, v in tot.items() if cat != 'interceptions'},
        })
    return data


def stamp(data, previous):
    """Keep the previous 'updated' time unless the numbers changed."""
    same = previous and {k: v for k, v in previous.items() if k not in ('updated', 'updatedLabel')} == data
    now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
    updated = previous['updated'] if same else now.isoformat().replace('+00:00', 'Z')
    d = et(updated)
    return dict(data, updated=updated, updatedLabel=f'{ap_date(d)}, {d.year}, {ap_time(d)} ET'), not same


# ---------- embed ----------

EMBED_KEYS = ('v', 'season', 'record', 'confRecord', 'tiles', 'teamRows', 'lead', 'through', 'games', 'updated', 'updatedLabel')


def embed_data(snap):
    d = {k: snap[k] for k in EMBED_KEYS if k in snap}
    d['src'] = [['ESPN box scores', SRC_ESPN], ['FloridaGators.com', SRC_UF]]
    return d


def build_embed(snap):
    tpl = TEMPLATE.read_text()
    blob = json.dumps(embed_data(snap), ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    assert '</' not in blob.lower() and '<!--' not in blob, 'data must not close the script'
    html = tpl.replace('/*FS*/null/*FS-END*/', '/*FS*/' + blob + '/*FS-END*/', 1)
    assert '/*FS*/' + blob in html, 'template data marker missing'
    assert html.lower().count('<script') == html.lower().count('</script'), 'script balance'
    assert 'cdn.jsdelivr' not in html
    if len(html) > LIMIT:
        raise StatsError(f'embed is {len(html)} characters, over the {LIMIT} cap')
    return html


def fingerprint(s):
    """Same 31-hash the game-day tooling uses, for in-place Wix patch checks."""
    h = 0
    for ch in s:
        h = (h * 31 + ord(ch)) & 0xffffffff
    return h


def shell_fingerprint(html):
    """Fingerprint of the embed with its data block emptied: a data-only PATCH must see this unchanged live."""
    return fingerprint(re.sub(r'/\*FS\*/.*?/\*FS-END\*/', '/*FS*/null/*FS-END*/', html, count=1, flags=re.S))


# ---------- scheduling ----------

def due(prev, now):
    """No-network decision: is an ESPN read worth it on this 5-minute tick?"""
    if not prev or prev.get('v') != SCHEMA:
        return 'no snapshot'
    finals = set(prev.get('finals', []))
    for g in prev.get('games', []):
        k = dt.datetime.fromisoformat(g['k'].replace('Z', '+00:00'))
        hours = (now - k).total_seconds() / 3600
        if g['id'] not in finals and 0 <= hours <= 8:
            return f'game window {g["id"]}'
        if g['id'] in finals and hours <= 72 and now.minute < 5:
            return f'post-game corrections {g["id"]}'
    if now.hour == 10 and now.minute < 10:
        return 'daily schedule check'
    return None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--season', type=int)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--from-dir')
    ap.add_argument('--build-only', action='store_true')
    ap.add_argument('--out-json', default=str(OUT_JSON))
    ap.add_argument('--out-html', default=str(OUT_HTML))
    ap.add_argument('--feed', help='also write the embed data as compact JSON here (served by GitHub Pages)')
    ap.add_argument('--no-embed', action='store_true', help='skip the Wix embed HTML (the feed job needs no template)')
    a = ap.parse_args(argv)
    now = dt.datetime.now(dt.timezone.utc)
    out_json, out_html = pathlib.Path(a.out_json), pathlib.Path(a.out_html)
    prev = json.loads(out_json.read_text()) if out_json.exists() else None
    if a.build_only:
        if not prev:
            raise SystemExit('no snapshot to build from')
        html = build_embed(prev)
        out_html.write_text(html)
        print(json.dumps({'embed': len(html), 'fp': fingerprint(html), 'shellFp': shell_fingerprint(html)}))
        return 0
    season = a.season or (prev or {}).get('season') or (now.year if now.month >= 3 else now.year - 1)
    reason = 'forced' if (a.force or a.from_dir) else due(prev, now)
    if not reason:
        print('florida-stats: not due; no ESPN read')
        return 0
    src = Source(season, a.from_dir)
    try:
        events, team = {}, None
        for st in (2, 3):
            try:
                sch = src.schedule(st)
            except StatsError:
                if st == 2:
                    raise
                sch = {}  # postseason list may not exist yet; the regular season still builds
            team = team or sch.get('team')
            for ev in sch.get('events', []):
                g = parse_event(ev)
                events[g['id']] = g
        if not events:
            raise StatsError('ESPN schedule returned no games')
        prev_finals = set((prev or {}).get('finals', []))
        boxes = {}
        for g in events.values():
            if not g['final']:
                continue
            boxes[g['id']] = parse_summary(src.summary(g['id']), g['id'])
        data = build_snapshot(season, list(events.values()), boxes, team)
        snap, changed = stamp(data, prev)
        html = None if a.no_embed else build_embed(snap)
    except StatsError as e:
        print(f'florida-stats: {reason}: kept last snapshot: {e}', file=sys.stderr)
        return 2
    new_finals = sorted(set(snap['finals']) - prev_finals)
    if changed or not out_json.exists():
        out_json.parent.mkdir(parents=True, exist_ok=True)
        out_json.write_text(json.dumps(snap, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
    if html is not None and (changed or not out_html.exists() or out_html.read_text() != html):
        out_html.parent.mkdir(parents=True, exist_ok=True)
        out_html.write_text(html)
    if a.feed:
        feed = pathlib.Path(a.feed)
        blob = json.dumps(embed_data(snap), ensure_ascii=False, separators=(',', ':'), sort_keys=True) + '\n'
        if not feed.exists() or feed.read_text() != blob:
            feed.parent.mkdir(parents=True, exist_ok=True)
            feed.write_text(blob)
    report = {'reason': reason, 'changed': changed, 'finals': len(snap['finals']), 'newFinals': new_finals,
              'record': snap.get('record')}
    if html is not None:
        report.update({'embed': len(html), 'fp': fingerprint(html), 'shellFp': shell_fingerprint(html)})
    print(json.dumps(report))
    return 0


if __name__ == '__main__':
    sys.exit(main())
