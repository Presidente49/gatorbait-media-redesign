# Restream OAuth Setup — Manual Steps Required

The Restream developer portal SPA does not render in automated/headless browsers.
Brenden must complete these steps manually from his own browser.

---

## 1. Create the Restream App

1. Go to **https://developers.restream.io/apps** in your browser
2. If no app is listed, click **Create** (the button may only render in a real browser session)
3. In the app settings, set the **Redirect URI** to:
   ```
   https://gatorbait-social.workers.dev/oauth/callback
   ```
4. **Check ALL available scopes**
5. Click **Save**
6. Copy the **Client ID** and **Client Secret** — you'll need them below

## 2. Deploy the Worker

```bash
cd workers/restream-oauth
npm install
wrangler secret put RESTREAM_CLIENT_ID    # paste client ID when prompted
wrangler secret put RESTREAM_CLIENT_SECRET # paste client secret when prompted
npm run deploy
```

## 3. Authorize

Visit **https://gatorbait-social.workers.dev/login** in your browser.
This redirects to Restream's authorization page. After granting access, you'll
be redirected back to the callback URL and see a confirmation with token info.

---

## Why Manual?

The Restream developer portal (`developers.restream.io`) is a single-page app
that detects and blocks automated/headless browser contexts. The `<main>` element
renders empty in those sessions. This is a known limitation — the app creation
must be done in a standard browser.
