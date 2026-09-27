#!/usr/bin/env node
// Band → newsletter. The homepage game-day band is the single source for the "easy send":
// update the band (score, tracker, leaders, story buttons), run this, pass the gates, upload as a Wix DRAFT,
// and send only on Brenden's yes.
//
// Usage:
//   node automation/newsletter/band-to-mjml.mjs [--band deploy/wix-served/home-gameday.html]
//        [--stories deploy/wix-served/home-fallback.json] [--campaign postgame_ole_miss_2026_09_26] [--out newsletter/X.mjml]
//
// --stories is a JSON file in the homepage-fallback shape ({posts:[{title,excerpt,url,author,image:{src,alt}}]}).
// Compliance/revenue (Sept. 27): every issue carries the business postal address (CAN-SPAM) and the All Access
// CTA; keep the CTA copy matched to the live /pricing-plans/subscribe page (7-day trial, $9.99/mo, $99/yr).
// House rule: at most 2 editorial photos per issue, real credited photos only (graphics and charts stay text-only).
// Each band button is matched to a story by its /post/ path; a button with no story metadata becomes a text link.
import fs from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const bandFile = arg('--band', 'deploy/wix-served/home-gameday.html');
const storiesFile = arg('--stories', 'deploy/wix-served/home-fallback.json');

const src = fs.readFileSync(bandFile, 'utf8');
const A = '/*GD*/window.__GBM_GAMEDAY__=';
const a = src.indexOf(A), b = src.indexOf(';/*GD-END*/');
if (a < 0 || b < 0) throw new Error('No /*GD*/ band data in ' + bandFile);
const g = JSON.parse(src.slice(a + A.length, b));
const stories = fs.existsSync(storiesFile) ? JSON.parse(fs.readFileSync(storiesFile, 'utf8')).posts || [] : [];

const date = String(g.kickoff || '').slice(0, 10);
const opp = (g.home.name === 'Florida' ? g.away.name : g.home.name);
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const campaign = arg('--campaign', `${g.status === 'final' ? 'postgame' : 'gameday'}_${slug(opp)}_${date.replace(/-/g, '_')}`);
const out = arg('--out', `newsletter/${date}-band-${slug(opp).replace(/_/g, '-')}.mjml`);

