"""Original stylized football-helmet SVGs in team colors (no school logos or artwork).
Usage: from helmets import helmet; helmet('FLA', flip=False, size=120)"""
# shell, stripe, facemask, decal text color. Stylized from each team's public colors.
T = {
 'FLA': ('#0021a5', '#fa4616', '#ffffff', '#fa4616'), 'MISS': ('#13294b', '#cf142b', '#ffffff', '#cf142b'),
 'TEX': ('#ffffff', '#af5c37', '#af5c37', '#af5c37'), 'TENN': ('#ffffff', '#ff8200', '#ff8200', '#ff8200'),
 'UGA': ('#ba0c2f', '#2c2a29', '#b3b3b3', '#ffffff'), 'OU': ('#ffffff', '#990000', '#990000', '#990000'),
 'ND': ('#c99700', '#062340', '#062340', '#062340'), 'PUR': ('#ceb888', '#000000', '#000000', '#000000'),
 'OSU': ('#a8adb4', '#ba0c2f', '#ba0c2f', '#ba0c2f'), 'ILL': ('#13294b', '#ff5f05', '#ff5f05', '#ff5f05'),
 'ALA': ('#9e1b32', '#ffffff', '#b3b3b3', '#ffffff'), 'SC': ('#73000a', '#000000', '#ffffff', '#ffffff'),
 'LSU': ('#fdd023', '#461d76', '#461d76', '#461d76'), 'TA&M': ('#ffffff', '#500000', '#500000', '#500000'),
 'USC': ('#9d2235', '#ffc72c', '#b3b3b3', '#ffc72c'), 'ORE': ('#00934b', '#fff41b', '#fff41b', '#fff41b'),
 'PSU': ('#ffffff', '#061440', '#061440', '#061440'), 'WIS': ('#ffffff', '#a00000', '#a00000', '#a00000'),
 'LOU': ('#c9001f', '#ffffff', '#2c2a29', '#ffffff'), 'WAKE': ('#2c2a29', '#ceb888', '#ceb888', '#ceb888'),
 'MICH': ('#00274c', '#ffcb05', '#ffcb05', '#ffcb05'), 'IOWA': ('#231f20', '#fcd116', '#fcd116', '#fcd116'),
 'MSST': ('#5d1725', '#c1c6c8', '#c1c6c8', '#ffffff'), 'MIZ': ('#000000', '#f1b82d', '#f1b82d', '#f1b82d'),
 'AUB': ('#002b5c', '#f26522', '#ffffff', '#f26522'), 'VAN': ('#000000', '#cfae70', '#cfae70', '#cfae70'),
}
SHELL = 'M32 64 C18 63 8 53 6 39 C4 17 24 4 48 4 C69 4 85 14 89 30 L79 32 C73 34 71 41 71 47 L77 68 C63 73 46 71 32 64 Z'
def helmet(abbr, flip=False, size=120, uid=None):
    s, st, fm, dc = T[abbr]
    uid = uid or (abbr.replace('&', '') + ('f' if flip else ''))
    line = '#081b35' if s.lower() in ('#ffffff', '#fdd023', '#c99700', '#ceb888', '#a8adb4') else 'rgba(0,0,0,.55)'
    tf = ' transform="translate(100,0) scale(-1,1)"' if flip else ''
    txt = abbr if len(abbr) <= 4 else abbr[:4]
    fs = 15 if len(txt) <= 3 else 12
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="{size}" height="{size*0.8:.0f}"><defs><clipPath id="c{uid}"><path d="{SHELL}"/></clipPath>
<linearGradient id="g{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
<g{tf}><path d="{SHELL}" fill="{s}" stroke="{line}" stroke-width="1.6"/>
<g clip-path="url(#c{uid})"><path d="M4 44 C4 14 44 -2 90 24" fill="none" stroke="{st}" stroke-width="7"/><path d="M4 44 C4 14 44 -2 90 24" fill="none" stroke="{line}" stroke-width="7" stroke-dasharray="0" opacity="0"/><path d="{SHELL}" fill="url(#g{uid})"/></g>
<circle cx="50" cy="45" r="3.6" fill="{line}" opacity=".7"/><path d="M71 47 L77 68" stroke="{line}" stroke-width="1" opacity=".5"/>
<g fill="none" stroke="rgba(255,255,255,.45)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M80 33 Q96 33 97 41 L97 61 Q96 67 78 66"/><path d="M73 44 H97"/><path d="M75 55 H97"/><path d="M88 33.5 V66"/></g><g fill="none" stroke="{fm}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M80 33 Q96 33 97 41 L97 61 Q96 67 78 66"/><path d="M73 44 H97"/><path d="M75 55 H97"/><path d="M88 33.5 V66"/></g>
</g><text x="{38 if not flip else 62}" y="33" text-anchor="middle" font-family="BarlowC,'Barlow Condensed',Arial" font-weight="800" font-size="{fs}" fill="{dc}" stroke="{line}" stroke-width=".4">{txt.replace('&','&amp;')}</text></svg>'''
if __name__ == '__main__':
    import pathlib
    cells = ''.join(f'<div>{helmet(k)}{helmet(k, flip=True)}</div>' for k in T)
    pathlib.Path('sheet.html').write_text(f'<body style="margin:0;background:#081b35;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:12px;width:1500px">{cells}</body>'.replace('<div>', '<div style="display:flex;gap:4px">'))
