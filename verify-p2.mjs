import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless:true });

// p5: mobile menu focus behavior
{
  const ctx = await browser.newContext({ viewport:{width:390,height:844} });
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('nexcy-loaded','1');document.cookie='nexcy-consent=accept; path=/';}catch(e){}});
  const page = await ctx.newPage();
  await page.goto('http://localhost:3100/',{waitUntil:'networkidle'});
  const role = await page.getAttribute('#mobile-menu','role');
  const modal = await page.getAttribute('#mobile-menu','aria-modal');
  await page.click('button[aria-label="Ouvrir le menu"]');
  await page.waitForTimeout(400);
  const focusAfterOpen = await page.evaluate(()=>document.activeElement?.textContent);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const focusAfterClose = await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
  console.log('p5 -> role:', role, '| aria-modal:', modal, '| focus@open:', JSON.stringify(focusAfterOpen), '| focus@close:', JSON.stringify(focusAfterClose));
  await ctx.close();
}

// Regression + descenders: contact hero "projet" (j,p), desktop + mobile
async function shoot(path,file,w,h,wait=1600){
  const ctx = await browser.newContext({ viewport:{width:w,height:h} });
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('nexcy-loaded','1');document.cookie='nexcy-consent=accept; path=/';}catch(e){}});
  const page = await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto('http://localhost:3100'+path,{waitUntil:'networkidle'});
  await page.waitForTimeout(wait);
  await page.screenshot({ path:file });
  console.log(file+' | errors:'+(errs.length?JSON.stringify(errs):'none'));
  await ctx.close();
}
await shoot('/','shots/p2-home-desktop.png',1440,900,2400);
await shoot('/','shots/p2-home-mobile.png',390,844,2200);
await shoot('/contact','shots/p2-contact-descenders.png',1440,700,1400);
await shoot('/','shots/p2-showcase.png',1440,900,1400);
await browser.close();
console.log('done');
