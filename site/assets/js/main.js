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

  addEventListener('resize', () => { measureServices(); onBackdropScroll(); }, { passive: true });
  addEventListener('load', measureServices);

  /* ---------------- en-tête, menu ---------------- */
  const top = $('.top'), nav = $('.nav'), toggle = $('.nav__toggle'), dock = $('.dock');
  let lastY = scrollY;
  function onPageScroll() {
    const y = scrollY;
    top.classList.toggle('is-solid', y > 40);
    const menuOpen = nav.classList.contains('is-open');
    top.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 4);
    if (y < lastY - 4) top.classList.remove('is-hidden');
    lastY = y;
  }
  onPageScroll();
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav__label').textContent = open ? 'Fermer' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    paintDock();
  }
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('.nav__list a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });

  /* ---------------- barre d'actions (téléphone) ----------------
     Cachée tant qu'un autre bloc « Appeler » est à l'écran : jamais deux « Appeler » à la fois.
     Elle s'efface aussi pendant la saisie du formulaire et quand le menu est ouvert. */
  const zones = new Set();
  let typing = false;
  function paintDock() {
    const show = zones.size === 0 && !typing && !nav.classList.contains('is-open') && scrollY > 80;
    dock.classList.toggle('is-in', show);
  }
  const zoneIO = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) zones.add(e.target); else zones.delete(e.target); });
    paintDock();
  }, { threshold: 0 });
  $$('[data-cta-zone]').forEach(z => zoneIO.observe(z));
  const formEl = $('[data-form]');
  formEl.addEventListener('focusin', () => { typing = true; paintDock(); });
  formEl.addEventListener('focusout', () => { typing = false; setTimeout(paintDock, 150); });

  /* ---------------- trajet : l'application de cartes de l'appareil ---------------- */
  const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const apps = $('[data-apps]');
  if (IOS && apps) {
    const apple = $('[data-app="apple"]', apps);
    apps.prepend(apple);
    $$('[data-route]').forEach(a => { a.href = apple.href; });
  }

  /* ---------------- statut ouvert / fermé (heure de Québec) ---------------- */
  const statusEls = $$('[data-status]'), dockStatus = $('[data-dock-status]');
  function nextOpening(q) {
    for (let i = 0; i < 8; i++) {
      const wd = (q.wd + i) % 7, slot = HOURS[wd];
      if (!slot) continue;
      if (i === 0 && q.h >= slot[0]) continue;
      const when = i === 0 ? 'aujourd’hui' : i === 1 ? 'demain' : DAYS[wd];
      const short = i === 0 ? `ouvre à ${fmtH(slot[0])}` : i === 1 ? `demain ${fmtH(slot[0])}` : `${DAYS[wd].slice(0, 3)}. ${fmtH(slot[0])}`;
      return { long: `ouvre ${when} à ${fmtH(slot[0])}`, short };
    }
    return { long: '', short: '' };
  }
  function updateStatus() {
    const q = quebecNow(), slot = HOURS[q.wd];
    const open = !!slot && q.h >= slot[0] && q.h < slot[1];
    const soon = open && slot[1] - (q.h + q.min / 60) <= 1;
    const nx = open ? null : nextOpening(q);
    const txt = open ? (soon ? `Ferme bientôt · à ${fmtH(slot[1])}` : `Ouvert · ferme à ${fmtH(slot[1])}`) : `Fermé · ${nx.long}`;
    statusEls.forEach(el => {
      el.classList.toggle('is-open', open); el.classList.toggle('is-soon', soon); el.classList.toggle('is-closed', !open);
      $('.status__text', el).textContent = txt;
    });
    if (dockStatus) dockStatus.textContent = open ? (soon ? `Ferme bientôt · ${fmtH(slot[1])}` : `Ouvert · jusqu’à ${fmtH(slot[1])}`) : `Fermé · ${nx.short}`;
    $$('[data-hours] tr').forEach(tr => tr.classList.toggle('is-today', tr.dataset.days.split(' ').includes(String(q.wd))));
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------------- apparitions (une fois, sous le premier écran seulement) ---------------- */
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
      el.style.setProperty('--d', Math.min(n, 3) * 0.06 + 's');
      el.classList.add('in');
      setTimeout(() => { el.classList.add('done'); el.style.removeProperty('--d'); }, 700);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });
  reveals.forEach(el => io.observe(el));

  /* ---------------- inspection : un seul appui, 2,6 s, sans bloquer le défilement ---------------- */
  const holdBtn = $('[data-hold]'), wheelBox = $('[data-wheel]');
  const checks = $$('[data-checks] li'), pins = $$('.inspect__pins g'), doneMsg = $('[data-done]');
  let hp = 0, running = false, holdRaf = null, holdLast = 0, holdDone = false;
  function paintHold() {
    wheelBox.style.setProperty('--p', hp.toFixed(3));
    wheelBox.style.setProperty('--sweep', (hp * 720).toFixed(1) + 'deg');
    wheelBox.style.setProperty('--spin', (hp * 90).toFixed(1) + 'deg');
    holdBtn.style.setProperty('--p', hp.toFixed(3));
    checks.forEach((li, i) => { const on = hp >= +li.dataset.at; if (li.classList.contains('on') !== on) { li.classList.toggle('on', on); pins[i] && pins[i].classList.toggle('on', on); } });
  }
  function finishHold() {
    holdDone = true; hp = 1; running = false; paintHold();
    holdBtn.classList.remove('is-holding'); holdBtn.classList.add('is-done');
    holdBtn.querySelector('.hold__label').textContent = 'Inspection terminée';
    doneMsg.textContent = 'Tout est vérifié. Maintenant, on peut parler de prix, par écrit.';
    const cta = $('.inspect__cta'); if (cta) cta.hidden = false;
  }
  function holdTick(now) {
    const dt = Math.min(64, now - (holdLast || now)); holdLast = now;
    hp = Math.min(1, hp + dt / 2600);
    paintHold();
    if (hp >= 1) { finishHold(); holdRaf = null; holdLast = 0; return; }
    holdRaf = requestAnimationFrame(holdTick);
  }
  holdBtn.addEventListener('click', () => {
    if (holdDone || running) return;
    if (reduceMQ.matches) { finishHold(); return; }
    running = true; holdBtn.classList.add('is-holding');
    holdBtn.querySelector('.hold__label').textContent = 'Inspection en cours…';
    holdRaf = requestAnimationFrame(holdTick);
  });

  /* ---------------- pneus d'hiver : compte à rebours vrai ---------------- */
  const countNum = $('[data-count-num]'), countUnit = $('[data-count-unit]'), countCap = $('[data-count-caption]');
  function winterTarget() {
    const q = quebecNow();
    const today = Date.UTC(q.y, q.m - 1, q.d);
    const inSeason = (q.m === 12) || q.m <= 2 || (q.m === 3 && q.d <= 15);
    if (inSeason) {
      const endY = q.m === 12 ? q.y + 1 : q.y;
      const days = Math.round((Date.UTC(endY, 2, 15) - today) / 864e5);
      return { days, caption: 'd’obligation encore, jusqu’au 15 mars' };
    }
    const dec1 = Date.UTC(q.y, 11, 1);
    const days = Math.round((dec1 - today) / 864e5);
    return { days, caption: 'avant l’obligation du 1er décembre' };
  }
  const wt = winterTarget();
  countCap.innerHTML = wt.caption.replace('1er', '1<sup>er</sup>');
  countUnit.textContent = wt.days === 1 ? 'jour' : 'jours';
  countNum.setAttribute('aria-label', `${wt.days} ${wt.days === 1 ? 'jour' : 'jours'}`);
  countNum.textContent = wt.days;

  // ruban de chantier : il avance avec le défilement (jamais tout seul), seulement quand il est visible
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

  /* ---------------- Nous trouver : carte sur demande, partage, distance ----------------
     Loi 25 : aucune requête vers Google, Waze ou Apple avant un toucher ; position jamais transmise ni conservée. */
  const GARAGE = { lat: 46.86987, lng: -71.17556 }; // 4 sources concordantes (±20 m) ; à vérifier sur l'épingle de la fiche Google
  // Code officiel « Partager > Intégrer une carte » de Google Maps : coller ici la valeur de src (https://www.google.com/maps/embed?pb=…).
  const MAP_EMBED = '';
  const card = $('[data-map]'), mapBtn = $('[data-map-load]'), frame = $('#map-frame');
  if (MAP_EMBED && card && mapBtn) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = mapBtn.className; btn.setAttribute('aria-describedby', 'map-note'); btn.setAttribute('aria-controls', 'map-frame');
    btn.innerHTML = mapBtn.innerHTML.replace('<span class="sr"> (nouvel onglet)</span>', '');
    mapBtn.replaceWith(btn);
    const label = $('[data-map-label]', btn);
    label.textContent = 'Afficher la carte Google';
    $('[data-map-note] span').innerHTML = 'La carte est fournie par Google. En l’affichant, Google reçoit votre adresse IP et peut utiliser des témoins. Rien n’est chargé avant ce toucher. <a href="confidentialite.html#carte">Confidentialité</a>';
    btn.addEventListener('click', () => {
      if (frame.firstChild) { frame.replaceChildren(); frame.hidden = true; card.classList.remove('is-live'); label.textContent = 'Afficher la carte Google'; return; }
      const f = Object.assign(document.createElement('iframe'), { src: MAP_EMBED, title: 'Carte Google : Mécanique SKL, 1100, boulevard des Chutes', loading: 'lazy', referrerPolicy: 'strict-origin-when-cross-origin' });
      f.addEventListener('load', () => card.classList.add('is-live'), { once: true });
      frame.hidden = false; frame.append(f); label.textContent = 'Masquer la carte';
    });
  }

  const copied = $('[data-copied]');
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const lbl = $('span', b) || b, label = lbl.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); lbl.textContent = 'Copié'; if (copied && b.dataset.copyDone) copied.textContent = b.dataset.copyDone; }
    catch { if (copied) copied.textContent = b.dataset.copy; }
    setTimeout(() => { lbl.textContent = label; if (copied) copied.textContent = ''; }, 1800);
  }));
  const shareBtn = $('[data-share]');
  if (shareBtn && navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener('click', () => navigator.share({ title: 'Mécanique SKL', text: 'Mécanique SKL, 1100, boul. des Chutes, Québec (Québec) G1E 2G1', url: location.href.split('#')[0] }).catch(() => {}));
  }

  const near = $('[data-near]'), nearOut = $('[data-near-out]'), nearLabel = $('[data-near-label]');
  const me = $('[data-me]'), meLine = $('[data-me-line]'), meDot = $('[data-me-dot]'), meText = $('[data-me-label]');
  const fmtKm = km => km < 1 ? `${Math.max(50, Math.round(km * 1000 / 50) * 50)} m` : `${km.toLocaleString('fr-CA', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`;
  function placeMe(lat, lng) {
    const R = 6371, rad = d => d * Math.PI / 180;
    const dLat = rad(lat - GARAGE.lat), dLng = rad(lng - GARAGE.lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(GARAGE.lat)) * Math.cos(rad(lat)) * Math.sin(dLng / 2) ** 2;
    const km = 2 * R * Math.asin(Math.sqrt(a));
    // direction depuis le garage (plan schématique : 1 km, 3 km et 10 km sur des cercles)
    const east = dLng * Math.cos(rad(GARAGE.lat)), north = dLat, len = Math.hypot(east, north) || 1;
    const r = km >= 10 ? 128 : 120 * Math.sqrt(km / 10);
    const x = 200 + (east / len) * r, y = 150 - (north / len) * r;
    meLine.setAttribute('x2', x.toFixed(1)); meLine.setAttribute('y2', y.toFixed(1));
    meDot.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    meText.textContent = `Vous · ${fmtKm(km)}`;
    meText.setAttribute('x', x > 290 ? -10 : 10); meText.setAttribute('text-anchor', x > 290 ? 'end' : 'start');
    me.removeAttribute('hidden');
    return km;
  }
  if (near && 'geolocation' in navigator && window.isSecureContext) {
    near.hidden = false; $('[data-near-note]').hidden = false;
    const idle = nearLabel.textContent;
    near.addEventListener('click', () => {
      near.setAttribute('aria-busy', 'true'); nearLabel.textContent = 'Recherche de votre position…';
      navigator.geolocation.getCurrentPosition(p => {
        // la position sert ici seulement : rien n'est envoyé, rien n'est enregistré
        const km = placeMe(p.coords.latitude, p.coords.longitude);
        nearOut.textContent = `Vous êtes à environ ${fmtKm(km)} du garage, à vol d’oiseau. Le trajet exact s’affiche dans votre application de cartes.`;
        near.removeAttribute('aria-busy'); nearLabel.textContent = idle;
      }, e => {
        nearOut.textContent = e.code === 1 ? 'Localisation refusée. Aucun souci : les boutons ci-dessus calculent le trajet dans votre application.' : 'Position introuvable pour l’instant. Réessayez dans un moment.';
        near.removeAttribute('aria-busy'); nearLabel.textContent = idle;
      }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 });
    });
  }

  /* ---------------- formulaire de démonstration ---------------- */
  const msg = $('[data-msg]');
  let lastPrefill = '';
  $$('[data-prefill]').forEach(a => a.addEventListener('click', () => {
    const t = $('#f-quoi'), v = t.value.trim();
    if (!v || v === lastPrefill.trim()) { lastPrefill = `${a.dataset.prefill} : `; t.value = lastPrefill; }
  }));
  formEl.addEventListener('submit', e => {
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
    // MAQUETTE : rien n'est envoyé. Sur le vrai site, brancher ici l'envoi vers le garage (après l'EFVP et la politique à jour).
    formEl.classList.add('is-sent');
    msg.className = 'form__msg is-ok';
    msg.textContent = `Merci ${new FormData(formEl).get('nom').trim().split(' ')[0]}. Ceci est une maquette : votre demande n’a été envoyée à personne. Pour joindre le garage, appelez le 418 663-1195.`;
  });
  formEl.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });

  /* ---------------- divers ---------------- */
  $$('[data-year]').forEach(el => { el.textContent = quebecNow().y; });
  document.addEventListener('visibilitychange', () => { document.body.classList.toggle('paused', document.hidden); });

  function pinToFinalStates() {
    tapeOn = false;
    $$('.reveal').forEach(el => el.classList.add('in', 'done'));
  }
  reduceMQ.addEventListener('change', e => { if (e.matches) { pinToFinalStates(); resetBackdrop(); } else { onBackdropScroll(); } });
  if (reduceMQ.matches) pinToFinalStates();

  // Un seul passage par image pour tout ce qui suit le défilement.
  let fxQueued = false;
  function runFx() { fxQueued = false; onBackdropScroll(); moveTape(); onPageScroll(); paintDock(); }
  addEventListener('scroll', () => { if (!fxQueued) { fxQueued = true; requestAnimationFrame(runFx); } }, { passive: true });

  onBackdropScroll();
  maybeLoadVideo();
})();
