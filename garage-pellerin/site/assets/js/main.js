/* Garage M. Pellerin · maquette — aucun service tiers, aucun témoin */
(() => {
  // « Ouvert maintenant » selon l'heure de Québec (lun.–ven., 8 h–12 h et 13 h–17 h ; heures à confirmer)
  const el = document.querySelector('[data-status]');
  const txt = document.querySelector('[data-status-text]');
  if (el && txt) {
    const parts = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => (parts.find(p => p.type === t) || {}).value || '';
    const day = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })).getDay();
    const m = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
    const weekday = day >= 1 && day <= 5;
    const open = weekday && ((m >= 480 && m < 720) || (m >= 780 && m < 1020));
    let msg;
    if (open) msg = m < 720 ? 'Ouvert · jusqu’à 12 h' : 'Ouvert · jusqu’à 17 h';
    else if (weekday && m >= 720 && m < 780) msg = 'Pause du dîner · retour à 13 h';
    else if (weekday && m < 480) msg = 'Fermé · ouvre à 8 h';
    else if (day >= 1 && day <= 4) msg = 'Fermé · ouvre demain à 8 h';
    else msg = 'Fermé · ouvre lundi à 8 h';
    txt.textContent = msg;
    el.classList.add(open ? 'is-open' : 'is-closed');
  }

  // Démonstration du devis
  const job = document.querySelector('[data-quote-job]');
  const out = document.querySelector('[data-quote-out]');
  if (job && out) job.addEventListener('change', () => { out.textContent = job.value; });

  // Formulaire : maquette, rien n'est envoyé
  const form = document.querySelector('[data-form]');
  const msg = document.querySelector('[data-form-msg]');
  if (form && msg) form.addEventListener('submit', e => {
    e.preventDefault();
    const nom = form.nom.value.trim(), tel = form.tel.value.trim();
    if (!nom || !tel) { msg.textContent = 'Indiquez votre nom et votre téléphone.'; (nom ? form.tel : form.nom).focus(); return; }
    msg.textContent = 'Démonstration : dans le vrai site, votre demande arriverait directement au garage. Rien n’a été envoyé.';
    form.reset();
  });
})();
