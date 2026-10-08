/* Mécanique SKL · comportements du site
   Sans dépendance. Tout l'essentiel fonctionne sans ce fichier. */
(() => {
  'use strict';

  // Vidéo Higgsfield de l'accueil : null tant qu'elle n'existe pas.
  // Une fois générée et approuvée : 'assets/video/hero-scrub.mp4'.
  const HERO_VIDEO = null;

  const TZ = 'America/Toronto'; // heure de Québec
  const HOURS = { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 12] }; // À CONFIRMER avec le garage (source unique : Otobox)
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
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

  /* ---------------- décor fixe : la roue tourne au fil du défilement ----------------
     Le défilement reste 100 % natif. On ne fait que suivre scrollY avec un léger lissage
     (≈ 0,15 s) pour que la roue tourne en douceur, même avec une molette à crans. */
  const backdrop = $('.backdrop');
  const rig = $('.wheel-rig');
  let bdTarget = 0, bdShown = null, bdRaf = null, bdLast = 0, bdVars = {};
  const setBd = (n, v) => { if (bdVars[n] !== v) { bdVars[n] = v; backdrop.style.setProperty(n, v); } };
  function paintBackdrop(y) {
    const vh = innerHeight, p = clamp(y / vh, 0, 1);
    setBd('--rot', (y * 0.11).toFixed(1) + 'deg');            // environ un tour tous les 3 300 px
    setBd('--zoom', (1 + 0.08 * p).toFixed(4));
    setBd('--wz', (1 + 0.1 * p).toFixed(4));
    setBd('--haze', (0.5 - 0.35 * p).toFixed(3));
    setBd('--shade', clamp((y / vh - 0.6) * 0.42, 0, 0.6).toFixed(3)); // la roue s'efface doucement sous le contenu
    if (video.duration) requestSeek(p * video.duration);
  }
  function bdTick(now) {
    const dt = Math.min(64, now - (bdLast || now)); bdLast = now;
    bdShown += (bdTarget - bdShown) * (1 - Math.pow(1 - 0.24, dt / 16.667));
    if (Math.abs(bdTarget - bdShown) < 0.5) { bdShown = bdTarget; bdRaf = null; bdLast = 0; }
    else bdRaf = requestAnimationFrame(bdTick);
    paintBackdrop(bdShown);
  }
  // Le décor se met en veille quand la section Services atteint le haut de l'écran
  // (tout ce qui suit est opaque) et se réveille en remontant.
  const servicesSec = $('#services');
  let bdOff = false, servicesTop = 0;
  const measureServices = () => { servicesTop = servicesSec.getBoundingClientRect().top + scrollY; };
  measureServices();
  function onBackdropScroll() {
    const off = scrollY > servicesTop - 2;
    if (off !== bdOff) { bdOff = off; backdrop.classList.toggle('is-off', off); }
    if (reduceMQ.matches || off) return;
    bdTarget = scrollY;
    if (bdShown === null) { bdShown = bdTarget; paintBackdrop(bdShown); return; }
    if (bdRaf === null) bdRaf = requestAnimationFrame(bdTick);
  }
  function resetBackdrop() {
    if (bdRaf) cancelAnimationFrame(bdRaf);
    bdRaf = null; bdShown = null; bdVars = {};
    ['--rot', '--zoom', '--wz', '--haze', '--shade'].forEach(v => backdrop.style.removeProperty(v));
  }

  /* ---------------- vidéo d'accueil (grands écrans seulement, quand elle existera) ---------------- */
  const VIDEO_GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  const video = $('.floor__video');
  let seekBusy = false, pendingTime = null, videoStarted = false;
  function requestSeek(t) {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    if (Math.abs(video.currentTime - t) < 0.01) return;
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => { seekBusy = false; if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); } });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; });
  async function maybeLoadVideo() {
    if (!HERO_VIDEO || videoStarted || VIDEO_GATES.some(q => matchMedia(q).matches)) return;
    videoStarted = true;
    try {
      const res = await fetch(HERO_VIDEO, { priority: 'low' });
      if (!res.ok) return;
      video.src = URL.createObjectURL(await res.blob());   // Blob : fonctionne même sans requêtes partielles
      video.addEventListener('canplay', () => { backdrop.classList.add('video-ready'); requestSeek(clamp(scrollY / innerHeight, 0, 1) * video.duration); }, { once: true });
    } catch (e) { /* le sol codé reste en place */ }
  }
  VIDEO_GATES.forEach(q => matchMedia(q).addEventListener('change', maybeLoadVideo));

  /* ---------------- poussière dans la lumière (haut de page seulement) ---------------- */
  const dust = $('.dust');
  const dctx = dust.getContext('2d');
  let dustRaf = null, motes = [], dustLast = 0, dustW = 0, litX = 0.66, litY = 0.5;
  function sizeDust() {
    dustW = innerWidth;
    const dpr = Math.min(2, devicePixelRatio || 1);
    dust.width = dust.clientWidth * dpr; dust.height = dust.clientHeight * dpr;
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rig.getBoundingClientRect();
    litX = (r.left + r.width / 2) / dust.clientWidth; litY = (r.top + r.height / 2) / dust.clientHeight;
    const g = rng(42);
    motes = Array.from({ length: innerWidth < 720 ? 22 : 34 }, () => ({ x: g() * dust.clientWidth, y: g() * dust.clientHeight, s: 0.6 + g() * 1.6, vx: (g() - 0.5) * 0.12, vy: -0.05 - g() * 0.12, a: 0.15 + g() * 0.45, ph: g() * 6.28 }));
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
  function startDust() { if (dustRaf || reduceMQ.matches || document.hidden || scrollY > innerHeight * 1.3) return; if (!motes.length) sizeDust(); dustRaf = requestAnimationFrame(drawDust); }
  function stopDust() { if (dustRaf) cancelAnimationFrame(dustRaf); dustRaf = null; }
  function dustByScroll() { if (scrollY > innerHeight * 1.3) stopDust(); else startDust(); }
  addEventListener('resize', () => { measureServices(); if (innerWidth !== dustW) { motes = []; if (dustRaf) sizeDust(); } onBackdropScroll(); }, { passive: true });
  addEventListener('load', measureServices);

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
  reduceMQ.addEventListener('change', e => { if (e.matches) { pinToFinalStates(); resetBackdrop(); stopDust(); } else { unpinFinalStates(); onBackdropScroll(); startDust(); } });
  if (reduceMQ.matches) pinToFinalStates();

  // Un seul passage par image pour tous les effets liés au défilement :
  // on lit les positions une fois, on écrit ensuite, jamais en boucle.
  let fxQueued = false;
  function runFx() { fxQueued = false; onBackdropScroll(); dustByScroll(); onScrollEffects(); moveTape(); onPageScroll(); }
  addEventListener('scroll', () => { if (!fxQueued) { fxQueued = true; requestAnimationFrame(runFx); } }, { passive: true });

  onBackdropScroll();
  startDust();
  maybeLoadVideo();
})();
