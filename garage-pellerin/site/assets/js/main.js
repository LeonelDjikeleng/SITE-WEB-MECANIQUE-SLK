/* Garage M. Pellerin · maquette — aucun service tiers, aucun témoin */
(() => {
  // En-tête blanc dès qu'on quitte le visuel
  const header = document.querySelector('[data-header]');
  if (header) {
    const maj = () => header.classList.toggle('is-solid', window.scrollY > 40);
    maj();
    window.addEventListener('scroll', maj, { passive: true });
  }

  // État du garage selon l'heure de Québec (lun.–ven., 8 h–12 h et 13 h–17 h ; heures à confirmer)
  const now = document.querySelector('[data-now]');
  if (now) {
    const q = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    const d = q.getDay(), m = q.getHours() * 60 + q.getMinutes();
    const semaine = d >= 1 && d <= 5;
    let t;
    if (semaine && m >= 480 && m < 720) t = 'Ouvert en ce moment, jusqu’à midi';
    else if (semaine && m >= 780 && m < 1020) t = 'Ouvert en ce moment, jusqu’à 17 h';
    else if (semaine && m >= 720 && m < 780) t = 'Pause du dîner, de retour à 13 h';
    else if (semaine && m < 480) t = 'Fermé, ouvre ce matin à 8 h';
    else if (d >= 1 && d <= 4) t = 'Fermé, ouvre demain à 8 h · rendez-vous en ligne ouvert';
    else t = 'Fermé, ouvre lundi à 8 h · rendez-vous en ligne ouvert';
    now.textContent = t;
  }

  // Avant / après
  document.querySelectorAll('[data-compare]').forEach(box => {
    const r = box.querySelector('[data-compare-range]');
    if (!r) return;
    const maj = () => box.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', maj);
    maj();
  });

  // Formulaire de démonstration : rien n'est envoyé
  const form = document.querySelector('[data-form]');
  const msg = document.querySelector('[data-form-msg]');
  if (form && msg) form.addEventListener('submit', e => {
    e.preventDefault();
    const nom = form.nom.value.trim(), tel = form.tel.value.trim();
    if (!nom || !tel) { msg.textContent = 'Indiquez votre nom et votre téléphone.'; (nom ? form.tel : form.nom).focus(); return; }
    msg.textContent = 'Maquette : sur le vrai site, votre demande arriverait directement au garage. Rien n’a été envoyé.';
    form.reset();
  });
})();
