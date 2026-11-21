#!/usr/bin/env python3
"""Print the loader embed body for the front-page Top 25 scoreboard, pinned to one commit.
Usage: python3 deploy/home-scoreboard/make-loader.py <40-hex commit sha> > loader.html
The commit must contain sports-live/home-scoreboard.js. The loader only fetches the script on the front page ("/"), checks again on
every client-side route change, and does nothing else. Never prints a secret; reads nothing."""
import re, sys
sha = sys.argv[1] if len(sys.argv) > 1 else ''
if not re.fullmatch(r'[0-9a-f]{40}', sha):
    sys.exit('usage: make-loader.py <40-hex commit sha>')
print("<!-- GBM_HOME_SCOREBOARD_V1 src=%s immutable=1 bundle=sports-live/home-scoreboard.js --><script id=\"gbm-lsb-loader\">(function(){if(window.__GBM_LSB_L__)return;window.__GBM_LSB_L__=1;var done=0,t;function go(){if(done||!/^\\/?$/.test(location.pathname||'/'))return;done=1;clearInterval(t);var s=document.createElement('script');s.async=true;s.id='gbm-lsb-bundle';s.src='https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@%s/sports-live/home-scoreboard.js';document.head.appendChild(s);}go();if(!done){window.addEventListener('popstate',go);window.addEventListener('gbmroutechange',go);t=setInterval(go,2000);}})();</script>" % (sha, sha))
