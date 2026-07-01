import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
async function shoot(path, file, w, h, wait=1600) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h} });
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('nexcy-loaded','1');document.cookie='nexcy-consent=accept; path=/';}catch(e){}});
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto('http://localhost:3100'+path,{waitUntil:'networkidle'});
  await page.waitForTimeout(wait);
  await page.screenshot({ path:file, fullPage: file.includes('full') });
  console.log(file+' | errors: '+(errs.length?JSON.stringify(errs):'none'));
  await ctx.close();
}
// m3: tablet 768 → hamburger expected (no pill)
await shoot('/','shots/p1-tablet-768.png',768,900,1600);
// desktop still has pill
await shoot('/','shots/p1-desktop-nav.png',1440,500,1600);
// m1: services end (no invented CTA) — full page bottom
await shoot('/services','shots/p1-services-full.png',1440,900,1800);
// m2: contact info block (no cal url → échange direct hidden)
await shoot('/contact','shots/p1-contact.png',1440,1150,1500);
// mobile regression
await shoot('/','shots/p1-home-mobile.png',390,844,2000);
await browser.close();
console.log('done');
