#!/usr/bin/env node
// Lesson 91: set the story-page "Up next" box in the post template embed 14a887e3 to Oklahoma at Florida.
// Usage: node patch-next-box.mjs <live-body.html> [out.html]
//   <live-body.html> is the exact embedData.html just read from embed 14a887e3 (also the rollback copy).
// Exit codes: 0 patched (out.html written); 3 NO `var NEXT={...}` object in the live body (the Oct. 28 rev 29 build removed the expired
// Oct. 17 Up Next code; then there is nothing to patch, the story-kit chip follows sports-live/scoreboard.json by itself: do NOT add code);
// 1 any other assertion failure (do not patch).
// Changes only the NEXT object. `until` is kickoff, so the box retires itself. No ranking is written: add Oklahoma's rank only after the
// Sunday, Nov. 1 polls post (fresh-news rule), as a second guarded patch.
import { readFileSync, writeFileSync } from 'node:fs';
const [, , inFile, outFile] = process.argv;
if (!inFile) { console.error('usage: patch-next-box.mjs <live-body.html> [out.html]'); process.exit(1); }
const html = readFileSync(inFile, 'utf8');
const djb2 = (t) => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(16); };
const RE = /var NEXT=\{[^}]*\};/g;
const hits = html.match(RE) || [];
if (hits.length === 0) { console.log(`No "var NEXT={...}" in ${inFile} (${html.length} chars, djb2 ${djb2(html)}). Nothing to patch; verify the Up next chip from the scoreboard feed instead.`); process.exit(3); }
if (hits.length !== 1) { console.error(`expected exactly one NEXT object, found ${hits.length}`); process.exit(1); }
const NEXT = { opp: 'vs. Oklahoma', when: 'Sat., Nov. 7 \\u00b7 7:45 p.m. ET \\u00b7 SEC Network', where: 'Ben Hill Griffin Stadium, Gainesville', href: '/', cta: 'Latest news', until: '2026-11-08T00:45:00Z' };
// Same shape and key order as the live object; · stays a JS escape inside the single-quoted string, exactly as before.
const lit = 'var NEXT={' + Object.entries(NEXT).map(([k, v]) => `${k}:'${v.replace(/\\\\/g, '\\')}'`).join(',') + '};';
if (/'/.test(Object.values(NEXT).join('').replace(/\\u00b7/g, ''))) { console.error('unescaped quote in NEXT values'); process.exit(1); }
const out = html.replace(hits[0], () => lit);
if (out === html) { console.error('replacement changed nothing'); process.exit(1); }
if (out.length > 15000) { console.error(`over the 15,000-character cap: ${out.length}`); process.exit(1); }
console.log(`old: ${hits[0]}\nnew: ${lit}\nbefore: chars=${html.length} djb2=${djb2(html)}\nafter : chars=${out.length} djb2=${djb2(out)} (delta ${out.length - html.length})`);
if (outFile) writeFileSync(outFile, out);
