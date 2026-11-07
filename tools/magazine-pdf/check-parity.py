#!/usr/bin/env python3
"""Full-copy parity check: package article text vs the prepared story bodies (and, optionally, a built PDF).

Usage: python3 -I tools/magazine-pdf/check-parity.py <posts.json> <package-articles-dir> [--pdf file.pdf]
  posts.json            magazine/issues/<issue>/posts.json (output of prepare.py)
  package-articles-dir  the handoff package's articles/ folder; articles.json (the manifest) is read from that folder or from
                        its parent, and each story is matched to posts.json by post id
  --pdf file.pdf        also confirm, with pdftotext, that the first 8 and last 8 words of every prepared paragraph are in the PDF

Writes a markdown report to stdout. Exit status: 0 = nothing UNEXPLAINED, 1 = at least one UNEXPLAINED item, 2 = usage or input error.
The checker is read-only: it changes no file and calls no network service.

What is compared, per story (matched by post id):
  (a) every source paragraph (articles/*.txt, one paragraph per line; a literal line break inside a block counts as two paragraphs,
      the same way prepare.py splits it) must be in the prepared copy. A missing one is 'dropped by rule' only when it is
        - a bare byline line ('By Name', or the story byline itself),
        - a link-only/promo line (a URL or bare domain, a short lead-in plus URL, a sponsor label, a 'More from ...:' line, a short
          line whose text is mostly or finally link labels per the package's native snapshot, or the heading of a section that holds
          only such lines),
        - an empty line,
        - a heading that repeats the story title,
        - a photo-credit or caption line ('Cover: ...', 'Photo by ...', 'Photo: ...', 'Top photo: ...', the package's image credit
          or caption).
      Anything else is UNEXPLAINED. Prepared paragraphs with no source counterpart are UNEXPLAINED too.
  (b) text differences inside matched paragraphs. The only expected ones are Condon '2-3' to '3-6' and McMiller 'Springs' to
      'Spring' (the two verified live corrections); each must be present. A paragraph whose end was trimmed is judged like a
      dropped paragraph (a promo or link tail is 'dropped by rule'). Every other difference is UNEXPLAINED.
  (c) the story's final source paragraph (its ending) must be in the prepared copy or in the dropped-by-rule list.
With --pdf: for every prepared paragraph the first 8 words and the last 8 words must be in the PDF text. Case, whitespace,
punctuation, quote style and line-break hyphens are ignored, and a phrase must occur at least as often in the PDF as it does in
the prepared copy (pull quotes repeat body sentences, so a pull quote cannot stand in for a missing paragraph).
"""
from __future__ import annotations

import difflib
import html
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

# The two verified live corrections the prepared copy must carry: (post id, word in the source, word in the prepared copy).
EXPECTED = [
    ('27b79db1-f0e7-40eb-9639-49a60420ac00', '2-3', '3-6', "Condon: '2-3 shooting from the field' became '3-6' (ESPN box score)"),
    ('e0e37d66-2592-443d-8a5e-0058bc507802', 'Springs', 'Spring', "McMiller: 'Silver Springs, Maryland' became 'Silver Spring' (ESPN roster)"),
]

URL_RE = re.compile(r'(?:https?://|www\.)\S+', re.I)
DOMAIN_RE = re.compile(r'^[a-z0-9][a-z0-9.\-]*\.(?:com|net|org|edu|gov|io|co)$', re.I)
BYLINE_RE = re.compile(r'^by\s+\S+(?:\s+\S+){0,3}$', re.I)
CREDIT_LABEL_RE = re.compile(r'^(?:cover|top photo|photo|photos|graphic|credit|illustration|image|video still)\s*:', re.I)
CREDIT_INLINE_RE = re.compile(r'\b(?:archival photo|photo|photos|video still|graphic|illustration)\s+by\b|\bvideo still\s*:|\bwikimedia commons\b|\bCC BY\b', re.I)
PROMO_LABEL_RE = re.compile(r'^(?:advertisement|sponsored(?: content)?|sponsor|ad)$', re.I)
PROMO_LEAD_RE = re.compile(r'^(?:more from|read more|related|watch|listen|subscribe|follow)\b[^:]{0,60}:', re.I)


def ws(s):
    """Whitespace-normalized text (non-breaking spaces and runs of spaces become one space)."""
    return re.sub(r'\s+', ' ', s).strip()


