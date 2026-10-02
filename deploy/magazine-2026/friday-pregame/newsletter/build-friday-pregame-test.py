#!/usr/bin/env python3
"""Builds friday-pregame-test.html (TEST newsletter, hand-written table layout, no mjml needed).
Reads sports-live/magazine-issue-pregame.json. Does not send anything."""
import json, html, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[4]
D = json.load(open(ROOT / 'sports-live/magazine-issue-pregame.json'))
OUT = pathlib.Path(__file__).with_name('friday-pregame-test.html')
SITE = 'https://www.gatorbaitmedia.com'
NAVY, PANEL, PANEL2, LINE = '#060b1c', '#0d1530', '#111b3d', '#24315e'
ORANGE, BLUE, TEXT, MUTE = '#fa4616', '#3d7bff', '#f2f5ff', '#a9b3d3'
HEAD = "'Barlow Condensed','Barlow','Arial Narrow',Arial,Helvetica,sans-serif"
BODY = "'Barlow',Arial,Helvetica,sans-serif"
e = lambda s: html.escape(str(s), quote=True)
def url(p): return p if p.startswith('http') else SITE + p
def img(im, w, h, alt=None, extra=''):
    return (f'https://static.wixstatic.com/media/{im["id"]}~mv2.{im["ext"]}/v1/fill/w_{w},h_{h},al_c,q_80/file.{im["ext"]}')
def im_tag(im, w, h, disp_w, alt=None):
    src = img(im, w*2 if w*2 <= im['width'] else w, h*2 if w*2 <= im['width'] else h)
    return (f'<img src="{src}" width="{disp_w}" alt="{e(alt or im["alt"])}" '
            f'style="display:block;width:100%;max-width:{disp_w}px;height:auto;border:0;outline:none;text-decoration:none;">')
def btn(label, href, color=ORANGE, big=True):
    pad = '18px 36px' if big else '12px 24px'; fs = 22 if big else 16
    return (f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>'
            f'<td align="center" bgcolor="{color}" style="background:{color};border-radius:4px;">'
            f'<a href="{e(href)}" style="display:inline-block;padding:{pad};font-family:{HEAD};font-size:{fs}px;font-weight:800;'
            f'letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">{e(label)}</a></td></tr></table>')
def label(t, color=ORANGE):
    return (f'<div style="font-family:{HEAD};font-size:15px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:{color};'
            f'padding:0 0 10px;">{e(t)}</div>')
def h2(t):
    return (f'<div style="font-family:{HEAD};font-size:30px;line-height:1.05;font-weight:800;text-transform:uppercase;'
            f'color:{TEXT};padding:0 0 14px;">{e(t)}</div>')
def section(inner, bg=NAVY, pad='28px 24px'):
    return (f'<tr><td bgcolor="{bg}" style="background:{bg};padding:{pad};border-top:1px solid {LINE};">{inner}</td></tr>')
def tm(t):
    r = f'{t["rank"]} ' if t.get('rank') else ''
    return f'{r}{t["name"]}'
def ap(rank): return f'No. {rank} ' if rank else ''

rows = []
cv, g, lead = D['cover'], D['game'], D['lead']

# Test banner
rows.append(f'<tr><td align="center" bgcolor="{ORANGE}" style="background:{ORANGE};padding:10px 16px;font-family:{BODY};font-size:14px;font-weight:700;color:#ffffff;">'
            f'TEST EMAIL for Brenden only &mdash; not sent to the list</td></tr>')
# View in browser
rows.append(f'<tr><td align="center" bgcolor="{NAVY}" style="background:{NAVY};padding:10px 16px;font-family:{BODY};font-size:13px;color:{MUTE};">'
            f'Trouble reading this? <a href="{SITE}/magazine" style="color:{MUTE};text-decoration:underline;">View in browser</a></td></tr>')
