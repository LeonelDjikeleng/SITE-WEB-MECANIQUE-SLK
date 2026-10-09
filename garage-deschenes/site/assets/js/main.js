/* Garage Jean-Yves Deschênes · maquette · comportements
   Tout le contenu reste lisible sans JavaScript. */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* Heures (À CONFIRMER avec le garage : les annuaires ne s'entendent pas) */
  const TZ = 'America/Toronto';
  const HOURS = { 1: [480, 1050], 2: [480, 1050], 3: [480, 1050], 4: [480, 1050], 5: [480, 1050] }; // minutes depuis minuit
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  function quebecNow() {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
    return { wd, min: +g('hour') * 60 + +g('minute'), y: +g('year'), m: +g('month'), d: +g('day') };
  }
  const fmt = m => { const h = Math.floor(m / 60), mm = m % 60; return h + ' h' + (mm ? ' ' + String(mm).padStart(2, '0') : ''); };

  function paintStatus() {
    const el = $('#status'); if (!el) return;
    const n = quebecNow(), today = HOURS[n.wd];
    let txt, open = false;
    if (today && n.min >= today[0] && n.min < today[1]) { open = true; txt = 'Ouvert · ferme à ' + fmt(today[1]); }
    else if (today && n.min < today[0]) txt = 'Fermé · ouvre à ' + fmt(today[0]);
    else {
      let k = 1; while (k < 8 && !HOURS[(n.wd + k) % 7]) k++;
      const d = (n.wd + k) % 7;
      txt = 'Fermé · ouvre ' + (k === 1 ? 'demain' : DAYS[d]) + ' à ' + fmt(HOURS[d][0]);
    }
    el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open);
    $('.status__txt', el).textContent = txt;
    const row = $(`.hours tr[data-d="${n.wd}"]`); if (row) row.classList.add('is-today');
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* Compte à rebours : 1er décembre (heure de Québec) */
  (function winter() {
    const n = quebecNow();
    const today = Date.UTC(n.y, n.m - 1, n.d);
    const target = Date.UTC(n.y, 11, 1);
    const inSeason = (n.m === 12) || (n.m <= 2) || (n.m === 3 && n.d <= 15);
    const days = Math.round((target - today) / 864e5);
    const d = $('#days'), l = $('#days-lbl'); if (!d) return;
    if (inSeason) { d.textContent = '✓'; l.textContent = 'les pneus d’hiver sont obligatoires jusqu’au 15 mars'; }
    else { d.textContent = days; l.textContent = (days > 1 ? 'jours' : 'jour') + ' avant l’obligation des pneus d’hiver'; }
  })();

  /* En-tête : se cache en descendant, revient en remontant */
  const top = $('#top'), bar = $('.bar'), burger = $('.burger'), nav = $('#nav');
  let lastY = scrollY;
  function onHeader() {
    const y = scrollY, menuOpen = burger.getAttribute('aria-expanded') === 'true';
    top.classList.toggle('is-hidden', !menuOpen && y > 240 && y > lastY + 2);
    if (y < lastY - 2 || y < 240) top.classList.remove('is-hidden');
    bar.classList.toggle('is-on', y > innerHeight * 0.55);
    lastY = y;
  }
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); burger.focus(); } });

  /* Fig. 1 : la vue éclatée s'ouvre au chargement, puis les pièces s'écartent un peu au défilement */
  const fig = $('#fig1'), svg = fig && $('.fig__svg', fig);
  let figC = 0, figS = 0, figVisible = true;
  const setFig = () => { svg.style.setProperty('--c', figC.toFixed(4)); svg.style.setProperty('--s', figS.toFixed(4)); };
  function explode() {
    if (!svg || reduceMQ.matches) return;
    fig.classList.add('is-pre');
    const START = 0.62, DUR = 1500, t0 = performance.now() + 250;
    const ease = t => 1 - Math.pow(1 - t, 4);
    figC = START; setFig();
    const step = now => {
      const t = clamp((now - t0) / DUR, 0, 1);
      figC = START * (1 - ease(t)); setFig();
      if (t > 0.55) fig.classList.remove('is-pre');
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function figScroll() {
    if (!svg || reduceMQ.matches || !figVisible) return;
    const r = fig.getBoundingClientRect();
    const p = clamp((innerHeight * 0.5 - r.top) / (innerHeight * 0.9), 0, 1);
    if (Math.abs(p - figS) > 0.001) { figS = p; setFig(); }
  }
  if (svg && 'IntersectionObserver' in window) new IntersectionObserver(es => { figVisible = es[0].isIntersecting; }).observe(fig);

  /* Apparitions */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  const revealables = $$('.reveal, .step, .principe__t');
  if (io && !reduceMQ.matches) revealables.forEach(el => io.observe(el));
  else revealables.forEach(el => el.classList.add('is-in'));
  requestAnimationFrame(() => requestAnimationFrame(() => $('.hero__t')?.classList.add('is-in')));

  /* Voyants */
  const lamps = $$('.lamp'), infos = $$('.lampinfo');
  function pick(btn, ignite) {
    lamps.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    infos.forEach(a => a.classList.toggle('is-on', a.dataset.for === btn.dataset.lamp));
    if (ignite && !reduceMQ.matches) { btn.classList.remove('is-ignite'); void btn.offsetWidth; btn.classList.add('is-ignite'); }
  }
  lamps.forEach(b => b.addEventListener('click', () => pick(b, true)));
  if (lamps.length) pick(lamps[0], false);
  // Le premier voyant s'allume quand le tableau entre à l'écran
  const cl = $('[data-cluster]');
  if (cl && io && !reduceMQ.matches) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { lamps[0].classList.add('is-ignite'); o.disconnect(); } }, { threshold: 0.4 }).observe(cl);

  /* Liste d'hiver */
  const boxes = $$('.check__list input'), fill = $('#check-fill'), state = $('#check-state');
  function paintCheck() {
    const n = boxes.filter(b => b.checked).length;
    fill.style.setProperty('--p', (n / boxes.length).toFixed(3));
    state.textContent = n === boxes.length ? 'Tout est prêt pour l’hiver.' : n + ' sur ' + boxes.length + ' de fait';
  }
  boxes.forEach(b => b.addEventListener('change', paintCheck)); if (boxes.length) paintCheck();

  /* Préremplissage du formulaire */
  const msg = $('#f-msg');
  $$('[data-prefill]').forEach(a => a.addEventListener('click', () => {
    if (!msg) return;
    const v = a.dataset.prefill;
    if (!msg.value.trim() || msg.dataset.auto === '1') { msg.value = v; msg.dataset.auto = '1'; }
    setTimeout(() => { msg.focus({ preventScroll: true }); msg.setSelectionRange(msg.value.length, msg.value.length); }, reduceMQ.matches ? 0 : 650);
  }));
  msg && msg.addEventListener('input', () => { msg.dataset.auto = '0'; });

  /* Formulaire de démonstration : n'envoie rien */
  const form = $('#form'), out = $('#form-msg');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    let bad = null;
    $$('[required]', form).forEach(f => {
      const wrap = f.closest('.field') || f.closest('.consent');
      const ok = f.type === 'checkbox' ? f.checked : f.value.trim().length > 1;
      wrap.classList.toggle('is-bad', !ok);
      if (!ok && !bad) bad = f;
    });
    if (bad) { out.className = 'form__msg is-bad'; out.textContent = 'Il manque une information : vérifiez les champs en rouge.'; bad.focus(); return; }
    out.className = 'form__msg is-ok';
    out.textContent = 'Ceci est une maquette : votre demande n’a été envoyée à personne. Pour un vrai rendez-vous, appelez le 418 661-2102.';
    form.reset(); msg.dataset.auto = '0';
  });

  /* Une seule passe par image pour tout ce qui dépend du défilement */
  let queued = false;
  const run = () => { queued = false; onHeader(); figScroll(); };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', () => { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
  reduceMQ.addEventListener?.('change', () => { if (reduceMQ.matches && svg) { figC = 0; figS = 0; setFig(); fig.classList.remove('is-pre'); } revealables.forEach(el => el.classList.add('is-in')); });

  explode(); run();
})();