def words(s):
    return len(s.split())


def head(s, n=10):
    w = s.split()
    return ' '.join(w[:n]) + (' ...' if len(w) > n else '')


def md(s):
    """Text safe to place inside a markdown inline-code span."""
    return s.replace('`', "'")


# ---------------------------------------------------------------------------------------------------------------- inputs

def fail(msg):
    print('check-parity.py: ' + msg, file=sys.stderr)
    sys.exit(2)


def load_manifest(pkg_dir):
    for cand in (pkg_dir / 'articles.json', pkg_dir.parent / 'articles.json'):
        if cand.is_file():
            return cand, json.loads(cand.read_text(encoding='utf-8'))
    fail('articles.json not found in %s or its parent' % pkg_dir)


def resolve(manifest_path, pkg_dir, rel):
    for cand in (manifest_path.parent / rel, pkg_dir / Path(rel).name):
        if cand.is_file():
            return cand
    return None


def read_source(path):
    """-> (header dict, [paragraph], number of blocks that held a literal line break). Header is title, byline, date, url, blank."""
    lines = path.read_text(encoding='utf-8').split('\n')
    if len(lines) < 6 or not lines[3].startswith('http') or lines[4].strip():
        fail('unexpected header in %s (want title, byline, date, url, blank line)' % path)
    header = {'title': lines[0].strip(), 'byline': lines[1].strip(), 'date': lines[2].strip(), 'url': lines[3].strip()}
    body = '\n'.join(lines[5:])
    blocks = [b for b in re.split(r'\n[ \t]*\n', body) if b.strip()]
    paras, multi = [], 0
    for b in blocks:
        parts = [ws(x) for x in b.split('\n') if ws(x)]
        multi += len(parts) > 1
        paras.extend(parts)
    return header, paras, multi


def prepared_paragraphs(post):
    """-> [(tag, text)] from the prepared html, tags stripped, entities decoded, a literal newline starting a new paragraph."""
    out = []
    for tag, inner in re.findall(r'<(p|h3|h4|blockquote)>(.*?)</\1>', post['html'], re.S):
        text = html.unescape(re.sub(r'<[^>]+>', '', inner))
        for part in text.split('\n'):
            if ws(part):
                out.append((tag, ws(part)))
    return out


def native_lines(path):
    """Per source line (normalized text) from the package's native snapshot: node kind, list item, link characters, ends on a link."""
    info = {}
    if path is None:
        return info
    nodes = json.loads(path.read_text(encoding='utf-8')).get('richContent', {}).get('nodes', [])

    def add(node, kind, in_list):
        chars = []
        for child in node.get('nodes', []):
            if child.get('type') != 'TEXT':
                continue
            td = child.get('textData', {})
            linked = any(d.get('type') == 'LINK' for d in td.get('decorations', []))
            chars.extend((ch, linked) for ch in td.get('text', ''))
        cur, lines = [], []
        for ch, linked in chars:
            if ch == '\n':
                lines.append(cur)
                cur = []
            else:
                cur.append((ch, linked))
        lines.append(cur)
        for ln in lines:
            key = ws(''.join(c for c, _ in ln))
            if not key:
                continue
            solid = [(c, l) for c, l in ln if not c.isspace() and c not in '.,;:!?)("“”’\'—–-·']
            info[key] = {'kind': kind, 'list': in_list, 'chars': sum(1 for c, _ in ln if not c.isspace()),
                         'link_chars': sum(1 for c, l in ln if l and not c.isspace()), 'ends_link': bool(solid) and solid[-1][1]}

    for node in nodes:
        t = node.get('type')
        if t in ('BULLETED_LIST', 'ORDERED_LIST'):
            for item in node.get('nodes', []):
                for child in item.get('nodes', []):
                    if child.get('type') == 'PARAGRAPH':
                        add(child, 'PARAGRAPH', True)
        elif t in ('PARAGRAPH', 'HEADING'):
            add(node, t, False)
        elif t == 'BLOCKQUOTE':
            for child in node.get('nodes', []):
                add(child, 'BLOCKQUOTE', False)
    return info


# ----------------------------------------------------------------------------------------------------------------- align

