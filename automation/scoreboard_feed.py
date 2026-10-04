#!/usr/bin/env python3
"""Scoreboard feed: ESPN public JSON -> sports-live/scoreboard.json for the front page.

Reads Florida's ESPN schedule, the SEC standings and (for the last final, the next game and any live game)
the game summary; the next game's pregame summary supplies the opponent's current record. Story links come only from our own posts (gazette-live/posts.json); an ESPN or SEC link is
never emitted. The output is checked by validate_scoreboard.py before it is written, so a bad run keeps
the last good file. No Wix writes happen here.

Usage:
  python automation/scoreboard_feed.py               # refresh only when due (cheap no-op otherwise)
  python automation/scoreboard_feed.py --force       # fetch now
  python automation/scoreboard_feed.py --from-dir D  # build from saved ESPN JSON (tests, offline review)
Exit codes: 0 ok or not due, 2 fetch/parse/validation failure (nothing written).
"""
import argparse, datetime as dt, json, pathlib, re, sys, time, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from validate_scoreboard import SITE, validate  # noqa: E402

TEAM_ID = '57'  # ESPN id for Florida
SITE_API = 'https://site.web.api.espn.com/apis/site/v2/sports/football/college-football'
STANDINGS_URL = 'https://site.web.api.espn.com/apis/v2/sports/football/college-football/standings?group=8&season={season}'  # group 8 = SEC
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'sports-live/scoreboard.json'
POSTS = ROOT / 'gazette-live/posts.json'
TV_NAMES = {'SECN': 'SEC Network', 'SECN+': 'SEC Network+'}
ALIASES = {'Florida Atlantic': ['FAU'], 'Florida State': ['FSU'], 'Mississippi State': ['Miss. State', 'Mississippi St.'],
           'Texas A&M': ['Texas A&amp;M'], 'South Carolina': ['S.C.'], 'Georgia': ['UGA']}
LIVE_BEFORE_H, LIVE_AFTER_H = 1, 5  # poll every run from 1h before kickoff to 5h after


class ScoreError(Exception):
    """A fetch, parse or consistency check failed; nothing is written."""


# ---------- fetching ----------

