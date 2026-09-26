"""Build the halftime story (Ricos richContent) from article.json. Usage: python3 build.py"""
import json, pathlib, itertools
HERE = pathlib.Path(__file__).resolve().parent
A = json.loads((HERE / 'article.json').read_text())
ids = (f'n{i}' for i in itertools.count(1))
def seg(s):
    text, *mods = s if isinstance(s, list) else [s]
    dec = []
    for m in mods:
        if m == 'b': dec.append({'type': 'BOLD', 'fontWeightValue': 700})
        elif m == 'i': dec.append({'type': 'ITALIC', 'italicData': True})
        else: dec.append({'type': 'LINK', 'linkData': {'link': {'url': m, 'target': 'BLANK', 'rel': {'noreferrer': True}}}})
    return {'type': 'TEXT', 'id': '', 'nodes': [], 'textData': {'text': text, 'decorations': dec}}
nodes = []
for kind, *rest in A['body']:
    if kind == 'p':
        nodes.append({'type': 'PARAGRAPH', 'id': next(ids), 'nodes': [seg(s) for s in rest[0]], 'paragraphData': {}})
    elif kind == 'h':
        nodes.append({'type': 'HEADING', 'id': next(ids), 'nodes': [seg(rest[0])], 'headingData': {'level': 2}})
    elif kind == 'img':
        src, w, h, alt, cap = rest
        nodes.append({'type': 'IMAGE', 'id': next(ids), 'nodes': [{'type': 'CAPTION', 'id': next(ids), 'nodes': [seg([cap, 'b'])]}],
                      'imageData': {'containerData': {'width': {'size': 'CONTENT'}, 'alignment': 'CENTER', 'textWrap': True},
                                    'image': {'src': {'id': src}, 'width': w, 'height': h}, 'altText': alt, 'caption': cap}})
rc = {'nodes': nodes}
(HERE / 'richContent.json').write_text(json.dumps(rc, ensure_ascii=False))
text = ' '.join(t['textData']['text'] for n in nodes for t in n['nodes'] if t.get('type') == 'TEXT')
print('nodes', len(nodes), 'words', len(text.split()), 'bytes', len(json.dumps(rc)))
