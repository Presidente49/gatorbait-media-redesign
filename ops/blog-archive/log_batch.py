#!/usr/bin/env python3
"""Append one batch plan to rollback.jsonl BEFORE it is applied, and update progress.json.

stdin: JSON {"batch":N,"first":"YYYY-MM-DD","last":"YYYY-MM-DD","n":50,"skipUnpub":0,"skipRecent":0,
             "nochange":0,"items":[[postId, firstPublished, origCats, newCats, origTags, newTags, mediaFlag]]}
Category/tag ids are 8-character prefixes of the Wix UUIDs (unique within this site).
Rollback = PATCH each post back to origCats/origTags (mediaFlag 1 = displayed/custom were originally false).
"""
import json, sys, os
d = json.load(sys.stdin)
here = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here, "rollback.jsonl"), "a") as f:
    for it in d["items"]:
        f.write(json.dumps({"b": d["batch"], "id": it[0], "first": it[1], "oc": it[2], "nc": it[3], "ot": it[4], "nt": it[5], "m": it[6]}, separators=(",", ":")) + "\n")
pp = os.path.join(here, "progress.json")
p = json.load(open(pp)) if os.path.exists(pp) else {"batches": 0, "scanned": 0, "planned": 0, "skipUnpub": 0, "skipRecent": 0, "nochange": 0}
p["batches"] = max(p["batches"], d["batch"]); p["scanned"] += d["n"]; p["planned"] += len(d["items"])
p["skipUnpub"] += d.get("skipUnpub", 0); p["skipRecent"] += d.get("skipRecent", 0); p["nochange"] += d.get("nochange", 0)
p["lastProcessedDate"] = d["last"]
json.dump(p, open(pp, "w"), indent=1)
print(len(d["items"]), "logged; progress", p)
