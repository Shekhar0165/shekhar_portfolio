const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

        // We have to navigate to the domain first before setting local storage
        await page.goto('http://localhost:5173/admin/login');

        await page.evaluate(() => {
            localStorage.setItem('admin_token', 'fake-jwt-token-for-testing');
        });

        console.log('Token injected, navigating to dashboard...');
        await page.goto('http://localhost:5173/admin/dashboard');

        // Wait for potential network requests to settle
        await new Promise(r => setTimeout(r, 4000));

        await page.screenshot({ path: 'debug-auth.png', fullPage: true });
        console.log('Screenshot saved to debug-auth.png');

        await browser.close();
    } catch (err) {
        console.error(err);
    }
})();
