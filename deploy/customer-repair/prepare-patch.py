#!/usr/bin/env python3
"""Prepare a guarded Wix custom-embed PATCH body. This script makes no API calls."""
import argparse
import json
import os
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('direction', choices=['apply', 'rollback'])
parser.add_argument('embed_id')
parser.add_argument('--current', type=Path, required=True, help='Fresh Get Custom Embed JSON response')
parser.add_argument('--expected-revision', required=True, help='Revision read immediately before this operation')
parser.add_argument('--snapshot-dir', type=Path, required=True, help='Private preserved snapshots outside the public checkout')
parser.add_argument('--output', type=Path, required=True, help='Private PATCH body path outside the public checkout; never stdout')
args = parser.parse_args()
repo = Path(__file__).resolve().parents[2]
root = args.snapshot_dir.resolve()
for path in [root, args.current.resolve(), args.output.resolve()]:
    if path == repo or repo in path.parents:
        parser.error('Provider snapshots and PATCH bodies must stay outside the public checkout')
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
body = json.dumps({'customEmbed': {'id': args.embed_id, 'revision': str(current['revision']),
                  'embedData': target['embedData']}}, ensure_ascii=False)
with os.fdopen(os.open(args.output, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), 'w') as output:
    output.write(body)
os.chmod(args.output, 0o600)
print('Guarded PATCH body written privately; no API call made.')