def fetch_json(url, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'GatorBait-Scoreboard/1 (+https://www.gatorbaitmedia.com)', 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.load(r)
        except Exception as e:  # network or JSON error: retry, then give up without writing
            last = e
            time.sleep(2 * (i + 1))
    raise ScoreError(f'fetch failed: {url}: {last}')


class Source:
    """ESPN reader. Live by default; --from-dir reads schedule.json, standings.json and summary-<id>.json."""
    def __init__(self, season, folder=None):
        self.season, self.folder = season, folder and pathlib.Path(folder)

    def _file(self, name):
        p = self.folder / name
        if not p.exists():
            raise ScoreError(f'missing fixture {p}')
        return json.loads(p.read_text())

    def schedule(self):
        if self.folder:
            return self._file('schedule.json')
        return fetch_json(f'{SITE_API}/teams/{TEAM_ID}/schedule?season={self.season}&seasontype=2')

    def standings(self):
        if self.folder:
            return self._file('standings.json')
        return fetch_json(STANDINGS_URL.format(season=self.season))

    def summary(self, event_id):
        if self.folder:
            return self._file(f'summary-{event_id}.json')
        return fetch_json(f'{SITE_API}/summary?event={event_id}')


# ---------- parsing ----------

def iso(v):
    """ESPN '2026-09-26T19:30Z' -> '2026-09-26T19:30:00Z'."""
    d = dt.datetime.fromisoformat(str(v).replace('Z', '+00:00'))
    return d.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def score_of(c):
    s = c.get('score')
    if isinstance(s, dict):
        s = s.get('displayValue', s.get('value'))
    return None if s in (None, '') else int(float(s))


def rank_of(c):
    r = (c.get('curatedRank') or {}).get('current') or c.get('rank')
    return int(r) if r and 1 <= int(r) <= 25 else None  # ESPN uses 99 for unranked


def record_of(c, kind):
    for r in c.get('record') or c.get('records') or []:
        if r.get('type') == kind:
            return r.get('displayValue') or r.get('summary')
    return None


OVERALL = re.compile(r'^\d+-\d+$')


def overall_of(c):
    """A competitor's overall record as the feed emits it ('3-1'), or None when ESPN sends none or a tie/odd form."""
    r = record_of(c, 'total')
    return r if isinstance(r, str) and OVERALL.match(r) else None


STATE_STATUS = {'pre': 'scheduled', 'in': 'in-progress', 'post': 'final'}


def parse_event(ev):
    comp = ev['competitions'][0]
    us = next(c for c in comp['competitors'] if str(c.get('id') or c['team']['id']) == TEAM_ID)
    them = next(c for c in comp['competitors'] if c is not us)
    typ = (comp.get('status') or ev.get('status') or {}).get('type', {})
    name = typ.get('name', '')
    status = STATE_STATUS.get(typ.get('state', 'pre'), 'scheduled')
    if 'POSTPONED' in name:
        status = 'postponed'
    elif 'CANCEL' in name:
        status = 'canceled'
    elif status == 'final' and not typ.get('completed'):
        status = 'in-progress'
    tv = next((TV_NAMES.get(n, n) for n in ((b.get('media') or {}).get('shortName') for b in comp.get('broadcasts') or []) if n), None)
    a, b = score_of(us), score_of(them)
    return {
        'eventId': str(ev['id']),
        'date': iso(comp.get('date') or ev['date']),
        'opponent': them['team'].get('location') or them['team'].get('shortDisplayName') or them['team'].get('displayName'),
        'opponentRank': rank_of(them), 'flaRank': rank_of(us),
        'home': us.get('homeAway') == 'home' and not comp.get('neutralSite'),
        'status': status, 'score': {'fla': a, 'opp': b} if a is not None and b is not None else None,
        'tv': tv, 'venue': (comp.get('venue') or {}).get('fullName'),
        'flaConf': record_of(us, 'vsconf'),
        # ESPN puts the opponent's overall record on a schedule row only once that game is final (the record after it);
        # for the next game it comes from the pregame summary instead (see build()).
        'opponentRecord': overall_of(them),
    }


def parse_standings(sd):
    rows = []
    for e in (sd.get('standings') or {}).get('entries', []):
        stats = {s.get('type'): s.get('displayValue') for s in e.get('stats', [])}
        conf, overall = stats.get('vsconf'), stats.get('total')
        if conf and overall:
            rows.append({'team': e['team'].get('location') or e['team'].get('displayName'), 'confRecord': conf, 'overall': overall,
                         'rank': rank_of(e['team'])})
    def pct(rec):
        w, l = (int(x) for x in rec.split('-')[:2])
        return w / (w + l) if w + l else 0.0
    # ESPN's own seed field is unreliable early in a season, so order by the records themselves.
    rows.sort(key=lambda r: (-pct(r['confRecord']), -int(r['confRecord'].split('-')[0]), -pct(r['overall']), r['team']))
    return rows


def parse_summary(sm):
    """Header score, per-period line scores and live fields for one game."""
    comp = sm['header']['competitions'][0]
    out = {'state': (comp.get('status') or {}).get('type', {}).get('state'), 'teams': {}}
    for c in comp['competitors']:
        ls = [int(float(x.get('displayValue', x.get('value', 0)))) for x in c.get('linescores') or []]
        out['teams'][str(c.get('id') or c['team']['id'])] = {'score': score_of(c), 'lines': ls, 'record': overall_of(c)}
    st = comp.get('status') or {}
    out['clock'], out['period'] = st.get('displayClock'), st.get('period')
    sit = sm.get('situation') or {}
    play = sit.get('lastPlay') or {}
    poss = sit.get('possession') or (play.get('team') or {}).get('id')
    cur = (sm.get('drives') or {}).get('current') or {}
    if not play and cur.get('plays'):
        play = cur['plays'][-1]
        poss = poss or (cur.get('team') or {}).get('id')
    out['possession'] = poss and str(poss)
    out['lastPlay'] = (play.get('text') or None) if play else None
    return out


# ---------- our own stories ----------

def _words(s):
    return re.sub(r'[^a-z0-9& ]+', ' ', s.lower().replace('’', "'"))


GALLERY = re.compile(r"best shots|photo gallery|\bgallery\b|\bphotos\b")
PREVIEW = re.compile(r"first look|\bpreview\b|what to watch|game week|keys to|scouting report|how to watch")
RECAP = re.compile(r"postgame|post-game|recap|\bhow the gators\b|\brout of\b|\bwin over\b|\bbeat\b|\bbeats\b|\bsealed\b|sideline|thoughts from")
SCORE_IN_TITLE = re.compile(r"\b\d{1,2}[-, ]{1,3}(?:[a-z .&']+ )?\d{1,2}\b")


def _mentions(title, opp):
    t = ' ' + _words(title) + ' '
    names = [opp] + ALIASES.get(opp, [])
    for n in names:
        n = _words(n).strip()
        if f' {n} ' in t:
            # "Texas" must not match "Texas A&M"; "Georgia" must not match "Georgia Tech" and so on.
            if n == 'texas' and 'texas a&m' in t and 'texas a&m' not in _words(opp):
                continue
            return True
    return False


def _posts(posts_doc):
    out = []
    for p in (posts_doc or {}).get('posts', []):
        url, when = p.get('url') or '', p.get('firstPublishedDate') or p.get('publishedDate')
        if not (url.startswith(SITE) and when and p.get('title')):
            continue  # never emit anything that isn't our own page
        try:
            out.append({'title': p['title'], 'url': url, 'when': dt.datetime.fromisoformat(when.replace('Z', '+00:00'))})
        except ValueError:
            pass
    return out


def find_story(game, posts, kind):
    """Best own-site post of kind 'recap' | 'gallery' | 'preview' for one game, or None."""
    kick = dt.datetime.fromisoformat(game['date'].replace('Z', '+00:00'))
    best = None
    for p in posts:
        title, low = p['title'], p['title'].lower()
        if not _mentions(title, game['opponent']):
            continue
        age = (p['when'] - kick).total_seconds() / 86400
        is_gallery = bool(GALLERY.search(low))
        if kind == 'gallery':
            if not is_gallery or not (-0.25 <= age <= 7):
                continue
            key = (0, p['when'])  # earliest gallery is the canonical one
        elif kind == 'recap':
            if is_gallery or not (-0.1 <= age <= 7) or not (RECAP.search(low) or SCORE_IN_TITLE.search(low)):
                continue
            key = (-(3 * bool(re.search('postgame|post-game|recap', low)) + 2 * bool(SCORE_IN_TITLE.search(low)) + bool(RECAP.search(low))), p['when'])
        else:
            if is_gallery or not (-10 <= age <= 0.2) or not PREVIEW.search(low):
                continue
            key = (0, -p['when'].timestamp())  # newest preview wins
        if best is None or key < best[0]:
            best = (key, p['url'])
    return best[1] if best else None


# ---------- building ----------

def build(schedule, standings, summaries, posts_doc, prev, now):
    events = sorted((parse_event(e) for e in schedule.get('events', [])), key=lambda g: g['date'])
    if not events:
        raise ScoreError('ESPN schedule returned no games')
    posts = _posts(posts_doc)
    finals = [g for g in events if g['status'] == 'final']
    upcoming = [g for g in events if g['status'] in ('scheduled', 'in-progress')]
    live_games = [g for g in events if g['status'] == 'in-progress']
    team = schedule.get('team') or {}
    stand = parse_standings(standings) if standings else []
    fl = next((r for r in stand if r['team'] == 'Florida'), None)

    rec = str(team.get('recordSummary') or '')
    if not re.match(r'^\d+-\d+', rec):
        raise ScoreError(f'no usable Florida record in ESPN schedule: {rec!r}')
    w = sum(1 for g in finals if g['score']['fla'] > g['score']['opp'])
    m = re.match(r'(\d+)-(\d+)', rec)
    if (int(m.group(1)), int(m.group(2))) != (w, len(finals) - w):
        raise ScoreError(f'computed record {w}-{len(finals) - w} != ESPN recordSummary {rec}')
    ref = upcoming[0] if upcoming else (finals[-1] if finals else None)
    conf = (fl or {}).get('confRecord') or (finals[-1]['flaConf'] if finals else None)
    out = {
        'updatedAt': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'season': int(schedule.get('season', {}).get('year') or now.year),
        'team': {'name': 'Florida', 'rank': (ref or {}).get('flaRank') or (fl or {}).get('rank'),
                 'record': f'{m.group(1)}-{m.group(2)}', 'conf': conf},
    }

    out['last'] = None
    if finals:
        g = finals[-1]
        q = None
        sm = summaries.get(g['eventId'])
        if sm:
            t = sm['teams']
            if TEAM_ID in t and len(t) == 2:
                opp_id = next(k for k in t if k != TEAM_ID)
                q = {'fla': t[TEAM_ID]['lines'], 'opp': t[opp_id]['lines']}
                if (sum(q['fla']), sum(q['opp'])) != (g['score']['fla'], g['score']['opp']):
                    raise ScoreError(f'event {g["eventId"]}: quarters {q} do not add up to schedule score {g["score"]}')
        elif prev and (prev.get('last') or {}).get('eventId') == g['eventId']:
            q = prev['last'].get('quarters')  # summary read failed: keep what we already had for this game
        out['last'] = {
            'eventId': g['eventId'], 'opponent': g['opponent'], 'opponentRank': g['opponentRank'], 'home': g['home'],
            'date': g['date'], 'status': 'final', 'score': g['score'], 'quarters': q, 'venue': g['venue'],
            'recapUrl': find_story(g, posts, 'recap'), 'galleryUrl': find_story(g, posts, 'gallery'),
        }

    out['next'] = None
    if upcoming:
        g = upcoming[0]
        # The Tunnel prints this under the opponent's name. ESPN's pregame summary carries the current record; a schedule
        # row carries one only for an in-progress or final game. If the summary read failed, keep what we had for this game.
        sm = summaries.get(g['eventId'])
        opp_rec = next((t.get('record') for k, t in (sm or {}).get('teams', {}).items() if k != TEAM_ID), None) or g['opponentRecord']
        if not opp_rec and prev and (prev.get('next') or {}).get('eventId') == g['eventId']:
            opp_rec = prev['next'].get('opponentRecord')
        g['opponentRecord'] = opp_rec if isinstance(opp_rec, str) and OVERALL.match(opp_rec) else None
        out['next'] = {'eventId': g['eventId'], 'opponent': g['opponent'], 'opponentRank': g['opponentRank'], 'opponentRecord': g['opponentRecord'],
                       'home': g['home'], 'kickoffIso': g['date'], 'tv': g['tv'], 'venue': g['venue'], 'previewUrl': find_story(g, posts, 'preview')}

    sched = []
    for g in events:
        story = find_story(g, posts, 'recap') if g['status'] == 'final' else find_story(g, posts, 'preview') if g['status'] == 'scheduled' else None
        sched.append({'eventId': g['eventId'], 'date': g['date'], 'opponent': g['opponent'], 'opponentRank': g['opponentRank'],
                      'opponentRecord': g['opponentRecord'], 'home': g['home'], 'status': g['status'], 'score': g['score'], 'tv': g['tv'], 'storyUrl': story})
    out['schedule'] = sched
    out['standings'] = [{k: r[k] for k in ('team', 'confRecord', 'overall')} for r in stand]

    out['live'] = None
    if live_games:
        g = live_games[0]
        sm = summaries.get(g['eventId'])
        if sm and sm['state'] == 'in' and TEAM_ID in sm['teams']:
            opp_id = next((k for k in sm['teams'] if k != TEAM_ID), None)
            a, b = sm['teams'][TEAM_ID]['score'], sm['teams'].get(opp_id, {}).get('score')
            if a is None or b is None:
                a, b = (g['score'] or {}).get('fla'), (g['score'] or {}).get('opp')
            if a is not None and b is not None and sm['period']:
                poss = sm['possession']
                out['live'] = {'eventId': g['eventId'], 'clock': sm['clock'] or '', 'period': int(sm['period']),
                               'score': {'fla': a, 'opp': b},
                               'possession': 'fla' if poss == TEAM_ID else 'opp' if poss and poss == opp_id else None,
                               'lastPlay': sm['lastPlay']}
    return out


def stamp(data, prev, now):
    """Keep the previous updatedAt unless something changed, so unchanged runs make no commit."""
    body = {k: v for k, v in (prev or {}).items() if k != 'updatedAt'}
    data = dict(data)
    same = bool(prev) and body == {k: v for k, v in data.items() if k != 'updatedAt'}
    data['updatedAt'] = prev['updatedAt'] if same else now.strftime('%Y-%m-%dT%H:%M:%SZ')
    return data, not same


# ---------- scheduling ----------

def due(prev, now):
    """No-network decision: is an ESPN read worth it on this 5-minute tick? Hourly, or every tick in a game window."""
    if not prev or prev.get('season') != now.year and now.month >= 3:
        return 'no current-season file'
    for g in prev.get('schedule', []):
        kick = dt.datetime.fromisoformat(g['date'].replace('Z', '+00:00'))
        hours = (now - kick).total_seconds() / 3600
        if g['status'] == 'in-progress' or (g['status'] != 'final' and g['status'] != 'canceled' and -LIVE_BEFORE_H <= hours <= LIVE_AFTER_H):
            return f'game window {g["eventId"]}'
    if now.minute < 10:
        return 'hourly'
    return None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--season', type=int)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--from-dir')
    ap.add_argument('--posts', default=str(POSTS))
    ap.add_argument('--out', default=str(OUT))
    ap.add_argument('--now', help='ISO time to pretend it is (tests)')
    a = ap.parse_args(argv)
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')) if a.now else dt.datetime.now(dt.timezone.utc)
    out = pathlib.Path(a.out)
    try:
        prev = json.loads(out.read_text()) if out.exists() else None
    except ValueError:
        prev = None
    reason = 'forced' if (a.force or a.from_dir) else due(prev, now)
    if not reason:
        print('scoreboard: not due; no ESPN read')
        return 0
    season = a.season or (prev or {}).get('season') or (now.year if now.month >= 3 else now.year - 1)
    src = Source(season, a.from_dir)
    try:
        sch = src.schedule()
        try:
            standings = src.standings()
        except ScoreError as e:
            if not prev:
                raise
            print(f'scoreboard: standings unavailable, reusing previous: {e}', file=sys.stderr)
            standings = None
        events = [parse_event(e) for e in sch.get('events', [])]
        need = [g['eventId'] for g in events if g['status'] == 'in-progress']
        finals = [g for g in events if g['status'] == 'final']
        if finals:
            need.append(max(finals, key=lambda g: g['date'])['eventId'])
        upcoming = sorted((g for g in events if g['status'] in ('scheduled', 'in-progress')), key=lambda g: g['date'])
        if upcoming:
            need.append(upcoming[0]['eventId'])  # pregame summary: the next opponent's current record for The Tunnel
        summaries = {}
        for eid in dict.fromkeys(need):
            try:
                summaries[eid] = parse_summary(src.summary(eid))
            except (ScoreError, KeyError, ValueError, IndexError) as e:
                print(f'scoreboard: summary {eid} unavailable: {e}', file=sys.stderr)
        try:
            posts_doc = json.loads(pathlib.Path(a.posts).read_text())
        except (OSError, ValueError):
            posts_doc = {}
        data = build(sch, standings, summaries, posts_doc, prev, now)
        if standings is None and prev:
            data['standings'] = prev.get('standings', [])
        data, changed = stamp(data, prev, now)
        errors = validate(data)
        if errors:
            raise ScoreError('output failed validation: ' + '; '.join(errors[:6]))
    except (ScoreError, KeyError, ValueError, StopIteration, TypeError) as e:
        print(f'scoreboard: {reason}: kept last file: {type(e).__name__}: {e}', file=sys.stderr)
        return 2
    if changed or not out.exists():
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({'reason': reason, 'changed': changed, 'record': data['team']['record'], 'live': bool(data['live']),
                      'games': len(data['schedule'])}))
    return 0


if __name__ == '__main__':
    sys.exit(main())
