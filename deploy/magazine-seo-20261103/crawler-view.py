#!/usr/bin/env python3
"""Crawler view of a page: fetch server HTML (no JavaScript) with a cache-busting query and print the share tags.
Usage: python3 -I crawler-view.py URL [UA]   (UA defaults to facebookexternalhit/1.1)"""
import re, sys, json, subprocess, time, html

url = sys.argv[1]
ua = sys.argv[2] if len(sys.argv) > 2 else "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
sep = "&" if "?" in url else "?"
raw = subprocess.run(["curl", "-sS", "-L", "-A", ua, "-H", "Cache-Control: no-cache", "-w", "\n__HTTP__%{http_code}", f"{url}{sep}cb={int(time.time())}"],
                     capture_output=True, text=True, check=True).stdout
body, _, code = raw.rpartition("\n__HTTP__")
head = body.split("</head>")[0]
out = {"http": code, "bytes": len(body)}
out["title"] = [html.unescape(t) for t in re.findall(r"<title[^>]*>(.*?)</title>", head, re.S)]
metas = re.findall(r'<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"', head)
want = ("description", "og:", "twitter:", "robots")
out["meta"] = [(k, html.unescape(v)) for k, v in metas if k.startswith(want)]
out["canonical"] = re.findall(r'<link rel="canonical" href="([^"]+)"', head)
lds = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', body, re.S)
types = []
for s in lds:
    try:
        j = json.loads(s)
        items = j.get("@graph", [j]) if isinstance(j, dict) else j
        types.append([i.get("@type") for i in items])
    except Exception as e:
        types.append(f"INVALID JSON: {e}")
out["jsonld_blocks"] = types
out["h1_in_server_html"] = len(re.findall(r"<h1[\s>]", body.split("<script")[0] + "".join(re.findall(r"<body.*", body, re.S)[:0])))
print(json.dumps(out, indent=1, ensure_ascii=False))
