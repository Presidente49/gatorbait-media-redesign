#!/usr/bin/env node
// speed-2026: extracts every executable <script> block from each <id8>-live.html and <id8>-v2.html and runs `node --check` on it.
// Usage: node deploy/speed-2026/embeds/qa/syntax-check.mjs
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), dir = join(here, '..');
const tmp = join(process.env.TMPDIR || '/tmp', 'speed-2026-syntax'); mkdirSync(tmp, { recursive: true });
let bad = 0, n = 0;
for (const f of readdirSync(dir).filter((f) => /-(live|v2)\.html$/.test(f)).sort()) {
  const html = readFileSync(join(dir, f), 'utf8'); let i = 0;
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type=["']?(application\/ld\+json|text\/plain)/.test(m[1]) || !m[2].trim()) continue;
    const p = join(tmp, `${f}.${i++}.js`); writeFileSync(p, m[2]); n++;
    try { execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' }); }
    catch (e) { bad++; console.log('SYNTAX FAIL', f, 'script', i - 1, String(e.stderr).split('\n').slice(0, 4).join(' | ')); }
  }
}
console.log(`${n - bad}/${n} script blocks pass node --check`);
process.exit(bad ? 1 : 0);
