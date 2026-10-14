// Aperçu : quelques images clés, en 1920x1080 (ou vertical 1080x1920)
import { chromium } from '/tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/fonts/node_modules/playwright/index.mjs';
const [out, mode = 'h', cutName = 'principal', ...times] = process.argv.slice(2);
const [w, h] = mode === 'v' ? [1080, 1920] : [1920, 1080];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files', '--force-color-profile=srgb', '--default-tile-width=4096', '--default-tile-height=4096'] });
const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('file:///home/user/SITE-WEB-MECANIQUE-SLK/projet/film/render/film.html');
await p.evaluate(async ([w, h, c]) => { FILM.setup(w, h); FILM.use(c); await document.fonts.ready; }, [w, h, cutName]);
for (const t of times) { await p.evaluate(t => FILM.render(+t), t); await p.screenshot({ path: `${out}/${mode}-${cutName}-${t}.png` }); }
console.log('erreurs', JSON.stringify(errs), 'durée', await p.evaluate(() => FILM.duration()));
await b.close();
