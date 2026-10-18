"""Build the permanent 2026 football resource from verified UF source snapshots.

Local staging only. Publication is owned by the controller. The existing article
canonical remains unchanged. Run from this directory or the repository root.
"""
from pathlib import Path
from html import escape
import json
from datetime import datetime
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
ROSTER = json.loads((ROOT / 'roster.json').read_text())
SCHEDULE = json.loads((ROOT / 'schedule.json').read_text())
URL = 'https://www.gatorbaitmedia.com/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play'
GROUPS = [('QB', 'Quarterbacks'), ('RB', 'Running backs'), ('WR', 'Wide receivers'), ('TE', 'Tight ends'), ('OL', 'Offensive line'), ('DL', 'Defensive line'), ('JACK', 'JACK'), ('ILB', 'Inside linebackers'), ('CB', 'Cornerbacks'), ('S', 'Safeties'), ('STAR', 'STAR'), ('K', 'Kickers'), ('P', 'Punters'), ('LS', 'Long snappers')]

def e(value):
    return escape(str(value), quote=True)

def link(label, url):
    return '<a href="' + e(url) + '">' + e(label) + '</a>'

import re
CHECKED = datetime.fromisoformat(SCHEDULE['checkedDate'])
CHECKED_LABEL = CHECKED.strftime('%B %-d, %Y').replace('September', 'Sept.').replace('October', 'Oct.').replace('November', 'Nov.')
GREEN, RED, ORANGE = '#1a7f3c', '#b3261e', '#c94400'
games = [g for g in SCHEDULE['games'] if g['date'] >= '2026-09-01']
assert len(games) == 12
finals = [g for g in games if g['result'] and g['result'].get('status') in ('W', 'L')]
wins = sum(g['result']['status'] == 'W' for g in finals)
sec = [g for g in finals if g['conference']]
sec_wins = sum(g['result']['status'] == 'W' for g in sec)
record = str(wins) + '–' + str(len(finals) - wins) + ' overall · ' + str(sec_wins) + '–' + str(len(sec) - sec_wins) + ' SEC'
nxt = next(g for g in games if g not in finals)

def strip_rank(title):
    return re.sub(r'^#\d+\s+', '', title)

def when(g):
    return datetime.fromisoformat(g['date'])

def short_date(d):
    return d.strftime('%b. %-d').replace('Sep.', 'Sept.')

def label(g):
    name = strip_rank(g['opponent']['title'])
    prefix = 'at ' if g['location_indicator'] == 'A' else 'vs. '
    if g['location_indicator'] == 'N':
        name += ' (' + g['location'].split(',')[0] + ')'
    return prefix + name

nd = when(nxt)
intro = '<p><strong>By Brenden Martin</strong></p>\n<p>Cover photo: Chris Spears / GatorBait Media.</p>\n'
intro += '<p><strong>2026 SEASON GUIDE · Updated ' + e(CHECKED_LABEL) + '</strong></p>\n'
intro += '<p>One place for Florida’s full football roster, results and the road ahead. Bookmark this guide; GatorBait’s football coverage links back here throughout the season.</p>\n'
intro += '<p><strong>' + e(record) + '</strong></p>\n<h2 id="schedule">2026 schedule &amp; results</h2>\n'
intro += '<p><strong><span data-color="' + ORANGE + '">NEXT:</span> ' + e(label(nxt)) + ' · ' + e(nd.strftime('%A, %b. %-d')) + ' · ' + e(nxt['time'].strip()) + ' ET · ' + e(nxt['media']['tv'].strip() or 'TV TBA') + '</strong></p>\n'
intro += '<p>All times Eastern. Open date: ' + e(', '.join(short_date(datetime.fromisoformat(b)) for b in SCHEDULE['byeDates'])) + '. Kickoff windows for later games are not final start times.</p>\n'

