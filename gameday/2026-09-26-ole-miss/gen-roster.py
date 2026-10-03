import json, html
d = json.load(open('rosters-raw.json'))
def esc(s): return html.escape(str(s), quote=True)
TEAMS = [
  ('Florida', 'No. 21 · 3-0, 1-0 SEC · Home', '#0021A5', '#FA4616', d['Florida']),
  ('Ole Miss', 'No. 4 · 3-0, 1-0 SEC · Visitors', '#14213D', '#CE1126', d['Ole Miss']),
]
def page(i, name, sub, c1, c2, players):
    rows = ''.join(
        '<tr><td class="n">%s</td><td class="nm">%s</td><td class="p">%s</td><td class="c">%s</td></tr>' % (esc(p[0]), esc(p[1]), esc(p[2]), esc(p[3]))
        for p in sorted(players, key=lambda p: (int(p[0]), p[1])))
    return f'''<section class="page">
  <header>
    <div class="mast"><span class="g">GATOR</span><span class="b">BAIT</span><span class="m">MEDIA</span></div>
    <div class="title"><b>GAME DAY ROSTER</b><span>Ole Miss at Florida · Saturday, Sept. 26, 2026 · 3:30 p.m. ET · ABC · Ben Hill Griffin Stadium</span></div>
  </header>
  <div class="team" style="border-color:{c2}"><h1 style="color:{c1}">{esc(name)}</h1><p>{esc(sub)} · Numerical roster · {len(players)} players</p></div>
  <table><thead><tr><th>#</th><th>Name</th><th>Pos.</th><th>Cl.</th></tr></thead><tbody>{rows}</tbody></table>
  <footer>
    <p class="inj"><b>Injury watch (Friday SEC availability report):</b> Florida WR Eric Singleton Jr. (No. 2) questionable, ankle · Ole Miss RB Kewan Lacy (No. 5) doubtful, shoulder.</p>
    <p class="src">Rosters: official 2026 rosters from FloridaGators.com and OleMissSports.com as of Sept. 26, 2026. Numbers can change on game day. <b>GatorBaitMedia.com</b> · Florida football. All the time. <span class="pg">Page {i} of 2</span></p>
  </footer>
</section>'''
css = '''
@page { size: letter portrait; margin: 0.35in 0.4in; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Helvetica Neue", Arial, sans-serif; color: #10233f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { height: 10.28in; display: flex; flex-direction: column; page-break-after: always; break-after: page; }
.page:last-child { page-break-after: auto; break-after: auto; }
header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #081b35; padding-bottom: 7px; }
.mast { font-weight: 900; font-size: 24px; letter-spacing: -1px; white-space: nowrap; }
.mast .g { color: #003B7A; } .mast .b { color: #FA4616; } .mast .m { font-size: 10px; letter-spacing: 2.5px; color: #003B7A; margin-left: 6px; }
.title b { display: block; font-size: 15px; letter-spacing: 3px; color: #081b35; }
.title span { display: block; font-size: 9px; letter-spacing: .4px; color: #4b586a; margin-top: 2px; }
.team { border-left: 7px solid; padding: 6px 0 4px 10px; margin: 10px 0 8px; }
.team h1 { margin: 0; font-size: 30px; line-height: 1; text-transform: uppercase; letter-spacing: -.5px; }
.team p { margin: 4px 0 0; font-size: 9.5px; letter-spacing: .6px; text-transform: uppercase; color: #4b586a; font-weight: 700; }
table { width: 100%; border-collapse: collapse; font-size: 8.6px; line-height: 1.12; column-count: 3; }
thead { display: none; }
tbody { display: block; column-count: 3; column-gap: 16px; column-rule: 1px solid #d9dee7; }
tr { display: flex; break-inside: avoid; border-bottom: 1px solid #eef1f5; padding: 2.1px 0; }
td.n { width: 24px; font-weight: 900; color: #081b35; text-align: right; padding-right: 7px; font-variant-numeric: tabular-nums; }
td.nm { flex: 1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
td.p { width: 34px; color: #4b586a; font-weight: 700; }
td.c { width: 26px; color: #6d7888; text-align: right; }
footer { margin-top: auto; border-top: 1px solid #c5c9ce; padding-top: 5px; }
footer p { margin: 0 0 3px; font-size: 7.6px; color: #4b586a; line-height: 1.35; }
footer .inj b { color: #081b35; }
footer .pg { float: right; font-weight: 700; color: #081b35; }
'''
doc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GatorBait Game Day Roster — Ole Miss at Florida, Sept. 26, 2026</title><style>' + css + '</style></head><body>' + ''.join(page(i+1, *t) for i, t in enumerate(TEAMS)) + '</body></html>'
open('roster-print.html', 'w').write(doc)
print('html', len(doc))
