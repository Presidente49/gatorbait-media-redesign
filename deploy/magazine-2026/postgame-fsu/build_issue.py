#!/usr/bin/env python3
"""Postgame edition generator: Florida at Florida State, Fri., Nov. 27, 2026 (ESPN event 401856759).

Writes sports-live/magazine-issue-fsu-postgame.json for the existing `layout: "postgame"` renderer
(sports-live/src/magazine-postgame.{js,css}), unchanged. Nothing is typed from memory: the teams, scores, records, rank, line
score, scoring plays (AP style), team stats, box score, leaders, damage tiles and the win-probability flow are all computed from
ESPN's summary at build time. Everything hand-written (cover, columns, coverage, quotes, "next", links, credits) comes from a
copy file. Local build only: nothing here writes to Wix, sends mail or pushes.

Usage:
  python3 deploy/magazine-2026/postgame-fsu/build_issue.py --copy copy.json            (fetches ESPN; stops unless Final)
  python3 deploy/magazine-2026/postgame-fsu/build_issue.py --copy copy.json --file summary.json --out /tmp/test.json
Options: --event ID (default 401856759)  --file PATH (saved ESPN summary, no network)  --out PATH
         --allow-live (test build of a game that is not Final)  --dry-run (compute and validate, write nothing)
Then:  MAG_VARIANT=fsu-postgame node sports-live/build-magazine.mjs
See README.md and copy.example.json in this folder."""
import argparse, datetime, hashlib, json, math, pathlib, re, sys, urllib.request
from zoneinfo import ZoneInfo

