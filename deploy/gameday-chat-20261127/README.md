# GatorBait fan chat (Nov. 27, 2026)

A small, moderated live chat for game days. A Cloudflare Worker with one Durable Object per room (for example `game-401856759`) serves WebSockets
with the hibernation API and keeps the last messages, bans and settings in the object's SQLite storage. The chat window is `truck/chat.html`
(GitHub Pages), meant to sit in an iframe under the live scoreboard card in the live-updates post and on the Truck.

## Rules the server enforces
- Nickname 2 to 20 characters, letters, numbers, spaces, dots, dashes, underscores; staff-looking names (Jarvis, Brenden, Buddy, Admin, GatorBait ...) are reserved; word filter applies to names too.
- Messages up to 200 characters; no links, email addresses or phone numbers; word filter (whole-word and stem lists, spaced-out letters and leetspeak handled; normal words such as "Scunthorpe" or "class" pass).
- Slow mode (default 3 seconds, adjustable), at most 12 messages a minute per connection, no repeating the same message within 30 seconds, at most 6 connections per person.
- WebSocket origin must be gatorbaitmedia.com or presidente49.github.io (plus `ALLOW_ORIGINS` for local tests).
- IP addresses are never stored in the clear: a salted hash is used only for rate limits and bans.

## Moderation (Jarvis only)
`POST /room/<room>/mod` with `Authorization: Bearer <MOD_TOKEN>` and a JSON body:
`{"action":"say","text":"..."}` (staff message), `hide` (`id`), `ban` (`id`, `minutes`), `open` (`open`: true or false, the kill switch),
`slow` (`seconds`), `clear`, `status`. `MOD_TOKEN` and `SALT` are Worker secrets. They are never committed and never shown in chat.

## Local test
```
cd deploy/gameday-chat-20261127/worker && npm install
printf 'MOD_TOKEN=local-test-token\nSALT=local-test-salt\nALLOW_ORIGINS=http://127.0.0.1:8765\n' > .dev.vars   # local only, not committed
npx wrangler dev --port 8787 &
node test-chat.mjs        # 25 checks: origin gate, nicknames, slow mode, filters, staff messages, hide, kill switch, ban
```

## Deploy
`npx wrangler deploy` (or the Cloudflare connector), then set the secrets, then set `DEFAULT_API` in `truck/chat.html` (or pass `?api=`).
Rollback: close the room with the `open` action, or delete the Worker.