rows = []
for g in games:
    d = when(g)
    for b in SCHEDULE['byeDates']:
        bd = datetime.fromisoformat(b)
        if d > bd and not any(r[0] == bd for r in rows):
            rows.append((bd, '<tr data-bg="#eef0f3"><td>' + e(short_date(bd)) + '</td><td><em>Open date</em></td><td><em>No game</em></td></tr>'))
    r = g['result']
    if g in finals:
        color = GREEN if r['status'] == 'W' else RED
        details = '<strong><span data-color="' + color + '">' + r['status'] + '</span></strong> ' + e(r['team_score'] + '–' + r['opponent_score'])
        bg = ''
    else:
        details = e(g['time'].strip()) + ' ET · ' + e(g['media']['tv'].strip() or 'TV TBA')
        bg = ''
        if g is nxt:
            details = '<strong>NEXT</strong> · ' + details
            bg = ' data-bg="#fff0e3"'
    rows.append((d, '<tr' + bg + '><td>' + e(short_date(d)) + '</td><td>' + link(label(g), 'https://floridagators.com' + g['game_center_link']) + '</td><td>' + details + '</td></tr>'))
schedule = '<table><thead><tr><th>Date</th><th>Opponent</th><th>Result / kickoff</th></tr></thead><tbody>' + ''.join(r[1] for r in rows) + '</tbody></table>'
schedule += '<p>Home games are played in Gainesville. The Georgia game is at Mercedes-Benz Stadium in Atlanta.</p>'
schedule += '<p>Source: ' + link('Florida’s official 2026 football schedule', SCHEDULE['sourceUrl']) + '. Checked ' + e(CHECKED_LABEL) + '. Times and TV assignments may change.</p>'

roster = '<h2 id="roster">2026 player roster</h2><p>All 117 players listed on Florida’s official 2026 roster, organized by position. Tap a player’s name for the official bio. This is a roster, not a depth chart or an availability report. Some offensive and defensive players share jersey numbers.</p>'
for code, label in GROUPS:
    players = [p for p in ROSTER['players'] if p['positionShort'] == code]
    roster += '<h3>' + label + '</h3><table><thead><tr><th>No.</th><th>Player</th><th>Year</th></tr></thead><tbody>'
    for p in players:
        roster += '<tr><td>' + e(p['jerseyNumber']) + '</td><td>' + link(p['firstName'] + ' ' + p['lastName'], p['bioUrl']) + '</td><td>' + e(p['academicYearShort']) + '</td></tr>'
    roster += '</tbody></table>'
roster += '<p>Year abbreviations follow UF’s roster: Fr. = freshman; So. = sophomore; Jr. = junior; Sr. = senior; 5th, 6th and 7th = fifth, sixth and seventh year.</p>'
roster += '<p>Source: ' + link('Florida’s official 2026 football roster', ROSTER['sourceUrl']) + '. Names, numbers, positions and years checked ' + e(CHECKED_LABEL) + '.</p>'
roster += '<h2>Keep reading</h2><p>' + link('Latest GatorBait coverage', 'https://www.gatorbaitmedia.com/gatorbait-media-blogs') + ' · ' + link('GatorBait Magazine', 'https://www.gatorbaitmedia.com/magazine') + ' · ' + link('GatorBait TV', 'https://www.gatorbaitmedia.com/the-buddy-martin-show') + '</p>'

body = intro + schedule + roster
assert len(body) <= 30000, len(body)
(ROOT / 'resource-native.html').write_text(body)

# Direct Ricos authoring uses the confirmed Wix Node/TableData/TableCellData
# schemas. LINK decoration shape is also present in the existing native post
# deploy/writer-attributions/before/1c12e61d-0018-4089-896c-47ab5d470655.json.
# The read-only HTML conversion endpoint returned HTTP 403; no site write occurred.
serial = 0
def nid():
    global serial
    serial += 1
    return 'field-guide-' + str(serial)

def textnode(text, decorations):
    return {'type': 'TEXT', 'id': nid(), 'nodes': [], 'textData': {'text': text, 'decorations': decorations}}

