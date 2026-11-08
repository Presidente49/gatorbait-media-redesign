#!/usr/bin/env python3
"""GatorBait game metrics from ESPN's public summary JSON.

Usage:  python3 game_metrics.py 401856739 [--file summary.json] [--team 57]
        python3 game_metrics.py --selftest
Prints, per team: plays, success rate, explosive plays, points per drive,
plus a reconciliation of play-sum yards against the box score. Read-only.
Definitions live in ../references/metrics.md. Thresholds are constants below.
"""
import json, ssl, sys, urllib.request

URL = "https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=%s"
EXPL_RUSH, EXPL_PASS = 10, 15  # explosive thresholds (yards); see metrics.md
SCRIM = {"Rush", "Pass Reception", "Pass Incompletion", "Sack", "Passing Touchdown",
         "Rushing Touchdown", "Interception", "Fumble Recovery (Own)",
         "Fumble Recovery (Opponent)", "Pass Interception Return", "Fumble Return Touchdown"}
PASS = {"Pass Reception", "Pass Incompletion", "Passing Touchdown", "Interception",
        "Pass Interception Return", "Sack"}


def fetch(eid):
    ctx = ssl.create_default_context()  # honors SSL_CERT_FILE and HTTPS_PROXY
    with urllib.request.urlopen(URL % eid, timeout=30, context=ctx) as r:
        return json.load(r)


def needed(down, dist):
    """Yards needed for a successful play: 50% on 1st, 70% on 2nd, 100% on 3rd/4th."""
    return {1: 0.5, 2: 0.7}.get(down, 1.0) * dist


def analyze(summary):
    comp = summary["header"]["competitions"][0]["competitors"]
    home = next(c for c in comp if c["homeAway"] == "home")["team"]["id"]
    names = {c["team"]["id"]: c["team"]["displayName"] for c in comp}
    t = {i: dict(name=n, plays=0, succ=0, expl=0, drives=0, pts=0, yds=0, rush_expl=0, pass_expl=0)
         for i, n in names.items()}
    score = {"home": 0, "away": 0}
    for d in summary["drives"]["previous"]:
        plays = d.get("plays", [])
        if not plays:
            continue
        off = None
        for p in plays:
            for tp in p.get("teamParticipants", []):
                if tp.get("type") == "offense":
                    off = tp["id"]
                    break
            if off:
                break
        if off not in t:
            continue
        t[off]["drives"] += 1
        for p in plays:
            ty = p["type"]["text"]
            if ty not in SCRIM or p.get("isPenalty"):
                continue
            s = p.get("start", {})
            if not s.get("down") or not s.get("distance"):
                continue
            gain = p.get("statYardage", 0)
            turnover = ty in ("Interception", "Pass Interception Return") or p.get("isTurnover")
            if turnover:
                gain = 0
            t[off]["plays"] += 1
            t[off]["yds"] += p.get("statYardage", 0) if not turnover else 0
            if not turnover and gain >= needed(s["down"], s["distance"]):
                t[off]["succ"] += 1
            kind = "pass" if ty in PASS else "rush"
            if not turnover and gain >= (EXPL_PASS if kind == "pass" else EXPL_RUSH) and ty != "Sack":
                t[off]["expl"] += 1
                t[off][kind + "_expl"] += 1
        last = plays[-1]
        new = {"home": last["homeScore"], "away": last["awayScore"]}
        side = "home" if off == home else "away"
        t[off]["pts"] += new[side] - score[side]
        score = new
    return t


def box_yards(summary):
    out = {}
    for tm in summary["boxscore"]["teams"]:
        st = {s["name"]: s["displayValue"] for s in tm["statistics"]}
        out[tm["team"]["id"]] = (int(st["totalYards"]), int(st["rushingYards"]), int(st["netPassingYards"]))
    return out


def report(summary, eid=""):
    t, box = analyze(summary), box_yards(summary)
    print("Event %s  (source: ESPN summary drives/plays, fetched live)" % eid)
    for i, m in t.items():
        sr = 100.0 * m["succ"] / m["plays"] if m["plays"] else 0
        ppd = m["pts"] / m["drives"] if m["drives"] else 0
        print("%-18s plays %3d  success %2d/%d = %.1f%%  explosive %d (rush %d, pass %d; %d+ rush / %d+ pass)  "
              "drives %d  offensive points %d  PPD %.2f" % (m["name"], m["plays"], m["succ"], m["plays"], sr,
              m["expl"], m["rush_expl"], m["pass_expl"], EXPL_RUSH, EXPL_PASS, m["drives"], m["pts"], ppd))
    for i, m in t.items():
        tot, ru, pa = box[i]
        print("RECONCILE %-14s play-sum yards %d vs box total %d (diff %+d); box rush %d + net pass %d"
              % (m["name"], m["yds"], tot, m["yds"] - tot, ru, pa))
    print("Differences beyond a few yards mean the play filter missed a play type: check before publishing.")


def selftest():
    assert needed(1, 10) == 5 and needed(2, 10) == 7 and needed(3, 4) == 4
    def pl(ty, down, dist, gain, off="1", hs=0, as_=0, pen=False):
        return dict(type=dict(text=ty), start=dict(down=down, distance=dist), statYardage=gain,
                    isPenalty=pen, teamParticipants=[dict(type="offense", id=off)], homeScore=hs, awayScore=as_)
    s = dict(header=dict(competitions=[dict(competitors=[
        dict(homeAway="home", team=dict(id="1", displayName="H")),
        dict(homeAway="away", team=dict(id="2", displayName="A"))])]),
        drives=dict(previous=[
            dict(plays=[pl("Rush", 1, 10, 5), pl("Pass Reception", 2, 5, 15), pl("Rush", 1, 10, 2),
                        pl("Penalty", 1, 10, 0, pen=True), pl("Rushing Touchdown", 2, 8, 8, hs=7)]),
            dict(plays=[pl("Interception", 1, 10, 0, off="2", hs=7), pl("Rush", 2, 10, 9, off="2", hs=7, as_=3)])]))
    r = analyze(s)
    assert r["1"]["plays"] == 4 and r["1"]["succ"] == 3 and r["1"]["expl"] == 1 and r["1"]["pts"] == 7
    assert r["2"]["plays"] == 2 and r["2"]["succ"] == 1 and r["2"]["pts"] == 3 and r["2"]["drives"] == 1
    print("selftest ok")


if __name__ == "__main__":
    a = sys.argv[1:]
    if "--selftest" in a:
        selftest(); sys.exit()
    if "--file" in a:
        data = json.load(open(a[a.index("--file") + 1]))
        eid = a[0] if a and not a[0].startswith("--") else "file"
    else:
        eid = a[0]; data = fetch(eid)
    report(data, eid)
