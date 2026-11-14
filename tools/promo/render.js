/* Renders the promo videos frame by frame and encodes them with ffmpeg.
   Usage: node tools/promo/render.js <video 1|2|3> <out.mp4> [fps]
          node tools/promo/render.js <video> --stills <dir> <t1,t2,...>   (preview frames) */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

(async () => {
  const [v, out, a3, a4] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'promo.html') + '?v=' + v);
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.DURATION);
  console.log('answer:', JSON.stringify(await page.evaluate(() => window.answer())));
  if (out === '--stills') {
    fs.mkdirSync(a3, { recursive: true });
    for (const t of a4.split(',').map(Number)) {
      await page.evaluate((t) => window.renderAt(t), t);
      await page.screenshot({ path: path.join(a3, `v${v}-t${t}.jpg`), type: 'jpeg', quality: 80 });
    }
  } else {
    const fps = +(a3 || 30);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-'));
    const frames = Math.round(duration * fps);
    for (let f = 0; f < frames; f++) {
      await page.evaluate((t) => window.renderAt(t), f / fps);
      await page.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(dir, '%05d.jpg'),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`wrote ${out} (${frames} frames)`);
  }
  await browser.close();
})();
