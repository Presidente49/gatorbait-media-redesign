#!/usr/bin/env python3
"""Rivalry Week edition (Florida at Florida State, Nov. 27, 2026) in the Swamp Night layout.

Same sections and classes as pregame-20261107.html. Stories and photos come from the current
magazine issue JSON; game facts, the line, the poll and recent meetings are read from ESPN at build time.
Usage: python3 -I magazine/swamp-night/build_rivalry.py   (writes rivalry-20261127.html next to it)
"""
import json, html, os, sys, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SITE = 'https://www.gatorbaitmedia.com'
E = lambda s: html.escape(str(s), quote=True)
def get(u):
    return json.load(urllib.request.urlopen(u, timeout=40))
API = 'https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/'
EVENT = '401856759'
HEAD = {'Buddy Martin': 'ae876a_524038122b9144399b4daa9234e505d4~mv2.jpg', 'Franz Beard': '1bf8c6_1c70982db21a41c0981d3a717922999d%7Emv2.jpg'}
SHORT = {
 'baugh-control': 'Baugh Control: the comeback', 'fortune-cookie': 'The Gator fortune cookie', 'no-logic': 'No logic, no reason',
 'say-thanks': 'Time to say thanks', 'area-evaluations': 'Area Evaluations', 'best-shots': 'Best shots: 126 photos',
 'train-wreck': 'Sumrall after the comeback', 'flag-day': 'Flag Day in The Swamp', 'live-updates': 'Quarter by quarter', 'vb3': 'The receiving room'}
def short(url, title):
    for k, v in SHORT.items():
        if k in url: return v
    return title

d = json.load(open(os.path.join(ROOT, 'sports-live/magazine-issue-vanderbilt-postgame.json')))
cover = d['cover']
stories = [dict(rubric='The game story', author='GatorBait Staff', title=cover['headline'], dek=cover['dek'], url=cover['url'], image=cover['image'])]
stories += d['columns']['items'] + d['coverage']['items']
assert len(stories) == 10 and len({s['image']['id'] for s in stories}) == 10
N = len(stories)

# --- ESPN ---
m = get(API + 'summary?event=' + EVENT)
comp = m['header']['competitions'][0]
assert comp['status']['type']['state'] == 'pre', 'game is no longer pregame'
rec = {}
for t in comp['competitors']:
    r = {x['type']: x['summary'] for x in t['record']}
    rec[t['team']['id']] = (r['total'], r['vsconf'], t.get('rank'))
(fl_all, fl_conf, fl_rank), (fs_all, fs_conf, _) = rec['57'], rec['52']
pc = m['pickcenter'][0]
line, total = pc['details'], pc['overUnder']
pred = m['predictor']
p_fl = pred['awayTeam']['gameProjection'] if pred['awayTeam']['id'] == '57' else pred['homeTeam']['gameProjection']
p_fs = pred['homeTeam']['gameProjection'] if pred['homeTeam']['id'] == '52' else pred['awayTeam']['gameProjection']
rk = get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings')
poll = next((p for p in rk['rankings'] if 'playoff' in p['name'].lower()), None) or next(p for p in rk['rankings'] if 'ap' in p['name'].lower())
top = [(r['current'], r['team'].get('location') or r['team']['nickname']) for r in poll['ranks'][:4]]
fl_poll = next((r['current'] for r in poll['ranks'] if r['team']['id'] == '57'), None)
poll_name = 'CFP Top 25' if 'playoff' in poll['name'].lower() else 'AP Top 25'
import datetime
_pd = datetime.date.fromisoformat(poll.get('date', '')[:10])
poll_date = _pd.strftime('%b').upper() + '. %d, %d' % (_pd.day, _pd.year)
meet = []
for yr in range(2025, 2020, -1):
    s = get(API + 'teams/57/schedule?season=%d' % yr)
    for e in s['events']:
        c = e['competitions'][0]
        ids = {x['team']['id']: x for x in c['competitors']}
        if '52' in ids and c['status']['type']['completed']:
            f, t = ids['57'], ids['52']
            fs_, ts_ = int(float(f['score']['value'])), int(float(t['score']['value']))
            where = 'Gainesville' if f['homeAway'] == 'home' else 'Tallahassee'
            meet.append((yr, where, 'Florida %d, Florida State %d' % (fs_, ts_) if fs_ > ts_ else 'Florida State %d, Florida %d' % (ts_, fs_), fs_ > ts_))
