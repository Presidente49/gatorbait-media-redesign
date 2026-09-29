#!/usr/bin/env python3
"""Schema check for sports-live/scoreboard.json. Refuses (exit 1) anything the front page can't read.

The front page reads exactly the contract in the README ("Scoreboard feed"). Unknown keys are errors on
purpose: a drifting feed should fail here, not silently on the site. Story links must be
https://www.gatorbaitmedia.com/... (never ESPN or SEC), or null.

Usage: python automation/validate_scoreboard.py [path]      (default sports-live/scoreboard.json)
"""
import datetime as dt, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT = ROOT / 'sports-live/scoreboard.json'
SITE = 'https://www.gatorbaitmedia.com/'
STATUSES = {'scheduled', 'in-progress', 'final', 'postponed', 'canceled'}
ISO = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$')
RECORD = re.compile(r'^\d+-\d+(-\d+)?$')


def _int(v):
    return isinstance(v, int) and not isinstance(v, bool)


class _V:
    def __init__(self):
        self.errors = []

    def err(self, path, msg):
        self.errors.append(f'{path}: {msg}')

    def obj(self, o, path, required, optional=()):
        if not isinstance(o, dict):
            self.err(path, 'must be an object')
            return False
        for k in required:
            if k not in o:
                self.err(path, f'missing "{k}"')
        for k in o:
            if k not in required and k not in optional:
                self.err(f'{path}.{k}', 'unknown key')
        return True

    def iso(self, v, path, nullable=False):
        if v is None and nullable:
            return
        if not (isinstance(v, str) and ISO.match(v)):
            self.err(path, f'must be an ISO UTC timestamp like 2026-09-26T19:30:00Z, got {v!r}')
            return
        try:
            dt.datetime.strptime(v, '%Y-%m-%dT%H:%M:%SZ')
        except ValueError:
            self.err(path, f'not a real date: {v!r}')

    def string(self, v, path, nullable=False):
        if v is None and nullable:
            return
        if not (isinstance(v, str) and v.strip()):
            self.err(path, f'must be a non-empty string{" or null" if nullable else ""}, got {v!r}')

    def intv(self, v, path, nullable=False, lo=0):
        if v is None and nullable:
            return
        if not _int(v) or v < lo:
            self.err(path, f'must be an integer >= {lo}{" or null" if nullable else ""}, got {v!r}')

    def boolean(self, v, path):
        if not isinstance(v, bool):
            self.err(path, f'must be true/false, got {v!r}')

    def rank(self, v, path):
        if v is not None and not (_int(v) and 1 <= v <= 25):
            self.err(path, f'must be 1-25 or null, got {v!r}')

    def record(self, v, path):
        if not (isinstance(v, str) and RECORD.match(v)):
            self.err(path, f'must look like 4-0, got {v!r}')

    def link(self, v, path):
        if v is None:
            return
        if not (isinstance(v, str) and v.startswith(SITE) and len(v) > len(SITE) and ' ' not in v):
            self.err(path, f'must be null or a {SITE}... link, got {v!r}')

    def pair(self, v, path, nullable=False):
        if v is None and nullable:
            return
        if self.obj(v, path, ('fla', 'opp')):
            self.intv(v.get('fla'), f'{path}.fla')
            self.intv(v.get('opp'), f'{path}.opp')

    def quarters(self, v, path):
        if v is None:
            return
        if self.obj(v, path, ('fla', 'opp')):
            for side in ('fla', 'opp'):
                a = v.get(side)
                if not (isinstance(a, list) and len(a) >= 4 and all(_int(x) and x >= 0 for x in a)):
                    self.err(f'{path}.{side}', f'must be a list of at least 4 non-negative integers, got {a!r}')
            if isinstance(v.get('fla'), list) and isinstance(v.get('opp'), list) and len(v['fla']) != len(v['opp']):
                self.err(path, 'fla and opp must have the same number of periods')


