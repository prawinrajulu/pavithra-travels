import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', error => {
      console.log(`[BROWSER ERROR] ${error.message}`);
    });

    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    
    // Fill in login
    await page.type('input[type="email"]', 'pavithrashoppee@gmail.com');
    await page.type('input[type="password"]', '[PASSWORD]');
    await page.click('button[type="submit"]');
    
    console.log('Waiting for login to complete and navigate...');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log('Navigated to: ' + page.url());
    
    console.log('Navigating to Admin Blog Manager...');
    await page.goto('http://localhost:5173/admin/blogs-manager', { waitUntil: 'networkidle0' });
    
    console.log('Page loaded. Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(`Body length: ${bodyHTML.length} characters`);
    
    await browser.close();
  } catch (error) {
    console.error('Puppeteer Script Error:', error);
    process.exit(1);
  }
})();