const attr = v => String(v == null ? '' : v).replace(/"/g, '&quot;');
const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SITE = 'https://www.gatorbaitmedia.com';
const utm = (path, content) => `${path.startsWith('http') ? path : SITE + path}${path.includes('?') ? '&' : '?'}utm_source=gatorbait_magazine_newsletter&utm_medium=email&utm_campaign=${campaign}&utm_content=${content}`;
const trim = (t, n = 220) => { t = String(t || ''); if (t.length <= n) return t; const c = t.slice(0, n); return c.slice(0, c.lastIndexOf(' ')).replace(/[,;:\s]+$/, '') + '…'; };
const pathOf = u => { try { return new URL(u, SITE).pathname; } catch { return u; } };

const isFinal = g.status === 'final';
const label = isFinal ? 'FINAL' : g.status === 'half' ? 'HALFTIME' : 'GAME DAY';
const subject = arg('--subject', `GatorBait Magazine — ${isFinal ? 'Postgame' : 'Game Day'}: ${g.headline.replace(/^FINAL:\s*/i, '')}`);
if (/"/.test(subject)) throw new Error('Subject has a straight double quote');

const team = (t, color) => `
        <td style="padding:10px 4px;text-align:center;"><div style="font:800 15px/1.2 Inter,Arial,sans-serif;color:${color};">${esc(t.name)}</div><div style="font:700 10px/1.4 Inter,Arial,sans-serif;color:#9EADC1;letter-spacing:1px;">${t.rank ? 'NO. ' + esc(t.rank) + ' · ' : ''}${esc(t.record)}</div><div style="font:700 44px/1.1 Newsreader,Georgia,serif;color:#FFFFFF;">${t.score == null ? '–' : esc(t.score)}</div></td>`;

const usedImg = new Set();
const cards = (g.links || []).filter(l => /^\/post\//.test(l[1])).map((l, i) => {
  const s = stories.find(p => pathOf(p.url) === l[1]);
  const href = utm(l[1], 'band_' + slug(l[0]));
  const img = s && s.image && s.image.src && /\bphotos?\b/i.test(s.image.alt || '') && !/graphic|stat card|charted/i.test(s.image.alt || '') && !usedImg.has(s.image.src) && usedImg.size < 2 ? s.image.src : '';
  if (img) usedImg.add(img);
  return `
    <mj-section background-color="#FFFFFF" padding="${i ? '6px' : '22px'} 26px 18px">
      <mj-column>${img ? `
        <mj-image src="${esc(img)}" alt="${esc(s.image.alt || s.title)}" href="${attr(href)}" padding="0 0 12px" />` : ''}
        <mj-text mj-class="kicker" padding="0 0 4px">${esc(l[0])}</mj-text>
        <mj-text padding="0 0 6px"><a href="${attr(href)}" style="color:#081B35;text-decoration:none;"><span class="${i ? 'gb-h3' : 'gb-h2'}">${esc(s ? s.title : l[0])}</span></a></mj-text>${s && s.excerpt ? `
        <mj-text font-size="14px" color="#4B5666" padding="0 0 10px">${esc(trim(s.excerpt))}</mj-text>` : ''}
        <mj-button href="${attr(href)}" align="left" padding="0">READ →</mj-button>
      </mj-column>
    </mj-section>`;
}).join('');

const nextArg = arg('--next', '');
const [nextHead, nextBody] = nextArg.split('|');
const lookAhead = nextArg ? `
    <mj-section background-color="#FA4616" padding="20px 26px">
      <mj-column>
        <mj-text color="#FFFFFF" font-size="10px" font-weight="900" letter-spacing="1.9px" padding="0 0 6px">LOOK AHEAD</mj-text>
        <mj-text color="#FFFFFF" padding="0 0 6px"><span class="gb-h2">${esc(nextHead)}</span></mj-text>${nextBody ? `
        <mj-text color="#FFF1EA" font-size="14px" padding="0">${esc(nextBody)}</mj-text>` : ''}
      </mj-column>
    </mj-section>` : '';
const tracker = (g.st || []).map(r => `
          <tr style="border-bottom:1px solid #E1E4EA;"><td style="padding:8px 4px;">${esc(r[1])}</td><td style="text-align:center;padding:8px 4px;color:#6D7888;font-size:12px;">${esc(r[0])}</td><td style="text-align:right;padding:8px 4px;font-weight:800;">${esc(r[2])}</td></tr>`).join('');

const mjml = `<mjml lang="en" dir="ltr">
  <mj-head>
    <mj-title>${esc(subject)}</mj-title>
    <mj-preview>${esc(g.note)}</mj-preview>
    <mj-font name="Newsreader" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,600;6..72,700&amp;display=swap" />
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&amp;display=swap" />
    <mj-attributes>
      <mj-all font-family="Inter, Arial, sans-serif" />
      <mj-text color="#14243D" font-size="15px" line-height="1.55" />
      <mj-button background-color="#FA4616" color="#FFFFFF" border-radius="0" inner-padding="12px 18px" font-size="12px" font-weight="800" />
      <mj-class name="kicker" font-size="10px" font-weight="800" letter-spacing="1.7px" color="#D8450C" text-transform="uppercase" />
    </mj-attributes>
    <mj-style>
      .gb-wordmark { font-weight:900; letter-spacing:-1.8px; }
      .gb-h1 { font-family:'Newsreader',Georgia,serif; font-size:32px; line-height:1.08; font-weight:700; }
      .gb-h2 { font-family:'Newsreader',Georgia,serif; font-size:24px; line-height:1.14; font-weight:700; }
      .gb-h3 { font-family:'Newsreader',Georgia,serif; font-size:19px; line-height:1.2; font-weight:700; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F2F0EB" width="640px">
    <mj-section background-color="#FFFFFF" padding="20px 24px 14px">
      <mj-column>
        <mj-text align="center" padding="0"><a href="${attr(utm('/', 'masthead'))}" style="text-decoration:none;"><span class="gb-wordmark" style="font-size:34px;color:#003B7A;">GATOR</span><span class="gb-wordmark" style="font-size:34px;color:#FA4616;">BAIT</span></a><br/><span style="font-size:10px;font-weight:800;letter-spacing:2.2px;color:#003B7A;">GATORBAIT MAGAZINE NEWSLETTER</span></mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#081B35" padding="18px 22px 8px">
      <mj-column>
        <mj-text align="center" color="#FA7A45" font-size="10px" font-weight="900" letter-spacing="2px" padding="0 0 4px">${label} · ${esc(g.when)}</mj-text>
        <mj-table padding="0" width="100%"><tr>${team(g.away, '#D5DFEC')}
        <td style="padding:10px 4px;text-align:center;color:#9EADC1;font:700 11px/1.4 Inter,Arial,sans-serif;">${esc(g.venue)}</td>${team(g.home, '#FFFFFF')}
        </tr></mj-table>
        <mj-text align="center" color="#FFFFFF" padding="8px 0 4px"><span class="gb-h1">${esc(g.headline)}</span></mj-text>
        <mj-text align="center" color="#D5DFEC" font-size="15px" padding="0 0 16px">${esc(g.note)}</mj-text>
      </mj-column>
    </mj-section>${tracker ? `
    <mj-section background-color="#FFFDF9" padding="18px 26px 8px">
      <mj-column>
        <mj-text color="#081B35" font-size="20px" font-weight="800" padding="0 0 6px">GAME TRACKER</mj-text>
        <mj-table width="100%" padding="0" font-size="14px">
          <tr style="border-bottom:2px solid #081B35;font-size:11px;font-weight:800;letter-spacing:1px;"><th style="text-align:left;padding:6px 4px;color:#6D7888;">${esc(g.away.name.toUpperCase())}</th><th></th><th style="text-align:right;padding:6px 4px;color:#003B7A;">${esc(g.home.name.toUpperCase())}</th></tr>${tracker}
        </mj-table>${(g.ld || []).length ? `
        <mj-text font-size="13px" color="#4B5666" padding="10px 0 0"><b>Leaders:</b> ${g.ld.map(esc).join(' · ')}</mj-text>` : ''}
      </mj-column>
    </mj-section>` : ''}
    <mj-section background-color="#FFFFFF" padding="22px 26px 0">
      <mj-column><mj-text color="#081B35" font-size="20px" font-weight="800" padding="0 0 4px">THE STORIES</mj-text><mj-divider border-color="#FA4616" border-width="3px" padding="0" /></mj-column>
    </mj-section>${cards}${lookAhead}
    <mj-section background-color="#081B35" padding="22px 26px">
      <mj-column>
        <mj-text color="#FA7A45" font-size="10px" font-weight="900" letter-spacing="1.9px" padding="0 0 6px">GATORBAIT ALL ACCESS</mj-text>
        <mj-text color="#FFFFFF" padding="0 0 6px"><span class="gb-h2">Get every GatorBait story, all season.</span></mj-text>
        <mj-text color="#D5DFEC" font-size="14px" padding="0 0 14px">Start with a 7-day free trial, then $9.99 a month or $99 a year. Independent Florida Gators journalism from Buddy Martin, Franz Beard and the GatorBait staff.</mj-text>
        <mj-button href="${attr(utm('/pricing-plans/subscribe', 'all_access_cta'))}" align="left" padding="0">START FREE TRIAL →</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="18px 26px 24px">
      <mj-column width="40%"><mj-text padding="0" color="#003B7A" font-size="18px" font-weight="900">GATOR<span style="color:#FA4616;">BAIT</span> MEDIA</mj-text></mj-column>
      <mj-column width="60%"><mj-text align="right" color="#667386" font-size="11px" line-height="1.55" padding="0">Florida football. All the time.<br/>GatorBaitMedia.com · Old-school journalism + new tech.<br/>GatorBait Media · 1524 SE 22nd Ave, Ocala, FL 34471</mj-text></mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
fs.writeFileSync(out, mjml);
console.log(JSON.stringify({ out, subject, preheader: g.note, campaign, stories: (g.links || []).length, withImages: usedImg.size }, null, 1));
