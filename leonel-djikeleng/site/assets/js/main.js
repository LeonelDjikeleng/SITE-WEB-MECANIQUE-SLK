(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var bar = document.querySelector("[data-mobile-bar]");
  var hero = document.querySelector(".hero");
  var contact = document.getElementById("contact");

  /* ---------- En-tête : filet au défilement ---------- */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Barre d'action mobile : visible après le héros, cachée au formulaire ---------- */
  if (bar && "IntersectionObserver" in window && hero && contact) {
    var heroVisible = true, contactVisible = false;
    var update = function () {
      var show = !heroVisible && !contactVisible;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      bar.querySelectorAll("a").forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(contact);
    var formEl = document.getElementById("form-diagnostic");
    if (formEl) {
      formEl.addEventListener("focusin", function () { contactVisible = true; update(); });
    }
  }

  /* ---------- Menu mobile ---------- */
  var menu = document.getElementById("menu");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.documentElement.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
  }
  function closeMenu(restore) {
    menu.hidden = true;
    document.documentElement.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", function () { closeMenu(); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") closeMenu();
      if (e.key === "Tab") {
        var f = menu.querySelectorAll("a, button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Rails : points de position au téléphone ---------- */
  document.querySelectorAll(".rail").forEach(function (rail) {
    var items = rail.children;
    if (items.length < 2) return;
    var dots = document.createElement("div");
    dots.className = "rail-dots";
    dots.setAttribute("aria-hidden", "true");
    for (var i = 0; i < items.length; i++) dots.appendChild(document.createElement("span"));
    rail.parentNode.appendChild(dots);
    var paint = function () {
      var w = items[0].getBoundingClientRect().width + 12;
      var idx = Math.round(rail.scrollLeft / w);
      for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle("on", j === Math.min(idx, items.length - 1));
    };
    rail.addEventListener("scroll", function () { window.requestAnimationFrame(paint); }, { passive: true });
    paint();
  });

  /* ---------- Offre choisie : transmise au formulaire ---------- */
  var offreField = document.getElementById("f-offre");
  document.querySelectorAll("[data-offre]").forEach(function (a) {
    a.addEventListener("click", function () { if (offreField) offreField.value = a.getAttribute("data-offre"); });
  });

  /* ---------- Formulaire ---------- */
  var form = document.getElementById("form-diagnostic");
  if (!form) return;
  var shownAt = Date.now();
  var status = form.querySelector(".form-status");
  var TYPES = ["Garage", "Plomberie", "Construction", "Commerce", "Services", "Autre"];

  var rules = [
    { id: "f-prenom", err: "e-prenom", test: function (v) { return v.length >= 1 && v.length <= 80; }, msg: "Indiquez votre prénom." },
    { id: "f-entreprise", err: "e-entreprise", test: function (v) { return v.length >= 1 && v.length <= 120; }, msg: "Indiquez le nom de votre entreprise." },
    { id: "f-type", err: "e-type", test: function (v) { return TYPES.indexOf(v) !== -1; }, msg: "Choisissez un type d’entreprise." },
    { id: "f-courriel", err: "e-courriel", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 255; }, msg: "Entrez une adresse courriel valide." },
    { id: "f-tel", err: "e-tel", test: function (v) { return v === "" || /^[0-9+\-().\s]{7,40}$/.test(v); }, msg: "Entrez un numéro de téléphone valide, ou laissez vide." },
    { id: "f-tache", err: "e-tache", test: function (v) { return v.length >= 5 && v.length <= 600; }, msg: "Décrivez la tâche en quelques mots." }
  ];

  function setError(input, errEl, msg) {
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errEl.id);
      errEl.textContent = msg; errEl.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      errEl.textContent = ""; errEl.hidden = true;
    }
  }

  function validate() {
    var firstBad = null;
    rules.forEach(function (r) {
      var input = document.getElementById(r.id), errEl = document.getElementById(r.err);
      var ok = r.test(input.value.trim());
      setError(input, errEl, ok ? "" : r.msg);
      if (!ok && !firstBad) firstBad = input;
    });
    var consent = document.getElementById("f-consent"), eC = document.getElementById("e-consent");
    if (!consent.checked) { eC.textContent = "Cochez cette case pour que je puisse vous recontacter."; eC.hidden = false; if (!firstBad) firstBad = consent; }
    else { eC.textContent = ""; eC.hidden = true; }
    return firstBad;
  }

  rules.forEach(function (r) {
    var input = document.getElementById(r.id);
    // L'erreur s'efface pendant la frappe (et non à la sortie du champ) :
    // aucun déplacement de mise en page au moment où le doigt touche le champ suivant.
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", function () {
      if (input.hasAttribute("aria-invalid") && r.test(input.value.trim())) setError(input, document.getElementById(r.err), "");
    });
  });

  var consentBox = document.getElementById("f-consent");
  consentBox.addEventListener("change", function () {
    if (consentBox.checked) { var eC = document.getElementById("e-consent"); eC.textContent = ""; eC.hidden = true; }
  });

  function say(text, kind) {
    status.textContent = text;
    status.className = "form-status" + (kind ? " is-" + kind : "");
    status.hidden = false;
  }

  function done(prenom) {
    form.innerHTML = '<div class="form-done" tabindex="-1"><h3>Merci, ' + escapeHtml(prenom) + '.</h3>' +
      '<p>Votre demande est bien reçue. Je vous écris ou vous appelle dans les prochains jours ouvrables pour fixer l’appel.</p>' +
      '<p>Pressé&nbsp;? Appelez ou textez au <a href="tel:+14182557236">418&nbsp;255-7236</a>.</p></div>';
    form.querySelector(".form-done").focus();
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = validate();
    if (bad) { bad.focus(); say("Vérifiez les champs indiqués.", "err"); return; }

    var data = {
      prenom: form.prenom.value.trim(),
      entreprise: form.entreprise.value.trim(),
      type_entreprise: form.type_entreprise.value,
      courriel: form.courriel.value.trim(),
      telephone: form.telephone.value.trim() || null,
      tache_principale: form.tache_principale.value.trim(),
      offre: form.offre.value || null,
      consentement: true,
      site_web: form.site_web.value,
      affiche_depuis_ms: Date.now() - shownAt
    };

    var cfg = window.LD_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      say("Le formulaire en ligne sera activé sous peu. En attendant, appelez ou textez au 418 255-7236 : je vous réponds rapidement.", "err");
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Envoi…";
    fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/functions/v1/" + (cfg.fonction || "demande-diagnostic"), {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": cfg.supabaseAnonKey, "Authorization": "Bearer " + cfg.supabaseAnonKey },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      done(data.prenom);
    }).catch(function () {
      btn.disabled = false; btn.textContent = "Réserver mon appel gratuit";
      say("L’envoi n’a pas fonctionné. Réessayez dans un instant, ou appelez au 418 255-7236.", "err");
    });
  });
})();
