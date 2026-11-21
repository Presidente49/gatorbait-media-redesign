#!/usr/bin/env python3
"""Game day edition of the Vanderbilt magazine (owner direction, Nov. 21, 2026, during the game: "making the magazine like a game day
magazine... a living, breathing, organic thing", then "do it").

build_issue.py reads ESPN's pregame data and stops on anything unexpected, so it is not run while the game is on. This script takes
the issue it wrote (sports-live/magazine-issue-vanderbilt.json) and turns it into the game day edition without touching a number:
  - cover: a photo from today's game by Chris Spears, linked straight to the live updates post
  - shots: a photo mosaic of his pictures right under the jump strip (shots.top), also linked to the live updates
  - one text card for the live updates post at the top of the story cards
Everything else (Franz Beard's column, the writers' pieces, the staff stories, schedules, rosters, the availability report) is unchanged.
The live score needs nothing here: the layout already reads ESPN's scoreboard for this event from 30 minutes before kickoff.
Photos: sent by the owner on Nov. 21 as Chris Spears' pictures from today's game. No player is named (jersey numbers only): the
current-game art rule wants the photographer's or the owner's identification, and neither has given names.
Run from the repo root, then MAG_VARIANT=vanderbilt node sports-live/build-magazine.mjs. Idempotent. Never sends mail, never writes to Wix."""
import json, pathlib, re
root = pathlib.Path(__file__).resolve().parents[3]
f = root / 'sports-live/magazine-issue-vanderbilt.json'
d = json.loads(f.read_text(encoding='utf-8'))
LIVE = '/post/live-updates-vanderbilt-at-no-24-florida'
CREDIT = 'Photo by Chris Spears, GatorBait Media.'
def pic(i, w, h, alt, cap=None):
    p = {'id': i, 'ext': 'jpg', 'width': w, 'height': h, 'alt': alt, 'credit': CREDIT}
    if cap: p['caption'] = cap
    return p
d['issue']['number'] = 'Vanderbilt Game Day'
d['issue']['pageTitle'] = 'GatorBait Magazine | Game Day: Vanderbilt at Florida | Nov. 21, 2026'
d['cover'] = {'kicker': 'Game day · Live from the Swamp', 'headline': 'Vanderbilt at Florida',
  'dek': "The live score, Chris Spears' photos from the sideline, updates after every quarter, and the pregame reads from Franz Beard, Loren Meadows, Eddie Gilley and Buddy Martin.",
  'byline': 'By GatorBait Staff · Photos by Chris Spears', 'url': LIVE, 'directLink': True, 'cta': 'Live updates',
  'image': pic('d3cfa5_a1369c76e7d548a5bb876f0db6aa4964', 1024, 684, 'A Florida player in a blue No. 16 jersey jumps with both arms raised near the goal line at Ben Hill Griffin Stadium on Nov. 21, 2026.')}
d['shots'] = {'label': 'Game day in photos', 'note': "Chris Spears' pictures from the Swamp. Tap a photo for the live updates.", 'jump': 'Photos', 'top': True, 'url': LIVE,
  'credit': 'Photos by Chris Spears, GatorBait Media.', 'photos': [
    pic('d3cfa5_6493cd82f7644858a7e27bc3b2d7ff34', 1024, 678, 'A Florida player in a blue No. 20 jersey, holding the ball, leaps over Vanderbilt defenders who are on the ground.', 'A Florida ball carrier leaps over Vanderbilt defenders.'),
    pic('d3cfa5_44f25c74ac5d4d889e0d38ecb35554ad', 1024, 648, 'Florida defenders in blue stand near a pile of Vanderbilt players at the line of scrimmage while one Florida player points a finger in the air.', "Florida's defense at the line of scrimmage."),
    pic('d3cfa5_1a44d3d034b54dda9c5e95423cad0585', 1620, 1080, 'A Florida player in a blue No. 12 jersey runs with the ball as a Vanderbilt defender in a white No. 24 jersey dives at him.', "Florida's No. 12 runs as a Vanderbilt defender dives at him."),
    pic('d3cfa5_ca8d11d57ffb4666bae9fbf448c89b79', 1112, 704, 'A Florida player in a blue No. 6 jersey runs with the ball past Vanderbilt defenders in white while an official looks on.', 'A Florida ball carrier runs past Vanderbilt defenders.'),
    pic('d3cfa5_0e90b67f0a844dbfa66be7bb2cda10d8', 1620, 1080, 'A Florida player in a blue No. 12 jersey carries the ball as a Vanderbilt defender dives at his feet, with the Swamp tunnel banner behind them.', "Florida's No. 12 on the run in the Swamp.")]}
cards = [c for c in d['cards']['items'] if c.get('url') != LIVE]
d['cards']['items'] = [{'kicker': 'GatorBait Staff · Live', 'date': 'Nov. 21', 'title': 'Live updates: Vanderbilt at No. 24 Florida', 'url': LIVE,
  'excerpt': 'Every score, quarter by quarter, with photos by Chris Spears. Updated through the game.'}] + cards
d['$comment'] = re.sub(r' Game day edition:.*$', '', d['$comment']) + ' Game day edition: cover, shots and one card added by deploy/magazine-2026/pregame-vanderbilt/gameday_patch.py during the game (Nov. 21).'
# guards (the renderer trims silently)
S = d['shots']; C = d['cover']
assert len(S['label']) <= 40 and len(S['note']) <= 120 and len(S['credit']) <= 120 and len(S['jump']) <= 30 and len(S['photos']) <= 8
for p in S['photos']: assert len(p['caption']) <= 80 and len(p['alt']) <= 200 and len(p['credit']) <= 160, p
assert len(C['dek']) <= 600 and len(C['image']['alt']) <= 200 and len(d['issue']['number']) <= 60 and len(d['issue']['pageTitle']) <= 120
for c in d['cards']['items']: assert len(c['kicker']) <= 80 and len(c['title']) <= 200 and len(c['excerpt']) <= 300
assert len(d['cards']['items']) <= 18
own = json.dumps([C['kicker'], C['headline'], C['dek'], C['byline'], S['label'], S['note'], S['credit'], [p['caption'] for p in S['photos']], d['cards']['items'][0]], ensure_ascii=False)
assert '\u2014' not in own and '—' not in own
assert not re.search(r'gator\s*-?\s*country', json.dumps(d), re.I)
ids = [C['image']['id'], d['lead']['image']['id']] + [p['id'] for p in S['photos']] + [x['image']['id'] for k in ('exclusives', 'features') for x in d[k]['items'] if x.get('image')] + [c['image']['id'] for c in d['cards']['items'] if c.get('image')]
assert len(ids) == len(set(ids)), 'every photo is a distinct file'
s = json.dumps(d, ensure_ascii=False, indent=1)
atom = r'(?:"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|null|true|false)'
out = re.sub(r'\[\n\s+((?:' + atom + r',\n\s+)*' + atom + r')\n\s+\]', lambda m: '[' + re.sub(r',\n\s+', ', ', m.group(1)) + ']', s)
assert json.loads(out) == d
f.write_text(out + '\n', encoding='utf-8')
print('game day edition written:', f, '| cover', C['image']['id'][:16], '| photos', len(S['photos']), '| cards', len(d['cards']['items']))
