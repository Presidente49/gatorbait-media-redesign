/**
 * GatorBait Dispatch — Team Communication Workspace
 *
 * A lightweight Cloudflare Worker + Durable Object that lets
 * team members and agents post, read, and coordinate in real time.
 *
 * Routes:
 *   GET  /                → Dashboard UI (HTML)
 *   GET  /api/messages    → List messages (JSON), ?channel=general&limit=50
 *   POST /api/messages    → Post a message { author, channel?, text }
 *   GET  /api/channels    → List all channels
 *   GET  /api/status      → Worker health + stats
 *   POST /api/clear       → Clear a channel { channel } (requires auth)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // All persistent state lives in the Durable Object
    const id = env.DISPATCH.idFromName('primary');
    const stub = env.DISPATCH.get(id);

    // Route to Durable Object for API calls
    if (url.pathname.startsWith('/api/')) {
      return stub.fetch(request);
    }

    // Dashboard UI
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(dashboardHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

/**
 * Durable Object: DispatchRoom
 * Stores messages in-memory with persistence via Durable Object storage.
 */
export class DispatchRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.messages = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    const stored = await this.state.storage.get('messages');
    this.messages = stored || [];
    this.initialized = true;
  }

  async save() {
    await this.state.storage.put('messages', this.messages);
  }

  async fetch(request) {
    await this.initialize();
    const url = new URL(request.url);

    if (url.pathname === '/api/messages' && request.method === 'GET') {
      return this.getMessages(url);
    }

    if (url.pathname === '/api/messages' && request.method === 'POST') {
      return this.postMessage(request);
    }

    if (url.pathname === '/api/channels' && request.method === 'GET') {
      return this.getChannels();
    }

    if (url.pathname === '/api/status' && request.method === 'GET') {
      return this.getStatus();
    }

    if (url.pathname === '/api/clear' && request.method === 'POST') {
      return this.clearChannel(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  getMessages(url) {
    const channel = url.searchParams.get('channel') || 'general';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 200);

    const filtered = this.messages
      .filter((m) => m.channel === channel)
      .slice(-limit);

    return jsonResponse(filtered);
  }

  async postMessage(request) {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const { author, text, channel } = body;

    if (!author || !text) {
      return jsonResponse({ error: 'author and text are required' }, 400);
    }

    const message = {
      id: crypto.randomUUID(),
      author: String(author).slice(0, 64),
      text: String(text).slice(0, 2000),
      channel: String(channel || 'general').slice(0, 32),
      timestamp: new Date().toISOString(),
    };

    this.messages.push(message);

    // Cap total messages at 1000 to avoid unbounded growth
    if (this.messages.length > 1000) {
      this.messages = this.messages.slice(-800);
    }

    await this.save();
    return jsonResponse(message, 201);
  }

  getChannels() {
    const channelSet = new Set(this.messages.map((m) => m.channel));
    // Always include default channels
    ['general', 'restream', 'deploy', 'alerts'].forEach((c) => channelSet.add(c));

    const channels = [...channelSet].map((name) => ({
      name,
      messageCount: this.messages.filter((m) => m.channel === name).length,
    }));

    return jsonResponse(channels);
  }

  getStatus() {
    return jsonResponse({
      status: 'ok',
      worker: 'gatorbait-dispatch',
      totalMessages: this.messages.length,
      channels: [...new Set(this.messages.map((m) => m.channel))].length,
      upSince: new Date().toISOString(),
    });
  }

  async clearChannel(request) {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${this.env.DISPATCH_SECRET}`) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const channel = body.channel || 'general';
    const before = this.messages.length;
    this.messages = this.messages.filter((m) => m.channel !== channel);
    await this.save();

    return jsonResponse({
      cleared: channel,
      removed: before - this.messages.length,
    });
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Inline dashboard HTML — no external dependencies.
 */
function dashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GatorBait Dispatch</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117; color: #c9d1d9; min-height: 100vh;
      display: flex; flex-direction: column;
    }
    header {
      background: #161b22; border-bottom: 1px solid #30363d;
      padding: 16px 24px; display: flex; align-items: center; gap: 12px;
    }
    header h1 { font-size: 20px; color: #58a6ff; }
    header .status { font-size: 12px; color: #3fb950; margin-left: auto; }
    .container { display: flex; flex: 1; overflow: hidden; }
    .sidebar {
      width: 200px; background: #161b22; border-right: 1px solid #30363d;
      padding: 12px; overflow-y: auto;
    }
    .sidebar h3 { font-size: 12px; color: #8b949e; text-transform: uppercase; margin-bottom: 8px; }
    .channel-btn {
      display: block; width: 100%; text-align: left; padding: 8px 12px;
      background: none; border: none; color: #c9d1d9; cursor: pointer;
      border-radius: 6px; font-size: 14px; margin-bottom: 2px;
    }
    .channel-btn:hover { background: #21262d; }
    .channel-btn.active { background: #1f6feb33; color: #58a6ff; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .messages {
      flex: 1; overflow-y: auto; padding: 16px 24px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .msg {
      background: #161b22; border: 1px solid #30363d; border-radius: 8px;
      padding: 12px 16px;
    }
    .msg .meta { font-size: 12px; color: #8b949e; margin-bottom: 4px; }
    .msg .meta .author { color: #58a6ff; font-weight: 600; }
    .msg .text { font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
    .compose {
      border-top: 1px solid #30363d; padding: 16px 24px;
      display: flex; gap: 8px;
    }
    .compose input[type=text] {
      flex: 1; background: #0d1117; border: 1px solid #30363d;
      border-radius: 6px; padding: 10px 14px; color: #c9d1d9; font-size: 14px;
    }
    .compose input[type=text]:focus { outline: none; border-color: #58a6ff; }
    .compose button {
      background: #238636; color: #fff; border: none; border-radius: 6px;
      padding: 10px 20px; font-size: 14px; cursor: pointer;
    }
    .compose button:hover { background: #2ea043; }
    .author-input {
      width: 120px; background: #0d1117; border: 1px solid #30363d;
      border-radius: 6px; padding: 10px 14px; color: #c9d1d9; font-size: 14px;
    }
    .empty { color: #484f58; text-align: center; margin-top: 40px; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <h1># GatorBait Dispatch</h1>
    <span class="status" id="status">● Connected</span>
  </header>
  <div class="container">
    <div class="sidebar">
      <h3>Channels</h3>
      <div id="channels"></div>
    </div>
    <div class="main">
      <div class="messages" id="messages"></div>
      <div class="compose">
        <input class="author-input" type="text" id="author" placeholder="Your name" />
        <input type="text" id="input" placeholder="Type a message..." />
        <button id="send">Send</button>
      </div>
    </div>
  </div>
  <script>
    let currentChannel = 'general';
    const savedAuthor = localStorage.getItem('dispatch_author') || '';
    document.getElementById('author').value = savedAuthor;

    async function loadChannels() {
      const res = await fetch('/api/channels');
      const channels = await res.json();
      const container = document.getElementById('channels');
      container.innerHTML = channels.map(ch =>
        '<button class="channel-btn' + (ch.name === currentChannel ? ' active' : '') +
        '" data-channel="' + ch.name + '"># ' + ch.name +
        (ch.messageCount ? ' <span style="color:#484f58">(' + ch.messageCount + ')</span>' : '') +
        '</button>'
      ).join('');
      container.querySelectorAll('.channel-btn').forEach(btn => {
        btn.onclick = () => { currentChannel = btn.dataset.channel; loadChannels(); loadMessages(); };
      });
    }

    async function loadMessages() {
      const res = await fetch('/api/messages?channel=' + currentChannel + '&limit=100');
      const msgs = await res.json();
      const container = document.getElementById('messages');
      if (!msgs.length) {
        container.innerHTML = '<div class="empty">No messages in #' + currentChannel + ' yet</div>';
        return;
      }
      container.innerHTML = msgs.map(m =>
        '<div class="msg"><div class="meta"><span class="author">' + escapeHtml(m.author) +
        '</span> &middot; ' + new Date(m.timestamp).toLocaleString() +
        '</div><div class="text">' + escapeHtml(m.text) + '</div></div>'
      ).join('');
      container.scrollTop = container.scrollHeight;
    }

    document.getElementById('send').onclick = sendMessage;
    document.getElementById('input').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

    async function sendMessage() {
      const input = document.getElementById('input');
      const authorEl = document.getElementById('author');
      const text = input.value.trim();
      const author = authorEl.value.trim() || 'anonymous';
      if (!text) return;
      localStorage.setItem('dispatch_author', author);
      input.value = '';
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text, channel: currentChannel }),
      });
      loadMessages();
      loadChannels();
    }

    function escapeHtml(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    // Initial load + poll every 5s
    loadChannels();
    loadMessages();
    setInterval(() => { loadMessages(); loadChannels(); }, 5000);
  </script>
</body>
</html>`;
}
