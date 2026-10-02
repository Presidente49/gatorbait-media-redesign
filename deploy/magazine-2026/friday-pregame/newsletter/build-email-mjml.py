#!/usr/bin/env python3
"""Friday Pregame newsletter, house MJML style (light cards, navy and orange), built from sports-live/magazine-issue-pregame.json.
Usage: build-email-mjml.py <cover-image-url> [--test]   -> writes friday-pregame.mjml next to this file (compile with mjml).
The GatorBait mark is the approved logo file (Wix d3cfa5_95dd8a25...), served as PNG for email clients that cannot read webp."""
import json, sys, html, pathlib
root = pathlib.Path(__file__).resolve().parents[4]
D = json.loads((root / 'sports-live/magazine-issue-pregame.json').read_text())
COVER = sys.argv[1]
TEST = '--test' in sys.argv
CID = '--cid' in sys.argv  # images carried inside the email (cid:) so no client can block them; text-only story cards
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
if False:  # the cover art carries the logo; no separate header band
    # header: the real logo
    add('<mj-section background-color="#FFFFFF" padding="18px 24px 14px" border-bottom="4px solid %s"><mj-column>'
        '<mj-image src="%s" alt="GatorBait" width="250px" href="%s" padding="0" />'
        '<mj-text align="center" color="%s" font-size="12px" font-weight="800" letter-spacing="2.4px" padding="8px 0 0">MAGAZINE &#183; FRIDAY PREGAME EDITION &#183; OCT. 2, 2026</mj-text></mj-column></mj-section>' % (ORANGE, LOGO, SITE + '/magazine', NAVY))
# cover
add('<mj-section background-color="%s" padding="0"><mj-column><mj-image src="%s" alt="GatorBait Magazine cover: Gators head to Missouri, where history hasn’t been kind. Photo by Chris Spears, GatorBait Media." href="%s" padding="0" width="600px" /></mj-column></mj-section>' % (NAVY, 'cid:cover.jpg' if CID else COVER, FRANZ))
add('<mj-section background-color="#FFFFFF" padding="22px 24px 6px"><mj-column>'
    '<mj-text color="%s" font-size="17px" line-height="1.5" padding="0 0 6px">%s</mj-text>'
    '<mj-button href="%s" padding="14px 0 6px">READ THE COLUMN</mj-button>'
    '<mj-button href="%s" background-color="%s" padding="6px 0 10px">OPEN THE FULL MAGAZINE</mj-button></mj-column></mj-section>'
    % (MUTE, e(D['cover']['dek']), FRANZ, SITE + '/magazine', NAVY))
# the game: matchup graphic (rendered from deploy/covers/pregame-matchup.html) + one line of detail
G = D['game']
MATCHUP = 'https://static.wixstatic.com/media/d3cfa5_1fe245369e1d40dfbe9ab7c20053de72~mv2.jpg/v1/fill/w_1200,h_760,al_c,q_85/file.jpg'
add('<mj-section background-color="%s" padding="0"><mj-column><mj-image src="%s" alt="No. 8 Florida (4-0) at No. 25 Missouri (3-1), Saturday, Oct. 3, 3:30 p.m. ET on ABC. Line FLA -5.5, total 57.5." href="%s" padding="0" width="600px" /></mj-column></mj-section>' % (NAVY, MATCHUP, SITE + '/magazine'))
add('<mj-section background-color="%s" padding="12px 24px 16px"><mj-column><mj-text color="#D7E0EB" font-size="14px" line-height="1.5" padding="0">ESPN matchup predictor: Florida %s%%, Missouri %s%%. %s</mj-text></mj-column></mj-section>' % (NAVY, G['predictor']['florida'], G['predictor']['missouri'], e(G['forecast'])))
# tale of the tape: ESPN season team stats (site.api.espn.com teams/57 and /142 statistics, pulled Oct. 2) and ESPN season leaders (summary?event=401856708)
T = json.loads((pathlib.Path(__file__).resolve().parent / 'stats-espn.json').read_text())
tr = ''
for lab, f, m, hi in T['tape']:
    fb = (float(f.rstrip('%')) > float(m.rstrip('%'))) == hi
    mb = (float(m.rstrip('%')) > float(f.rstrip('%'))) == hi
    if f == m: fb = mb = False
    cell = lambda v, b, al: '<td style="padding:8px 4px;border-bottom:1px solid #dde3ec;text-align:%s;font-size:18px;font-weight:900;color:%s;font-variant-numeric:tabular-nums;width:26%%;">%s</td>' % (al, ORANGE if b else NAVY, e(v))
    tr += '<tr>%s<td style="padding:8px 4px;border-bottom:1px solid #dde3ec;text-align:center;font-size:12px;font-weight:800;letter-spacing:1px;color:%s;">%s</td>%s</tr>' % (cell(f, fb, 'left'), MUTE, e(lab.upper()), cell(m, mb, 'right'))
