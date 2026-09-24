import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [work, output, chrome] = process.argv.slice(2);
const require = createRequire(join(resolve(work),'colorlib','package.json'));
const {chromium} = require('playwright-core');
const browser = await chromium.launch({executablePath:chrome, chromiumSandbox:true});
const report={email:[],paged:null};
const save=()=>writeFileSync(join(output,'browser-report.json'),JSON.stringify(report,null,2));
try {
 const p=await browser.newPage();
 for(const n of [4,24]) {
  for(const width of [390,1000]) {
   await p.setViewportSize({width,height:1100});
   await p.goto(pathToFileURL(join(work,'colorlib',String(n),'index.html')).href,{waitUntil:'load'});
   const m=await p.evaluate(()=>({width:innerWidth,docWidth:document.documentElement.scrollWidth,tables:document.querySelectorAll('table').length,words:document.body.innerText.trim().split(/\s+/).length}));
   await p.screenshot({path:join(output,`colorlib-${n}-${width}.png`)});
   report.email.push({template:n,...m,pass:m.docWidth<=width && m.tables>0 && m.words>20});save();
  }
 }
 if (!existsSync(join(work,'pagedjs','dist','paged.polyfill.js'))) throw new Error('Original Paged.js build unavailable; email checks preserved');
 const fixture=readFileSync(join(output,'publication.html'),'utf8');
 const polyfill=pathToFileURL(join(work,'pagedjs','dist','paged.polyfill.js')).href;
 const paged=join(output,'paged-original.html');
 writeFileSync(paged,fixture.replace('</head>',`<script>window.PagedConfig={after:flow=>{window.__pages=flow.total}}</script><script src="${polyfill}"></script></head>`));
 await p.goto(pathToFileURL(paged).href,{waitUntil:'load'});
 await p.waitForFunction(()=>window.__pages>0,null,{timeout:60000});
 report.paged=await p.evaluate(()=>({pages:window.__pages,containers:document.querySelectorAll('.pagedjs_page').length,endMarker:document.body.innerText.includes('END OF NATIVE TOOL TEST')}));
 if(report.paged.pages!==2 || !report.paged.endMarker) throw new Error('Native paged engine pagination/text failed');
 await p.pdf({path:join(output,'paged-original.pdf'),printBackground:true,preferCSSPageSize:true});
 await p.screenshot({path:join(output,'paged-original.png')});
 writeFileSync(join(output,'browser-report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
 if(report.email.some(t=>!t.pass)) throw new Error('Original template geometry failed');
} finally {await browser.close()}