def inlines(element, inherited=None):
    inherited = inherited or []
    decorations = list(inherited)
    if element.tag in ('strong', 'b'):
        decorations += [{'type': 'BOLD'}]
    if element.tag == 'span' and 'data-color' in element.attrib:
        decorations += [{'type': 'COLOR', 'colorData': {'foreground': element.attrib['data-color']}}]
    if element.tag == 'em':
        decorations += [{'type': 'ITALIC'}]
    if element.tag == 'a':
        decorations += [{'type': 'LINK', 'linkData': {'link': {'url': element.attrib['href'], 'target': 'BLANK', 'rel': {'noreferrer': True}}}}]
    result = []
    if element.text:
        result.append(textnode(element.text, decorations))
    for child in element:
        result.extend(inlines(child, decorations))
        if child.tail:
            result.append(textnode(child.tail, decorations))
    return result

def para(element, bold=False):
    return {'type': 'PARAGRAPH', 'id': nid(), 'nodes': inlines(element, [{'type': 'BOLD'}] if bold else []), 'paragraphData': {'textStyle': {'textAlignment': 'LEFT', 'lineHeight': '1.4'}}}

native = []
table_index = 0
for el in ET.fromstring('<root>' + body + '</root>'):
    if el.tag == 'p':
        native.append(para(el))
    elif el.tag in ('h2', 'h3'):
        native.append({'type': 'HEADING', 'id': el.attrib.get('id', nid()), 'nodes': inlines(el), 'headingData': {'level': int(el.tag[1]), 'textStyle': {'textAlignment': 'LEFT'}}})
    elif el.tag == 'table':
        rows = []
        for ri, row in enumerate(el.findall('.//tr')):
            cells = []
            for cell in row:
                background = '#e6edff' if ri == 0 else ('#f4f6fa' if ri % 2 == 0 else '#ffffff')
                if 'data-bg' in row.attrib:
                    background = row.attrib['data-bg']
                cells.append({'type': 'TABLE_CELL', 'id': nid(), 'nodes': [para(cell, cell.tag == 'th')], 'tableCellData': {'cellStyle': {'backgroundColor': background}, 'colspan': 1, 'rowspan': 1}})
            rows.append({'type': 'TABLE_ROW', 'id': nid(), 'nodes': cells})
        native.append({'type': 'TABLE', 'id': nid(), 'nodes': rows, 'tableData': {'containerData': {'width': {'size': 'CONTENT'}, 'alignment': 'CENTER'}, 'dimensions': {'colsWidthRatio': [20, 36, 44] if table_index == 0 else [15, 60, 25], 'colsMinWidth': [64, 90, 125] if table_index == 0 else [40, 140, 55]}, 'rowHeader': True, 'columnHeader': False, 'cellSpacing': 0, 'cellPadding': [10, 8, 10, 8], 'altText': '2026 Florida football schedule and results' if table_index == 0 else '2026 Florida player roster by position'}})
        table_index += 1
rich_content = {'nodes': native}
(ROOT / 'resource-rich-content.json').write_text(json.dumps(rich_content, ensure_ascii=False, separators=(',', ':')))
assert len([x for x in native if x['type'] == 'TABLE']) == 15
assert sum(len(x['nodes']) - 1 for x in native if x['type'] == 'TABLE') == 130
meta = {
    'postId': 'aeb4f5a5-3910-4b11-9a63-b05bac96e623',
    'canonicalUrl': URL,
    'title': 'Florida Football: 2026 Roster & Schedule',
    'excerpt': 'Florida’s full 2026 football roster, game results and upcoming schedule. A permanent GatorBait season guide, checked against official UF sources.',
    'author': 'Brenden Martin',
    'sourceCheckedDate': SCHEDULE['checkedDate'],
    'rosterCount': len(ROSTER['players']),
    'regularSeasonGames': len(games),
    'nativeHtmlCharacters': len(body),
    'scope': 'Replace this existing guide body and title; preserve its canonical slug, originalPublishedDate, categoryIds, tagIds, media and other metadata unless separately reviewed.',
    'anchors': 'HTML ids schedule and roster are source intent. Verify converted Ricos heading node IDs and public DOM IDs before wiring deep links. Default both cards to canonical URL if anchors cannot be verified.'
}
(ROOT / 'resource-metadata.json').write_text(json.dumps(meta, indent=2))

