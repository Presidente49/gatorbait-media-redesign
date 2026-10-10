import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PKG);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(async()=>chromium.launch());
for(const n of ['forecast','changes']){const p=await b.newPage({viewport:{width:1200,height:675}});await p.goto('file://'+process.cwd()+'/'+n+'.html');await p.waitForTimeout(600);await p.screenshot({path:n+'.png'});}
await b.close();
