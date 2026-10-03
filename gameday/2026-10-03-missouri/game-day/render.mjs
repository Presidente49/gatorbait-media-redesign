import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:880,height:495}});
await p.goto('file://'+process.cwd()+'/cover.html');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.team,.meta,.venue,.stat')].map(e=>{const r=e.getBoundingClientRect();return [e.className||e.tagName,Math.round(r.right),Math.round(r.bottom),e.scrollWidth>e.clientWidth]})));
await p.screenshot({path:'missouri-gameday-cover.png'});
await p.screenshot({path:'missouri-gameday-cover.jpg',type:'jpeg',quality:18});
await b.close();