css = '''body{margin:0;background:#f4f0e6;color:#11274a;font-family:Barlow,sans-serif}*{box-sizing:border-box}main{max-width:920px;margin:36px auto;padding:32px;background:#fffdf9;border-top:8px solid #ff6500}h1{font-size:clamp(34px,7vw,62px);line-height:.98;letter-spacing:-.04em;margin:12px 0 24px;max-width:760px}h2{background:#123dbb;color:white;padding:18px;font-size:28px;margin-top:36px}h3{font-size:23px;border-top:3px solid #11274a;padding-top:18px;margin:32px 0 10px}p{font-size:17px;line-height:1.55}a{color:#163fb2;text-underline-offset:3px}table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:16px}th,td{text-align:left;padding:13px 10px;border-bottom:1px solid #d9dde4;overflow-wrap:anywhere}th{background:#11274a;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.04em}th:first-child,td:first-child{width:70px}th:last-child,td:last-child{width:32%}tbody tr:nth-child(even){background:#f0f3f7}td:first-child{white-space:nowrap}td a{display:inline-block;padding:3px 0;font-weight:700}header small{font-weight:900;letter-spacing:.16em;color:#c94400}@media(max-width:600px){main{margin:0;padding:18px}h2{font-size:24px;padding:14px}p{font-size:16px}th,td{padding:11px 7px;font-size:14px}th:first-child,td:first-child{width:68px}th:last-child,td:last-child{width:31%}}
'''
pbody = re.sub(r'<tr data-bg="(#[0-9a-f]+)"', lambda m: '<tr style="background:' + m.group(1) + '"', body)
pbody = re.sub(r'<span data-color="(#[0-9a-f]+)">', lambda m: '<span style="color:' + m.group(1) + '">', pbody)
preview = '<!doctype html><html lang="en"><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;800&display=swap"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(meta['title']) + '</title><style>' + css + '</style><main><header><small>GATORBAIT / THE FIELD GUIDE</small><h1>' + e(meta['title']) + '</h1></header>' + pbody + '</main></html>'
(ROOT / 'preview.html').write_text(preview)

card = '<aside class="gbm-season-card" aria-label="Florida football season guide"><small>THE FIELD GUIDE · 2026</small><h2>Know the team.<br>Follow the season.</h2><p>Florida’s full roster, results and schedule in one place.</p><a href="' + URL + '">Roster &amp; schedule <span aria-hidden="true">↗</span></a></aside>'
(ROOT / 'link-card.html').write_text(card)
(ROOT / 'link-card.css').write_text('''.gbm-season-card{min-width:0;background:#f5f1e7;color:#11274a;padding:22px;border-top:6px solid #f86600}.gbm-season-card small{font:800 11px/1.4 Barlow,Arial,sans-serif;letter-spacing:.12em}.gbm-season-card h2{font:900 29px/1 Barlow,Arial,sans-serif!important;letter-spacing:-.025em;margin:14px 0!important;color:#11274a!important}.gbm-season-card p{font:15px/1.45 Barlow,Arial,sans-serif;margin:0 0 15px}.gbm-season-card a{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:44px;background:#123dbb;color:#fff!important;padding:12px 14px;font:800 14px/1.2 Barlow,Arial,sans-serif;text-decoration:none!important}.gbm-season-card a:focus-visible{outline:3px solid #f86600;outline-offset:3px}.gbm-season-card a:hover{background:#11274a}@media(max-width:420px){.gbm-season-card{padding:18px}.gbm-season-card h2{font-size:26px!important}}
''')
print(json.dumps(meta, indent=2))
