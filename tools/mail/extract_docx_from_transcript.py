#!/usr/bin/env python3
"""Decode a Gmail RAW message (mcp Gmail get_message, messageFormat=RAW) out of a Claude Code session
transcript, save its attachments, and print a .docx as paragraphs.

Why: the Gmail connector has no attachment download, but RAW returns the full MIME. The tool result lands
in the session transcript (~/.claude/projects/<project>/<session>.jsonl), where this script reads it.

Usage: extract_docx_from_transcript.py <gmail-message-id> <out-dir> [transcript.jsonl]
Prints one line per paragraph: <index> <B|-> <text>. B means the paragraph starts bold.
Straight quotes, single spaces and "&amp;" fixes are the copy desk's job, not this script's.
"""
import base64, email, glob, json, os, re, sys, zipfile
from email import policy

def latest_transcript():
    files = glob.glob(os.path.expanduser('~/.claude/projects/*/*.jsonl'))
    return max(files, key=os.path.getmtime)

def find_raw(path, msg_id):
    best = None
    for line in open(path, errors='ignore'):
        if msg_id in line and '"raw"' in line:
            m = re.search(r'\\"raw\\":\\"([A-Za-z0-9_\-=]+)\\"', line) or re.search(r'"raw":"([A-Za-z0-9_\-=]+)"', line)
            if m:
                best = m.group(1)
    return best

def main():
    msg_id, out = sys.argv[1], sys.argv[2]
    path = sys.argv[3] if len(sys.argv) > 3 else latest_transcript()
    raw = find_raw(path, msg_id)
    if not raw:
        sys.exit('RAW for %s not found in %s; call get_message with messageFormat RAW first' % (msg_id, path))
    os.makedirs(out, exist_ok=True)
    msg = email.message_from_bytes(base64.urlsafe_b64decode(raw + '=' * (-len(raw) % 4)), policy=policy.default)
    for part in msg.walk():
        name = part.get_filename()
        if not name:
            continue
        dest = os.path.join(out, os.path.basename(name))
        open(dest, 'wb').write(part.get_payload(decode=True))
        print('saved', dest, file=sys.stderr)
        if dest.lower().endswith('.docx'):
            xml = zipfile.ZipFile(dest).read('word/document.xml').decode('utf8')
            for i, p in enumerate(re.findall(r'<w:p[ >].*?</w:p>', xml, flags=re.S)):
                text = ''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, flags=re.S))
                bold = 'B' if re.search(r'<w:b/>|<w:b ', p) else '-'
                print(i, bold, text)

if __name__ == '__main__':
    main()