def similarity(a, b, cache={}):
    """0 when two paragraphs are not the same paragraph; 1 when identical; else a pairing score (>= 0.7)."""
    if a == b:
        return 1.0
    if (a, b) in cache:
        return cache[(a, b)]
    ta, tb = a.split(' '), b.split(' ')
    score = 0.0
    if min(len(ta), len(tb)) >= 5:
        if ta[:len(tb)] == tb or tb[:len(ta)] == ta or ta[-len(tb):] == tb or tb[-len(ta):] == ta:
            score = 0.8  # one paragraph is the head or the tail of the other
        elif len(set(ta) & set(tb)) / len(set(ta) | set(tb)) >= 0.4:
            r = difflib.SequenceMatcher(None, ta, tb, autojunk=False).ratio()
            score = r if r >= 0.7 else 0.0
    cache[(a, b)] = score
    return score


def align(src, prep):
    """Order-preserving pairing of source and prepared paragraphs that maximizes total similarity -> [(i, j)]."""
    n, m = len(src), len(prep)
    sim = [[similarity(src[i], prep[j]) for j in range(m)] for i in range(n)]
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            best = max(dp[i + 1][j], dp[i][j + 1])
            if sim[i][j] > 0:
                best = max(best, dp[i + 1][j + 1] + sim[i][j])
            dp[i][j] = best
    pairs, i, j = [], 0, 0
    while i < n and j < m:
        if sim[i][j] > 0 and abs(dp[i][j] - (dp[i + 1][j + 1] + sim[i][j])) < 1e-9:
            pairs.append((i, j))
            i += 1
            j += 1
        elif dp[i + 1][j] >= dp[i][j + 1]:
            i += 1
        else:
            j += 1
    return pairs


def word_diffs(a, b):
    """Word-level differences between a source and a prepared paragraph -> [(op, src words, prepared words, context, at_end)]."""
    ta, tb = a.split(' '), b.split(' ')
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, ta, tb, autojunk=False).get_opcodes():
        if op != 'equal':
            out.append((op, ' '.join(ta[i1:i2]), ' '.join(tb[j1:j2]), ' '.join(ta[max(0, i1 - 3):i1]), i2 == len(ta) and j2 == len(tb)))
    return out


# ------------------------------------------------------------------------------------------------------------- classify

class Rules:
    def __init__(self, post, header, manifest_entry, native):
        self.post, self.header, self.native = post, header, native
        self.title = ws(post['title'])
        self.bylines = {ws(post.get('byline', '')), ws(header['byline'])}
        self.author = post.get('author', '')
        self.credits = [ws(manifest_entry.get(k, '')) for k in ('image_credit', 'image_caption') if manifest_entry.get(k)]
        self.caption = ws(post.get('caption') or '')

    def kind(self, text):
        info = self.native.get(text)
        if info:
            return info['kind']
        return None

    def is_heading(self, text):
        k = self.kind(text)
        if k:
            return k == 'HEADING'
        return words(text) <= 10 and not re.search(r'[.?!"”]$', text)

    def link_only(self, text):
        """-> note or None."""
        if PROMO_LABEL_RE.match(text):
            return 'sponsor/ad label'
        if DOMAIN_RE.match(text.replace(' ', '')) and words(text) <= 4:
            return 'bare site name (domain only)'
        urls = URL_RE.findall(text)
        if urls:
            rest = re.findall(r'\w+', URL_RE.sub(' ', text))
            if not rest:
                return 'bare URL'
            if re.search(r'(?:https?://|www\.)\S+[\s.,;:)]*$', text, re.I) and len(rest) <= 40:
                return 'short lead-in plus URL'
        if PROMO_LEAD_RE.match(text) and words(text) <= 30:
            return "'%s' promo line" % text.split(':')[0]
        info = self.native.get(text)
        if info and info['link_chars'] and words(text) <= 30 and (info['link_chars'] / max(info['chars'], 1) >= 0.3 or info['ends_link']):
            return 'short line of link labels (%d of %d characters are links%s)' % (info['link_chars'], info['chars'], ', ends on a link' if info['ends_link'] else '')
        return None

    def classify(self, text):
        """-> (category, note) for a paragraph that may be dropped by rule, else None."""
        if not text.strip():
            return ('empty line', '')
        if text in self.bylines or BYLINE_RE.match(text):
            name = re.sub(r'^by\s+', '', text, flags=re.I)
            note = ''
            if text not in self.bylines and self.author and name.lower() != self.author.lower():
                note = "the name on the line ('%s') is not the post author's ('%s')" % (name, self.author)
            return ('bare byline line', note)
        note = self.link_only(text)
        if note:
            return ('link-only/promo line', note)
        if text == self.title or (self.is_heading(text) and text.lower() == self.title.lower()):
            return ('heading repeated', 'repeats the story title')
        if CREDIT_LABEL_RE.match(text) or (words(text) <= 60 and CREDIT_INLINE_RE.search(text)) or any(c and c in text for c in self.credits):
            note = 'carried as the hero caption' if self.caption and self.caption in text else ''
            return ('photo-credit/caption line', note)
        return None


