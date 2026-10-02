#!/usr/bin/env python3
"""Friday Pregame newsletter, house MJML style (light cards, navy and orange), built from sports-live/magazine-issue-pregame.json.
Usage: build-email-mjml.py <cover-image-url> [--test]   -> writes friday-pregame.mjml next to this file (compile with mjml).
The GatorBait mark is the approved logo file (Wix d3cfa5_95dd8a25...), served as PNG for email clients that cannot read webp."""
import json, sys, html, pathlib
root = pathlib.Path(__file__).resolve().parents[4]
D = json.loads((root / 'sports-live/magazine-issue-pregame.json').read_text())
COVER = sys.argv[1]
TEST = '--test' in sys.argv
SITE = 'https://www.gatorbaitmedia.com'
FRANZ = SITE + D['cover']['url']
LOGO = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp/v1/fit/w_600,h_160,q_90/file.png'
e = lambda s: html.escape(s or '', quote=True)
def u(p): return p if p.startswith('http') else SITE + p
def img(i, w, h):
    return 'https://static.wixstatic.com/media/%s~mv2.%s/v1/fill/w_%d,h_%d,al_c,q_80/file.%s' % (i['id'], i['ext'], w, h, i['ext'])
NAVY, ORANGE, BLUE, INK, MUTE = '#081F3D', '#FA4616', '#0A2CA8', '#11274A', '#4B586A'
out = []
add = out.append
add('<mjml><mj-head><mj-title>GatorBait Magazine: Friday Pregame, Florida at Missouri</mj-title>'
    '<mj-preview>Franz Beard leads the Friday pregame edition: the Sooth Board, three keys and who is out.</mj-preview>'
    '<mj-attributes><mj-all font-family="Arial, Helvetica, sans-serif" /><mj-text color="%s" font-size="16px" line-height="1.5" />'
    '<mj-button background-color="%s" color="#FFFFFF" border-radius="3px" font-size="15px" font-weight="800" /></mj-attributes></mj-head>'
    '<mj-body background-color="#EEF1F5">' % (INK, ORANGE))
if TEST:
    add('<mj-section background-color="%s" padding="8px 16px"><mj-column><mj-text align="center" color="#FFFFFF" font-size="13px" font-weight="800" padding="0">TEST EMAIL for Brenden only. Not sent to the list.</mj-text></mj-column></mj-section>' % ORANGE)
# header: the real logo
add('<mj-section background-color="#FFFFFF" padding="18px 24px 14px" border-bottom="4px solid %s"><mj-column>'
    '<mj-image src="%s" alt="GatorBait" width="250px" href="%s" padding="0" />'
    '<mj-text align="center" color="%s" font-size="12px" font-weight="800" letter-spacing="2.4px" padding="8px 0 0">MAGAZINE &#183; FRIDAY PREGAME EDITION &#183; OCT. 2, 2026</mj-text></mj-column></mj-section>' % (ORANGE, LOGO, SITE + '/magazine', NAVY))
# cover
add('<mj-section background-color="%s" padding="0"><mj-column><mj-image src="%s" alt="GatorBait Magazine cover: Gators head to Missouri, where history hasn’t been kind. Photo by Chris Spears, GatorBait Media." href="%s" padding="0" width="600px" /></mj-column></mj-section>' % (NAVY, COVER, FRANZ))
add('<mj-section background-color="#FFFFFF" padding="22px 24px 6px"><mj-column>'
    '<mj-text color="%s" font-size="17px" line-height="1.5" padding="0 0 6px">%s</mj-text>'
    '<mj-button href="%s" padding="14px 0 6px">READ THE COLUMN</mj-button>'
    '<mj-button href="%s" background-color="%s" padding="6px 0 10px">OPEN THE FULL MAGAZINE</mj-button></mj-column></mj-section>'
    % (MUTE, e(D['cover']['dek']), FRANZ, SITE + '/magazine', NAVY))
