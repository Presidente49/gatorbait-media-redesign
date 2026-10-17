import { readFileSync,writeFileSync } from 'node:fs';
const dir='deploy/broadcast-2026/s4/src/';
const header=readFileSync(dir+'header.css','utf8').split('/* kept from rev36: story pages')[0]
 .replace(/\^/g,'html:has(#gbm-site-header) ').replace(/`/g,'#gbm-site-header').replace(/\$/g,'!important').replace(/~/g,'"Barlow Condensed",Barlow,sans-serif').replace(/§/g,'#gbm-mobile-drawer-root').replace(/¶/g,'#gbm-mobile-shell');
const css='/* Swamp Night shared chrome, Oct. 17, 2026. CSS only; no content, routing, app logic or story rules. */\n'+header+['theme.css','tv.css','roster.css','gate.css','ui.css'].map(f=>{
 let s=readFileSync(dir+f,'utf8');
 // These widgets can inject their original styles after hydration. Stable doubled
 // IDs/classes keep the new skin authoritative without ordering or polling hacks.
 if(f==='tv.css')s=s.replaceAll('#gbm-media-hub','#gbm-media-hub#gbm-media-hub');
 if(f==='roster.css')s=s.replaceAll('.gbm-football-tools','.gbm-football-tools.gbm-football-tools');
 if(f==='gate.css')s=s.replaceAll('#gbm-gate','#gbm-gate#gbm-gate');
 return s;
}).join('\n');
writeFileSync('deploy/swamp-night-20261017/site-shell.css',css);
console.log('site-shell.css',css.length,'chars');