assert len(meet) >= 4, meet
fl_w = sum(1 for x in meet if x[3]); fs_w = len(meet) - fl_w
print('ESPN:', fl_all, fl_conf, fl_rank, '|', fs_all, fs_conf, '|', line, total, p_fl, p_fs, '|', poll['name'], poll_date, top, fl_poll, '|', meet, file=sys.stderr)

def img(s, cls=''):
    i = s['image']
    return 'https://static.wixstatic.com/media/%s~mv2.%s' % (i['id'], i['ext'])
def byline(a):
    ph = '<img class="writer-photo" src="https://static.wixstatic.com/media/%s" alt="%s" width="56" height="56" loading="eager">' % (HEAD[a], E(a)) if a in HEAD else ''
    lab = 'The newsroom' if a == 'GatorBait Staff' else ('Photos by' if a == 'Chris Spears' else 'By')
    return '<div class="byline">%s<div><span class="eyebrow">%s</span><strong>%s</strong></div></div>' % (ph, lab, E(a))
def link(s): return SITE + s['url']
arrow = '<span aria-hidden="true">↗</span>'
rank_txt = ('No. %s ' % fl_poll) if fl_poll else ''  # same poll as the snapshot (ESPN's game header can lag a week)
DATE = 'Friday, November 27, 2026'

toc = ''
for n, s in enumerate(stories, 1):
    a = s['author']
    w = ('<small class="toc-writer"><img src="https://static.wixstatic.com/media/%s" alt="" width="32" height="32" decoding="async">%s</small>' % (HEAD[a], E(a))) if a in HEAD else '<small>%s</small>' % E(a)
    toc += '<li><a href="%s"><span>%02d</span><div>%s%s</div><b aria-hidden="true">↗</b></a></li>' % (link(s), n, E(short(s['url'], s['title'])), w)

writers = ''
for a, key in (('Buddy Martin', 'fortune-cookie'), ('Franz Beard', 'no-logic'), ('Eddie Gilley', 'area-evaluations'), ('Chris Spears', 'best-shots')):
    s = next(x for x in stories if key in x['url'])
    ph = '<img src="https://static.wixstatic.com/media/%s" alt="%s" width="96" height="96" decoding="async">' % (HEAD[a], E(a)) if a in HEAD else ''
    writers += '<a class="writer-widget" href="%s">%s<span><small>IN THIS ISSUE</small><strong>%s</strong><em>%s ↗</em></span></a>' % (link(s), ph, E(a), 'See the photos' if a == 'Chris Spears' else 'Read the story')

hero, buddy, franz = stories[0], stories[1], stories[2]
cards = ''
for n, s in enumerate(stories, 1):
    if s in (hero, buddy, franz): continue
    i = s['image']
    cards += ('<article class="week-card" data-story-number="%d" id="story-%d"><a class="card-photo" href="%s"><img class="" src="%s" alt="%s" width="%s" height="%s" loading="eager" decoding="async"><span class="photo-credit">Nov. 21, 2026 · %s</span></a>'
              '<div class="card-copy"><p class="eyebrow">%s</p><h3><a href="%s">%s</a></h3>%s<p>%s</p><a class="text-link" href="%s">%s%s</a></div></article>') % (
        n, n, link(s), img(s), E(i['alt']), i['width'], i['height'], E(i['credit'].replace('Photo by ', '').rstrip('.')), E(s['rubric']), link(s), E(s['title']), byline(s['author']), E(s['dek']), link(s), 'See the gallery' if 'best-shots' in s['url'] else 'Read the story', arrow)

polls = ''.join('<li><b>%02d</b><span>%s</span></li>' % (r, E(nm)) for r, nm in top)
if fl_poll: polls += '<li class="florida-rank" value="%d"><b>%02d</b><span>Florida</span><strong>GATORS</strong></li>' % (fl_poll, fl_poll)
past = ''.join('<div class="past-game"><span>%d · %s</span><strong>%s</strong></div>' % (y, w, E(r)) for y, w, r, _ in meet)
nx = d['next']['pickem']
gs, rc, rv = link(hero), link(next(x for x in stories if 'vb3' in x['url'])), link(next(x for x in stories if 'train-wreck' in x['url']))
hi = hero['image']

out = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rivalry Week — Florida at Florida State | GatorBait Magazine</title><meta name="description" content="The November 27, 2026 GatorBait Magazine rivalry week edition. %(N)d stories from the win over Vanderbilt and the Florida–Florida State game guide."><link rel="stylesheet" href="swamp-night.css"></head>
<body><a class="skip" href="#contents">Skip to issue contents</a><div id="swamp-night">
<div class="edition-strip"><div><b>RIVALRY WEEK EDITION</b><span>%(DATE)s</span><span class="strip-note">Kickoff 3:30 p.m. ET · ABC</span></div></div>
<header class="masthead wrap" id="top"><a class="wordmark" href="https://www.gatorbaitmedia.com/" aria-label="GatorBait Media home"><span class="gator">GATOR</span><span class="bait">BAIT</span><small>MAGAZINE</small></a><div class="issue-meta"><p class="eyebrow">Tallahassee · Rivalry week</p><p>Florida at Florida State</p><span>%(N)d stories · November 27, 2026</span></div></header>
<nav class="issue-nav wrap" aria-label="Magazine sections"><a href="#contents">In this issue</a><a href="#poll-snapshot">Poll snapshot</a><a href="#issue-writers">Writers</a><a href="#the-game">The game</a><a href="#the-column">Franz Beard</a><a href="#more-week">More from the week</a></nav>
<main class="wrap">
<section class="hero" aria-labelledby="hero-title"><div class="hero-image"><img src="%(himg)s" width="%(hw)s" height="%(hh)s" alt="%(halt)s" decoding="async"><span class="hero-caption">Florida 34, Vanderbilt 27 · Nov. 21, 2026 · %(hcred)s</span></div><div class="hero-story"><div class="hero-heading"><p class="eyebrow">Last time out</p><h1 id="hero-title">%(htitle)s</h1></div><div class="hero-summary">%(hby)s<p>%(hdek)s</p><a class="button" href="%(gs)s">Read the game story%(arrow)s</a></div></div></section>
<section class="issue-widgets" id="issue-desk" aria-label="Issue tools"><div class="issue-widget-grid"><article class="poll-widget" id="poll-snapshot" data-widget="poll" aria-labelledby="poll-title"><p class="eyebrow">The issue’s poll snapshot</p><h2 id="poll-title">%(poll_name)s</h2><p class="widget-date">%(poll_date)s · PER ESPN</p><ol class="poll-ladder">%(polls)s</ol><p class="source-note">Rankings as listed by ESPN when this edition was built.</p></article><article class="poll-widget" data-widget="milestone"><p class="eyebrow">%(nxb)s</p><h2>%(nxt)s</h2><p>%(nxx)s</p><a class="text-link" href="%(gs)s">The game story ↗</a></article></div></section><section class="contents widget-contents" id="contents" tabindex="-1"><header class="section-heading" id="contents-heading"><p class="eyebrow">%(N)d stories</p><h2>In this issue</h2><span class="widget-chip">%(N)d STORIES</span></header><ol>%(toc)s</ol></section><section class="writer-widgets" id="issue-writers" aria-labelledby="writers-title"><header class="section-heading"><p class="eyebrow">The voices of GatorBait</p><h2 id="writers-title">Meet your writers</h2></header><div class="writer-widget-grid">%(writers)s</div></section>
<div class="lead-row compact-lead"><section class="lead-story" aria-labelledby="lead-title"><p class="eyebrow">Buddy Martin</p><h2 id="lead-title">%(btitle)s</h2>%(bby)s<p>%(bdek)s</p><a class="text-link" href="%(burl)s">Read Buddy’s column%(arrow)s</a></section></div>
<section class="game-grid" id="the-game" aria-label="The game and series"><article class="game-card"><p class="eyebrow">The game</p><h2><span>FLORIDA</span><em>at</em><span>FLORIDA STATE</span></h2><div class="game-records"><div><b>%(rank)sFlorida</b><span>%(fl_all)s overall · %(fl_conf)s SEC</span></div><div><b>Florida State</b><span>%(fs_all)s overall · %(fs_conf)s ACC</span></div></div><dl><div><dt>When</dt><dd>Nov. 27, 2026 · 3:30 p.m. ET</dd></div><div><dt>Where</dt><dd>Doak Campbell Stadium<br>Tallahassee, Florida</dd></div><div><dt>Watch</dt><dd>ABC</dd></div><div><dt>The line</dt><dd>%(line)s · Total %(total)s<br>Per ESPN</dd></div></dl><p class="source-note">Records, line and total per ESPN when this edition was built.</p><a class="text-link" href="https://www.espn.com/college-football/game/_/gameId/%(EVENT)s">ESPN game page%(arrow)s</a></article><article class="series-card"><p class="eyebrow">The last %(nm)d meetings</p><div class="series-score">%(fl_w)d<span>—</span>%(fs_w)d</div><h2>The regular season<br>ends in Tallahassee.</h2><p>Florida’s record against Florida State<br>in the last %(nm)d meetings.</p>%(past)s<p class="source-note">Results per ESPN.</p></article></section>
<section class="tape"><header class="section-heading" id="tape"><p class="eyebrow">Pregame at a glance</p><h2>Tale of the tape</h2></header><div class="tape-head"><b>FLORIDA</b><span>Entering Nov. 27</span><b>FLORIDA STATE</b></div><div class="tape-row"><strong>%(fl_all)s</strong><span>Overall record</span><strong>%(fs_all)s</strong></div><div class="tape-row"><strong>%(fl_conf)s</strong><span>Conference record</span><strong>%(fs_conf)s</strong></div><div class="tape-row"><strong>%(p_fl)s%%</strong><span>ESPN matchup predictor</span><strong>%(p_fs)s%%</strong></div></section>
<section class="keys-section"><header class="section-heading" id="keys"><p class="eyebrow">The matchup</p><h2>What to watch</h2></header><div class="keys-grid"><a href="%(gs)s" class="key"><span class="key-number">01</span><h3>%(nxt)s</h3><p>%(nxx)s</p><b>The game story ↗</b></a><a href="%(rc)s" class="key"><span class="key-number">02</span><h3>The receiving room</h3><p>%(rcdek)s</p><b>The receivers ↗</b></a><a href="%(rv)s" class="key"><span class="key-number">03</span><h3>Cleaning it up</h3><p>%(rvdek)s</p><b>The reaction ↗</b></a></div></section>
<article class="column" id="the-column"><div class="column-heading"><p class="eyebrow">Franz Beard</p><h2>%(ftitle)s</h2>%(fby)s</div><div class="column-reading"><div class="column-rule"></div><p>%(fdek)s</p><a class="button" href="%(furl)s">Read the full column%(arrow)s</a></div></article>
<section class="more-week" aria-labelledby="more-week-title"><header class="section-heading" id="more-week"><p class="eyebrow">Around Gator Nation</p><h2 id="more-week-title">More from this week</h2></header><div class="week-grid">%(cards)s</div></section>
<aside class="publisher-box"><div><p class="eyebrow">GatorBait Media</p><h2>Independent Florida coverage.</h2><p>Every story in this edition is on GatorBaitMedia.com.</p></div><a class="button" href="https://www.gatorbaitmedia.com/magazine">Open the magazine%(arrow)s</a></aside>
</main><footer class="wrap"><a href="https://www.gatorbaitmedia.com/">GatorBait Media</a><p>Florida at Florida State · November 27, 2026 · Rivalry week edition</p><a href="#top">Back to the top ↑</a></footer></div><script src="image-readiness.js" defer></script></body></html>
''' % dict(N=N, DATE=DATE, himg=img(hero), hw=hi['width'], hh=hi['height'], halt=E(hi['alt']), hcred=E(hi['credit']), htitle=E(hero['title']), hby=byline('GatorBait Staff'), hdek=E(hero['dek']), gs=gs, arrow=arrow,
  poll_name=poll_name, poll_date=E(poll_date), polls=polls, nxb=E(nx['badge']), nxt=E(nx['title']), nxx=E(nx['text']), toc=toc, writers=writers,
  btitle=E(buddy['title']), bby=byline('Buddy Martin'), bdek=E(buddy['dek']), burl=link(buddy), rank=rank_txt, fl_all=fl_all, fl_conf=fl_conf, fs_all=fs_all, fs_conf=fs_conf,
  line=E(line), total=total, EVENT=EVENT, nm=len(meet), fl_w=fl_w, fs_w=fs_w, past=past, p_fl=p_fl, p_fs=p_fs, rc=rc, rv=rv,
  rcdek=E(next(x for x in stories if 'vb3' in x['url'])['dek']), rvdek=E(next(x for x in stories if 'train-wreck' in x['url'])['dek']),
  ftitle=E(franz['title']), fby=byline('Franz Beard'), fdek=E(franz['dek']), furl=link(franz), cards=cards)
open(os.path.join(HERE, 'rivalry-20261127.html'), 'w').write(out)
print('wrote', len(out), 'chars', file=sys.stderr)