# --------------------------------------------------------------------------------------------------------------- compare

def compare_story(post, header, src, prep, rules, multi_blocks):
    """-> result dict for one story."""
    prep_text = [t for _, t in prep]
    pairs = align(src, prep_text)
    by_src = {i: j for i, j in pairs}
    used = set(by_src.values())
    res = {'post': post, 'src': src, 'prep': prep, 'multi_blocks': multi_blocks, 'exact': 0, 'dropped': [], 'unexplained': [],
           'diffs': [], 'added': [], 'corrections': [], 'ending': None}
    status = {}  # source index -> ('present' | 'diff' | 'dropped' | 'unexplained', detail)

    # (b) differences inside matched paragraphs; trimmed tails are judged like dropped text.
    for i, j in pairs:
        a, b = src[i], prep_text[j]
        if a == b:
            res['exact'] += 1
            status[i] = ('present', '')
            continue
        verdicts = []
        for op, old, new, ctx, at_end in word_diffs(a, b):
            exp = next((e for e in EXPECTED if e[0] == post['id'] and op == 'replace' and subst_ok(old, new, e[1], e[2])), None)
            if exp:
                verdicts.append(('expected', old, new, ctx, exp[3]))
            elif op == 'delete' and at_end:
                cat = rules.classify(old) or ((('link-only/promo line', rules.link_only(old)) if rules.link_only(old) else None))
                if cat:
                    verdicts.append(('tail dropped by rule', old, '', ctx, '%s: %s' % cat))
                else:
                    verdicts.append(('UNEXPLAINED', old, '', ctx, 'the end of the paragraph was cut and the removed text is not a byline, link/promo or credit line'))
            else:
                verdicts.append(('UNEXPLAINED', old, new, ctx, 'not one of the expected corrections'))
        res['diffs'].append({'i': i, 'a': a, 'verdicts': verdicts})
        status[i] = ('diff', '')
        if any(v[0] == 'UNEXPLAINED' for v in verdicts):
            status[i] = ('unexplained', 'text differs')
        elif any(v[0] == 'tail dropped by rule' for v in verdicts):
            status[i] = ('dropped', 'tail trimmed')
        for v in verdicts:
            if v[0] == 'expected':
                res['corrections'].append((post['id'], v[1], v[2]))

    # (a) source paragraphs missing from the prepared copy.
    missing = [i for i in range(len(src)) if i not in by_src]
    cats = {i: rules.classify(src[i]) for i in missing}
    # A heading that is directly followed by a run of dropped link/promo, credit or byline lines (the run ends at the next heading or
    # at the first paragraph that was kept) and by nothing else is the heading of a link-only section: it would be orphaned.
    for i in missing:
        if cats[i] or not rules.is_heading(src[i]):
            continue
        run = []
        k = i + 1
        while k < len(src) and k in cats and not rules.is_heading(src[k]):
            run.append(k)
            k += 1
        if run and all(cats[s] for s in run) and any(cats[s][0] == 'link-only/promo line' for s in run):
            cats[i] = ('link-only/promo line', 'heading of a section that holds only link/promo lines')
    for i in missing:
        if cats[i]:
            res['dropped'].append({'i': i, 'text': src[i], 'cat': cats[i][0], 'note': cats[i][1]})
            status[i] = ('dropped', cats[i][0])
        else:
            res['unexplained'].append({'i': i, 'text': src[i], 'why': 'no rule category applies: not a bare byline, link/promo line, empty line, repeated heading or photo credit/caption'})
            status[i] = ('unexplained', 'missing')
    for j in range(len(prep)):
        if j not in used:
            res['added'].append({'j': j, 'tag': prep[j][0], 'text': prep_text[j]})

    # (c) ending
    last = len(src) - 1
    st = status.get(last, ('unexplained', 'missing'))
    res['ending'] = {'i': last, 'text': src[last], 'status': st[0], 'detail': st[1]}
    return res


