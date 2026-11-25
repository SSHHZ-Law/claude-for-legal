// Shared setup for the browser tests. Serves the app straight from disk through request
// interception (no web server needed) and hands back a page plus a few helpers.
// Needs Playwright with Chromium: it is preinstalled in Claude Code cloud sessions;
// on your own machine run `npm i -D playwright && npx playwright install chromium` first.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'), ORIGIN = 'http://smokering.test';
const TYPES = { html: 'text/html', css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', woff2: 'font/woff2', webmanifest: 'application/manifest+json' };

exports.start = async (name, { scale = 2, theme = 'light' } = {}) => {
  const OUT = path.join(__dirname, 'out', name); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: scale, colorScheme: theme });
  await c.route(ORIGIN + '/**', r => {
    const f = path.join(ROOT, decodeURIComponent(new URL(r.request().url()).pathname));
    fs.existsSync(f) && fs.statSync(f).isFile() ? r.fulfill({ body: fs.readFileSync(f), contentType: TYPES[f.split('.').pop()] || 'application/octet-stream' }) : r.fulfill({ status: 404, body: '' });
  });
  // The test origin is plain http, where browsers expose no clipboard; record what the app writes instead.
  await c.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async t => { window.__clip = t; } }, configurable: true }); });
  const p = await c.newPage(); const errors = []; let fails = 0, passes = 0;
  p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const log = (ok, what) => { ok ? passes++ : fails++; console.log((ok ? 'PASS  ' : 'FAIL  ') + what); };
  const text = sel => p.locator(sel).first().innerText();
  const settle = () => p.waitForTimeout(350);
  const has = async t => (await p.content()).includes(t);
  const open = async (route, sel) => { await p.goto(ORIGIN + '/index.html#' + route); await p.waitForSelector(sel); await settle(); };
  const pickMe = async who => { await open('/who', '.who'); await p.click(`.who button:has-text("${who}")`); await p.waitForSelector('.board'); };
  // Full-page screenshot with the fixed bars at the true bottom.
  const shot = async (file, dir = OUT) => {
    await settle(); await p.evaluate(() => { document.getElementById('toast').hidden = true; });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.setViewportSize({ width: 390, height: Math.max(H, 844) }); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(dir, file + '.png') }); await p.setViewportSize({ width: 390, height: 844 });
  };
  const done = async () => {
    await b.close();
    console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors');
    console.log(`${name}: ${passes} passed, ${fails} failed`);
    if (fails || errors.length) process.exitCode = 1;
  };
  return { ROOT, ORIGIN, OUT, fs, path, b, c, p, log, text, settle, has, open, pickMe, shot, done };
};
