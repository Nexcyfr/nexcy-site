import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });

// M2: FRESH context (preloader WILL show). After ~3.6s the preloader is gone AND the hero must be revealed.
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://localhost:3100/', { waitUntil:'networkidle' });
  await page.waitForTimeout(3600); // preloader ~2.2s + hero entrance
  // Is the hero H1 visible (opacity ~1)?
  const heroOpacity = await page.evaluate(() => {
    const inner = document.querySelector('[data-hero-word]');
    if (!inner) return 'no-word';
    const wrapper = inner.closest('span');
    return getComputedStyle(inner).transform; // should be ~none/identity when revealed
  });
  const tagline = await page.evaluate(() => {
    const el = document.querySelector('[data-hero-tagline]');
    return el ? getComputedStyle(el).opacity : 'none';
  });
  const preloaderGone = await page.evaluate(() => !document.querySelector('[role="status"][aria-label="Chargement du site"]'));
  console.log('M2 first-visit -> preloader gone:', preloaderGone, '| tagline opacity:', tagline, '| hero word transform:', heroOpacity);
  console.log('M2 page errors:', errors.length?errors:'none');
  await page.screenshot({ path:'shots/p0-home-firstvisit.png' });
  await ctx.close();
}

// Regression: clean desktop + mobile (preloader skipped)
async function shoot(path, file, w, h, wait=2000) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h} });
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('nexcy-loaded','1');document.cookie='nexcy-consent=accept; path=/';}catch(e){}});
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto('http://localhost:3100'+path,{waitUntil:'networkidle'});
  await page.waitForTimeout(wait);
  await page.screenshot({ path:file });
  console.log(file+' | errors: '+(errs.length?JSON.stringify(errs):'none'));
  await ctx.close();
}
await shoot('/','shots/p0-home-desktop.png',1440,900,2400);
await shoot('/','shots/p0-home-mobile.png',390,844,2400);
await shoot('/contact','shots/p0-contact-desktop.png',1440,1150,1600);

await browser.close();
console.log('done');