def subst_ok(old, new, want_old, want_new):
    """True when old -> new is want_old -> want_new with the same leading and trailing punctuation."""
    mo, mn = re.match(r'^(\W*)(.*?)(\W*)$', old, re.S), re.match(r'^(\W*)(.*?)(\W*)$', new, re.S)
    return bool(mo and mn and mo.group(1) == mn.group(1) and mo.group(3) == mn.group(3) and mo.group(2) == want_old and mn.group(2) == want_new)


# ------------------------------------------------------------------------------------------------------------------ pdf

def pdf_key(s):
    return re.sub(r'[\W_]+', '', unicodedata.normalize('NFKC', s).casefold())


def pdf_check(posts, preps, pdf_path):
    """-> per-story results for the first-8 / last-8 word test. preps: post id -> [(tag, text)]."""
    try:
        raw = subprocess.run(['pdftotext', '-raw', pdf_path, '-'], capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError) as e:
        fail('pdftotext failed on %s: %s' % (pdf_path, e))
    pdf = pdf_key(raw)
    # What the prepared copy itself contains, per phrase: body paragraphs of every story plus every pull quote (the builder prints
    # a pull quote verbatim from the body, so it repeats a body sentence).
    corpus = [pdf_key(t) for p in posts for _, t in preps.get(p['id'], [])]
    corpus += [pdf_key(p['pullquote']['text']) for p in posts if p.get('pullquote') and p.get('hero') == 'pullquote']

    def need(k):
        return max(1, sum(c.count(k) for c in corpus))

    def found(phrase_words):
        k = pdf_key(' '.join(phrase_words))
        n = need(k)
        if pdf.count(k) >= n:
            return 'ok'
        # A paragraph can be split by a page or column break (a folio or running head falls inside the 8 words).
        for cut in range(2, len(phrase_words) - 1):
            l, r = pdf_key(' '.join(phrase_words[:cut])), pdf_key(' '.join(phrase_words[cut:]))
            if len(l) >= 8 and len(r) >= 8 and pdf.count(l) >= n and pdf.count(r) >= n:
                return 'split'
        return 'missing (found %d of %d)' % (pdf.count(k), n)

    out = {}
    for p in posts:
        rows = []
        for _, text in preps.get(p['id'], []):
            w = text.split()
            rows.append((text, found(w[:8]), found(w[-8:])))
        out[p['id']] = rows
    return out, len(raw)


# ---------------------------------------------------------------------------------------------------------------- report