REPO = pathlib.Path(__file__).resolve().parents[3]
DEFAULT_EVENT = '401856759'
DEFAULT_OUT = REPO / 'sports-live' / 'magazine-issue-fsu-postgame.json'
US = 'FLA'            # Florida, identified by ESPN abbreviation (never by home/away)
US_CONF = 'SEC'
ET = ZoneInfo('America/New_York')
API = '/apis/site/v2/sports/football/college-football/'
HOSTS = ('https://site.web.api.espn.com', 'https://site.api.espn.com')  # the second host blocks some clients, so it is the fallback
SITE_HOSTS = {'gatorbaitmedia.com', 'www.gatorbaitmedia.com'}
ORD = {1: 'first', 2: 'second', 3: 'third', 4: 'fourth'}
MONTH = {1: 'Jan.', 2: 'Feb.', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'Aug.', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Dec.'}
ALLOWED_COPY = {'cover', 'columns', 'coverage', 'quotes', 'next', 'reference', 'credits', 'asOf', 'issue', 'final', 'sections', 'teamNames', 'scoreAbbr', 'set'}
CONTENTS = [('columns', 'The columns'), ('coverage', 'The game package'), ('damage', 'By the numbers'), ('scoring', 'Score by score'), ('box', 'Box score'), ('flow', 'Game flow'), ('quotes', 'In their words'), ('next', 'Up next')]
DEFAULT_LINKS = [  # evergreen footer links, the same ones the Vanderbilt edition used; replaced by copy.reference.links when given
    {'label': 'Schedule and results', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#schedule'},
    {'label': 'Roster', 'url': '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play#roster'},
    {'label': 'The Buddy Martin Show', 'url': '/the-buddy-martin-show'},
    {'label': 'GatorBait home', 'url': '/'}]
BUNDLE_BASE = 198112    # bytes of the built postgame bundle apart from the issue JSON (CSS + renderers + signup), measured Nov. 27, 2026; build-magazine.mjs is the real check
BUNDLE_CAP = 212 * 1024  # the postgame cap in sports-live/build-magazine.mjs
ERRORS, WARNINGS = [], []


def err(msg): ERRORS.append(msg)
def warn(msg): WARNINGS.append(msg)
def rnd(x): return int(math.floor(x + 0.5))  # half up, like JavaScript (Python's round() is banker's rounding)
def toint(v, default=0):
    try: return int(float(str(v).replace(',', '').strip()))
    except (ValueError, TypeError): return default
def of(s): return str(s).replace('/', ' of ').replace('-', ' of ')
def plural(n, one, many=None): return '%s %s' % (n, one if n == 1 else (many or one + 's'))
def poss(name): return name + ("'" if name.endswith('s') else "'s")


# ---------------------------------------------------------------- ESPN
def http_json(path):
    errs = []
    for host in HOSTS:
        try:
            req = urllib.request.Request(host + path, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=40) as r: return json.load(r)
        except Exception as e: errs.append('%s: %s' % (host, e))
    raise SystemExit('ERROR: ESPN fetch failed on both hosts:\n  ' + '\n  '.join(errs))


def load_summary(a):
    if a.file:
        d = json.loads(pathlib.Path(a.file).read_text())
        return d, 'file ' + a.file
    d = http_json(API + 'summary?event=' + a.event)
    if not isinstance(d, dict) or not d.get('header') or not d.get('boxscore'): raise SystemExit('ERROR: ESPN returned no summary for event ' + a.event)
    return d, 'ESPN'


# ---------------------------------------------------------------- AP style for ESPN play text (same rules as deploy/gameday-20261127/livegen.cjs style())
def ap_style(s):
    s = re.sub(r'\s+', ' ', s or '').strip()
    s = re.sub(r'(\d+) Yd ', r'\1-yard ', s)
    s = re.sub(r'\b(Rushing|Passing|Receiving) Touchdown\b', lambda m: m.group(0).lower(), s)
    s = re.sub(r'\b(Field Goal|Interception Return|Fumble Return|Punt Return|Kickoff Return|Blocked Punt|Blocked Field Goal|Run|Pass|Rush|Kick|Safety|Return|Recovery|Reception|Failed|Blocked|Missed|No Good)\b', lambda m: m.group(0).lower(), s)
    s = re.sub(r'\bKICK\b', 'kick', s); s = re.sub(r'\bPASS\b', 'pass', s); s = re.sub(r'\bRUN\b', 'run', s)
    s = s.replace('Two-Point Conversion', 'two-point conversion'); s = re.sub(r'\(Two-Point', '(two-point', s, flags=re.I)
    return re.sub(r'\s+\)', ')', s)


def style_play(raw, names, td_rush):
    """Returns (full play text for the table, main clause without the PAT/two-point parenthetical)."""
    prot = {}
    s = re.sub(r'\s+', ' ', raw or '').strip()
    for i, n in enumerate(sorted(names, key=len, reverse=True)):  # player names are never restyled (a surname such as "Rush" stays as is)
        if n and n in s: tok = '\x01%d\x02' % i; prot[tok] = n; s = s.replace(n, tok)
    m = re.match(r'^(.*?)\s*(\(.*\))\s*$', s)
    main, paren = (m.group(1), m.group(2)) if m else (s, '')
    main, paren = ap_style(main), ap_style(paren)
    if td_rush: main = re.sub(r'(\d+-yard) run$', r'\1 touchdown run', main)
    for tok, n in prot.items(): main = main.replace(tok, n); paren = paren.replace(tok, n)
    if main and main[0].islower(): main = main[0].upper() + main[1:]
    return (main + (' ' + paren if paren else '')).strip(), main


def clock_phrase(q, clock):
    if q >= 5: return 'in overtime'
    mm, _, ss = (clock or '').partition(':')
    secs = toint(mm) * 60 + toint(ss)
    t = plural(secs, 'second') if secs < 60 else clock
    return 'with %s to play' % t if q == 4 else 'with %s left in %s' % (t, 'the half' if q == 2 else 'the %s quarter' % ORD.get(q, 'first'))


def when_label(q, clock): return 'Q%d %s' % (q, clock) if q <= 4 else ('OT' if q == 5 else '%dOT' % (q - 4))


# ---------------------------------------------------------------- the copy file
PLACEHOLDER = re.compile(r'\[[A-Z]{3,}')
OPTIONAL = re.compile(r'^\s*\[OPTIONAL\b.*\]\s*$', re.S)
DROP = object()
CURLY = {'\u2018': "'", '\u2019': "'", '\u201a': "'", '\u201b': "'", '\u201c': '"', '\u201d': '"', '\u201e': '"'}


def prune(o):
    """Drops _notes keys and untouched [OPTIONAL ...] placeholders (and the empty dicts and lists they leave behind)."""
    if isinstance(o, dict):
        out = {k: v for k, v in ((k, prune(v)) for k, v in o.items() if not k.startswith('_')) if v is not DROP}
        return out if out else DROP
    if isinstance(o, list):
        out = [v for v in (prune(x) for x in o) if v is not DROP]
        return out if out else DROP
    return DROP if isinstance(o, str) and OPTIONAL.match(o) else o


def walk(o, fn, path='$'):
    if isinstance(o, dict): return {k: walk(v, fn, path + '.' + k) for k, v in o.items()}
    if isinstance(o, list): return [walk(v, fn, '%s[%d]' % (path, i)) for i, v in enumerate(o)]
    return fn(o, path) if isinstance(o, str) else o


def load_copy(path):
    raw = json.loads(pathlib.Path(path).read_text())
    if not isinstance(raw, dict): raise SystemExit('ERROR: the copy file must be a JSON object')
    copy = prune(raw)
    copy = {} if copy is DROP else copy
    for k in copy:
        if k not in ALLOWED_COPY: err('copy: unknown top-level key "%s" (allowed: %s)' % (k, ', '.join(sorted(ALLOWED_COPY))))
    def chkph(s, p):
        if PLACEHOLDER.search(s): err('copy: placeholder text still in %s: %s' % (p, s[:60]))
        return s
    walk(copy, chkph)
    return copy


def straighten(o, counts):
    def fix(s, p):
        t = ''.join(CURLY.get(c, c) for c in s)
        if t != s: counts[0] += sum(1 for c in s if c in CURLY)
        return t
    return walk(o, fix)


def deep_merge(base, over):
    if isinstance(base, dict) and isinstance(over, dict):
        out = dict(base)
        for k, v in over.items(): out[k] = deep_merge(base[k], v) if k in base else v
        return out
    return over


def set_path(obj, path, value):
    toks = [int(t) if t.isdigit() else t for t in path.split('.')]
    cur = obj
    for t in toks[:-1]: cur = cur[t]
    cur[toks[-1]] = value


# ---------------------------------------------------------------- images and links
def safe_url(u):
    """Mirrors safeUrl() in sports-live/src/magazine.js: our own site only, https, no credentials."""
    from urllib.parse import urljoin, urlparse
    try:
        p = urlparse(urljoin('https://www.gatorbaitmedia.com', str(u or '')))
        if p.scheme != 'https' or p.username or p.password or p.hostname not in SITE_HOSTS: return ''
        return p.path + (('?' + p.query) if p.query else '') + (('#' + p.fragment) if p.fragment else '')
    except ValueError: return ''


def norm_image(img, where):
    """{id, ext, width, height, alt, credit, uaa}: accepts an id with ~mv2.jpg on it; appends the credit to the alt like the Vanderbilt build did."""
    if not isinstance(img, dict): err('%s: image must be an object with id, width, height, alt, credit' % where); return None
    i = str(img.get('id') or '').strip(); ext = str(img.get('ext') or '').strip().lower().lstrip('.')
    m = re.match(r'^(?:https://static\.wixstatic\.com/media/)?([0-9a-f]+_[0-9a-f]{32})(?:~mv2\.(jpe?g|png|webp|avif))?', i, re.I)
    if not m: err('%s: image id must look like d3cfa5_<32 hex> (got "%s")' % (where, i[:50])); return None
    i = m.group(1).lower(); ext = ext or (m.group(2) or 'jpg').lower()
    if ext not in ('jpg', 'jpeg', 'png', 'webp', 'avif'): err('%s: image ext must be jpg, png, webp or avif' % where)
    w, h = img.get('width'), img.get('height')
    if not (isinstance(w, int) and isinstance(h, int) and w > 0 and h > 0): err('%s: image width and height must be whole numbers (the real pixel size; the frame uses them as its aspect ratio)' % where)
    credit = str(img.get('credit') or '').strip(); alt = str(img.get('alt') or '').strip()
    if not alt: err('%s: image alt text is required' % where)
    if not credit: err('%s: image credit is required' % where)
    if credit and credit not in alt: alt = (alt + ' ' + credit).strip()
    return {'id': i, 'ext': ext, 'width': w, 'height': h, 'alt': alt, 'credit': credit, 'uaa': bool(img.get('uaa', False))}


def norm_items(P, key):
    """columns / coverage: a head plus up to 12 story rows. The first row is the lead card unless a row says lead explicitly."""
    items = P.get('items') or []
    if not isinstance(items, list): err('%s.items must be a list' % key); return None
    rows = []
    for n, s in enumerate(items):
        where = '%s.items[%d]' % (key, n)
        if not isinstance(s, dict): err(where + ' must be an object'); continue
        r = {k: s[k] for k in ('rubric', 'author', 'title', 'dek', 'url', 'read') if s.get(k)}
        if 'lead' in s: r['lead'] = bool(s['lead'])
        elif n == 0: r['lead'] = True
        if s.get('image'): r['image'] = norm_image(s['image'], where + '.image')
        for req in ('title', 'url'):
            if not r.get(req): err('%s.%s is required' % (where, req))
        rows.append(r)
    return rows


# ---------------------------------------------------------------- the build
def build(d, copy, a, src):
    c = d['header']['competitions'][0]
    ty = c['status']['type']
    final = bool(ty.get('completed')) and ty.get('description') == 'Final'
    if not final and not a.allow_live:
        raise SystemExit('ERROR: the game is not Final (ESPN says "%s"). Run again after the final whistle, or add --allow-live for a test build.' % (ty.get('detail') or ty.get('description')))
    if not final: warn('NOT FINAL (%s): this is a test build; do not commit or pin it.' % (ty.get('detail') or ty.get('description')))
    comps = c['competitors']
    if len(comps) != 2: raise SystemExit('ERROR: expected two competitors, got %d' % len(comps))
    us_c = next((x for x in comps if x['team'].get('abbreviation') == US), None)
    if not us_c: raise SystemExit('ERROR: no competitor with abbreviation %s in this game' % US)
    op_c = next(x for x in comps if x is not us_c)
    away_c = next(x for x in comps if x.get('homeAway') == 'away'); home_c = next(x for x in comps if x.get('homeAway') == 'home')
    us_home = us_c.get('homeAway') == 'home'
    names = dict(copy.get('teamNames') or {})
    def nm(x): return names.get(x['team']['abbreviation']) or x['team'].get('location') or x['team'].get('shortDisplayName') or x['team'].get('displayName')
    abbr_over = dict(copy.get('scoreAbbr') or {})
    def ab(x): return abbr_over.get(x['team']['abbreviation']) or {'FLA': 'UF'}.get(x['team']['abbreviation']) or x['team']['abbreviation']
    US_N, OP_N = nm(us_c), nm(op_c)
    us_nick = us_c['team'].get('name') or 'team'
    us_id, op_id = str(us_c['team']['id']), str(op_c['team']['id'])
    if us_id != '57': warn('team %s has id %s, not 57 (Florida)' % (US, us_id))
    S = {us_id: toint(us_c.get('score')), op_id: toint(op_c.get('score'))}
    FS, OS = S[us_id], S[op_id]
    if final and FS == OS: raise SystemExit('ERROR: the final is tied %d-%d; check ESPN' % (FS, OS))
    won = FS > OS
    def ls(x): return [toint(l.get('displayValue') if l.get('displayValue') is not None else l.get('value')) for l in x.get('linescores', [])]
    lsu, lso = ls(us_c), ls(op_c)
    if final and (sum(lsu) != FS or sum(lso) != OS): err('line score does not add up to the final: %s=%d, %s=%d' % (lsu, FS, lso, OS))
    if final and len(lsu) < 4: err('line score has %d periods' % len(lsu))
    def rec(x): return {r.get('type'): r.get('summary') for r in x.get('record', [])}
    def rank(x):
        r = toint(x.get('rank'), 0)
        return 'No. %d' % r if 1 <= r <= 25 else None
    # date, venue
    kick = datetime.datetime.fromisoformat(c['date'].replace('Z', '+00:00')).astimezone(ET)
    date_short = '%s, %s %d' % (kick.strftime('%A'), MONTH[kick.month], kick.day)
    date_long = '%s, %d' % (date_short, kick.year)
    venue = (d.get('gameInfo') or {}).get('venue') or {}
    v_name = venue.get('fullName'); v_city = (venue.get('address') or {}).get('city')
    neutral = bool(c.get('neutralSite'))
    # records, cross-checked against the schedule so a stale ESPN summary cannot print last week's record
    r_us = rec(us_c); rec_line = None
    if final:
        total, conf = r_us.get('total'), r_us.get('vsconf')
        if a.file: warn('records not cross-checked against the schedule (offline --file run)')
        else:
            try:
                sch = http_json(API + 'teams/%s/schedule' % us_id)
                w = l = 0; this_done = False
                for e in sch.get('events', []):
                    cc = e['competitions'][0]
                    if not cc['status']['type'].get('completed'): continue
                    me = next(x for x in cc['competitors'] if str(x['team']['id']) == us_id)
                    if me.get('winner'): w += 1
                    else: l += 1
                    if str(e['id']) == str(c.get('id') or d['header'].get('id')): this_done = True
                if this_done and total == '%d-%d' % (w, l): pass
                elif this_done: warn('ESPN summary record %s is stale; the schedule says %d-%d. Using the schedule total and dropping the conference record.' % (total, w, l)); total, conf = '%d-%d' % (w, l), None
                else: warn('ESPN schedule has not marked this game complete yet, so the record (%s) cannot be trusted; the record line is left out. Re-run in a few minutes.' % total); total = conf = None
            except SystemExit: warn('could not read the schedule to cross-check the record; the record line is left out'); total = conf = None
        if total: rec_line = '%s is %s%s' % (US_N, total, ', %s %s' % (conf, US_CONF) if conf else '')
    # team stats and players (matched by team id, never by list order)
    st = {}
    for tm in d['boxscore'].get('teams', []): st[str(tm['team']['id'])] = {s.get('name'): str(s.get('displayValue')).strip() if s.get('displayValue') is not None else None for s in tm.get('statistics', [])}
    tu, to = st.get(us_id, {}), st.get(op_id, {})
    pl = {}
    for tm in d['boxscore'].get('players', []):
        tid = str(tm['team']['id']); pl[tid] = {}
        for cat in tm.get('statistics', []):
            rows = []
            for x in cat.get('athletes', []):
                nmx = str((x.get('athlete') or {}).get('displayName') or '').strip()
                if not nmx or nmx.lower() == 'team': continue  # ESPN's "Team" rows are not people
                rows.append(dict(zip(cat.get('labels', []), x.get('stats', [])), name=nmx))
            pl[tid][cat['name']] = rows
    all_names = sorted({r['name'] for t in pl.values() for rows in t.values() for r in rows})
    def top(tid, cat, key, tie=None):
        rows = [r for r in pl.get(tid, {}).get(cat, []) if toint(r.get(key)) > 0 or (tie and toint(r.get(tie)) > 0)]
        return max(rows, key=lambda r: (toint(r.get(key)), toint(r.get(tie)) if tie else 0)) if rows else None
    def ratio(s):
        m = re.match(r'^\s*(\d+)\s*/\s*(\d+)', str(s or '')); return (int(m.group(1)), int(m.group(2))) if m else (0, 0)
    def leaders(tid, my_plays):
        items = []
        p = top(tid, 'passing', 'YDS')
        if p:
            cm, at = ratio(p.get('C/ATT')); s = '%s: %d of %d, %d yards' % (p['name'], cm, at, toint(p.get('YDS')))
            if toint(p.get('TD')): s += ', %d TD' % toint(p.get('TD'))
            if toint(p.get('INT')): s += ', %d INT' % toint(p.get('INT'))
            items.append(['Passing', s])
        p = top(tid, 'rushing', 'YDS', 'CAR')
        if p:
            s = '%s: %s, %d yards' % (p['name'], plural(toint(p.get('CAR')), 'carry', 'carries'), toint(p.get('YDS')))
            if toint(p.get('TD')): s += ', %d TD' % toint(p.get('TD'))
            items.append(['Rushing', s])
        p = top(tid, 'receiving', 'YDS', 'REC')
        if p:
            s = '%s: %s, %d yards' % (p['name'], plural(toint(p.get('REC')), 'catch', 'catches'), toint(p.get('YDS')))
            if toint(p.get('TD')): s += ', %d TD' % toint(p.get('TD'))
            items.append(['Receiving', s])
        p = top(tid, 'defensive', 'TOT', 'SOLO')
        if p:
            s = '%s: %s' % (p['name'], plural(toint(p.get('TOT')), 'tackle'))
            if toint(p.get('SACKS')): s += ', %s' % plural(toint(p.get('SACKS')), 'sack')
            if toint(p.get('TFL')): s += ', %s tackles for loss' % p.get('TFL')
            if toint(p.get('PD')): s += ', %s' % plural(toint(p.get('PD')), 'pass breakup')
            if toint(p.get('TD')): s += ', %d TD' % toint(p.get('TD'))
            items.append(['Defense', s])
        ks = pl.get(tid, {}).get('kicking', [])
        if ks:
            k = max(ks, key=lambda r: (toint(r.get('PTS')), ratio(r.get('FG'))[1]))
            fm, fa = ratio(k.get('FG')); xm, xa = ratio(k.get('XP'))
            if fa:
                dist = [m.group(1) for m in (re.match(r'^%s (\d+)-yard field goal' % re.escape(k['name']), pp['main']) for pp in my_plays) if m]
                s = '%s: %d of %d on field goals' % (k['name'], fm, fa) + (' (%s)' % ', '.join(dist) if dist and len(dist) == fm else '')
                items.append(['Kicking', s])
            elif xa: items.append(['Kicking', '%s: %d of %d on extra points' % (k['name'], xm, xa)])
        return items
    # scoring plays, each carrying Florida's and the opponent's running score whichever side was home
    sp = d.get('scoringPlays') or []
    plays = []
    for p in sp:
        tid = str(p['team']['id']); su = toint(p['homeScore'] if us_home else p['awayScore']); so = toint(p['awayScore'] if us_home else p['homeScore'])
        td_rush = (p.get('scoringType') or {}).get('name') == 'touchdown' and 'rushing' in str((p.get('type') or {}).get('text', '')).lower()
        full, main = style_play(p.get('text'), all_names, td_rush)
        q, clock = toint((p.get('period') or {}).get('number'), 1), (p.get('clock') or {}).get('displayValue') or ''
        plays.append({'id': str(p['id']), 'q': q, 'clock': clock, 'us': tid == us_id, 'su': su, 'so': so, 'full': full, 'main': main, 'team': US_N if tid == us_id else OP_N,
                      'when': when_label(q, clock), 'score': '%s %d, %s %d' % (ab(us_c), su, ab(op_c), so)})
    if final and (not plays or (plays[-1]['su'], plays[-1]['so']) != (FS, OS)): err('the scoring plays end %s, not the final %d-%d; ESPN may be missing a play' % ((plays[-1]['su'], plays[-1]['so']) if plays else 'empty', FS, OS))
    if len(plays) > 24: err('%d scoring plays; the renderer shows 24 at most' % len(plays))
    for p in plays: p['full'] = p['full'] if len(p['full']) <= 140 else p['full'].split(' (')[0]  # drop the PAT note before giving up on the 140-character cap
    # lead changes and ties
    prev, lastlead, changes, ties = 0, 0, 0, 0
    for k, p in enumerate(plays):
        lead = (p['su'] > p['so']) - (p['su'] < p['so'])
        p['lead'], p['prev'] = lead, prev
        p['flip'] = lead != 0 and lastlead != 0 and lead != lastlead   # the other team takes the lead
        p['tie'] = lead == 0 and prev != 0                              # ties it
        p['takes'] = lead != 0 and prev == 0 and k > 0                  # goes ahead out of a tie (the opening score of the game does not count)
        changes += p['flip']; ties += p['tie']
        if lead: lastlead = lead
        prev = lead
    winner_lead = 1 if won else -1
    decisive = None
    for k, p in enumerate(plays):
        if p['lead'] == winner_lead and p['prev'] != winner_lead: decisive = k
    # win probability, always from Florida's side (ESPN's value is the HOME team's chance)
    wp = [x for x in (d.get('winprobability') or []) if x.get('homeWinPercentage') is not None]
    pts = [min(100.0, max(0.0, round((x['homeWinPercentage'] if us_home else 1 - x['homeWinPercentage']) * 100, 1))) for x in wp]
    flow = marks = None
    if len(pts) >= 20:
        if final and not ((won and pts[-1] >= 50) or (not won and pts[-1] <= 50)): err('win probability ends at %s%% for Florida but the final says %s' % (pts[-1], 'a win' if won else 'a loss'))
        if len(pts) > 600: err('%d win-probability points; the renderer reads 600 at most' % len(pts))
        drive_plays = []
        dr = d.get('drives') or {}
        for dv in (dr.get('previous') or []) + ([dr['current']] if isinstance(dr.get('current'), dict) else []): drive_plays.extend(dv.get('plays') or [])
        per = {str(x['id']): (toint((x.get('period') or {}).get('number'), 0), (x.get('clock') or {}).get('displayValue')) for x in drive_plays}
        order = {str(x['id']): k for k, x in enumerate(drive_plays)}
        idx = {str(x['playId']): i for i, x in enumerate(wp)}
        cur, pq = 1, []
        for x in wp:  # period of each point; a point ESPN does not tie to a play takes the period before it
            cur = per.get(str(x['playId']), (0,))[0] or cur; pq.append(cur)
        kmax = min(4, max(pq))
        qs = [next(i for i, q in enumerate(pq) if q >= k) if any(q >= k for q in pq) else None for k in range(1, kmax + 1)]
        qs[0] = 0
        quarters = ['Q%d' % k for k in range(1, kmax + 1)]
        if None in qs or qs != sorted(set(qs)):
            warn('could not place every quarter line on the chart (%s); the chart is drawn without quarter labels' % qs); qs, quarters = [], []
        def at(k):  # win-probability index of scoring play k
            i = idx.get(plays[k]['id'])
            if i is not None: return i
            o = order.get(plays[k]['id'])
            if o is None: return None
            return next((j for j, x in enumerate(wp) if order.get(str(x['playId']), -1) >= o), len(wp) - 1)
        cands = []
        for k, p in enumerate(plays):
            i = at(k)
            if i is None: continue
            mm, _, ss = p['clock'].partition(':')
            late = p['q'] >= 5 or (p['q'] == 4 and toint(mm) * 60 + toint(ss) <= 600 and abs(p['su'] - p['so']) <= 8)  # a one-score game in the last ten minutes
            w = (4 if p['flip'] else 0) + (3 if p['tie'] else 0) + (3 if p['takes'] else 0) + (1 if k == 0 else 0) + (5 if k == decisive else 0) + (1.5 if late else 0) + abs(pts[i] - pts[max(i - 1, 0)]) / 10.0
            cands.append((w, k, i))
        chosen = []
        n = len(pts) - 1
        for w, k, i in sorted(cands, key=lambda t: (-t[0], t[1])):  # strongest first; skip any that would sit on top of one already chosen (26 px dots on the smallest phone chart, about 232 x 210 px at 320 px wide)
            if all(math.hypot((i - j) / n * 232, (pts[i] - pts[j]) / 100 * 210) >= 24 for _, _, j in chosen):
                chosen.append((w, k, i))
            if len(chosen) == 6: break
        marks = []
        for w, k, i in sorted(chosen, key=lambda t: t[2]):
            p = plays[k]; m = re.match(r'^(?P<who>.+?) (?P<n>\d+)-yard (?P<what>.+)$', p['main'])
            core = '%s %s-yard %s' % (poss(m.group('who')), m.group('n'), m.group('what')) if m else '%s (%s)' % (p['main'], p['team'])
            note = '%s %s; %s is at %d%%' % (core, clock_phrase(p['q'], p['clock']), US_N, rnd(pts[i]))
            marks.append({'i': i, 'title': '%d-%d' % (max(p['su'], p['so']), min(p['su'], p['so'])), 'note': note})
        def pct(i): return rnd(pts[i])
        start, half_i = pct(0), (qs[2] - 1 if len(qs) >= 3 else n // 2)
        half = pct(half_i)
        body = range(max(len(pts) - len(pts) // 10, 1))  # the final tenth of the plays always runs out to 0% or 100%, so the low and the peak are read before it
        lo_i = min(body, key=lambda i: pts[i]); hi_i = max(body, key=lambda i: pts[i])
        def qword(i): q = pq[i]; return 'in overtime' if q >= 5 else 'in the %s quarter' % ORD[max(q, 1)]
        extra = extra_now = ''
        if pct(lo_i) <= min(start, half) - 5: extra, extra_now = 'fell as low as %d%% %s' % (pct(lo_i), qword(lo_i)), 'falls as low as %d%% %s' % (pct(lo_i), qword(lo_i))
        elif pct(hi_i) >= max(start, half) + 5: extra, extra_now = 'peaked at %d%% %s' % (pct(hi_i), qword(hi_i)), 'peaks at %d%% %s' % (pct(hi_i), qword(hi_i))
        last_change = ''
        if decisive is not None and (changes or any(p['takes'] for p in plays)):
            dp = plays[decisive]; dm = re.match(r'^(?P<who>.+?) (?P<n>\d+)-yard (?P<what>.+)$', dp['main'])
            last_change = " The last lead change was %s %s." % ((poss(dm.group('who')) + ' %s-yard %s' % (dm.group('n'), dm.group('what'))) if dm else dp['main'], clock_phrase(dp['q'], dp['clock']))
        end = pct(len(pts) - 1)
        flow = {'kicker': 'Game flow', 'title': 'How the lead changed hands' if changes else 'How the game unfolded',
                'dek': "%s's chance to win, play by play. The %s started at %d%% and were at %d%% at halftime%s." % (US_N, us_nick, start, half, ', then ' + extra if extra else ''),
                'axis': ['100%', '50%', '0%'], 'quarters': quarters, 'quarterStarts': qs, 'points': pts, 'marks': marks,
                'summary': "Line chart of %s's win probability against %s. It starts near %d%%, is at %d%% at halftime%s and ends at %d%%.%s" % (US_N, OP_N, start, half, ', ' + extra_now if extra_now else '', end, last_change),
                'source': 'Win probability: ESPN. GatorBait Media graphic.'}
        flow['_info'] = {'lo': (pct(lo_i), pq[lo_i]), 'start': start, 'half': half, 'end': end}
    else: warn('ESPN has no usable win-probability series (%d points); the Game flow section is left out' % len(pts))
    # first-half and second-half
    h1u, h1o = sum(lsu[:2]), sum(lso[:2]); h2u, h2o = sum(lsu[2:]), sum(lso[2:])
    if len(lsu) >= 4 and len(lso) >= 4:
        if h1u == h1o: half_sent = 'The teams were tied %d-%d at halftime.' % (h1u, h1o)
        else: half_sent = '%s led %d-%d at the half.' % (US_N if h1u > h1o else OP_N, max(h1u, h1o), min(h1u, h1o))
        dtitle = ('%s won the second half %d-%d' % (US_N, h2u, h2o)) if h2u > h2o else ('%s won the second half %d-%d' % (OP_N, h2o, h2u)) if h2o > h2u else 'The second half ended %d-%d' % (h2u, h2o)
    else: half_sent, dtitle = '', 'By the numbers'
    # team-stat rows and box score
    def sv(t, k): return t.get(k)
    box_rows = []
    def row(label, fu, fo):
        if fu not in (None, '') and fo not in (None, ''): box_rows.append([label, str(fu), str(fo)])
        else: warn('box score row "%s" skipped: ESPN has no value for both teams' % label)
    row('First downs', sv(tu, 'firstDowns'), sv(to, 'firstDowns')); row('Total yards', sv(tu, 'totalYards'), sv(to, 'totalYards'))
    row('Passing', '%s, %s yds' % (sv(tu, 'completionAttempts'), sv(tu, 'netPassingYards')) if sv(tu, 'completionAttempts') else None, '%s, %s yds' % (sv(to, 'completionAttempts'), sv(to, 'netPassingYards')) if sv(to, 'completionAttempts') else None)
    row('Rushing', '%s yds on %s carries' % (sv(tu, 'rushingYards'), sv(tu, 'rushingAttempts')) if sv(tu, 'rushingAttempts') else None, '%s yds on %s carries' % (sv(to, 'rushingYards'), sv(to, 'rushingAttempts')) if sv(to, 'rushingAttempts') else None)
    row('Yards per rush', sv(tu, 'yardsPerRushAttempt'), sv(to, 'yardsPerRushAttempt')); row('Third downs', sv(tu, 'thirdDownEff'), sv(to, 'thirdDownEff'))
    row('Fourth downs', sv(tu, 'fourthDownEff'), sv(to, 'fourthDownEff')); row('Penalties', sv(tu, 'totalPenaltiesYards'), sv(to, 'totalPenaltiesYards'))
    row('Turnovers', sv(tu, 'turnovers'), sv(to, 'turnovers')); row('Time of possession', sv(tu, 'possessionTime'), sv(to, 'possessionTime'))
    # damage tiles
    tiles = []
    pu = top(us_id, 'passing', 'YDS'); ru = top(us_id, 'rushing', 'YDS', 'CAR')
    if pu:
        cm, at_ = ratio(pu.get('C/ATT')); det = '%d of %d passing' % (cm, at_)
        if toint(pu.get('TD')): det += ', %s' % plural(toint(pu.get('TD')), 'touchdown')
        if toint(pu.get('INT')): det += ', %s' % plural(toint(pu.get('INT')), 'interception')
        tiles.append({'value': str(toint(pu.get('YDS'))), 'label': '%s passing yards' % pu['name'], 'detail': det + '.'})
    if ru:
        det = '%s, %s per carry' % (plural(toint(ru.get('CAR')), 'carry', 'carries'), ru.get('AVG')) if ru.get('AVG') else plural(toint(ru.get('CAR')), 'carry', 'carries')
        if toint(ru.get('TD')): det += ', %s' % plural(toint(ru.get('TD')), 'touchdown')
        tiles.append({'value': str(toint(ru.get('YDS'))), 'label': '%s rushing yards' % ru['name'], 'detail': det + '.'})
    if sv(tu, 'thirdDownEff') and sv(to, 'thirdDownEff'): tiles.append({'value': sv(tu, 'thirdDownEff'), 'label': '%s third downs' % US_N, 'detail': '%s converted %s.' % (OP_N, of(sv(to, 'thirdDownEff')))})
    if sv(tu, 'turnovers') is not None and sv(to, 'turnovers') is not None: tiles.append({'value': str(sv(tu, 'turnovers')), 'label': '%s turnovers' % US_N, 'detail': '%s had %s.' % (OP_N, sv(to, 'turnovers'))})
    def pen(t): m = re.match(r'^(\d+)-(\d+)$', str(sv(t, 'totalPenaltiesYards') or '')); return (m.group(1), m.group(2)) if m else None
    if pen(tu) and pen(to): tiles.append({'value': '%s for %s' % pen(tu), 'label': '%s penalties' % US_N, 'detail': '%s: %s for %s yards.' % ((OP_N,) + pen(to))})
    if sv(tu, 'possessionTime') and sv(to, 'possessionTime'): tiles.append({'value': sv(tu, 'possessionTime'), 'label': '%s time of possession' % US_N, 'detail': '%s held the ball for %s.' % (OP_N, sv(to, 'possessionTime'))})
    # contents-independent issue blocks
    q_cols = ['1', '2', '3', '4'] + (['OT'] if len(lsu) > 4 else []) + ['F'] if final else [str(i + 1) for i in range(len(lsu))] + ['F']
    def qrow(l): return l[:4] + ([sum(l[4:])] if len(l) > 4 else []) if final else l
    def srow(x, l, f): r = {'team': nm(x), 'q': qrow(l), 'f': f}; r.update({'rank': rank(x)} if rank(x) else {}); r.update({'us': True} if x is us_c else {}); return r
    leaders_us, leaders_op = leaders(us_id, [p for p in plays if p['us']]), leaders(op_id, [p for p in plays if not p['us']])
    label = 'Final' if final else (ty.get('shortDetail') or ty.get('detail') or 'Live')[:20]
    def team_final(x):
        t = {'name': nm(x)}; t.update({'rank': rank(x)} if rank(x) else {}); t['score'] = S[str(x['team']['id'])]
        if final and S[str(x['team']['id'])] > S[op_id if x is us_c else us_id]: t['won'] = True
        return t
    meta = [date_short] + ([', '.join(x for x in (v_name, v_city) if x)] if v_name else []) + list((copy.get('final') or {}).get('extraMeta') or []) + ([rec_line] if rec_line else [])
    winner_c, loser_c = (us_c, op_c) if won else (op_c, us_c)
    issue = {
        '$comment': ('%s postgame web edition (built %s ET from %s, ESPN event %s): %s %d, %s %d%s. Written by deploy/magazine-2026/postgame-fsu/build_issue.py; every number is from ESPN at build time; hand-written copy from the copy file (sha256 %s).'
                     % (OP_N, datetime.datetime.now(ET).strftime('%Y-%m-%d %H:%M'), src, a.event, nm(winner_c), max(FS, OS), nm(loser_c), min(FS, OS), '' if final else ' (NOT FINAL: test build, do not publish)', a.copy_hash)),
        'id': '%s-postgame-%s' % (kick.strftime('%Y-%m-%d'), re.sub(r'[^a-z0-9]+', '-', OP_N.lower()).strip('-')),
        'layout': 'postgame',
        'issue': {'number': 'Postgame edition', 'date': date_long, 'week': '%s%s%s%s' % (nm(away_c), ' vs. ' if neutral else ' at ', nm(home_c), ' \u00b7 ' + v_city if v_city else ''), 'home': 'GatorBait Media',
                  'pageTitle': 'GatorBait Magazine | Postgame: %s %d, %s %d' % (nm(winner_c), max(FS, OS), nm(loser_c), min(FS, OS))},
        'cover': {'score': {'away': nm(away_c), 'awayScore': str(S[str(away_c['team']['id'])]), 'home': nm(home_c), 'homeScore': str(S[str(home_c['team']['id'])]), 'label': label}},
        'final': {'label': label, 'teams': [team_final(away_c), team_final(home_c)], 'meta': meta},
    }
    # hand-written blocks
    cv = dict(copy.get('cover') or {})
    if cv.get('image'): cv['image'] = norm_image(cv['image'], 'cover.image')
    issue['cover'] = deep_merge(issue['cover'], cv)
    def package(key, kicker, title, dek):
        P = copy.get(key)
        if not P: return None
        rows = norm_items(P, key)
        if rows is None: return None
        if not rows: return None
        out = {'kicker': P.get('kicker') or kicker, 'title': P.get('title') or title}
        if P.get('dek') or dek: out['dek'] = P.get('dek') or dek
        out['items'] = rows
        return out
    issue['columns'] = package('columns', 'The columns', 'What our writers made of the game', None)
    issue['coverage'] = package('coverage', 'The game package', 'Everything GatorBait published on the game', None)
    issue['damage'] = {'kicker': 'By the numbers', 'title': dtitle,
                       'dek': ('%s The %s finished with %s yards to %s and converted %s third downs.' % (half_sent, us_nick, sv(tu, 'totalYards'), poss(OP_N) + ' ' + str(sv(to, 'totalYards')), of(sv(tu, 'thirdDownEff')))).strip() if sv(tu, 'totalYards') and sv(to, 'totalYards') and sv(tu, 'thirdDownEff') else half_sent,
                       'yards': {'label': 'Total yards', 'rows': [{'name': US_N, 'value': toint(sv(tu, 'totalYards')), 'us': True}, {'name': OP_N, 'value': toint(sv(to, 'totalYards'))}]},
                       'stats': tiles[:8], 'source': 'Source: ESPN box score (event %s).' % a.event}
    if not (sv(tu, 'totalYards') and sv(to, 'totalYards')): issue['damage'].pop('yards'); warn('no total yards from ESPN; the yards bars are left out')
    issue['scoring'] = {'kicker': 'Score by score', 'title': 'How the points came',
                        'dek': ('Every scoring play, with the game clock. ' + ('The lead never changed hands' if not changes else 'The lead changed hands %s' % plural(changes, 'time')) + (' and the score was tied %s.' % plural(ties, 'time') if ties else '.')),
                        'cols': q_cols, 'rows': [srow(away_c, lso if away_c is op_c else lsu, S[str(away_c['team']['id'])]), srow(home_c, lso if home_c is op_c else lsu, S[str(home_c['team']['id'])])],
                        'plays': [{'when': p['when'], 'play': p['full'], 'score': p['score'], 'uf': p['us']} for p in plays], 'source': 'Scoring plays and line score: ESPN. Times are game clock.'}
    issue['box'] = {'kicker': 'Box score', 'title': 'The full box score', 'dek': 'Team stats and the leaders for both teams.', 'cols': [US_N, OP_N], 'rows': box_rows,
                    'leaders': [{'team': US_N, 'items': leaders_us}, {'team': OP_N, 'items': leaders_op}], 'source': 'Team stats and leaders: ESPN box score (event %s).' % a.event}
    if flow: info = flow.pop('_info'); issue['flow'] = flow
    else: info = None
    q = copy.get('quotes')
    if q and q.get('items'):
        issue['quotes'] = {'kicker': q.get('kicker') or 'In their words', 'title': q.get('title') or 'What they said', 'items': [{k: it[k] for k in ('text', 'who', 'role', 'url', 'link') if it.get(k)} for it in q['items']]}
        if q.get('dek'): issue['quotes']['dek'] = q['dek']
    nx = copy.get('next')
    if nx: issue['next'] = {k: nx[k] for k in ('kicker', 'title', 'meta', 'note', 'pickem') if nx.get(k)}; issue['next'].setdefault('kicker', 'Up next')
    ref = copy.get('reference') or {}
    issue['reference'] = {'label': ref.get('label') or 'More GatorBait', 'links': ref.get('links') or DEFAULT_LINKS, 'top': ref.get('top') or 'Back to the cover'}
    # section heading overrides for the computed sections
    for k, v in (copy.get('sections') or {}).items():
        if k not in ('damage', 'scoring', 'box', 'flow'): err('copy.sections.%s: only damage, scoring, box and flow headings can be overridden here' % k); continue
        if k not in issue: warn('copy.sections.%s ignored: that section is not in this issue' % k); continue
        for f, val in v.items():
            if f not in ('kicker', 'title', 'dek', 'source'): err('copy.sections.%s.%s: only kicker, title, dek and source can be set' % (k, f))
            else: issue[k][f] = val
    # credits: from the photos unless the copy says otherwise
    imgs = [x for x in [issue['cover'].get('image')] + [it.get('image') for key in ('columns', 'coverage') for it in (issue.get(key) or {}).get('items', [])] if x]
    other = []
    for x in imgs:
        if not x.get('uaa') and x['credit'] and x['credit'] not in other: other.append(x['credit'])
    issue['credits'] = deep_merge({'label': 'Photo credits', 'uaa': any(x.get('uaa') for x in imgs), 'other': other[:4]}, copy.get('credits') or {})
    issue['asOf'] = ('Score, scoring plays, box score, leaders and win probability: ESPN (event %s)%s.' % (a.event, ', final' if final else ', NOT FINAL')) + ((' ' + copy['asOf']) if copy.get('asOf') else '')
    issue['issue'] = deep_merge(issue['issue'], copy.get('issue') or {})
    if copy.get('final'): issue['final']['meta'] = meta  # extraMeta is already folded in
    # contents: only sections that exist
    issue['contents'] = {'label': 'In this issue', 'items': [{'id': k, 'label': l} for k, l in CONTENTS if issue.get(k)]}
    # the final order of keys
    order_keys = ['$comment', 'id', 'layout', 'issue', 'cover', 'final', 'contents', 'columns', 'coverage', 'damage', 'scoring', 'box', 'flow', 'quotes', 'next', 'reference', 'credits', 'asOf']
    issue = {k: issue[k] for k in order_keys if issue.get(k)}
    for p in (copy.get('set') or {}).items():
        try: set_path(issue, p[0], p[1]); print('  copy.set applied:', p[0])
        except (KeyError, IndexError, TypeError) as e: err('copy.set "%s" does not point at anything in the issue (%s)' % (p[0], e))
    return issue, {'final': final, 'plays': plays, 'info': info, 'tiles': tiles, 'rec_line': rec_line, 'us_home': us_home, 'FS': FS, 'OS': OS, 'US_N': US_N, 'OP_N': OP_N, 'changes': changes, 'ties': ties}


# ---------------------------------------------------------------- validation (the limits the renderer applies silently, plus house style)
def validate(issue, copy):
    def chk(s, n, what, req=True):
        if s is None and not req: return
        if not isinstance(s, str) or (req and not s.strip()): err('%s: missing or not text' % what); return
        if len(s) > n: err('%s: %d characters, the renderer cuts at %d: %s' % (what, len(s), n, s[:70]))
    def url(u, what, post=False):
        s = safe_url(u)
        if not u or not s: err('%s: "%s" is not a gatorbaitmedia.com link (use a site-relative path such as /post/slug)' % (what, u))
        elif post and not s.startswith('/post/'): warn('%s: %s is not a /post/ URL' % (what, s))
        elif re.search(r'[A-Z\s]', s.split('#')[0].split('?')[0]): warn('%s: %s has capitals or spaces; Wix slugs are lowercase' % (what, s))
    C = issue.get('cover', {})
    for req in ('kicker', 'coverTitle', 'headline', 'dek', 'byline', 'cta', 'url', 'image'):
        if not C.get(req): err('cover.%s is required (copy.cover.%s)' % (req, req))
    chk(C.get('kicker'), 80, 'cover.kicker', False); chk(C.get('coverTitle'), 40, 'cover.coverTitle', False); chk(C.get('headline'), 200, 'cover.headline', False); chk(C.get('dek'), 600, 'cover.dek', False)
    chk(C.get('byline'), 80, 'cover.byline', False); chk(C.get('cta'), 60, 'cover.cta', False); chk(C.get('linesLabel'), 40, 'cover.linesLabel', False)
    if C.get('url'): url(C['url'], 'cover.url', True)
    for t in C.get('teasers', []): chk(t, 60, 'cover.teasers')
    if len(C.get('teasers', [])) > 4: err('cover.teasers: %d items, the cover shows 4' % len(C['teasers']))
    for t in C.get('lines', []): chk(t, 80, 'cover.lines')
    if len(C.get('lines', [])) > 6: err('cover.lines: %d items, the cover shows 6' % len(C['lines']))
    if C.get('lines') and not C.get('linesLabel'): warn('cover.lines without cover.linesLabel')
    S = C.get('score', {})
    for k in ('away', 'home'): chk(S.get(k), 20, 'cover.score.' + k)
    for k in ('awayScore', 'homeScore'): chk(S.get(k), 4, 'cover.score.' + k)
    chk(S.get('label'), 20, 'cover.score.label')
    I = issue['issue']; chk(I['number'], 60, 'issue.number'); chk(I['date'], 60, 'issue.date'); chk(I['week'], 120, 'issue.week'); chk(I['pageTitle'], 120, 'issue.pageTitle'); chk(issue['id'], 80, 'id')
    F = issue['final']; chk(F['label'], 20, 'final.label')
    if len(F['meta']) > 4: err('final.meta: %d lines, the renderer shows 4 (copy.final.extraMeta adds to ESPN\'s date, venue and record)' % len(F['meta']))
    for m in F['meta']: chk(m, 60, 'final.meta')
    for t in F['teams']: chk(t['name'], 30, 'final.teams.name'); chk(t.get('rank'), 12, 'final.teams.rank', False)
    # heads of every section (kicker 60, title 120, dek 400)
    for key in ('columns', 'coverage', 'damage', 'scoring', 'box', 'flow', 'quotes'):
        if key in issue: chk(issue[key].get('kicker'), 60, key + '.kicker', False); chk(issue[key].get('title'), 120, key + '.title'); chk(issue[key].get('dek'), 400, key + '.dek', False)
    for key in ('columns', 'coverage'):
        P = issue.get(key)
        if not P: continue
        if len(P['items']) > 12: err('%s: %d items, the renderer shows 12' % (key, len(P['items'])))
        for n, it in enumerate(P['items']):
            w = '%s.items[%d]' % (key, n); chk(it.get('title'), 200, w + '.title'); chk(it.get('dek'), 400, w + '.dek', False); chk(it.get('rubric'), 40, w + '.rubric', False); chk(it.get('author'), 60, w + '.author', False); chk(it.get('read'), 30, w + '.read', False)
            if it.get('url'): url(it['url'], w + '.url', True)
    D = issue['damage']; chk(D['source'], 240, 'damage.source')
    if 'yards' in D:
        chk(D['yards']['label'], 40, 'damage.yards.label')
        for r in D['yards']['rows']:
            chk(r['name'], 30, 'damage.yards.name')
            if r['value'] < 0: err('damage.yards: negative total yards')
    if not D['stats']: warn('no damage tiles could be computed')
    if len(D['stats']) > 8: err('damage.stats: more than 8 tiles')
    for s in D['stats']: chk(s['value'], 12, 'stat value'); chk(s['label'], 60, 'stat label'); chk(s['detail'], 80, 'stat detail')
    Sc = issue['scoring']
    if len(Sc['cols']) > 6: err('scoring.cols: too many periods for the table')
    for r in Sc['rows']:
        chk(r['team'], 30, 'scoring.rows.team'); chk(r.get('rank'), 8, 'scoring.rows.rank', False)
        if len(r['q']) != len(Sc['cols']) - 1: err('scoring.rows: %s has %d period scores for %d columns' % (r['team'], len(r['q']), len(Sc['cols']) - 1))
    for c_ in Sc['cols']: chk(c_, 4, 'scoring.cols')
    for p in Sc['plays']: chk(p['when'], 16, 'scoring.plays.when'); chk(p['play'], 140, 'scoring.plays.play'); chk(p['score'], 20, 'scoring.plays.score')
    chk(Sc['source'], 240, 'scoring.source')
    B = issue['box']; chk(B['source'], 240, 'box.source')
    if len(B['rows']) > 14: err('box.rows: more than 14')
    if not B['rows']: err('box.rows: ESPN gave no team stats')
    for c_ in B['cols']: chk(c_, 20, 'box.cols')
    for r in B['rows']:
        for x in r: chk(x, 30, 'box row "%s"' % r[0])
    for t in B['leaders']:
        chk(t['team'], 20, 'box.leaders.team')
        if len(t['items']) > 8: err('box.leaders: more than 8 lines')
        for i in t['items']: chk(i[0], 20, 'leader label'); chk(i[1], 160, 'leader')
    if 'flow' in issue:
        Fl = issue['flow']; chk(Fl['summary'], 600, 'flow.summary'); chk(Fl['source'], 200, 'flow.source')
        if len(Fl['marks']) > 6: err('flow.marks: more than 6')
        for m in Fl['marks']:
            chk(m['title'], 20, 'mark title'); chk(m['note'], 160, 'mark note')
            if not (0 <= m['i'] < len(Fl['points'])): err('flow.marks: index %d is off the chart' % m['i'])
        if len(Fl['quarters']) != len(Fl['quarterStarts']): err('flow: quarters and quarterStarts differ in length')
        if not all(isinstance(v, (int, float)) and 0 <= v <= 100 for v in Fl['points']): err('flow.points: every point must be a number from 0 to 100 (the renderer drops the whole chart otherwise)')
    if 'quotes' in issue:
        if len(issue['quotes']['items']) > 6: err('quotes: %d quotes, the renderer shows 6' % len(issue['quotes']['items']))
        for n, qi in enumerate(issue['quotes']['items']):
            w = 'quotes.items[%d]' % n; chk(qi.get('text'), 400, w + '.text'); chk(qi.get('who'), 60, w + '.who'); chk(qi.get('role'), 120, w + '.role', False)
            if qi.get('url'): url(qi['url'], w + '.url')
            if qi.get('url') and not qi.get('link'): warn(w + ': url without link text, so no link shows')
        warn('quotes are published exactly as written in the copy file: each must be verbatim from a transcript or recording')
    if 'next' not in issue: err('next.title is required (copy.next): the email signup lives in that section')
    else:
        N = issue['next']; chk(N.get('kicker'), 40, 'next.kicker', False); chk(N.get('title'), 120, 'next.title'); chk(N.get('note'), 300, 'next.note', False)
        if len(N.get('meta', [])) > 6: err('next.meta: more than 6 lines')
        for m in N.get('meta', []): chk(m, 60, 'next.meta')
        if N.get('pickem'):
            P = N['pickem']; chk(P.get('badge'), 40, 'next.pickem.badge'); chk(P.get('title'), 60, 'next.pickem.title'); chk(P.get('text'), 300, 'next.pickem.text')
    R = issue['reference']; chk(R['label'], 40, 'reference.label'); chk(R['top'], 40, 'reference.top')
    if len(R['links']) > 6: err('reference.links: %d links, the footer shows 6' % len(R['links']))
    for n, l in enumerate(R['links']): chk(l.get('label'), 40, 'reference.links[%d].label' % n); url(l.get('url'), 'reference.links[%d].url' % n)
    Cr = issue['credits']; chk(Cr['label'], 30, 'credits.label')
    if len(Cr['other']) > 4: err('credits.other: more than 4 lines')
    for t in Cr['other']: chk(t, 80, 'credits.other')
    chk(issue['asOf'], 240, 'asOf')
    # images: every id used once across cover, columns and coverage; alt <= 200, credit <= 120
    ids = []
    def img(x, w):
        if not x: return
        ids.append((x['id'], w)); chk(x['alt'], 200, w + '.alt'); chk(x['credit'], 120, w + '.credit')
    img(C.get('image'), 'cover.image')
    for key in ('columns', 'coverage'):
        for n, it in enumerate((issue.get(key) or {}).get('items', [])): img(it.get('image'), '%s.items[%d].image' % (key, n))
    seen = {}
    for i, w in ids:
        if i in seen: err('photo %s is used twice (%s and %s): never use a photo id twice' % (i, seen[i], w))
        seen[i] = w
    # one canonical article URL, one primary home
    urls = {}
    for w, u in [('cover.url', C.get('url'))] + [('%s.items[%d].url' % (k, n), it.get('url')) for k in ('columns', 'coverage') for n, it in enumerate((issue.get(k) or {}).get('items', []))]:
        s = safe_url(u).split('#')[0].rstrip('/')
        if s in urls: err('%s repeats %s (one canonical article URL, one primary editorial home)' % (w, urls[s]))
        elif s: urls[s] = w
    if not issue.get('columns') and not issue.get('coverage'): warn('no columns and no coverage rows: the issue has only the cover and the ESPN sections')
    # house style
    txt = json.dumps(issue, ensure_ascii=False)
    if re.search(r'gator\s*-?\s*country', txt, re.I): err('house style: "Gator Country" must never appear')
    for m in re.finditer(r'[\u2014\u2013\u2018\u2019\u201c\u201d]', txt): err('house style: no em dashes, en dashes or curly quotes (found %r near "%s")' % (m.group(0), txt[max(0, m.start() - 30):m.end() + 20])); break
    for m in re.finditer(r'\b(?:January|February|March|April|August|September|October|November|December)\s+\d|\b(?:Nov|Sept|Sep|Oct|Dec|Aug|Jan|Feb)\s+\d', txt): warn('AP style: abbreviate the month with a period, e.g. "Nov. 27" (found "%s")' % m.group(0))
    for m in re.finditer(r'\b\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm|A\.M\.|P\.M\.)(?![\w.])', txt): warn('AP style: times read "3:30 p.m." (found "%s")' % m.group(0))
    if '  ' in txt: warn('double spaces in the issue text')
    return txt


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--copy', required=True, help='the hand-written copy file (see copy.example.json)')
    ap.add_argument('--file', help='a saved ESPN summary JSON instead of fetching (tests)')
    ap.add_argument('--event', default=DEFAULT_EVENT)
    ap.add_argument('--out', default=str(DEFAULT_OUT))
    ap.add_argument('--allow-live', action='store_true', help='build from a game that is not Final (test only)')
    ap.add_argument('--dry-run', action='store_true', help='compute and validate; write nothing')
    a = ap.parse_args()
    a.copy_hash = hashlib.sha256(pathlib.Path(a.copy).read_bytes()).hexdigest()[:12]
    d, src = load_summary(a)
    real = str(d['header'].get('id') or a.event)
    if real != a.event and not a.file: warn('ESPN returned event %s for the requested %s' % (real, a.event))
    a.event = real  # a saved --file may be a different game: every printed id comes from the data itself
    counts = [0]
    copy = straighten(load_copy(a.copy), counts)
    if counts[0]: print('copy: straightened %d curly quote characters' % counts[0])
    if ERRORS:
        print('%d problem%s in the copy file; nothing was built:' % (len(ERRORS), '' if len(ERRORS) == 1 else 's'))
        for e in ERRORS: print('  ERROR:', e)
        sys.exit(2)
    issue, info = build(d, copy, a, src)
    issue = straighten(issue, counts)  # ESPN text too
    txt = validate(issue, copy)
    for w in WARNINGS: print('WARNING:', w)
    if ERRORS:
        print('\n%d problem%s; nothing was written:' % (len(ERRORS), '' if len(ERRORS) == 1 else 's'))
        for e in ERRORS: print('  ERROR:', e)
        sys.exit(2)
    compact = len(json.dumps({k: v for k, v in issue.items() if k != '$comment'}, ensure_ascii=False, separators=(',', ':')).encode())  # what the bundle carries
    est = BUNDLE_BASE + compact
    if est > BUNDLE_CAP - 400: print('WARNING: the bundle will be about %d bytes against the %d-byte postgame cap (%+d): trim copy (fewer rows, shorter dek or quotes) before building' % (est, BUNDLE_CAP, est - BUNDLE_CAP))
    out = pathlib.Path(a.out)
    if not a.dry_run: out.write_text(json.dumps(issue, ensure_ascii=False, indent=1) + '\n')
    fl = issue.get('flow'); i = info['info']
    print('%s %s | %d chars | %s %d, %s %d (%s) | %d scoring plays, lead changes %d, ties %d%s' % ('would write' if a.dry_run else 'wrote', out if a.dry_run else (out.relative_to(REPO) if REPO in out.parents else out), len(txt), info['US_N'], info['FS'], info['OP_N'], info['OS'],
          'Final' if info['final'] else 'NOT FINAL', len(info['plays']), info['changes'], info['ties'], ' | wp points %d, quarter starts %s, start %d%% half %d%% low %d%% (Q%d) end %d%%' % (len(fl['points']), fl['quarterStarts'], i['start'], i['half'], i['lo'][0], i['lo'][1], i['end']) if fl else ''))
    if fl:
        for m in fl['marks']: print('  mark', m['i'], m['title'], '|', m['note'])
    for p in issue['scoring']['plays']: print('  ', p['when'], '|', p['play'], '|', p['score'])
    for s in issue['damage']['stats']: print('  stat', s['value'], '|', s['label'], '|', s['detail'])
    print('  damage:', issue['damage']['title'], '|', issue['damage']['dek']);
    if fl: print('  flow:', fl['dek'])
    print('  record line:', info['rec_line'])
    for t in issue['box']['leaders']:
        for it in t['items']: print('  leader', t['team'], '|', it[0], '|', it[1])
    print('  sections:', ', '.join(x['id'] for x in issue['contents']['items']))
    print('  bundle estimate: ~%d bytes of the %d cap (issue JSON %d bytes; headroom about %d)' % (est, BUNDLE_CAP, compact, BUNDLE_CAP - est))


if __name__ == '__main__':
    main()
