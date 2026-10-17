#!/usr/bin/env python3
"""Fail closed on private runtime/CRM paths. Report only counts, never contents."""
import argparse
from pathlib import Path, PurePosixPath
import subprocess

def private_path(value):
    p = PurePosixPath(value)
    return (value.startswith(('backups/crm/', 'scratchpad/', 'private/', '.shared-memory/',
                              'social/queue/', 'social/sent/', 'marketing/queue/', 'marketing/outreach/'))
            or (value.startswith('deploy/customer-repair/') and p.suffix == '.json')
            or '.state' in p.parts or p.name.endswith('.runtime.json')
            or p.name == '.env' or (p.name.startswith('.env.') and p.name != '.env.example'))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument('--changed-from', help='Check added/modified tracked paths since a base ref; deletions allowed')
    selection.add_argument('--artifact-root', type=Path, help='Check all files, including ignored files, before a root Pages upload')
    args = parser.parse_args()
    if args.changed_from:
        paths = subprocess.check_output(['git', 'diff', '--name-only', '-z', '--diff-filter=ACMRT', args.changed_from, '--'], text=True).split('\0')
    else:
        paths = [p.relative_to(args.artifact_root).as_posix() for p in args.artifact_root.rglob('*') if p.is_file() and '.git' not in p.relative_to(args.artifact_root).parts and not (p.name == '.gitkeep' and p.stat().st_size == 0)]
    blocked = sum(private_path(p) for p in paths if p)
    print(f'Public boundary: {blocked} blocked private paths.')
    return 1 if blocked else 0

if __name__ == '__main__':
    raise SystemExit(main())