# Masthead
rows.append(f'<tr><td align="center" bgcolor="{NAVY}" style="background:{NAVY};padding:22px 24px 26px;border-bottom:4px solid {ORANGE};">'
            f'<div style="font-family:{HEAD};font-size:15px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:{BLUE};">Independent Florida Gators coverage</div>'
            f'<div style="font-family:{HEAD};font-size:46px;line-height:1;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:{TEXT};padding:8px 0 6px;">GatorBait <span style="color:{ORANGE};">Magazine</span></div>'
            f'<div style="font-family:{HEAD};font-size:20px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:{TEXT};">Friday Pregame Edition &middot; Oct. 2, 2026</div>'
            f'<div style="font-family:{BODY};font-size:15px;color:{MUTE};padding-top:6px;">{e(D["issue"]["name"])} &middot; Week 5</div></td></tr>')
# Cover
c = (label(cv['kicker']) +
     f'<a href="{e(url(cv["url"]))}" style="text-decoration:none;">{im_tag(cv["image"],552,345,552)}</a>'
     f'<div style="font-family:{HEAD};font-size:36px;line-height:1.05;font-weight:800;text-transform:uppercase;color:{TEXT};padding:18px 0 10px;">{e(cv["headline"])}</div>'
     f'<div style="font-family:{BODY};font-size:17px;line-height:1.5;color:{MUTE};padding-bottom:8px;">{e(cv["dek"])}</div>'
     f'<div style="font-family:{BODY};font-size:14px;color:{MUTE};padding-bottom:20px;">{e(cv["byline"])} &middot; {e(cv["image"]["credit"])}</div>'
     + btn('Read the column', url(cv['url'])))
rows.append(section(c, PANEL))
# Game
t1, t2 = g['teams']
def team_cell(t, align):
    return (f'<td width="50%" valign="top" align="{align}" style="padding:4px 6px;">'
            f'<div style="font-family:{HEAD};font-size:15px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:{BLUE};">{e(t["rank"])}</div>'
            f'<div style="font-family:{HEAD};font-size:34px;line-height:1;font-weight:800;text-transform:uppercase;color:{TEXT};">{e(t["name"])}</div>'
            f'<div style="font-family:{BODY};font-size:16px;font-weight:600;color:{TEXT};padding-top:4px;">{e(t["record"])} &middot; {e(t["conf"])}</div>'
            f'<div style="font-family:{BODY};font-size:13px;color:{MUTE};padding-top:2px;">{e(t["role"])}</div></td>')
chips = ''.join(
    f'<td width="33%" valign="top" align="center" style="padding:6px 4px;border:1px solid {LINE};background:{PANEL2};">'
    f'<div style="font-family:{HEAD};font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:{ORANGE};">{e(ch["k"])}</div>'
    f'<div style="font-family:{HEAD};font-size:20px;font-weight:800;color:{TEXT};padding-top:2px;">{e(ch["v"])}</div></td>'
    for ch in g['chips'])
gc = (label(g['label'], BLUE) +
      f'<div style="font-family:{HEAD};font-size:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:{TEXT};padding-bottom:14px;">'
      f'Kickoff {e(g["kickoff"])} &middot; {e(g["tv"])}</div>'
      f'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="padding-bottom:14px;"><tr>'
      + team_cell(t1, 'left') + team_cell(t2, 'right') + '</tr></table>'
      f'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="6" style="margin-top:12px;"><tr>{chips}</tr></table>'
      f'<div style="font-family:{BODY};font-size:15px;line-height:1.5;color:{TEXT};padding-top:14px;"><strong>Venue:</strong> {e(g["venue"])}<br>'
      f'<strong>TV:</strong> {e(g["tv"])}<br><strong>Forecast:</strong> {e(g["forecast"])}</div>'
      f'<div style="font-family:{BODY};font-size:12px;color:{MUTE};padding-top:8px;">{e(D["asOf"])}</div>')