# the game
G = D['game']; T = G['teams']
add('<mj-section background-color="%s" padding="26px 24px 8px"><mj-column>'
    '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 8px">THE GAME &#183; %s &#183; %s</mj-text>'
    '<mj-text color="#FFFFFF" font-size="32px" line-height="1.08" font-weight="900" padding="0 0 8px">%s %s at %s %s</mj-text>'
    '<mj-text color="#D7E0EB" font-size="15px" line-height="1.5" padding="0">%s &#183; %s<br/>Line %s &#183; Total %s &#183; Moneyline %s<br/>%s<br/>ESPN matchup predictor: Florida %s%%, Missouri %s%%.</mj-text></mj-column></mj-section>'
    % (NAVY, ORANGE, e(G['kickoff'].upper()), e(G['tv']), e(T[0]['rank']), e(T[0]['name']), e(T[1]['rank']), e(T[1]['name']),
       e(G['venue']), e(G['forecast']), e(G['chips'][0]['v']), e(G['chips'][1]['v']), e(G['chips'][2]['v']), e(D['asOf']), G['predictor']['florida'], G['predictor']['missouri']))
# Sooth Board
rows = []
for g in D['slate']['games']:
    a, h = g['away'], g['home']
    nm = lambda t: ((('No. %s ' % t['rank']) if t.get('rank') else '') + t['name'] + ' (' + t['rec'] + ')')
    pick = g['pick'] + ((' ' + g['note']) if g.get('note') else '')
    star = g.get('hero')
    rows.append('<tr><td style="padding:10px 0;border-bottom:1px solid #dde3ec;%s"><div style="font-size:12px;font-weight:800;color:%s;letter-spacing:1.2px;">%s &#183; %s</div>'
                '<div style="font-size:18px;font-weight:900;color:%s;line-height:1.25;padding:2px 0;">%s at %s</div>'
                '<div style="font-size:13px;color:%s;">Line %s &#183; O/U %s</div>'
                '<div style="font-size:15px;font-weight:900;color:%s;padding-top:3px;">Franz&#8217;s pick: %s</div></td></tr>'
                % ('background:#FFF4EF;' if star else '', BLUE, e(g['time'].upper()), e(g['tv'].upper()), NAVY, e(nm(a)), e(nm(h)), MUTE, e(g['line']), e(str(g['ou'])), ORANGE, e(pick)))
add('<mj-section background-color="#FFFFFF" padding="26px 24px 6px"><mj-column>'
    '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 6px">THE SOOTHSAYER</mj-text>'
    '<mj-text color="%s" font-size="30px" line-height="1.1" font-weight="900" padding="0 0 4px">The Sooth Board</mj-text>'
    '<mj-text color="%s" font-size="14px" padding="0 0 8px">Saturday&#8217;s SEC games with Franz Beard&#8217;s picks. Kickoffs, TV and lines: ESPN.</mj-text>'
    '<mj-table padding="0" cellpadding="0">%s</mj-table></mj-column></mj-section>' % (ORANGE, NAVY, MUTE, ''.join(rows)))
# three keys
ks = D['keys']['items'][:3]
kt = ''
for n, k in enumerate(ks, 1):
    first = k['p'].split('. ')[0].rstrip('.') + '.'
    kt += ('<mj-text color="%s" font-size="20px" line-height="1.2" font-weight="900" padding="12px 0 2px">%d. %s</mj-text>'
           '<mj-text color="%s" font-size="15px" line-height="1.5" padding="0 0 4px">%s</mj-text>') % (NAVY, n, e(k['h']), MUTE, e(first))
add('<mj-section background-color="#FFFFFF" padding="18px 24px 6px"><mj-column><mj-divider border-color="#dde3ec" border-width="1px" padding="0 0 12px" />'
    '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0">THREE KEYS</mj-text>%s</mj-column></mj-section>' % (ORANGE, kt))
# who is out
inj = ''
for t in D['injuries']['teams']:
    inj += '<mj-text color="%s" font-size="17px" font-weight="900" padding="10px 0 2px">%s</mj-text>' % (NAVY, e(t['name']))
    inj += '<mj-text color="%s" font-size="14px" line-height="1.6" padding="0 0 4px">%s</mj-text>' % (MUTE, '<br/>'.join('%s %s &#8212; <b>%s</b>' % (e(i['pos']), e(i['name']), e(i['status'])) for i in t['items']))
