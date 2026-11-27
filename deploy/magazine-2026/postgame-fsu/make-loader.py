#!/usr/bin/env python3
"""Write the Florida at Florida State postgame Magazine loader for embed 1dd74333: the postgame loader the build's QA frame uses
(deploy/magazine-2026/postgame-texas-web/candidate-loader.html: dark splash while the bundle loads, eight-second fallback to the
native page) with only its two commit pins, bundle file name and marker comment changed. The result is the same small loader as
the live one: one marker comment and one jsDelivr script URL, each carrying the commit SHA.
Usage: make-loader.py <40-hex commit that contains sports-live/magazine-fsu-postgame.js> [--no-git-check] [--host HOST]
HOST is cdn.jsdelivr.net (default, the live shape). If cdn.jsdelivr.net answers 403 "Package size exceeded 50 MB" for the new commit
(it has for fresh commits of this repository), re-run with --host fastly.jsdelivr.net, gcore.jsdelivr.net or rawcdn.githack.com once
that host returns the exact bytes (see README.md).
Prints the embed HTML (at most 15,000 characters) on stdout; the fingerprints and checks go to stderr. This script only prints text:
it never touches Wix. Jarvis patches the embed himself.
Unless --no-git-check is given, the commit must exist in this repository and contain the built bundle, so a pin that would 404
on the CDN is refused before it is ever pasted into the embed."""
import hashlib, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parents[2]
BASE = HERE.parent / 'postgame-texas-web' / 'candidate-loader.html'
BUNDLE = 'sports-live/magazine-fsu-postgame.js'
argv = sys.argv[1:]
host = 'cdn.jsdelivr.net'
if '--host' in argv:
    k = argv.index('--host'); host = argv[k + 1] if k + 1 < len(argv) else ''; del argv[k:k + 2]
    if host not in ('cdn.jsdelivr.net', 'fastly.jsdelivr.net', 'gcore.jsdelivr.net', 'rawcdn.githack.com'): sys.exit('ERROR: --host must be cdn.jsdelivr.net, fastly.jsdelivr.net, gcore.jsdelivr.net or rawcdn.githack.com')
args = [x for x in argv if not x.startswith('--')]
flags = [x for x in argv if x.startswith('--')]
if len(args) != 1 or not set(flags) <= {'--no-git-check'}: sys.exit(__doc__)
sha = args[0]
if not re.fullmatch(r'[0-9a-f]{40}', sha): sys.exit('ERROR: need the full 40-hex commit sha (git rev-parse HEAD)')
if sha == '0' * 40: sys.exit('ERROR: the all-zero pin is the QA fixture; never use it in the embed')

src = BASE.read_text().strip()
pins = re.findall(r'[0-9a-f]{40}', src)
assert len(pins) == 2 and pins[0] == pins[1], 'the base loader must carry exactly two identical commit pins (marker comment and script URL)'
assert src.count('magazine-postgame.js') == 2 and src.count('postgame texas-web') == 1, 'unexpected base loader: %s' % BASE
out = re.sub(r'[0-9a-f]{40}', sha, src).replace('magazine-postgame.js', 'magazine-fsu-postgame.js').replace('postgame texas-web', 'postgame florida-state')
assert out.count(sha) == 2 and out.count('magazine-fsu-postgame.js') == 2 and 'magazine-postgame.js' not in out and 'texas' not in out.lower()
assert 'src=%s immutable=1 bundle=%s' % (sha, BUNDLE) in out, 'marker comment is not in the live shape'
assert "gh/Presidente49/gatorbait-media-redesign@%s/%s'" % (sha, BUNDLE) in out, 'script URL is not in the live shape'
URL = 'https://%s/gh/Presidente49/gatorbait-media-redesign@%s/%s' % ('cdn.jsdelivr.net', sha, BUNDLE)
if host != 'cdn.jsdelivr.net':  # only the host (and, for githack, the path style) changes; the pin, bundle and everything else stay byte-identical
    URL2 = 'https://rawcdn.githack.com/Presidente49/gatorbait-media-redesign/%s/%s' % (sha, BUNDLE) if host == 'rawcdn.githack.com' else URL.replace('cdn.jsdelivr.net', host)
    assert out.count(URL) == 1; out = out.replace(URL, URL2); URL = URL2
assert 'setTimeout(fallback,8000)' in out and "<script id=\"gbm-magazine-2026-loader\">" in out and out.startswith('<!-- GBM_MAGAZINE_2026_V1 postgame florida-state src='), 'splash/fallback shape changed'
assert len(out) <= 15000, 'longer than the 15,000-character embed limit'
assert all(ord(c) < 0x10000 for c in out)


def djb2(t):  # additive form, as in the Texas runbook: ((h << 5) + h + code), shown in hex
    h = 5381
    for ch in t: h = ((h << 5) + h + ord(ch)) & 0xFFFFFFFF
    return format(h, 'x')


def djb2_xor(t):  # xor form, as in the Vanderbilt script, shown in decimal
    h = 5381
    for ch in t: h = (((h << 5) + h) ^ ord(ch)) & 0xFFFFFFFF
    return h


sys.stderr.write('chars=%d djb2=%s djb2xor=%d\n' % (len(out), djb2(out), djb2_xor(out)))
if '--no-git-check' not in flags:
    def git(*a, text=True): return subprocess.run(['git', '-C', str(REPO)] + list(a), capture_output=True, text=text)
    if git('cat-file', '-e', sha + '^{commit}').returncode != 0: sys.exit('ERROR: commit %s is not in this repository; commit and push the built bundle first (or pass --no-git-check)' % sha)
    if git('cat-file', '-e', '%s:%s' % (sha, BUNDLE)).returncode != 0: sys.exit('ERROR: commit %s does not contain %s; commit the built bundle first, then pin that commit' % (sha[:8], BUNDLE))
    blob = git('show', '%s:%s' % (sha, BUNDLE), text=False).stdout
    sys.stderr.write('bundle at %s: %d bytes, sha256 %s\n' % (sha[:8], len(blob), hashlib.sha256(blob).hexdigest()))
sys.stderr.write('CDN check (must print the same sha256 once the commit is pushed):\n  curl -sS %s | sha256sum\n' % URL)
sys.stdout.write(out)
