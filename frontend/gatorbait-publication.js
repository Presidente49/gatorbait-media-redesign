/* GatorBait Publication Shell v1
 * Pure Web Component for blank Wix routes.
 * No Wix DOM selectors. No Wix API calls. No global CSS.
 * Data is injected by a separate documented Wix/Velo adapter.
 */

const GBM_LOGO = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';

class GatorBaitPublication extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = { stories: [] };
  }

  set data(value) {
    this._data = value && typeof value === 'object' ? value : { stories: [] };
    if (this.isConnected) this.render();
  }

  get data() { return this._data; }

  connectedCallback() { this.render(); }

  esc(value = '') {
    return String(value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  mode() { return (this.getAttribute('mode') || 'home').toLowerCase(); }

  nav() {
    return `<header class="header">
      <div class="mast">
        <a href="/" class="logo"><img src="${GBM_LOGO}" width="250" height="67" alt="GatorBait Media"></a>
        <a href="/pricing-plans" class="support">JOIN GATORBAIT</a>
      </div>
      <nav aria-label="Primary">
        <a href="/">Home</a>
        <a href="/football">Football</a>
        <a href="/recruiting">Recruiting</a>
        <a href="/the-buddy-martin-show">GatorBait TV</a>
        <a href="/magazine">Magazine</a>
        <a href="/pricing-plans" class="join">Join</a>
      </nav>
    </header>`;
  }

  meta(story) {
    return [story.author, story.date].filter(Boolean).map(this.esc).join(' · ');
  }

  card(story, compact = false) {
    return `<a class="card ${compact ? 'compact' : ''}" href="${this.esc(story.url)}">
      ${story.image ? `<img src="${this.esc(story.image)}" alt="${this.esc(story.imageAlt || '')}" loading="lazy">` : ''}
      <div class="copy">
        <span class="kicker">${this.esc(story.kicker || story.category || 'GatorBait')}</span>
        <h3>${this.esc(story.title)}</h3>
        ${compact || !story.excerpt ? '' : `<p>${this.esc(story.excerpt)}</p>`}
        <div class="meta">${this.meta(story)}</div>
      </div>
    </a>`;
  }

  home(stories) {
    if (!stories.length) return this.empty('Latest coverage is loading.');
    const lead = stories[0];
    const rail = stories.slice(1, 5);
    const feed = stories.slice(5, 14);
    return `<main>
      <section class="top">
        <a class="lead" href="${this.esc(lead.url)}">
          ${lead.image ? `<img src="${this.esc(lead.image)}" alt="${this.esc(lead.imageAlt || '')}">` : ''}
          <div class="leadcopy">
            <span class="kicker">${this.esc(lead.kicker || lead.category || 'Latest')}</span>
            <h1>${this.esc(lead.title)}</h1>
            ${lead.excerpt ? `<p>${this.esc(lead.excerpt)}</p>` : ''}
            <div class="meta">${this.meta(lead)}</div>
          </div>
        </a>
        <aside>
          <div class="rule"><h2>Latest</h2></div>
          ${rail.map(s => this.card(s, true)).join('')}
        </aside>
      </section>
      <section class="block">
        <div class="rule"><h2>Inside GatorBait</h2></div>
        <div class="grid">${feed.map(s => this.card(s)).join('')}</div>
      </section>
      ${this.destinations()}
    </main>`;
  }

  section(stories) {
    const title = this.getAttribute('section-title') || 'Latest Coverage';
    return `<main class="section-page">
      <header class="section-head"><span>GatorBait Media</span><h1>${this.esc(title)}</h1></header>
      <div class="rows">${stories.length ? stories.slice(0, 30).map(s => `<a class="row" href="${this.esc(s.url)}">
        ${s.image ? `<img src="${this.esc(s.image)}" alt="${this.esc(s.imageAlt || '')}" loading="lazy">` : ''}
        <div><span class="kicker">${this.esc(s.kicker || s.category || title)}</span><h2>${this.esc(s.title)}</h2>${s.excerpt ? `<p>${this.esc(s.excerpt)}</p>` : ''}<div class="meta">${this.meta(s)}</div></div>
      </a>`).join('') : this.empty('Coverage is loading.')}</div>
    </main>`;
  }

  tv() {
    return `<main class="section-page">
      <header class="section-head"><span>Watch</span><h1>GatorBait TV</h1><p>The Buddy Martin Show, interviews, analysis and clips.</p></header>
      <div class="video"><iframe src="https://www.youtube.com/embed/live_stream?channel=UCtR8b1sKFuwaRjKy5BiXRvA" title="The Buddy Martin Show live stream" allowfullscreen></iframe></div>
      <a class="youtube" href="https://www.youtube.com/@thebuddymartinshow?sub_confirmation=1" target="_blank" rel="noopener">Subscribe free on YouTube</a>
    </main>`;
  }

  destinations() {
    return `<section class="destinations">
      <a href="/the-buddy-martin-show"><span>WATCH</span><strong>GatorBait TV</strong><em>The Buddy Martin Show and video coverage</em></a>
      <a href="/magazine"><span>READ</span><strong>GatorBait Magazine</strong><em>Original reporting and long-form coverage</em></a>
      <a href="/pricing-plans"><span>SUPPORT</span><strong>Join GatorBait</strong><em>Support independent Florida coverage</em></a>
    </section>`;
  }

  empty(message) { return `<div class="empty">${this.esc(message)}</div>`; }

  footer() {
    return `<footer><div><strong>GatorBait Media</strong><span>Independent Florida Gators coverage since 1979.</span></div><nav><a href="/the-buddy-martin-show">TV</a><a href="/magazine">Magazine</a><a href="/pricing-plans">Join</a><a href="/contact">Contact</a></nav></footer>`;
  }

  render() {
    const stories = Array.isArray(this._data.stories) ? this._data.stories : [];
    const body = this.mode() === 'tv' ? this.tv() : this.mode() === 'home' ? this.home(stories) : this.section(stories);
    this.shadowRoot.innerHTML = `${this.styles()}<div class="publication">${this.nav()}${body}${this.footer()}</div>`;
  }

  styles() {
    return `<style>
      :host{display:block;--navy:#08132f;--blue:#0021a5;--orange:#fa4616;--ink:#111827;--body:#465266;--line:#dfe4eb;--soft:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:var(--ink);background:#fff}*{box-sizing:border-box}a{text-decoration:none;color:inherit}.publication{min-height:100vh;background:#fff}.header{border-bottom:1px solid var(--line)}.mast{max-width:1320px;margin:auto;min-height:92px;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}.logo img{display:block;width:250px;height:auto}.support{font-size:13px;font-weight:800;color:var(--blue)}.header>nav{display:flex;justify-content:center;background:var(--navy);border-top:4px solid var(--orange)}.header>nav a{padding:15px 22px;color:#fff;font-size:14px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;border-right:1px solid #ffffff20}.header>nav a:hover{background:var(--blue)}.header>nav .join{background:var(--orange)}main{max-width:1320px;margin:auto;padding:34px 24px 68px}.top{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(310px,.78fr);gap:34px}.lead{display:block}.lead>img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}.leadcopy{padding:18px 0 24px;border-bottom:1px solid var(--line)}.kicker{display:block;color:#c73810;font-size:11px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;margin-bottom:7px}.lead h1,.section-head h1{font:700 clamp(38px,4.2vw,61px)/1.03 Georgia,"Times New Roman",serif;letter-spacing:-.035em;color:var(--navy);margin:0 0 12px}.lead p,.section-head p{font-size:18px;line-height:1.55;color:var(--body);margin:0 0 14px}.meta{font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.rule{border-bottom:3px solid var(--orange);padding-bottom:8px;margin-bottom:7px}.rule h2{font:700 27px/1.1 Georgia,"Times New Roman",serif;color:var(--navy);margin:0}.compact{display:grid;grid-template-columns:116px 1fr;gap:13px;padding:14px 0;border-bottom:1px solid var(--line)}.compact img{width:116px;height:76px;object-fit:cover}.card h3{font:700 19px/1.17 Georgia,"Times New Roman",serif;color:var(--navy);margin:0 0 7px}.card p{font-size:14px;line-height:1.5;color:var(--body);margin:0 0 11px}.compact .kicker,.compact .meta{font-size:9px}.block{margin-top:56px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}.grid .card{border-bottom:1px solid var(--line);padding-bottom:18px}.grid .card img{width:100%;aspect-ratio:16/10;object-fit:cover;margin-bottom:14px}.destinations{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:54px}.destinations a{background:var(--navy);color:#fff;border-top:5px solid var(--orange);padding:26px;min-height:175px}.destinations span{display:block;color:#ff9d78;font-size:10px;font-weight:900;letter-spacing:.15em}.destinations strong{display:block;font:700 28px/1.1 Georgia,"Times New Roman",serif;margin:8px 0}.destinations em{font-style:normal;color:#d5dcec;font-size:14px}.section-page{max-width:1120px}.section-head{padding:28px 0 24px;border-bottom:5px solid var(--orange);margin-bottom:10px}.section-head>span{font-size:11px;color:var(--blue);font-weight:900;letter-spacing:.14em;text-transform:uppercase}.section-head h1{font-size:clamp(42px,6vw,74px);margin:8px 0}.row{display:grid;grid-template-columns:220px minmax(0,1fr);gap:22px;padding:22px 0;border-bottom:1px solid var(--line)}.row img{width:220px;height:138px;object-fit:cover}.row h2{font:700 27px/1.13 Georgia,"Times New Roman",serif;color:var(--navy);margin:0 0 8px}.row p{font-size:14px;line-height:1.5;color:var(--body);margin:0 0 10px}.video{position:relative;padding-top:56.25%;background:#000;margin-top:24px}.video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.youtube{display:inline-block;background:var(--orange);color:#fff;font-weight:900;text-transform:uppercase;letter-spacing:.06em;padding:14px 18px;margin-top:18px}.empty{padding:42px 0;color:var(--body)}footer{background:var(--soft);border-top:5px solid var(--orange);padding:28px max(24px,calc((100vw - 1272px)/2));display:flex;justify-content:space-between;gap:28px}footer div{display:flex;flex-direction:column;gap:4px}footer strong{font:700 22px Georgia,"Times New Roman",serif;color:var(--navy)}footer span{font-size:13px;color:var(--body)}footer nav{display:flex;gap:18px;align-items:center;font-size:13px;font-weight:800;color:var(--blue)}
      @media(max-width:900px){.top{grid-template-columns:1fr}.grid{grid-template-columns:1fr 1fr}.destinations{grid-template-columns:1fr}.header>nav{overflow-x:auto;justify-content:flex-start}.header>nav a{white-space:nowrap}.row{grid-template-columns:180px 1fr}.row img{width:180px;height:113px}}
      @media(max-width:640px){.mast{min-height:78px;padding:10px 16px}.logo img{width:180px}.support{display:none}.header>nav{display:grid;grid-template-columns:1fr}.header>nav a{font-size:19px;padding:15px 20px;border-right:0;border-bottom:1px solid #ffffff20}.header>nav .join{background:var(--orange)}main{padding:22px 16px 48px}.lead h1{font-size:34px;line-height:1.07}.lead p{font-size:16px}.grid{grid-template-columns:1fr}.compact{grid-template-columns:122px 1fr}.compact img{width:122px;height:80px}.row{grid-template-columns:122px 1fr;gap:14px;padding:17px 0}.row img{width:122px;height:80px}.row h2{font-size:20px;line-height:1.18}.row p{display:none}.section-head h1{font-size:38px}.destinations{margin-top:36px}footer{padding:26px 16px;display:block}footer nav{margin-top:18px;flex-wrap:wrap}}
    </style>`;
  }
}

if (!customElements.get('gatorbait-publication')) {
  customElements.define('gatorbait-publication', GatorBaitPublication);
}

export { GatorBaitPublication };
