// Skapar sida/checklista-flyttstadning.pdf från sida/index.html.
// Kör: npm run pdf
// (Valfritt: CHROME_PATH=/sökväg/till/chrome om Playwrights egen webbläsare inte är installerad.)
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = path.join(root, 'sida', 'index.html');
const out = path.join(root, 'sida', 'checklista-flyttstadning.pdf');

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage();
await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: out,
  format: 'A4',
  preferCSSPageSize: true,
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate:
    '<div style="width:100%;font:8px system-ui,sans-serif;color:#5d716a;padding:0 16mm;display:flex;justify-content:space-between">' +
    '<span>Checklista för flyttstädning</span><span>Sida <span class="pageNumber"></span> av <span class="totalPages"></span></span></div>',
});
await browser.close();
console.log('Skapade', path.relative(root, out));
