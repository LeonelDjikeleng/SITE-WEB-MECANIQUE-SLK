/* Mécanique SKL · comportements du site
   Sans dépendance. Tout l'essentiel fonctionne sans ce fichier. */
(() => {
  'use strict';

  // Vidéo Higgsfield de l'accueil : null tant qu'elle n'existe pas.
  // Une fois générée et approuvée : 'assets/video/hero-scrub.mp4' + son poids exact en octets.
  const HERO_VIDEO = null;
  const HERO_VIDEO_BYTES = 0;
  const HERO_POSTER = 'assets/img/hero-poster.jpg';

  const TZ = 'America/Toronto'; // heure de Québec
  const HOURS = { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 12] }; // À CONFIRMER avec le garage (source unique : Otobox)
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fmtH = h => `${h} h`;

  /* ---------------- heure de Québec ---------------- */
  function quebecNow() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g('weekday')];
    return { y: +g('year'), m: +g('month'), d: +g('day'), h: +g('hour') % 24, min: +g('minute'), wd };
  }

  /* ---------------- découpage des titres ---------------- */
  function split(el, seed) {
    const r = rng(seed);
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const emText = el.querySelector('em') ? el.querySelector('em').textContent.trim() : '';
    const words = text.split(' ');
    const emWords = emText ? emText.split(' ') : [];
    const firstEm = emText ? words.length - emWords.length : Infinity;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const vis = document.createElement('span');
    vis.className = 'split';
    vis.setAttribute('aria-hidden', 'true');
    const spread = parseFloat(el.dataset.spread || '0.5');
    words.forEach((w, i) => {
      const ws = document.createElement('span');
      ws.className = 'w' + (i >= firstEm ? ' em' : '');
      ws.style.setProperty('--th', ((i / Math.max(1, words.length - 1)) * spread + r() * 0.05).toFixed(3));
      ws.textContent = w;
      vis.appendChild(ws);
      if (i < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.appendChild(vis);
  }
  $$('[data-split]').forEach((el, i) => split(el, 7 + i * 31));

  /* ---------------- accueil : animé partout, sauf si l'appareil demande moins d'animations ---------------- */
  // Le décor codé (sol, roue, poussière) s'anime aussi sur téléphone.
  // La vidéo, lourde, ne se charge que sur les grands écrans (les cinq portes de 10K Websites).
  const STATIC_GATES = ['(prefers-reduced-motion: reduce)'];
  const VIDEO_GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  const hero = $('.hero');
  const stage = $('.stage');
  const video = $('.floor__video');
  const ring = $('.ring');
  const hudVal = $('.hud__val');
  const bands = $$('.band').map((el, i, all) => ({
    el, a: +el.dataset.a, b: +el.dataset.b, first: i === 0, last: i === all.length - 1,
    ramp: el.dataset.ramp ? +el.dataset.ramp : null, op: -1, k: -1, on: null, live: null
  }));

  let gliding = false;
  let scrubOn = false, heroOnScreen = true, target = 0, shown = 0, rafId = null, lastTick = 0;
  let loadK = 0, loadStart = 0, lastVars = {}, lastHud = '', lastHudAt = 0;

  function heroProgress() {
    const r = hero.getBoundingClientRect();
    const range = hero.offsetHeight - innerHeight;
    return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
  }
  function setVar(name, val) {
    if (lastVars[name] === val) return;
    lastVars[name] = val;
    stage.style.setProperty(name, val);
  }
  function rangeVh() { return Math.max(1, (hero.offsetHeight - innerHeight) / innerHeight * 100); }

  function updateCaptions(p, now) {
    const vh = rangeVh();
    const f = Math.min(18 / vh, 0.06);        // rampes d'environ 18vh
    bands.forEach(b => {
      let op = (b.first ? 1 : smoothstep(p, b.a, b.a + f)) * (b.last ? 1 : 1 - smoothstep(p, b.b - f, b.b));
      if (b.first && p < b.a) op = 1;
      const ramp = b.ramp || Math.min(24 / vh, (b.b - b.a) * 0.35);
      let k = clamp((p - b.a) / ramp, 0, 1);
      if (b.first) k = Math.max(k, loadK);
      op = Math.round(op * 1000) / 1000;
      if (Math.abs(op - b.op) > 0.002) { b.op = op; b.el.style.opacity = op; }
      if (Math.abs(k - b.k) > 0.008 || (k === 1 && b.k !== 1) || (k === 0 && b.k !== 0)) { b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
      const on = op > 0.01, live = op > 0.6;
      if (on !== b.on) { b.on = on; b.el.classList.toggle('is-on', on); }
      if (live !== b.live) { b.live = live; b.el.classList.toggle('is-live', live); }
    });
    // la caméra descend vers la roue
    const e = easeInOut(p);
    const wz = 0.42 + 0.5 * e;
    setVar('--wz', wz.toFixed(4));
    setVar('--zoom', (wz / 0.42).toFixed(4));
    setVar('--rot', (p * 360).toFixed(2) + 'deg');   // un tour complet
    setVar('--haze', (0.55 - 0.42 * e).toFixed(3));
    stage.classList.toggle('is-moving', p > 0.02);
    const label = Math.round(p * 100) + ' %';
    if (label !== lastHud && (now - lastHudAt > 100 || p === 0 || p === 1)) { lastHud = label; lastHudAt = now; hudVal.textContent = label; }
  }

  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = gliding ? 0.7 : 0.34;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (loadStart && loadK < 1) loadK = clamp((now - loadStart) / 600, 0, 1);
    const settled = Math.abs(target - shown) < 0.0005 && loadK >= 1;
    if (settled) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    if (video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown, now);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen && scrubOn) rafId = requestAnimationFrame(tick);
  }

  // recherche vidéo protégée (une seule à la fois, la plus récente gagne)
  let seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    if (Math.abs(video.currentTime - t) < 0.01) return;
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => { seekBusy = false; if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); } });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; failVideo(); });

  let heroInit = false;
  function initHeroOnce() {
    if (heroInit) return;
    heroInit = true;
    maybeLoadVideo();
  }
  let videoStarted = false;
  function maybeLoadVideo() {
    if (!HERO_VIDEO) { ring.style.setProperty('--ld', 0); return; }
    if (videoStarted || !scrubOn || VIDEO_GATES.some(q => matchMedia(q).matches)) return;
    videoStarted = true;
    const img = new Image();
    let started = false;
    const start = () => { if (started) return; started = true; loadHeroBlob().catch(failVideo); };
    img.onload = start; img.onerror = start; img.src = HERO_POSTER;
    $('.floor').style.backgroundImage = `url('${HERO_POSTER}')`;
    setTimeout(start, 4000);
  }
  async function loadHeroBlob() {
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(HERO_VIDEO, { priority: 'low', signal: ctrl.signal });
    if (!res.ok) throw new Error('video ' + res.status);
    const total = Number(res.headers.get('Content-Length')) || HERO_VIDEO_BYTES || 1;
    const reader = res.body.getReader();
    const chunks = []; let got = 0, lastRing = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(watchdog); watchdog = setTimeout(() => ctrl.abort(), 20000);
      chunks.push(value); got += value.length;
      const frac = Math.min(1, got / total), now = performance.now();
      if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
    }
    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    video.load();
    video.addEventListener('canplay', () => { requestSeek(heroProgress() * video.duration); stage.classList.add('video-ready'); }, { once: true });
  }
  function failVideo() { stage.classList.add('video-failed'); ring.style.setProperty('--ld', 0); }

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(b => { b.op = -1; b.k = -1; b.on = null; b.live = null; b.el.style.removeProperty('opacity'); });
    lastVars = {};
    if (!loadStart) loadStart = performance.now();
    shown = target = heroProgress();
    updateCaptions(shown, performance.now());
    rafId = null; onScroll();
    if (rafId === null) rafId = requestAnimationFrame(tick);
    startDust();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    bands.forEach(b => { b.el.style.removeProperty('opacity'); b.el.style.setProperty('--k', 1); b.el.classList.add('is-on', 'is-live'); });
    ['--wz', '--zoom', '--rot', '--haze'].forEach(v => stage.style.removeProperty(v));
    lastVars = {};
    stopDust();
  }
  function applyHeroMode() { if (STATIC_GATES.some(q => matchMedia(q).matches)) disableScrub(); else { enableScrub(); maybeLoadVideo(); } }
  const MQLS = [...STATIC_GATES, ...VIDEO_GATES].map(q => matchMedia(q));
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));

  /* ---------------- un seul balayage : la roue tourne et on arrive sur le site ----------------
     Au premier geste vers le bas dans l'accueil (molette, pavé tactile, doigt, flèche du clavier),
     la page glisse d'elle-même jusqu'au contenu ; vers le haut depuis le début du contenu,
     elle revient à l'accueil. Désactivé si l'appareil demande moins d'animations. */
  const bannerH = () => ($('.demo-banner') ? $('.demo-banner').offsetHeight : 0);
  const heroEnd = () => Math.round(hero.offsetTop + hero.offsetHeight - bannerH());
  const easeGlide = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let glideRaf = null, swallowUntil = 0, touchY = null, touchLocked = false;
  // Deux temps : d'abord la roue tourne et se rapproche (accueil épinglé), puis l'accueil s'efface.
  function glideTo(to) {
    if (gliding) return;
    const from = scrollY;
    if (Math.abs(to - from) < 4) return;
    const pin = Math.max(0, hero.offsetTop + hero.offsetHeight - innerHeight);   // fin de l'animation de la roue
    const down = to > from, mobile = innerWidth < 720;
    const tSpin = mobile ? 600 : 680, tLeave = mobile ? 380 : 420;
    const segs = down
      ? [{ a: from, b: Math.max(from, Math.min(pin, to)), d: from < pin ? tSpin * (pin - from) / pin : 0, e: easeGlide },
         { a: Math.max(from, pin), b: to, d: tLeave, e: t => 1 - Math.pow(1 - t, 3) }]
      : [{ a: from, b: Math.min(from, pin), d: from > pin ? tLeave : 0, e: t => t * t * t },
         { a: Math.min(from, pin), b: to, d: tSpin, e: easeGlide }];
    const plan = segs.filter(sg => sg.d > 0 && Math.abs(sg.b - sg.a) > 1);
    if (!plan.length) return;
    gliding = true;
    let i = 0, t0 = performance.now();
    const step = now => {
      const sg = plan[i], t = clamp((now - t0) / sg.d, 0, 1);
      scrollTo(0, Math.round(sg.a + (sg.b - sg.a) * sg.e(t)));
      if (t >= 1) { i++; t0 = now; }
      if (i < plan.length) glideRaf = requestAnimationFrame(step);
      else { gliding = false; glideRaf = null; swallowUntil = performance.now() + 250; onScroll(); }
    };
    glideRaf = requestAnimationFrame(step);
  }
  function glideActive() { return scrubOn && !reduceMQ.matches && !document.documentElement.style.overflow; }
  // zone de l'accueil : vers le bas, on va au contenu ; vers le haut (depuis le haut du contenu), on revient
  function intent(dir) {
    const y = scrollY, end = heroEnd();
    if (dir > 0 && y < end - 4) { glideTo(end); return true; }
    if (dir < 0 && y > 4 && y <= end + 4) { glideTo(0); return true; }
    return false;
  }
  addEventListener('wheel', e => {
    if (!glideActive() || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const now = performance.now();
    if (gliding || now < swallowUntil) { e.preventDefault(); swallowUntil = Math.max(swallowUntil, now + 120); return; }
    if (intent(Math.sign(e.deltaY))) e.preventDefault();
  }, { passive: false });
  addEventListener('touchstart', e => { touchY = e.touches.length === 1 ? e.touches[0].clientY : null; touchLocked = false; }, { passive: true });
  addEventListener('touchmove', e => {
    if (!glideActive() || touchY === null) return;
    if (gliding || touchLocked) { e.preventDefault(); return; }
    const dy = touchY - e.touches[0].clientY;
    if (Math.abs(dy) < 8) return;
    if (intent(Math.sign(dy))) { touchLocked = true; e.preventDefault(); }
  }, { passive: false });
  addEventListener('touchend', () => { touchY = null; touchLocked = false; }, { passive: true });
  addEventListener('keydown', e => {
    if (!glideActive() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && t !== document.body && t !== document.documentElement && t.id !== 'main') return;
    const dir = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey ? 1 : (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) ? -1 : 0;
    if (dir && (gliding || intent(dir))) e.preventDefault();
  });

  new IntersectionObserver(([e]) => {
    heroOnScreen = e.isIntersecting;
    if (heroOnScreen) { onScroll(); if (scrubOn) startDust(); } else stopDust();
  }).observe(hero);

  /* ---------------- poussière dans la lumière ---------------- */
  const dust = $('.dust');
  const dctx = dust.getContext('2d');
  let dustRaf = null, motes = [], dustLast = 0, dustW = 0, litX = 0.66, litY = 0.5;
  function sizeDust() {
    dustW = innerWidth;
    const rig = $('.wheel-rig').getBoundingClientRect(), st = stage.getBoundingClientRect();
    litX = (rig.left + rig.width / 2 - st.left) / st.width; litY = (rig.top + rig.height / 2 - st.top) / st.height;
    const dpr = Math.min(2, devicePixelRatio || 1);
    dust.width = dust.clientWidth * dpr; dust.height = dust.clientHeight * dpr;
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rng(42);
    motes = Array.from({ length: innerWidth < 720 ? 22 : 34 }, () => ({ x: r() * dust.clientWidth, y: r() * dust.clientHeight, s: 0.6 + r() * 1.6, vx: (r() - 0.5) * 0.12, vy: -0.05 - r() * 0.12, a: 0.15 + r() * 0.45, ph: r() * 6.28 }));
  }
  function drawDust(now) {
    dustRaf = requestAnimationFrame(drawDust);
    if (now - dustLast < 33) return;           // ~30 i/s suffit
    dustLast = now;
    const w = dust.clientWidth, h = dust.clientHeight;
    dctx.clearRect(0, 0, w, h);
    motes.forEach(m => {
      m.x += m.vx; m.y += m.vy; m.ph += 0.02;
      if (m.y < -4) m.y = h + 4; if (m.x < -4) m.x = w + 4; if (m.x > w + 4) m.x = -4;
      const lit = Math.max(0, 1 - Math.hypot(m.x - w * litX, m.y - h * litY) / (Math.max(w, h) * 0.42));
      dctx.globalAlpha = m.a * (0.25 + 0.75 * lit) * (0.7 + 0.3 * Math.sin(m.ph));
      dctx.fillStyle = '#ffe2a8';
      dctx.beginPath(); dctx.arc(m.x, m.y, m.s, 0, 6.283); dctx.fill();
    });
  }
  function startDust() { if (dustRaf || !scrubOn || !heroOnScreen || document.hidden) return; if (!motes.length) sizeDust(); dustRaf = requestAnimationFrame(drawDust); }
  function stopDust() { if (dustRaf) cancelAnimationFrame(dustRaf); dustRaf = null; }
  addEventListener('resize', () => { if (!scrubOn) return; if (innerWidth !== dustW) sizeDust(); onScroll(); }, { passive: true });

  /* ---------------- en-tête, menu, barre d'actions ---------------- */
  const top = $('.top'), nav = $('.nav'), toggle = $('.nav__toggle'), dock = $('.dock');
  let lastY = scrollY;
  function onPageScroll() {
    const y = scrollY;
    top.classList.toggle('is-solid', y > 40);
    const menuOpen = nav.classList.contains('is-open');
    top.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 4);
    if (y < lastY - 4) top.classList.remove('is-hidden');
    dock.classList.toggle('is-in', y > 140);
    dock.classList.add('is-mobile');
    lastY = y;
  }
  onPageScroll();
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav__label').textContent = open ? 'Fermer' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('.nav__list a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });

  /* ---------------- statut ouvert / fermé ---------------- */
  const statusEl = $('.status'), statusText = $('.status__text'), todayText = $('[data-today]');
  function nextOpening(q) {
    for (let i = 0; i < 8; i++) {
      const wd = (q.wd + i) % 7, slot = HOURS[wd];
      if (!slot) continue;
      if (i === 0 && q.h >= slot[0]) continue;
      const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAYS[wd];
      return `ouvre ${when} à ${fmtH(slot[0])}`;
    }
    return '';
  }
  function updateStatus() {
    const q = quebecNow(), slot = HOURS[q.wd];
    const open = !!slot && q.h >= slot[0] && q.h < slot[1];
    statusEl.classList.toggle('is-open', open);
    statusText.textContent = open ? `Ouvert maintenant · ferme à ${fmtH(slot[1])}` : `Fermé · ${nextOpening(q)}`;
    todayText.textContent = slot ? `Aujourd'hui, ${DAYS[q.wd]} : ${fmtH(slot[0])} à ${fmtH(slot[1])}`.replace(' :', ' :') : `Aujourd'hui, ${DAYS[q.wd]} : fermé`;
    $$('[data-hours] tr').forEach(tr => tr.classList.toggle('is-today', +tr.dataset.day === q.wd));
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------------- apparitions ---------------- */
  $$('h2.reveal').forEach(h => { h.innerHTML = `<span class="slit">${h.innerHTML}</span>`; });
  const reveals = $$('.reveal');
  const fold = innerHeight;
  reveals.forEach(el => { if (el.getBoundingClientRect().top > fold * 0.9) el.classList.add('pre'); });
  const groups = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, parent = el.parentElement;
      const n = groups.get(parent) || 0;
      groups.set(parent, n + 1);
      el.style.setProperty('--d', Math.min(n, 3) * 0.05 + 's');
      el.classList.add('in');
      setTimeout(() => { el.classList.add('done'); el.style.removeProperty('--d'); }, 700);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });
  reveals.forEach(el => io.observe(el));

  /* ---------------- inspection : maintenir pour inspecter ---------------- */
  const holdBtn = $('[data-hold]'), wheelBox = $('[data-wheel]');
  const checks = $$('[data-checks] li'), pins = $$('.inspect__pins g'), doneMsg = $('[data-done]');
  let hp = 0, holding = false, holdRaf = null, holdLast = 0, holdDone = false;
  function paintHold() {
    wheelBox.style.setProperty('--p', hp.toFixed(3));
    wheelBox.style.setProperty('--sweep', (hp * 720).toFixed(1) + 'deg');
    wheelBox.style.setProperty('--spin', (hp * 90).toFixed(1) + 'deg');
    holdBtn.style.setProperty('--p', hp.toFixed(3));
    checks.forEach((li, i) => { const on = hp >= +li.dataset.at; if (li.classList.contains('on') !== on) { li.classList.toggle('on', on); pins[i] && pins[i].classList.toggle('on', on); } });
  }
  function finishHold() {
    holdDone = true; hp = 1; holding = false; paintHold();
    holdBtn.classList.remove('is-holding'); holdBtn.classList.add('is-done');
    holdBtn.querySelector('.hold__label').textContent = 'Inspection terminée';
    doneMsg.textContent = 'Tout est vérifié. Maintenant, on peut parler de prix, par écrit.';
    const cta = $('.inspect__cta'); if (cta) cta.hidden = false;
  }
  function holdTick(now) {
    const dt = Math.min(64, now - (holdLast || now)); holdLast = now;
    if (holding) hp = Math.min(1, hp + dt / 2600);
    else hp = Math.max(0, hp - dt / 1500 * (0.4 + hp));   // redescend en douceur
    paintHold();
    if (hp >= 1) { finishHold(); holdRaf = null; holdLast = 0; return; }
    if (!holding && hp <= 0) { holdRaf = null; holdLast = 0; return; }
    holdRaf = requestAnimationFrame(holdTick);
  }
  function holdStart(e) {
    if (holdDone) return;
    if (e && e.type === 'pointerdown') { holdBtn.setPointerCapture && holdBtn.setPointerCapture(e.pointerId); e.preventDefault(); }
    holding = true; holdBtn.classList.add('is-holding');
    if (!holdRaf) holdRaf = requestAnimationFrame(holdTick);
  }
  function holdEnd() { if (!holding) return; holding = false; holdBtn.classList.remove('is-holding'); if (!holdRaf && !holdDone) holdRaf = requestAnimationFrame(holdTick); }
  holdBtn.addEventListener('pointerdown', holdStart);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => holdBtn.addEventListener(t, holdEnd));
  holdBtn.addEventListener('contextmenu', e => e.preventDefault());
  holdBtn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); holdStart(); } });
  holdBtn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') holdEnd(); });
  holdBtn.addEventListener('blur', holdEnd);

  /* ---------------- pneus d'hiver : compte à rebours vrai ---------------- */
  const countNum = $('[data-count-num]'), countUnit = $('[data-count-unit]'), countCap = $('[data-count-caption]');
  function winterTarget() {
    const q = quebecNow();
    const today = Date.UTC(q.y, q.m - 1, q.d);
    const inSeason = (q.m === 12) || q.m <= 2 || (q.m === 3 && q.d <= 15);
    if (inSeason) {
      const endY = q.m === 12 ? q.y + 1 : q.y;
      const days = Math.round((Date.UTC(endY, 2, 15) - today) / 864e5);
      return { days, caption: "d'obligation encore, jusqu'au 15 mars" };
    }
    const dec1 = Date.UTC(q.y, 11, 1);
    const days = Math.round((dec1 - today) / 864e5);
    return { days, caption: 'avant l’obligation du 1er décembre' };
  }
  const wt = winterTarget();
  countCap.innerHTML = wt.caption.replace('1er', '1<sup>er</sup>');
  countUnit.textContent = wt.days === 1 ? 'jour' : 'jours';
  countNum.setAttribute('aria-label', `${wt.days} ${wt.days === 1 ? 'jour' : 'jours'}`);
  let counted = false;
  function runCount() {
    if (counted) return; counted = true;
    if (reduceMQ.matches) { countNum.textContent = wt.days; return; }
    const t0 = performance.now(), from = Math.max(wt.days + 60, 120);
    const step = now => {
      const t = clamp((now - t0) / 1400, 0, 1), e = 1 - Math.pow(1 - t, 3);
      countNum.textContent = Math.round(from + (wt.days - from) * e);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  countNum.textContent = wt.days;
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { runCount(); o.disconnect(); } }, { threshold: 0.4 }).observe($('[data-countdown]'));

  // ruban de chantier : il avance avec le défilement (jamais tout seul)
  const tape = $('[data-tape]'), winter = $('#pneus');
  let tapeOn = false, tapeW = 0, tapeLast = '';
  function moveTape() {
    if (!tapeOn) return;
    if (!tapeW) tapeW = tape.firstElementChild.offsetWidth;
    const y = winter.getBoundingClientRect().top;
    const tx = -((((innerHeight - y) * 0.45) % tapeW) + tapeW) % tapeW;
    const v = tx.toFixed(1) + 'px';
    if (v !== tapeLast) { tapeLast = v; tape.style.setProperty('--tx', v); }
  }
  new IntersectionObserver(([e]) => { tapeOn = e.isIntersecting && !reduceMQ.matches; if (tapeOn) moveTape(); }).observe(winter);
  addEventListener('resize', () => { tapeW = 0; }, { passive: true });

  /* ---------------- lignes de marquage et roue d'inspection, liées au défilement ---------------- */
  const drawPaths = $$('[data-draw]').map(el => ({ el, last: -1 }));
  const inspectSec = $('#inspection');
  const steps = $('[data-steps]'), closingWheel = $('.closing__wheel');
  let lastSs = '', lastSp = -1, lastCr = '';
  function onScrollEffects() {
    if (reduceMQ.matches) return;
    const vh = innerHeight;
    drawPaths.forEach(d => {
      const r = d.el.ownerSVGElement.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      const prog = clamp((vh - r.top) / (vh * 0.75), 0, 1);
      const v = Math.round((1 - prog) * 1000) / 1000;
      if (v !== d.last) { d.last = v; d.el.style.setProperty('--draw', v); }
    });
    const ir = inspectSec.getBoundingClientRect();
    if (ir.bottom > 0 && ir.top < vh) {
      const v = ((vh - ir.top) * -0.06).toFixed(1) + 'deg';
      if (v !== lastSs) { lastSs = v; wheelBox.style.setProperty('--ss', v); }
    }
    const sr = steps.getBoundingClientRect();
    if (sr.bottom > 0 && sr.top < vh) {
      const v = Math.round(clamp((vh * 0.85 - sr.top) / (sr.height * 0.9), 0, 1) * 1000) / 1000;
      if (v !== lastSp) { lastSp = v; steps.style.setProperty('--sp', v); }
    }
    const cr = closingWheel.getBoundingClientRect();
    if (cr.bottom > 0 && cr.top < vh) {
      const v = ((vh - cr.top) * 0.12).toFixed(1) + 'deg';
      if (v !== lastCr) { lastCr = v; closingWheel.style.setProperty('--cr', v); }
    }
  }
  onScrollEffects();

  /* ---------------- formulaire : prépare un courriel ---------------- */
  const form = $('[data-form]'), msg = $('[data-msg]');
  let lastPrefill = '';
  $$('[data-prefill]').forEach(a => a.addEventListener('click', () => {
    const t = $('#f-quoi'), v = t.value.trim();
    if (!v || v === lastPrefill.trim()) { lastPrefill = `${a.dataset.prefill}\u00a0: `; t.value = lastPrefill; }
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = ['#f-nom', '#f-tel', '#f-quoi'].map(s => $(s));
    let firstBad = null;
    fields.forEach(f => { const bad = !f.value.trim(); f.setAttribute('aria-invalid', String(bad)); if (bad && !firstBad) firstBad = f; });
    if (firstBad) {
      msg.className = 'form__msg is-err';
      msg.textContent = 'Il manque votre nom, votre téléphone ou une description du problème.';
      firstBad.focus();
      return;
    }
    // MAQUETTE : rien n'est envoyé. Sur le vrai site, brancher ici l'envoi vers le garage.
    form.classList.add('is-sent');
    msg.className = 'form__msg is-ok';
    msg.textContent = `Merci ${new FormData(form).get('nom').trim().split(' ')[0]}. Ceci est une maquette : votre demande n'a été envoyée à personne. Sur le vrai site, elle arriverait directement au garage. En attendant, appelez le 418 663-1195.`;
  });
  form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });

  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const label = b.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copié'; }
    catch { b.textContent = b.dataset.copy; }
    setTimeout(() => { b.textContent = label; }, 1800);
  }));

  /* ---------------- divers ---------------- */
  $$('[data-year]').forEach(el => { el.textContent = quebecNow().y; });
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
    if (document.hidden) stopDust(); else startDust();
  });

  function pinToFinalStates() {
    if (!holdDone) finishHold();
    countNum.textContent = wt.days; counted = true;
    tapeOn = false;
    $$('.reveal').forEach(el => el.classList.add('in', 'done'));
    drawPaths.forEach(d => d.el.style.setProperty('--draw', 0));
    steps.style.setProperty('--sp', 1);
  }
  function unpinFinalStates() {
    tapeOn = winter.getBoundingClientRect().top < innerHeight && winter.getBoundingClientRect().bottom > 0;
  }
  reduceMQ.addEventListener('change', e => { if (e.matches) pinToFinalStates(); else unpinFinalStates(); applyHeroMode(); });
  if (reduceMQ.matches) pinToFinalStates();

  // Un seul passage par image pour tous les effets liés au défilement :
  // on lit les positions une fois, on écrit ensuite, jamais en boucle.
  let fxQueued = false;
  function runFx() { fxQueued = false; onScrollEffects(); moveTape(); onPageScroll(); }
  addEventListener('scroll', () => { if (!fxQueued) { fxQueued = true; requestAnimationFrame(runFx); } }, { passive: true });

  applyHeroMode();
})();
