const DATA_URL = './data/posts.json';
const REFRESH_MS = 5 * 60 * 1000;
let lastSignature = '';

function esc(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function fmtDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

function relDate(value) {
  const d = new Date(value); const now = Date.now();
  const diff = Math.max(0, now - d.getTime());
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours===1?'':'s'} ago`;
  const days = Math.floor(hours/24);
  if (days < 7) return `${days} day${days===1?'':'s'} ago`;
  return fmtDate(value);
}

function imageMarkup(post, lead=false) {
  const image = post.image || {};
  const src = esc(image.src || '');
  if (!src) return `<div class="${lead?'lead-media':'card-media'}"></div>`;
  const width = Number(image.width) || 1600;
  const height = Number(image.height) || 900;
  const alt = esc(image.alt || `Featured image for ${post.title}`);
  const loading = lead ? 'eager' : 'lazy';
  const priority = lead ? ' fetchpriority="high"' : '';
  return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="${loading}" decoding="async"${priority}>`;
}

function meta(post, relative=false) {
  const who = esc(post.author || 'GatorBait Staff');
  const date = relative ? relDate(post.firstPublishedDate) : fmtDate(post.firstPublishedDate);
  const read = post.minutesToRead ? ` · ${post.minutesToRead} min read` : '';
  return `${who}${date ? ` · ${esc(date)}` : ''}${read}`;
}

function renderLead(post) {
  const node = document.getElementById('lead');
  node.innerHTML = `<a class="lead-link" href="${esc(post.url)}">
    <div class="lead-media">${imageMarkup(post,true)}</div>
    <div class="leadcopy"><span class="kicker">Latest</span><h1>${esc(post.title)}</h1>
    <p>${esc(post.excerpt || '')}</p><div class="meta">${meta(post)}</div></div></a>`;
}

function renderLatest(posts) {
  const node = document.getElementById('latest-list');
  node.innerHTML = posts.map(post => `<a class="compact" href="${esc(post.url)}">
    <div class="compact-media">${imageMarkup(post)}</div><div><span class="kicker">${esc(post.section || 'GatorBait')}</span>
    <h3>${esc(post.title)}</h3><div class="meta">${meta(post,true)}</div></div></a>`).join('');
}

function renderInside(posts) {
  const node = document.getElementById('inside-grid');
  node.innerHTML = posts.map(post => `<a class="card" href="${esc(post.url)}">
    <div class="card-media">${imageMarkup(post)}</div><span class="kicker">${esc(post.section || 'Football')}</span>
    <h3>${esc(post.title)}</h3><p>${esc(post.excerpt || '')}</p><div class="meta">${meta(post)}</div></a>`).join('');
}

function render(data) {
  const posts = [...(data.posts || [])]
    .filter(p => p && p.title && p.url && p.firstPublishedDate)
    .sort((a,b) => new Date(b.firstPublishedDate) - new Date(a.firstPublishedDate));
  if (!posts.length) throw new Error('No posts returned');
  const signature = posts.slice(0,8).map(p => `${p.url}|${p.firstPublishedDate}`).join('::');
  if (signature === lastSignature) return;
  lastSignature = signature;
  renderLead(posts[0]);
  renderLatest(posts.slice(1,5));
  renderInside(posts.slice(5,8));
  document.documentElement.dataset.latestPost = posts[0].url;
}

async function loadPosts() {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`Feed ${response.status}`);
    render(await response.json());
  } catch (error) {
    if (!lastSignature) {
      document.getElementById('lead').innerHTML = `<div class="error"><strong>Latest stories are temporarily unavailable.</strong><br><a href="https://www.gatorbaitmedia.com/gatorbait-media-blogs">Open the live GatorBait blog →</a></div>`;
    }
    console.error('GatorBait newsroom feed:', error);
  }
}

loadPosts();
setInterval(loadPosts, REFRESH_MS);
