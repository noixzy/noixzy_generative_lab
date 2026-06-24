#!/usr/bin/env node
// gen_thumbs.js — auto-generate gallery/thumbs/<id>.png for every module
// Usage: node workspace/gen_thumbs.js [id1 id2 ...]
// With no args: regenerates all modules listed in MODULES.
// With IDs: only regenerates those modules.

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const THUMBS = path.join(ROOT, 'gallery', 'thumbs');

// All modules: [id, wait_ms]
// wait_ms — how long to let the module render before screenshotting.
// Sims (reaction_diffusion, cellular_erosion) need more warmup.
const MODULES = [
  ['flow_field',              3000],
  ['reaction_diffusion',      5000],
  ['voronoi',                 2500],
  ['contour_field',           2500],
  ['truchet',                 2500],
  ['truchet_b',               2500],
  ['l_system',                2500],
  ['cellular_erosion',        5000],
  ['recursive_grid',          2500],
  ['sdf',                     2500],
  ['wave_interference',       2500],
  ['stipple',                 3000],
  ['grid_extrude',            3000],
  ['sdf_raymarch',            4000],
  ['gyroid',                  4000],
  ['displacement',            4000],
  ['displacement_primitives', 4000],
  ['mandelbulb',              5000],
  ['fold',                    4000],
];

const THUMB_SIZE = 640; // square output size in px

// Minimal static file server
function startServer(root, port) {
  const mime = {
    '.html': 'text/html', '.js': 'application/javascript',
    '.css': 'text/css',   '.png': 'image/png', '.jpg': 'image/jpeg',
  };
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, rel === '/' ? 'index.html' : rel);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(port, () => r(server)));
}

async function thumb(page, id, waitMs, port) {
  const url = `http://localhost:${port}/${id}/noixzy_${id}.html`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // wait for canvas to exist then let the sim warm up
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(waitMs);

  // screenshot the #stage div (the canvas container)
  const stage = await page.$('#stage');
  if (!stage) throw new Error(`#stage not found in ${id}`);

  const outPath = path.join(THUMBS, `${id}.png`);
  await stage.screenshot({ path: outPath });

  // crop/resize to THUMB_SIZE square using Canvas API via sharp if available,
  // otherwise just save as-is (Playwright screenshot is already the element bounds).
  console.log(`  ✓ ${id} → gallery/thumbs/${id}.png`);
}

(async () => {
  const args = process.argv.slice(2);
  const targets = args.length
    ? MODULES.filter(([id]) => args.includes(id))
    : MODULES;

  if (!targets.length) {
    console.error('No matching modules found. Available:', MODULES.map(m => m[0]).join(', '));
    process.exit(1);
  }

  const PORT = 7821;
  console.log(`Starting server on port ${PORT}…`);
  const server = await startServer(ROOT, PORT);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 900, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // silence console noise from modules
  page.on('console', () => {});
  page.on('pageerror', err => console.warn('  page error:', err.message));

  let ok = 0, fail = 0;
  for (const [id, waitMs] of targets) {
    process.stdout.write(`  ${id}… `);
    try {
      await thumb(page, id, waitMs, PORT);
      ok++;
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
      fail++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nDone: ${ok} ok, ${fail} failed.`);
  if (ok) console.log('Refresh gallery/index.html to see updated thumbnails.');
})();
