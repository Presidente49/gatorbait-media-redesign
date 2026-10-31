#!/usr/bin/env node
// Release gate for the Georgia postgame magazine issue. Fails (exit 1) while any placeholder is left:
//   - any string containing "[[" (a fill-in mark),
//   - any number equal to -1 (the numeric placeholder for scores, quarter points and yards),
//   - any "todo" key (the build strips it, so it would hide an unfinished note).
// Also fails on words that must never ship in this issue: Gator Country and betting terms.
// Usage: node deploy/postgame-georgia-20261031/check-no-placeholders.mjs [issue.json]
import { readFileSync } from 'node:fs';
const file = process.argv[2] || 'sports-live/magazine-issue-georgia-postgame.json';
const problems = [];
if (/\.mjml$/.test(file)) { // email mode: fill-in marks, placeholder tokens in image/link URLs, and banned words
  const src = readFileSync(file, 'utf8').split('\n');
  let inComment = false; // the draft banner comment explains the placeholders; it is not checked
  src.forEach((line, i) => {
    if (/<!--/.test(line)) inComment = true;
    const skip = inComment; if (/-->/.test(line)) inComment = false; if (skip) return;
    if (/\[\[/.test(line)) problems.push(`line ${i + 1}: placeholder mark "[[": ${line.trim().slice(0, 70)}`);
    if (/PLACEHOLDER_|POSTGAME_(STORY|COLUMN)_/.test(line)) problems.push(`line ${i + 1}: placeholder URL token: ${line.trim().slice(0, 70)}`);
    if (/gator\s*country|\b(spread|moneyline|over\/under|sportsbook|parlay)\b/i.test(line)) problems.push(`line ${i + 1}: banned term: ${line.trim().slice(0, 70)}`);
  });
  if (problems.length) { console.error(`${file}: ${problems.length} unfinished item(s)`); problems.slice(0, 60).forEach((p) => console.error('  ' + p)); process.exit(1); }
  console.log(`${file}: no placeholders, no banned terms.`); process.exit(0);
}
const issue = JSON.parse(readFileSync(file, 'utf8'));
const BANNED = [[/gator\s*country/i, 'Gator Country is never cited or credited'], [/\b(spread|moneyline|over\/under|point favorite|odds|laying \d|betting|sportsbook|parlay)\b/i, 'betting language']];
(function walk(v, path) {
  if (typeof v === 'string') {
    if (v.includes('[[')) problems.push(`${path}: placeholder text "${v.slice(0, 60)}"`);
    for (const [re, why] of BANNED) if (re.test(v)) problems.push(`${path}: ${why}: "${v.slice(0, 60)}"`);
  } else if (typeof v === 'number') {
    if (v === -1) problems.push(`${path}: numeric placeholder -1`);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
    if (k === 'todo') problems.push(`${path}.todo: remove the todo key`);
    if (k !== '$comment') walk(x, `${path}.${k}`);
  }
})(issue, '$');
if (problems.length) { console.error(`${file}: ${problems.length} unfinished item(s)`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log(`${file}: no placeholders, no banned terms.`);