add('<mj-section background-color="#FFFFFF" padding="14px 24px 22px"><mj-column><mj-divider border-color="#dde3ec" border-width="1px" padding="0 0 12px" />'
    '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0">WHO IS OUT</mj-text>'
    '<mj-text color="%s" font-size="13px" padding="2px 0 0">%s</mj-text>%s</mj-column></mj-section>' % (ORANGE, MUTE, e(D['injuries']['asOf']), inj))
# more from this week
add('<mj-section background-color="%s" padding="26px 24px 4px"><mj-column><mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 4px">THIS WEEK</mj-text>'
    '<mj-text color="#FFFFFF" font-size="28px" font-weight="900" padding="0">More from GatorBait</mj-text></mj-column></mj-section>' % (NAVY, ORANGE))
for c in D['cards']['items']:
    add('<mj-section background-color="#FFFFFF" padding="0 0 2px"><mj-column>'
        '<mj-image src="%s" alt="%s" href="%s" padding="0" width="600px" />'
        '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="1.6px" padding="14px 24px 0">%s</mj-text>'
        '<mj-text color="%s" font-size="22px" line-height="1.15" font-weight="900" padding="4px 24px 0">%s</mj-text>'
        '<mj-text color="%s" font-size="15px" line-height="1.5" padding="6px 24px 0">%s</mj-text>'
        '<mj-button href="%s" align="left" padding="10px 24px 22px" inner-padding="10px 22px">READ</mj-button></mj-column></mj-section>'
        % (img(c['image'], 1200, 674), e(c['image']['alt']), e(u(c['url'])), ORANGE, e(c['kicker'].upper()), NAVY, e(c['title']), MUTE, e(c['excerpt']), e(u(c['url']))))
# best shots
ph = D['shots']['photos']
def shot(p): return '<mj-column padding="3px"><mj-image src="%s" alt="%s" href="%s" padding="0" /><mj-text font-size="12px" color="%s" padding="3px 0 0" line-height="1.3">%s</mj-text></mj-column>' % (img(p, 360, 240), e(p['alt']), e(u(D['shots']['url'])), MUTE, e(p['caption']))
add('<mj-section background-color="#FFFFFF" padding="22px 21px 0"><mj-column><mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 3px 2px">PHOTOGRAPHY</mj-text><mj-text color="%s" font-size="26px" font-weight="900" padding="0 3px 4px">Best shots</mj-text><mj-text color="%s" font-size="13px" padding="0 3px 4px">From Florida 52, Ole Miss 28. Photos by Chris Spears, GatorBait Media.</mj-text></mj-column></mj-section>' % (ORANGE, NAVY, MUTE))
add('<mj-section background-color="#FFFFFF" padding="0 21px">%s</mj-section>' % ''.join(shot(p) for p in ph[:3]))
add('<mj-section background-color="#FFFFFF" padding="0 21px 8px">%s<mj-column padding="3px"></mj-column></mj-section>' % ''.join(shot(p) for p in ph[3:5]))
add('<mj-section background-color="#FFFFFF" padding="6px 24px 26px"><mj-column><mj-text align="center" color="%s" font-size="16px" padding="0 0 6px">%s</mj-text><mj-button href="%s" padding="8px 0 0">OPEN THE FULL MAGAZINE</mj-button></mj-column></mj-section>' % (INK, e(D['reference']['next']), SITE + '/magazine'))
# footer
links = ' &#183; '.join('<a href="%s" style="color:#D7E0EB;">%s</a>' % (e(u(l['url'])), e(l['label'])) for l in D['reference']['links'])
add('<mj-section background-color="%s" padding="20px 24px"><mj-column><mj-text align="center" color="#D7E0EB" font-size="13px" line-height="1.7" padding="0">%s<br/><a href="%s" style="color:#D7E0EB;">GatorBait Media</a> &#183; Independent Florida Gators coverage<br/>%s</mj-text></mj-column></mj-section>'
    % (NAVY, links, SITE, 'You are receiving this test from GatorBait Media.' if TEST else ''))
add('</mj-body></mjml>')
p = pathlib.Path(__file__).resolve().parent / 'friday-pregame.mjml'
p.write_text('\n'.join(out))
print('wrote', p, p.stat().st_size)
