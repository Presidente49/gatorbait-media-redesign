import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:900}});
await p.goto('file://'+process.cwd()+'/cover.html');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('h1,.match,.meta,.tape,.row')].map(e=>{const r=e.getBoundingClientRect();return [e.className||e.tagName,Math.round(r.right),Math.round(r.bottom),e.scrollWidth>e.clientWidth]})));
await p.screenshot({path:'missouri-first-look-cover.png'});await b.close();
