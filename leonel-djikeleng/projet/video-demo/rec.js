const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
await p.goto('file://'+process.argv[2]+'/film.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const N=450;for(let f=0;f<N;f++){await p.evaluate(t=>render(t),f/30);await p.screenshot({path:`${process.argv[2]}/frames/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close();console.log('ok');})();
