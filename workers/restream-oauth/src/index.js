/**
 * GatorBait Social — Restream OAuth2 Worker
 *
 * Routes:
 *   GET /login          → Redirects to Restream authorization page
 *   GET /oauth/callback → Exchanges code for tokens, displays result
 *   GET /               → Health check
 */

const RESTREAM_AUTH_URL = 'https://api.restream.io/login';
const RESTREAM_TOKEN_URL = 'https://api.restream.io/oauth/token';
const DISPATCH_URL = 'https://gatorbait-dispatch.workers.dev/api/messages';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/':
        return new Response('GatorBait Social — Restream OAuth Worker is running.', {
          headers: { 'Content-Type': 'text/plain' },
        });

      case '/login':
        return handleLogin(env);

      case '/oauth/callback':
        return handleCallback(url, env);

      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};

/**
 * Redirect the user to Restream's OAuth authorization page.
 */
function handleLogin(env) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.RESTREAM_CLIENT_ID,
    redirect_uri: env.RESTREAM_REDIRECT_URI,
    state: crypto.randomUUID(),
  });

  return Response.redirect(`${RESTREAM_AUTH_URL}?${params.toString()}`, 302);
}

/**
 * Exchange the authorization code for access + refresh tokens.
 */
async function handleCallback(url, env) {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`Authorization denied: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response('Missing authorization code.', { status: 400 });
  }

  const tokenResponse = await fetch(RESTREAM_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.RESTREAM_REDIRECT_URI,
      client_id: env.RESTREAM_CLIENT_ID,
      client_secret: env.RESTREAM_CLIENT_SECRET,
    }),
  });

  if (!tokenResponse.ok) {
    const body = await tokenResponse.text();
    await notifyDispatch('restream', `OAuth token exchange failed (${tokenResponse.status})`);
    return new Response(
      `Token exchange failed (${tokenResponse.status}): ${body}`,
      { status: 502 }
    );
  }

  const tokens = await tokenResponse.json();

  await notifyDispatch('restream', `OAuth successful! Token received (expires in ${tokens.expires_in}s)`);

  return new Response(
    JSON.stringify({
      message: 'Restream OAuth successful!',
      access_token: tokens.access_token ? '***RECEIVED***' : null,
      refresh_token: tokens.refresh_token ? '***RECEIVED***' : null,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
    }, null, 2),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Post a status update to the GatorBait Dispatch workspace.
 */
async function notifyDispatch(channel, text) {
  try {
    await fetch(DISPATCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'restream-oauth-worker', channel, text }),
    });
  } catch {
    // Dispatch is best-effort; don't block the main flow
  }
}
