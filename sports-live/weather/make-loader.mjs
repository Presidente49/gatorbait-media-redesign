#!/usr/bin/env node
// Prints the one-line loader for the live weather card, pinned to a commit. Usage: node make-loader.mjs <40-hex commit>
const c = process.argv[2] || '';
if (!/^[0-9a-f]{40}$/.test(c)) { console.error('need a 40-hex commit'); process.exit(1); }
process.stdout.write(`<!-- GBM_WX_V1 src=${c.slice(0, 7)} --><script id="gbm-wx-loader">(function(){var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@${c}/sports-live/weather/weather-card.js";s.async=true;document.head.appendChild(s)})();</script>`);
