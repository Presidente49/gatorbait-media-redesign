// ExecuteWixAPI function (site 18fb3a4e-d7f6-414a-aeb9-3047db3ea115). Replace __DATA__ with the JSON that
// `node livegen.cjs 401856759 --links "Halftime story|/post/<slug>;Game story|/post/<slug>"` prints, then run it as
// the `code` of one ExecuteWixAPI call (hasMutations true). It rewrites the body of the ONE live post in place
// (UPDATE_PUBLISH; no new post, so no new alert). Aborts if the post is not cleanly PUBLISHED.
async function() {
  const D = __DATA__;
  const base = "https://www.wixapis.com/blog/v3";
  const ID = "755d347f-1767-4f74-bbaf-28378a590705";
  const cur = await wix.request({ method: "GET", url: base + "/draft-posts/" + ID });
  const dp = cur.data.draftPost || {};
  if (dp.status !== "PUBLISHED" || dp.hasUnpublishedChanges) return { aborted: "unexpected state", status: dp.status, unpublished: dp.hasUnpublishedChanges };
  let n = 0;
  const nid = () => "lv" + (++n);
  const T = (t, d) => ({ type: "TEXT", id: "", nodes: [], textData: { text: t, decorations: d || [] } });
  const B = { type: "BOLD", fontWeightValue: 700 };
  const I = { type: "ITALIC", italicData: true };
  const L = u => ({ type: "LINK", linkData: { link: { url: u, target: "BLANK" } } });
  const P = r => ({ type: "PARAGRAPH", id: nid(), nodes: r, paragraphData: {} });
  const H = t => ({ type: "HEADING", id: nid(), nodes: [T(t)], headingData: { level: 2 } });
  const S = "https://www.gatorbaitmedia.com";
  const nodes = [
    P([T("Updated " + D.updated + ". ", [I]), T(D.status, [B])]),
    P([T("No. 20 Florida at Florida State, 3:30 p.m. ET on ABC, at Doak Campbell Stadium in Tallahassee.")])
  ];
  (D.links || []).forEach(l => nodes.push(P([T(l[0], [B, L(l[1].indexOf("http") === 0 ? l[1] : S + l[1])])])));
  if (!(D.sections || []).length) { nodes.push(H("Game log")); nodes.push(P([T("No scores yet.")])); }
  (D.sections || []).forEach(s => { nodes.push(H(s.h)); s.items.forEach(i => nodes.push(P([T(i[0], [B]), T(i[1])]))); });
  if ((D.numbers || []).length) { nodes.push(H(D.numbers[0])); D.numbers.slice(1).forEach(i => nodes.push(P([T(i[0], [B]), T(i[1])]))); }
  nodes.push(H("Read before kickoff"));
  [["The Soothsayer: The Gators have all the motivation they need", "the-soothsayer-the-gators-have-all-the-motivation-they-need", " by Franz Beard"],
   ["Pregame Analysis: No. 20 Florida Gators (7-4, 5-4) vs. Florida State Seminoles (5-6, 3-5)", "pregame-analysis-no-20-florida-gators-7-4-5-4-vs-florida-state-seminoles-5-6-3-5", " by Loren Meadows"],
   ["Behind the Sticks: Florida at Florida State", "behind-the-sticks-florida-at-florida-state", " by Brenden Martin"],
   ["Florida at Florida State: Game Time, TV Channel, Streaming, Odds and What to Watch", "florida-at-florida-state-game-time-tv-channel-streaming-odds-and-what-to-watch", ""]
  ].forEach(x => nodes.push(P([T(x[0], [L(S + "/post/" + x[1])]), T(x[2])])));
  nodes.push(P([T("The Florida-Florida State edition of GatorBait Magazine", [L(S + "/magazine")])]));
  nodes.push(P([T("Cover image: a frame from the Nov. 23 Florida news conference, courtesy ", [I]), T("Florida Gators Football and UAA", [I, L("https://floridagators.com")]), T(".", [I])]));
  const body = { draftPost: { id: ID, memberId: dp.memberId, title: D.title, excerpt: D.excerpt, richContent: { nodes: nodes } }, action: "UPDATE_PUBLISH" };
  await wix.request({ method: "PATCH", url: base + "/draft-posts/" + ID, body: body });
  const chk = await wix.request({ method: "GET", url: base + "/posts/" + ID });
  const p = chk.data.post || {};
  return { ok: true, title: p.title, lastPublishedDate: p.lastPublishedDate, status: D.status, updated: D.updated };
}
