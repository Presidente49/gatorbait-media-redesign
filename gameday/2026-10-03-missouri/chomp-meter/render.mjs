import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:900,height:300}});
await p.goto('file://'+process.cwd()+'/preview.html');await p.waitForTimeout(300);
await p.screenshot({path:'preview.png'});
await b.close();