add('<mj-section background-color="#FFFFFF" padding="24px 24px 8px"><mj-column>'
    '<mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 4px">FOR THE STAT GEEKS</mj-text>'
    '<mj-text color="%s" font-size="30px" line-height="1.1" font-weight="900" padding="0 0 4px">Tale of the tape</mj-text>'
    '<mj-text color="%s" font-size="13px" padding="0 0 8px">Season averages, four games each. Orange marks the edge. Source: ESPN.</mj-text>'
    '<mj-table padding="0" cellpadding="0"><tr><td style="padding:6px 4px;border-bottom:3px solid %s;font-size:14px;font-weight:900;color:%s;letter-spacing:1px;">FLORIDA</td><td style="border-bottom:3px solid %s;"></td><td style="padding:6px 4px;border-bottom:3px solid #F1B82D;text-align:right;font-size:14px;font-weight:900;color:%s;letter-spacing:1px;">MISSOURI</td></tr>%s</mj-table>'
    '</mj-column></mj-section>' % (ORANGE, NAVY, MUTE, BLUE, BLUE, NAVY, NAVY, tr))
def lead(team, bg, acc, fg, sub):
    r = ''.join('<mj-text color="%s" font-size="11px" font-weight="900" letter-spacing="1.6px" padding="12px 0 0">%s</mj-text>'
                '<mj-text color="%s" font-size="19px" line-height="1.15" font-weight="900" padding="2px 0 0">%s</mj-text>'
                '<mj-text color="%s" font-size="13px" line-height="1.4" padding="2px 0 0">%s</mj-text>' % (acc, e(c.upper()), fg, e(n), sub, e(v)) for c, n, v in T['leaders'][team])
    return '<mj-column background-color="%s" padding="18px 18px 20px" vertical-align="top"><mj-text color="%s" font-size="22px" font-weight="900" letter-spacing="1px" padding="0">%s</mj-text>%s</mj-column>' % (bg, fg, team.upper(), r)
add('<mj-section background-color="#FFFFFF" padding="16px 24px 4px"><mj-column><mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 4px">PLAYERS TO KNOW</mj-text>'
    '<mj-text color="%s" font-size="13px" padding="0">Season leaders by jersey number. Source: ESPN.</mj-text></mj-column></mj-section>' % (ORANGE, MUTE))
add('<mj-section background-color="#FFFFFF" padding="6px 24px 8px">%s%s</mj-section>' % (lead('Florida', BLUE, ORANGE, '#FFFFFF', '#DCE4FF'), lead('Missouri', '#111111', '#F1B82D', '#FFFFFF', '#E9D9A8')))
add('<mj-section background-color="#FFFFFF" padding="4px 24px 24px"><mj-column><mj-button href="https://floridagators.com/sports/football/roster" background-color="%s" padding="6px 0 0">THE FULL GATORS ROSTER</mj-button></mj-column></mj-section>' % NAVY)
# Sooth Board
rows = []
games = D['slate']['games']
show = [g for g in games if g.get('hero')] + [g for g in games if not g.get('hero')][:2]
for g in show:
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
    '<mj-text color="%s" font-size="14px" padding="0 0 8px">Franz Beard picks every SEC game. Here are three. Lines: ESPN.</mj-text>'
    '<mj-table padding="0" cellpadding="0">%s</mj-table><mj-button href="%s" background-color="%s" padding="14px 0 4px">SEE ALL %d OF FRANZ&#8217;S PICKS</mj-button></mj-column></mj-section>' % (ORANGE, NAVY, MUTE, ''.join(rows), SITE + '/magazine', NAVY, len(games)))
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
def card(c):
    return ('<mj-column padding="0 6px 12px" vertical-align="top">%s'
            '<mj-text color="%s" font-size="11px" font-weight="900" letter-spacing="1.6px" padding="10px 2px 0">%s</mj-text>'
            '<mj-text color="%s" font-size="18px" line-height="1.2" font-weight="900" padding="4px 2px 0"><a href="%s" style="color:%s;text-decoration:none;">%s</a></mj-text>'
            '<mj-text color="%s" font-size="14px" line-height="1.45" padding="6px 2px 0">%s</mj-text>'
            '<mj-button href="%s" align="left" padding="10px 2px 0" inner-padding="9px 18px" font-size="13px">READ</mj-button></mj-column>'
            % ('' if CID else '<mj-image src="%s" alt="%s" href="%s" padding="0" />' % (img(c['image'], 600, 400), e(c['image']['alt']), e(u(c['url']))),
               ORANGE, e(c['kicker'].upper()), NAVY, e(u(c['url'])), NAVY, e(c['title']), MUTE, e(c['excerpt']), e(u(c['url']))))
