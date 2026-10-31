// Refreshes sports-live/buddy-videos.json from the public YouTube RSS feed (no key, no account).
// YouTube's feed sends no CORS header, so the light homepage reads this file from GitHub Pages instead.
// Usage: node sports-live/build-buddy-videos.mjs   (add to any existing refresh job to keep it current; not scheduled by itself)
import { writeFileSync } from 'node:fs';
const FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCtR8b1sKFuwaRjKy5BiXRvA';
const x = await (await fetch(FEED)).text();
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const videos = [...x.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 12).map((m) => ({
  id: /<yt:videoId>([^<]+)</.exec(m[1])[1], title: dec(/<title>([^<]+)</.exec(m[1])[1]), published: /<published>([^<]+)</.exec(m[1])[1],
}));
if (videos.length < 3) throw new Error('feed returned fewer than 3 videos');
writeFileSync(new URL('./buddy-videos.json', import.meta.url), JSON.stringify({ channelId: 'UCtR8b1sKFuwaRjKy5BiXRvA', fetchedAt: new Date().toISOString(), videos }, null, 2) + '\n');
console.log('wrote', videos.length, 'videos');