rows.append(section(gc))
# Sooth Board
sl = D['slate']
sr = ''
for s in sl['games']:
    hero = s.get('hero')
    bg = '#1a2550' if hero else PANEL
    bd = ORANGE if hero else LINE
    pick = s['pick'] + (f' {s["note"]}' if s.get('note') else '')
    sr += (f'<tr><td style="padding:0 0 8px;"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" '
           f'style="background:{bg};border:1px solid {bd};{"border-left:4px solid "+ORANGE+";" if hero else ""}"><tr><td style="padding:10px 12px;">'
           f'<div style="font-family:{HEAD};font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:{BLUE};">{e(s["time"])} &middot; {e(s["tv"])}</div>'
           f'<div style="font-family:{HEAD};font-size:21px;line-height:1.15;font-weight:800;text-transform:uppercase;color:{TEXT};padding:3px 0;">'
           f'{e(ap(s["away"].get("rank")))}{e(s["away"]["name"])} ({e(s["away"]["rec"])}) at {e(ap(s["home"].get("rank")))}{e(s["home"]["name"])} ({e(s["home"]["rec"])})</div>'
           f'<div style="font-family:{BODY};font-size:13px;color:{MUTE};">Line {e(s["line"])} &middot; O/U {e(s["ou"])}</div>'
           f'<div style="font-family:{HEAD};font-size:17px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:{ORANGE};padding-top:4px;">Franz&rsquo;s pick: {e(pick)}</div>'
           f'</td></tr></table></td></tr>')
sb = (label('The Soothsayer') + h2(sl['label']) +
      f'<div style="font-family:{BODY};font-size:15px;color:{MUTE};padding:0 0 14px;">{e(sl["note"])}</div>'
      f'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">{sr}</table>'
      f'<div style="font-family:{BODY};font-size:12px;color:{MUTE};padding-top:4px;">{e(sl["source"])}</div>')
rows.append(section(sb, PANEL))
# Keys
ks = ''
for i, k in enumerate(D['keys']['items'][:3], 1):
    first = re.split(r'(?<=[.!?])\s', k['p'])[0]
    href = url(k.get('url') or cv['url'])
    ks += (f'<tr><td valign="top" width="44" style="padding:0 0 16px;font-family:{HEAD};font-size:38px;line-height:1;font-weight:800;color:{ORANGE};">{i}</td>'
           f'<td valign="top" style="padding:0 0 16px;"><div style="font-family:{HEAD};font-size:22px;line-height:1.1;font-weight:800;text-transform:uppercase;color:{TEXT};">{e(k["h"])}</div>'
           f'<div style="font-family:{BODY};font-size:15px;line-height:1.5;color:{MUTE};padding-top:4px;">{e(first)} '
           f'<a href="{e(href)}" style="color:{BLUE};font-weight:700;text-decoration:underline;">Read &rarr;</a></div></td></tr>')
rows.append(section(label('Franz Beard') + h2(D['keys']['label']) +
                    f'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">{ks}</table>'))
# Injuries
inj = D['injuries']
def team_inj(t):
    items = ''.join(
        f'<div style="font-family:{BODY};font-size:15px;line-height:1.45;color:{TEXT};padding:3px 0;border-bottom:1px solid {LINE};">'
        f'<strong>{e(i["pos"])} {e(i["name"])}</strong> &mdash; <span style="color:{ORANGE if i["status"]=="Out" else BLUE};font-weight:700;">{e(i["status"])}</span>'
        + (f'<br><span style="color:{MUTE};font-size:13px;">{e(i["detail"])}</span>' if i['detail'] else '') + '</div>'
        for i in t['items'])
    return (f'<div style="font-family:{HEAD};font-size:20px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:{TEXT};padding:8px 0 4px;">{e(t["name"])}</div>{items}')
rows.append(section(label(inj['label'], BLUE) + h2('Who is out') +
                    f'<div style="font-family:{BODY};font-size:13px;color:{MUTE};padding-bottom:6px;">{e(inj["asOf"])}</div>' +
                    ''.join(team_inj(t) for t in inj['teams']), PANEL))
# Cards
cards = D['cards']
cc = label('This week') + h2(cards['label'])
for it in cards['items']:
    u = url(it['url'])
    cc += (f'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background:{PANEL};border:1px solid {LINE};"><tr><td>'
           f'<a href="{e(u)}" style="text-decoration:none;">{im_tag(it["image"],552,310,552)}</a></td></tr><tr><td style="padding:14px 16px 16px;">'
           f'<div style="font-family:{HEAD};font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:{ORANGE};">{e(it["kicker"])} &middot; {e(it["date"])}</div>'
           f'<div style="font-family:{HEAD};font-size:25px;line-height:1.1;font-weight:800;text-transform:uppercase;color:{TEXT};padding:6px 0;"><a href="{e(u)}" style="color:{TEXT};text-decoration:none;">{e(it["title"])}</a></div>'
           f'<div style="font-family:{BODY};font-size:15px;line-height:1.5;color:{MUTE};padding-bottom:8px;">{e(it["excerpt"])}</div>'
           f'<a href="{e(u)}" style="font-family:{HEAD};font-size:16px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:{BLUE};text-decoration:none;">Read &rarr;</a>'
           f'<div style="font-family:{BODY};font-size:11px;color:{MUTE};padding-top:6px;">{e(it["image"]["credit"])}</div>'
           f'</td></tr></table>')