def validate(doc):
    v = _V()
    if not v.obj(doc, '$', ('updatedAt', 'season', 'team', 'last', 'next', 'schedule', 'standings', 'live')):
        return v.errors
    v.iso(doc.get('updatedAt'), 'updatedAt')
    v.intv(doc.get('season'), 'season', lo=2000)

    t = doc.get('team')
    if v.obj(t, 'team', ('name', 'rank', 'record', 'conf')):
        v.string(t.get('name'), 'team.name')
        v.rank(t.get('rank'), 'team.rank')
        v.record(t.get('record'), 'team.record')
        if t.get('conf') is not None:
            v.record(t.get('conf'), 'team.conf')

    last = doc.get('last')
    if last is not None and v.obj(last, 'last', ('eventId', 'opponent', 'opponentRank', 'home', 'date', 'status', 'score',
                                                  'quarters', 'venue', 'recapUrl', 'galleryUrl')):
        v.string(last.get('eventId'), 'last.eventId')
        v.string(last.get('opponent'), 'last.opponent')
        v.rank(last.get('opponentRank'), 'last.opponentRank')
        v.boolean(last.get('home'), 'last.home')
        v.iso(last.get('date'), 'last.date')
        if last.get('status') != 'final':
            v.err('last.status', 'must be "final"')
        v.pair(last.get('score'), 'last.score')
        v.quarters(last.get('quarters'), 'last.quarters')
        sc, q = last.get('score'), last.get('quarters')
        if isinstance(sc, dict) and isinstance(q, dict):
            for side in ('fla', 'opp'):
                if isinstance(q.get(side), list) and all(_int(x) for x in q[side]) and _int(sc.get(side)) and sum(q[side]) != sc[side]:
                    v.err('last.quarters', f'{side} quarters sum to {sum(q[side])} but score is {sc[side]}')
        v.string(last.get('venue'), 'last.venue', nullable=True)
        v.link(last.get('recapUrl'), 'last.recapUrl')
        v.link(last.get('galleryUrl'), 'last.galleryUrl')

    nxt = doc.get('next')
    if nxt is not None and v.obj(nxt, 'next', ('eventId', 'opponent', 'opponentRank', 'home', 'kickoffIso', 'tv', 'venue', 'previewUrl')):
        v.string(nxt.get('eventId'), 'next.eventId')
        v.string(nxt.get('opponent'), 'next.opponent')
        v.rank(nxt.get('opponentRank'), 'next.opponentRank')
        v.boolean(nxt.get('home'), 'next.home')
        v.iso(nxt.get('kickoffIso'), 'next.kickoffIso')
        v.string(nxt.get('tv'), 'next.tv', nullable=True)
        v.string(nxt.get('venue'), 'next.venue', nullable=True)
        v.link(nxt.get('previewUrl'), 'next.previewUrl')

    sched = doc.get('schedule')
    if not isinstance(sched, list) or not sched:
        v.err('schedule', 'must be a non-empty list')
    else:
        seen, prev_date = set(), ''
        for i, g in enumerate(sched):
            p = f'schedule[{i}]'
            if not v.obj(g, p, ('eventId', 'date', 'opponent', 'opponentRank', 'home', 'status', 'score', 'tv', 'storyUrl')):
                continue
            v.string(g.get('eventId'), f'{p}.eventId')
            if g.get('eventId') in seen:
                v.err(f'{p}.eventId', 'duplicate')
            seen.add(g.get('eventId'))
            v.iso(g.get('date'), f'{p}.date')
            if isinstance(g.get('date'), str) and g['date'] < prev_date:
                v.err(f'{p}.date', 'schedule must be in date order')
            prev_date = g.get('date') if isinstance(g.get('date'), str) else prev_date
            v.string(g.get('opponent'), f'{p}.opponent')
            v.rank(g.get('opponentRank'), f'{p}.opponentRank')
            v.boolean(g.get('home'), f'{p}.home')
            if g.get('status') not in STATUSES:
                v.err(f'{p}.status', f'must be one of {sorted(STATUSES)}, got {g.get("status")!r}')
            v.pair(g.get('score'), f'{p}.score', nullable=True)
            if g.get('status') == 'final' and g.get('score') is None:
                v.err(f'{p}.score', 'a final needs a score')
            v.string(g.get('tv'), f'{p}.tv', nullable=True)
            v.link(g.get('storyUrl'), f'{p}.storyUrl')

    st = doc.get('standings')
    if not isinstance(st, list):
        v.err('standings', 'must be a list')
    else:
        for i, r in enumerate(st):
            p = f'standings[{i}]'
            if v.obj(r, p, ('team', 'confRecord', 'overall')):
                v.string(r.get('team'), f'{p}.team')
                v.record(r.get('confRecord'), f'{p}.confRecord')
                v.record(r.get('overall'), f'{p}.overall')

    live = doc.get('live')
    if live is not None and v.obj(live, 'live', ('eventId', 'clock', 'period', 'score', 'possession', 'lastPlay')):
        v.string(live.get('eventId'), 'live.eventId')
        v.string(live.get('clock'), 'live.clock')
        v.intv(live.get('period'), 'live.period', lo=1)
        v.pair(live.get('score'), 'live.score')
        if live.get('possession') not in ('fla', 'opp', None):
            v.err('live.possession', 'must be "fla", "opp" or null')
        v.string(live.get('lastPlay'), 'live.lastPlay', nullable=True)

    # Cross-checks between blocks.
    if isinstance(sched, list):
        ids = {g.get('eventId'): g for g in sched if isinstance(g, dict)}
        for name, blk in (('last', last), ('next', nxt), ('live', live)):
            if isinstance(blk, dict) and blk.get('eventId') not in ids:
                v.err(f'{name}.eventId', 'not found in schedule')
    return v.errors


def load_and_validate(path):
    try:
        doc = json.loads(pathlib.Path(path).read_text())
    except (OSError, ValueError) as e:
        return [f'{path}: cannot read JSON: {e}']
    return validate(doc)


def main(argv):
    path = argv[0] if argv else DEFAULT
    errors = load_and_validate(path)
    if errors:
        print(f'scoreboard invalid ({len(errors)} problem{"s" if len(errors) != 1 else ""}):', file=sys.stderr)
        for e in errors:
            print('  ' + e, file=sys.stderr)
        return 1
    print(f'scoreboard ok: {path}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
