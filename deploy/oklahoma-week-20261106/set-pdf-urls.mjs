#!/usr/bin/env node
// Fill the two PDF links after the PDFs are uploaded to the Wix Media Manager (the upload is a separate, approved step).
// Usage: node deploy/oklahoma-week-20261106/set-pdf-urls.mjs <phone-media-file.pdf> <print-media-file.pdf> --phone-note "PDF, <pages>, <size>" --print-note "PDF, <pages>, <size>"  (both required)
//   Media files look like d3cfa5_<32 hex>.pdf (the name in the Media Manager). Writes the web issue JSON and the email source,
//   then prints the rebuild commands. Nothing is uploaded or sent.
import { readFileSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const pos = args.filter((a, i) => !a.startsWith('--') && !/^--/.test(args[i - 1] || ''));
const [phone, print] = pos;
const ok = (f) => /^[0-9a-f]{6}_[0-9a-f]{32}\.pdf$/.test(f || '');
if (!ok(phone) || !ok(print)) { console.error('Give two Media Manager file names like d3cfa5_<32 hex>.pdf (phone first, then print).'); process.exit(2); }
if (!opt('--phone-note', '') || !opt('--print-note', '')) { console.error('Give both --phone-note and --print-note (40 characters each at most), for example "PDF, 53 pages, 4.4 MB": the page count and size of the files you uploaded.'); process.exit(2); }
const HOST = 'https://18fb3a4e-d7f6-414a-aeb9-3047db3ea115.usrfiles.com/ugd/';
const jf = 'sports-live/magazine-issue-oklahoma-week.json';
const j = JSON.parse(readFileSync(jf, 'utf8'));
j.download.url = HOST + phone + '?dn=' + j.download.file;
j.download.note = opt('--phone-note', '');
j.download.print.url = HOST + print + '?dn=' + j.download.print.file;
j.download.print.note = opt('--print-note', '');
writeFileSync(jf, JSON.stringify(j, null, 1) + '\n');
const mf = 'newsletter/2026-11-06-oklahoma-week-magazine.mjml';
const m = readFileSync(mf, 'utf8');
if (!m.includes('PHONE_PDF_FILE_PLACEHOLDER')) { console.error('The email source has no PHONE_PDF_FILE_PLACEHOLDER (already filled?).'); process.exit(2); }
writeFileSync(mf, m.replace('PHONE_PDF_FILE_PLACEHOLDER', phone.replace(/\.pdf$/, '')));
console.log('Updated ' + jf + ' and ' + mf + '. Next:\n  MAG_VARIANT=oklahoma-week node sports-live/build-magazine.mjs\n  node deploy/oklahoma-week-20261106/qa-oklahoma-week.mjs --final\n  mjml --config.validationLevel strict ' + mf + ' -o newsletter/2026-11-06-oklahoma-week-magazine.html\n  node automation/newsletter/check-links.mjs ' + mf + '\n  node deploy/oklahoma-week-20261106/check-no-placeholders.mjs');