rows.append(section(cc))
# Shots
sh = D['shots']; ph = sh['photos']
def cell(p):
    return (f'<td width="33%" valign="top" style="padding:3px;"><a href="{e(url(sh["url"]))}" style="text-decoration:none;">{im_tag(p,176,117,176)}</a>'
            f'<div style="font-family:{BODY};font-size:12px;line-height:1.3;color:{MUTE};padding-top:4px;">{e(p["caption"])}</div></td>')
grid = ('<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed;"><tr>' + ''.join(cell(p) for p in ph[:3]) + '</tr>'
        '<tr>' + ''.join(cell(p) for p in ph[3:]) + '<td width="33%"></td></tr></table>')
rows.append(section(label('Photography', BLUE) + h2(sh['label']) +
                    f'<div style="font-family:{BODY};font-size:15px;color:{MUTE};padding-bottom:12px;">{e(sh["note"])}</div>{grid}'
                    f'<div style="font-family:{BODY};font-size:13px;color:{MUTE};padding-top:10px;">{e(sh["credit"])}. '
                    f'<a href="{e(url(sh["url"]))}" style="color:{BLUE};font-weight:700;text-decoration:underline;">See all the shots &rarr;</a></div>', PANEL))
# CTA
rows.append(section(f'<div style="font-family:{BODY};font-size:16px;line-height:1.5;color:{TEXT};text-align:center;padding-bottom:16px;">{e(D["reference"]["next"])}</div>'
                    + btn('Open the full Magazine', SITE + '/magazine'), NAVY, '32px 24px'))
# Footer
ref = ' &middot; '.join(f'<a href="{e(url(l["url"]))}" style="color:{BLUE};text-decoration:underline;">{e(l["label"])}</a>' for l in D['reference']['links'])
rows.append(f'<tr><td align="center" bgcolor="{PANEL}" style="background:{PANEL};padding:22px 24px;border-top:4px solid {ORANGE};font-family:{BODY};font-size:13px;line-height:1.6;color:{MUTE};">'
            f'<div style="font-family:{HEAD};font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:{TEXT};padding-bottom:6px;">{e(D["reference"]["label"])}</div>'
            f'<div style="padding-bottom:12px;">{ref}</div>'
            f'<div><a href="{SITE}" style="color:{MUTE};text-decoration:underline;">GatorBait Media</a> &middot; Independent Florida Gators coverage</div>'
            f'<div style="padding-top:8px;">You are receiving this test from GatorBait Media.</div></td></tr>')

doc = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<title>GatorBait Magazine: Friday Pregame Edition (TEST)</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&amp;family=Barlow+Condensed:wght@600;700;800&amp;display=swap" rel="stylesheet">
<style>body{{margin:0;padding:0;background:{NAVY};}}table{{border-collapse:collapse;}}img{{-ms-interpolation-mode:bicubic;}}a{{color:{BLUE};}}
@media only screen and (max-width:480px){{.wrap{{width:100%!important;}}}}</style></head>
<body style="margin:0;padding:0;background:{NAVY};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">TEST: Florida at Missouri, Franz Beard&rsquo;s Soothsayer, the Sooth Board and three keys.</div>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="{NAVY}" style="background:{NAVY};"><tr><td align="center">
<table role="presentation" class="wrap" width="600" border="0" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:{NAVY};">
{chr(10).join(rows)}
</table></td></tr></table></body></html>'''
OUT.write_text(doc, encoding='utf-8')
print(OUT, len(doc.encode()), 'bytes')