cs = D['cards']['items']
for i in range(0, len(cs), 2):
    pair = cs[i:i+2]
    add('<mj-section background-color="#FFFFFF" padding="%s 18px 6px">%s%s</mj-section>' % ('20px' if i == 0 else '6px', ''.join(card(c) for c in pair), '' if len(pair) == 2 else '<mj-column></mj-column>'))
if not CID:
    # best shots
    ph = D['shots']['photos']
    def shot(p): return '<mj-column padding="3px"><mj-image src="%s" alt="%s" href="%s" padding="0" /><mj-text font-size="12px" color="%s" padding="3px 0 0" line-height="1.3">%s</mj-text></mj-column>' % (img(p, 360, 240), e(p['alt']), e(u(D['shots']['url'])), MUTE, e(p['caption']))
    add('<mj-section background-color="#FFFFFF" padding="22px 21px 0"><mj-column><mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 3px 2px">PHOTOGRAPHY</mj-text><mj-text color="%s" font-size="26px" font-weight="900" padding="0 3px 4px">Best shots</mj-text><mj-text color="%s" font-size="13px" padding="0 3px 4px">From Florida 52, Ole Miss 28. Photos by Chris Spears, GatorBait Media.</mj-text></mj-column></mj-section>' % (ORANGE, NAVY, MUTE))
    add('<mj-section background-color="#FFFFFF" padding="0 21px">%s</mj-section>' % ''.join(shot(p) for p in ph[:3]))
    add('<mj-section background-color="#FFFFFF" padding="0 21px 8px">%s<mj-column padding="3px"></mj-column></mj-section>' % ''.join(shot(p) for p in ph[3:5]))
add('<mj-section background-color="#FFFFFF" padding="6px 24px 26px"><mj-column><mj-text align="center" color="%s" font-size="16px" padding="0 0 6px">%s</mj-text><mj-button href="%s" padding="8px 0 0">OPEN THE FULL MAGAZINE</mj-button></mj-column></mj-section>' % (INK, e(D['reference']['next']), SITE + '/magazine'))
# get more: daily blog alerts (The Gator Daily News on Facebook) | the GatorBait Boards
FB = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--fb=')), None)
add('<mj-section background-color="#FFFFFF" padding="0 24px 26px">'
    '<mj-column background-color="#FFF4EF" padding="18px 18px 20px" vertical-align="top" border-left="5px solid %s">'
    '<mj-text color="%s" font-size="11px" font-weight="900" letter-spacing="1.6px" padding="0">DAILY BLOG ALERTS</mj-text>'
    '<mj-text color="%s" font-size="20px" line-height="1.15" font-weight="900" padding="4px 0 0">Never miss a story</mj-text>'
    '<mj-text color="%s" font-size="14px" line-height="1.45" padding="6px 0 0">Every new GatorBait story, every day, on The Gator Daily News.</mj-text>'
    '<mj-button href="%s" align="left" padding="12px 0 0" inner-padding="9px 18px" font-size="13px">%s</mj-button></mj-column>'
    '<mj-column background-color="%s" padding="18px 18px 20px" vertical-align="top" border-left="5px solid #F1B82D">'
    '<mj-text color="#F1B82D" font-size="11px" font-weight="900" letter-spacing="1.6px" padding="0">THE BOARDS</mj-text>'
    '<mj-text color="#FFFFFF" font-size="20px" line-height="1.15" font-weight="900" padding="4px 0 0">Talk Gators with us</mj-text>'
    '<mj-text color="#D7E0EB" font-size="14px" line-height="1.45" padding="6px 0 0">Game Day Threads, recruiting and Gator Football Talk. A free GatorBait login lets you post.</mj-text>'
    '<mj-button href="%s" align="left" background-color="#F1B82D" color="%s" padding="12px 0 0" inner-padding="9px 18px" font-size="13px">JOIN THE BOARDS</mj-button></mj-column></mj-section>'
    % (ORANGE, ORANGE, NAVY, MUTE, e(FB or SITE), 'FOLLOW ON FACEBOOK' if FB else 'GET THE STORIES', NAVY, SITE + '/groups', NAVY))
# footer
links = ' &#183; '.join('<a href="%s" style="color:#D7E0EB;">%s</a>' % (e(u(l['url'])), e(l['label'])) for l in D['reference']['links'])
add('<mj-section background-color="%s" padding="20px 24px"><mj-column><mj-text align="center" color="#D7E0EB" font-size="13px" line-height="1.7" padding="0">%s<br/><a href="%s" style="color:#D7E0EB;">GatorBait Media</a> &#183; Independent Florida Gators coverage<br/>%s</mj-text></mj-column></mj-section>'
    % (NAVY, links, SITE, 'You are receiving this test from GatorBait Media.' if TEST else ''))
add('</mj-body></mjml>')
p = pathlib.Path(__file__).resolve().parent / 'friday-pregame.mjml'
p.write_text('\n'.join(out))
print('wrote', p, p.stat().st_size)