def main():
    args = sys.argv[1:]
    pdf_path = None
    if '--pdf' in args:
        k = args.index('--pdf')
        if k + 1 >= len(args):
            fail('--pdf needs a file')
        pdf_path = args[k + 1]
        del args[k:k + 2]
    if len(args) != 2:
        print(__doc__, file=sys.stderr)
        sys.exit(2)
    posts_path, pkg_dir = Path(args[0]), Path(args[1])
    if not posts_path.is_file() or not pkg_dir.is_dir():
        fail('posts.json or package articles dir not found')
    if pdf_path and not Path(pdf_path).is_file():
        fail('PDF not found: ' + pdf_path)
    posts_doc = json.loads(posts_path.read_text(encoding='utf-8'))
    posts = posts_doc['posts']
    by_id = {p['id']: p for p in posts}
    manifest_path, manifest = load_manifest(pkg_dir)
    entries = manifest['articles']

    results, problems = [], []  # problems: (story, kind, text)
    for e in entries:
        post = by_id.get(e['id'])
        if post is None:
            problems.append((e.get('title', e['id']), 'story missing', 'package story %s is not in posts.json' % e['id']))
            continue
        txt = resolve(manifest_path, pkg_dir, e['article_path'])
        if txt is None:
            fail('source text not found for %s (%s)' % (e['id'], e['article_path']))
        header, src, multi = read_source(txt)
        native = native_lines(resolve(manifest_path, pkg_dir, e['native_path']) if e.get('native_path') else None)
        prep = prepared_paragraphs(post)
        rules = Rules(post, header, e, native)
        r = compare_story(post, header, src, prep, rules, multi)
        r['entry'], r['header'] = e, header
        # header: title, byline, url
        hp = []
        if ws(header['title']) != ws(post['title']):
            hp.append(('UNEXPLAINED', "title differs: source `%s`, prepared `%s`" % (md(header['title']), md(post['title']))))
        else:
            hp.append(('ok', 'title identical'))
        body_byline = any(ws(post.get('byline', '')) == s for s in src)
        if ws(header['byline']) == ws(post.get('byline', '')):
            hp.append(('ok', 'byline identical (`%s`)' % md(header['byline'])))
        elif body_byline:
            hp.append(('ok', "byline `%s` is the story's own byline line in the source body (the package header has `%s`)" % (md(post['byline']), md(header['byline']))))
        else:
            hp.append(('UNEXPLAINED', "byline differs: source `%s`, prepared `%s`" % (md(header['byline']), md(post.get('byline', '')))))
        url = header['url'].replace('https://www.gatorbaitmedia.com', '')
        hp.append(('ok', 'url path identical') if url == post['url'] else ('UNEXPLAINED', 'url path differs: source `%s`, prepared `%s`' % (md(url), md(post['url']))))
        r['header_checks'] = hp
        results.append(r)
    seen = {e['id'] for e in entries}
    for p in posts:
        if p['id'] not in seen:
            problems.append((p['title'], 'no source', 'posts.json story %s (%s) has no package source' % (p['id'], p['key'])))

    # expected corrections
    corr = []
    for pid, old, new, label in EXPECTED:
        n = sum(1 for r in results if r['post']['id'] == pid for c in r['corrections'] if c[1:] == (old, new) or (subst_ok(c[1], c[2], old, new)))
        in_set = any(r['post']['id'] == pid for r in results)
        corr.append((label, old, new, n, in_set))

    pdf_res = pdf_len = None
    if pdf_path:
        pdf_res, pdf_len = pdf_check(posts, {r['post']['id']: r['prep'] for r in results}, pdf_path)

    # ------------------------------------------------------------------ render
    un_total = len(problems)
    lines = []
    w = lines.append
    w('# Full-copy parity report')
    w('')
    w('Package source text (articles/*.txt) against the prepared story bodies (`posts.json`), matched by post id through `articles.json`.')
    w('')
    w('- Prepared copy: `%s` (issue `%s`, %d stories)' % (md(str(posts_path)), md(posts_doc.get('issue', '?')), len(posts)))
    w('- Package: `%s` (manifest acquired %s; latest addition %s; %d stories)' % (md(str(manifest_path)), manifest.get('acquired_at', '?'), manifest.get('latest_addition_acquired_at', '?'), len(entries)))
    w('- Tool: `tools/magazine-pdf/check-parity.py` (read-only)' + ('; PDF: `%s`' % md(pdf_path) if pdf_path else '; no PDF checked'))
    w('')

    for r in results:
        r['n_un'] = len(r['unexplained']) + sum(1 for d in r['diffs'] for v in d['verdicts'] if v[0] == 'UNEXPLAINED') + len(r['added']) \
            + sum(1 for k, _ in r['header_checks'] if k == 'UNEXPLAINED') + (1 if r['ending']['status'] == 'unexplained' else 0)
        # an unexplained missing ending is already in r['unexplained']; do not count it twice
        if r['ending']['status'] == 'unexplained' and any(u['i'] == r['ending']['i'] for u in r['unexplained']):
            r['n_un'] -= 1
        un_total += r['n_un']
    corr_missing = [c for c in corr if c[4] and c[3] != 1]
    un_total += len(corr_missing)
    pdf_missing = 0
    if pdf_res is not None:
        for p in posts:
            rows = pdf_res.get(p['id'], [])
            pdf_missing += sum(1 for _, a, b in rows if a.startswith('missing') or b.startswith('missing'))
            if not rows:
                pdf_missing += 1
    fail_total = un_total + pdf_missing

    w('## Result: %s' % ('PASS: nothing UNEXPLAINED' if not fail_total else 'FAIL: %d UNEXPLAINED item(s)%s' % (un_total, (' and %d PDF paragraph(s) not found' % pdf_missing) if pdf_res is not None and pdf_missing else '')))
    w('')
    w('| # | Story | Source paragraphs | Prepared paragraphs | Identical | Differ | Dropped by rule | UNEXPLAINED | Ending (c) |')
    w('|---|---|---:|---:|---:|---:|---:|---:|---|')
    pos = {p['id']: n + 1 for n, p in enumerate(posts)}
    for r in sorted(results, key=lambda r: pos[r['post']['id']]):
        e = r['ending']
        end = {'present': 'in prepared copy', 'diff': 'in prepared copy, text differs', 'dropped': 'dropped by rule', 'unexplained': 'UNEXPLAINED'}[e['status']]
        w('| %d | %s `%s` | %d | %d | %d | %d | %d | %d | %s |' % (pos[r['post']['id']], md(head(r['post']['title'], 6)), r['post']['key'], len(r['src']), len(r['prep']), r['exact'],
                                                                 len(r['diffs']), len(r['dropped']), r['n_un'], end))
    for t, kind, text in problems:
        w('| - | %s | | | | | | 1 | %s |' % (md(head(t, 6)), kind))
    w('')
    w('Expected corrections (the only text differences allowed inside a matched paragraph):')
    w('')
    for label, old, new, n, in_set in corr:
        w('- %s: `%s` to `%s`, found %d time(s): %s' % (label, old, new, n, 'ok' if (n == 1 or not in_set) else 'UNEXPLAINED (expected exactly 1)') if in_set else '- %s: story not in this posts.json' % label)
    w('')

    for t, kind, text in problems:
        w('## UNEXPLAINED: %s' % kind)
        w('')
        w('- %s' % md(text))
        w('')

    for r in sorted(results, key=lambda r: pos[r['post']['id']]):
        p, e = r['post'], r['entry']
        w('## %d. %s' % (pos[p['id']], md(p['title'])))
        w('')
        w('`%s` | post `%s` | %s | source file `%s` | %d source paragraphs (%d blocks held a literal line break), %d prepared paragraphs' % (
            p['key'], p['id'], p['byline'], md(Path(e['article_path']).name), len(r['src']), r['multi_blocks'], len(r['prep'])))
        w('')
        for k, t in r['header_checks']:
            w('- Header: %s%s' % ('**UNEXPLAINED** ' if k == 'UNEXPLAINED' else '', t))
        w('')
        w('**(a) Source paragraphs missing from the prepared copy:** %d dropped by rule, %d UNEXPLAINED' % (len(r['dropped']), len(r['unexplained'])))
        w('')
        rows = [(d['i'], 'dropped by rule', d) for d in r['dropped']] + [(u['i'], 'UNEXPLAINED', u) for u in r['unexplained']]
        for i, k, d in sorted(rows, key=lambda x: x[0]):
            if k == 'dropped by rule':
                w('- `%d` `%s` : **dropped by rule**, %s%s' % (i + 1, md(head(d['text'])), d['cat'], (' (%s)' % d['note']) if d['note'] else ''))
            else:
                w('- `%d` `%s` : **UNEXPLAINED**, %s' % (i + 1, md(head(d['text'])), d['why']))
        if not rows:
            w('- none')
        w('')
        w('**(b) Text differences inside matched paragraphs:** %d paragraph(s)' % len(r['diffs']))
        w('')
        for d in r['diffs']:
            for kind, old, new, ctx, why in d['verdicts']:
                shown = '...%s `%s` to `%s`' % (md(ctx), md(old), md(new)) if kind in ('expected', 'UNEXPLAINED') and new else '...%s `%s` removed' % (md(ctx), md(old[:140]) + ('...' if len(old) > 140 else ''))
                label = {'expected': 'expected correction', 'UNEXPLAINED': '**UNEXPLAINED**', 'tail dropped by rule': '**dropped by rule** (end of paragraph trimmed)'}[kind]
                w('- `%d` `%s` : %s, %s. %s' % (d['i'] + 1, md(head(d['a'], 8)), label, shown, why))
        if not r['diffs']:
            w('- none')
        w('')
        e2 = r['ending']
        w('**(c) Ending (final source paragraph):** `%d` `%s`' % (e2['i'] + 1, md(head(e2['text'], 12))))
        w('')
        what = {'present': 'appears in the prepared copy, word for word',
                'diff': 'appears in the prepared copy with the difference listed in (b)',
                'dropped': 'is in the dropped-by-rule list (%s)' % e2['detail'],
                'unexplained': '**UNEXPLAINED**: not in the prepared copy and not dropped by a rule'}[e2['status']]
        w('- The ending %s.' % what)
        w('')
        if r['added']:
            w('**(d) Prepared paragraphs with no source counterpart:** %d, all UNEXPLAINED' % len(r['added']))
            w('')
            for a in r['added']:
                w('- prepared `%s` `%s` : **UNEXPLAINED**, not in the package source text' % (a['tag'], md(head(a['text']))))
            w('')
        if pdf_res is not None:
            rows = pdf_res.get(p['id'], [])
            bad = [(t, a, b) for t, a, b in rows if a.startswith('missing') or b.startswith('missing')]
            split = sum(1 for _, a, b in rows if 'split' in (a, b))
            w('**PDF:** %d prepared paragraphs, first 8 and last 8 words found for %d%s' % (len(rows), len(rows) - len(bad), (', %d of them across a page or column break' % split) if split else ''))
            w('')
            if not rows:
                w('- **PDF MISSING**: no prepared paragraphs to check')
            for t, a, b in bad:
                w('- **PDF MISSING** `%s` : first 8 words %s, last 8 words %s' % (md(head(t)), a, b))
            w('')

    # consolidated lists
    w('## All dropped by rule')
    w('')
    n = 0
    for r in sorted(results, key=lambda r: pos[r['post']['id']]):
        for d in r['dropped']:
            n += 1
            w('- `%s` `%d` `%s` : %s%s' % (r['post']['key'], d['i'] + 1, md(head(d['text'], 8)), d['cat'], (' (%s)' % d['note']) if d['note'] else ''))
        for d in r['diffs']:
            for kind, old, new, ctx, why in d['verdicts']:
                if kind == 'tail dropped by rule':
                    n += 1
                    w('- `%s` `%d` `%s` : end of paragraph trimmed, %s' % (r['post']['key'], d['i'] + 1, md(head(d['a'], 8)), why))
    if not n:
        w('- none')
    w('')
    w('## All UNEXPLAINED')
    w('')
    n = 0
    for t, kind, text in problems:
        n += 1
        w('- %s: %s' % (kind, md(text)))
    for r in sorted(results, key=lambda r: pos[r['post']['id']]):
        k = r['post']['key']
        for u in r['unexplained']:
            n += 1
            w('- `%s` missing paragraph `%d` `%s` : %s' % (k, u['i'] + 1, md(head(u['text'], 8)), u['why']))
        for d in r['diffs']:
            for kind, old, new, ctx, why in d['verdicts']:
                if kind == 'UNEXPLAINED':
                    n += 1
                    w('- `%s` text difference in paragraph `%d` `%s` : `%s` to `%s`. %s' % (k, d['i'] + 1, md(head(d['a'], 8)), md(old[:100]), md(new[:100]), why))
        for a in r['added']:
            n += 1
            w('- `%s` prepared paragraph with no source `%s`' % (k, md(head(a['text'], 8))))
        for kk, t in r['header_checks']:
            if kk == 'UNEXPLAINED':
                n += 1
                w('- `%s` header: %s' % (k, t))
    for label, old, new, cnt, in_set in corr_missing:
        n += 1
        w('- expected correction not found exactly once (%d): %s' % (cnt, label))
    if pdf_res is not None:
        for p in posts:
            for t, a, b in pdf_res.get(p['id'], []):
                if a.startswith('missing') or b.startswith('missing'):
                    n += 1
                    w('- `%s` PDF paragraph not found `%s` : first 8 words %s, last 8 words %s' % (p['key'], md(head(t, 8)), a, b))
            if not pdf_res.get(p['id']):
                n += 1
                w('- `%s` PDF: story has no prepared paragraphs' % p['key'])
    if not n:
        w('- none')
    w('')
    w('Rules used, so the lists above can be audited: a missing paragraph is "dropped by rule" only if it is a bare byline line (`By Name`, or the story byline), a link-only/promo line (bare URL or domain, a short lead-in plus URL, an ADVERTISEMENT label, a `More from ...:` line, a short line of link labels per the package native snapshot, or the heading of a section that holds only such lines), an empty line, a heading that repeats the story title, or a photo-credit/caption line. Everything else is UNEXPLAINED. This tool does not read `issue.json`: an UNEXPLAINED item may still be a recorded editorial rule in `receipt.json`; it is listed so a person can confirm it.')
    sys.stdout.write('\n'.join(lines) + '\n')
    sys.exit(1 if fail_total else 0)


if __name__ == '__main__':
    main()
