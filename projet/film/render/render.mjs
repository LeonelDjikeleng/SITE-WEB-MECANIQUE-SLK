// Rendu image par image : Chromium (vecteurs, fenêtre 4K et zoom CSS ×2 = 4K natif, sans agrandissement d'image) → JPEG qualité 100 → FFmpeg (x264 CRF 10, intermédiaire).
// Usage : node render.mjs h|v principal|court sortie.mp4 fps dpr debut fin
import { chromium } from '/tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/fonts/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const [mode, cutName, out, fpsS = '30', dprS = '2', a = '0', z = '0'] = process.argv.slice(2);
const fps = +fpsS, dpr = +dprS;
const [w, h] = mode === 'v' ? [1080, 1920] : [1920, 1080];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: w * dpr, height: h * dpr }, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/user/SITE-WEB-MECANIQUE-SLK/projet/film/render/film.html');
const dur = await p.evaluate(async ([w, h, c, z]) => { document.documentElement.style.zoom = z; FILM.setup(w, h); FILM.use(c); await document.fonts.ready; return FILM.duration(); }, [w, h, cutName, dpr]);
const total = Math.round(dur * fps), start = +a, end = +z ? Math.min(+z, total) : total;
const cdp = await p.context().newCDPSession(p);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let i = start; i < end; i++) {
  await p.evaluate(t => FILM.render(t), i / fps);
  const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 100, fromSurface: true });
  const buf = Buffer.from(r.data, 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
console.log(`terminé ${out} [${start}-${end}) ${((Date.now() - t0) / 1000).toFixed(0)} s erreurs ${JSON.stringify(errs)}`);
await b.close();
