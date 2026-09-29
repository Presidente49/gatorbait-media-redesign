#!/usr/bin/env python3
"""Prepare a guarded Wix custom-embed PATCH body. This script makes no API calls."""
import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('direction', choices=['apply', 'rollback'])
parser.add_argument('embed_id')
parser.add_argument('--current', type=Path, required=True, help='Fresh Get Custom Embed JSON response')
parser.add_argument('--expected-revision', required=True, help='Revision read immediately before this operation')
args = parser.parse_args()
root = Path(__file__).resolve().parent
current = json.loads(args.current.read_text())
current = current.get('customEmbed', current)
source_suffix, target_suffix = ('before', 'after') if args.direction == 'apply' else ('after', 'before')
source = json.loads((root / f'{args.embed_id}.{source_suffix}.json').read_text())
target = json.loads((root / f'{args.embed_id}.{target_suffix}.json').read_text())
if current.get('id') != args.embed_id:
    raise SystemExit('STOP: current object ID differs')
if str(current.get('revision')) != args.expected_revision:
    raise SystemExit('STOP: current revision differs')
for field in ('enabled', 'loadOnce', 'position', 'domain', 'pageFilter'):
    if current.get(field) != source.get(field):
        raise SystemExit(f'STOP: provider {field} differs from recorded baseline')
if current.get('embedData') != source.get('embedData'):
    raise SystemExit('STOP: provider code/category changed; inspect and merge instead of overwriting')
html = target['embedData']['html']
if len(html) > 15000:
    raise SystemExit('STOP: Wix HTML character limit exceeded')
print(json.dumps({'customEmbed': {'id': args.embed_id, 'revision': str(current['revision']),
                  'embedData': target['embedData']}}, ensure_ascii=False))
