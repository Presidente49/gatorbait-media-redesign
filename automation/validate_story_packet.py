#!/usr/bin/env python3
"""Check a draft story packet against existing publication data and its real art.

This is a local, deterministic gate. It starts no agents, calls no APIs and sends
nothing. Usage: python automation/validate_story_packet.py path/to/packet.json
"""
import argparse
import json
from pathlib import Path
import struct
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


def validate(packet):
    errors = []
    story = packet.get('story', {})
    url = story.get('canonicalUrl', '')
    parsed = urlsplit(url)
    if parsed.scheme != 'https' or parsed.netloc != 'www.gatorbaitmedia.com' or not parsed.path.startswith('/post/') or parsed.query or parsed.fragment:
        errors.append('Story must use one clean canonical GatorBait article URL.')
    posts = json.loads((ROOT / 'gazette-live/posts.json').read_text())['posts']
    matches = [p for p in posts if p.get('url') == url]
    if len(matches) != 1:
        errors.append('Canonical story must appear exactly once in current publication data.')
    elif matches[0].get('author') != story.get('author'):
        errors.append('Writer credit differs from the published story.')
    if story.get('author', '') not in packet.get('caption', ''):
        errors.append('Caption must credit the writer.')
    score = packet.get('score')
    if score:
        board = json.loads((ROOT / 'sports-live/scoreboard.json').read_text())
        games = [g for g in board['schedule'] if str(g['eventId']) == str(score.get('eventId'))]
        if len(games) != 1 or games[0].get('status') != 'final':
            errors.append('Score claim must match one final in the current season schedule.')
        else:
            g = games[0]
            if (g.get('score', {}).get('fla'), g.get('score', {}).get('opp')) != (score.get('florida'), score.get('opponent')):
                errors.append('Graphic score differs from the checked season feed.')
            if g.get('opponentRank') != score.get('opponentRankAtKickoff'):
                errors.append('Historical kickoff ranking differs from the checked game record.')
    art = packet.get('art', {})
    for label, rel in [('art', art.get('path', '')), ('preview', packet.get('preview', ''))]:
        path = (ROOT / rel).resolve()
        if not rel or not path.is_relative_to(ROOT) or not path.is_file():
            errors.append(f'{label} must identify a real file inside this repository.')
    if art.get('path') and (ROOT / art['path']).is_file():
        data = (ROOT / art['path']).read_bytes()
        if data[:8] != b'\x89PNG\r\n\x1a\n' or len(data) < 24:
            errors.append('Native art must be a valid PNG with an IHDR size.')
        elif struct.unpack('>II', data[16:24]) != (art.get('width'), art.get('height')):
            errors.append('Native export dimensions do not match the packet.')
    if not art.get('alt', '').strip():
        errors.append('Image alt text is required.')
    if packet.get('state') != 'DRAFT' or packet.get('publication', {}).get('sent') or packet.get('publication', {}).get('scheduled'):
        errors.append('This packet is a draft-only production input.')
    if not packet.get('campaignId') or not packet.get('sourceUrl'):
        errors.append('Campaign identity and source receipt are required.')
    return errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('packet', type=Path)
    args = parser.parse_args()
    packet = json.loads(args.packet.read_text())
    errors = validate(packet)
    print(json.dumps({'campaignId': packet.get('campaignId'), 'state': 'BLOCKED' if errors else 'READY_FOR_NATIVE_REVIEW', 'errors': errors, 'sent': False}, indent=2))
    raise SystemExit(bool(errors))
