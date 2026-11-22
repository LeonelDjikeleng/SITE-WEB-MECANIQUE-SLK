// Fonction Edge Supabase : reçoit le formulaire du site et enregistre la demande.
// Déploiement : supabase functions deploy demande-diagnostic --no-verify-jwt
// Secret requis : ORIGINES_AUTORISEES (ex. "https://leoneldjikeleng.com,https://www.leoneldjikeleng.com")
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.
import { createClient } from "jsr:@supabase/supabase-js@2";

const TYPES = ["Garage", "Plomberie", "Construction", "Commerce", "Services", "Autre"];
const OFFRES = ["Essentiel", "Signature", "Vidéo publicitaire", "Pilote automatique", "Entretien mensuel"];
const origines = (Deno.env.get("ORIGINES_AUTORISEES") ?? "").split(",").map((o) => o.trim()).filter(Boolean);

function cors(origin: string | null) {
  const ok = origin && origines.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin! : origines[0] ?? "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Vary": "Origin",
  };
}
const json = (body: unknown, status: number, h: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...h, "Content-Type": "application/json" } });

const txt = (v: unknown, min: number, max: number) =>
  typeof v === "string" && v.trim().length >= min && v.trim().length <= max ? v.trim() : null;

Deno.serve(async (req) => {
  const h = cors(req.headers.get("Origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ ok: false }, 405, h);
  if (origines.length && !origines.includes(req.headers.get("Origin") ?? "")) return json({ ok: false }, 403, h);

  let d: Record<string, unknown>;
  try { d = await req.json(); } catch { return json({ ok: false }, 400, h); }

  // Anti-pourriel : champ piège rempli ou envoi en moins de 3 secondes -> succès simulé, rien d'enregistré.
  const piege = typeof d.site_web === "string" && d.site_web !== "";
  const rapide = typeof d.affiche_depuis_ms !== "number" || d.affiche_depuis_ms < 3000;
  if (piege || rapide) return json({ ok: true }, 200, h);

  const prenom = txt(d.prenom, 1, 80);
  const entreprise = txt(d.entreprise, 1, 120);
  const courriel = txt(d.courriel, 3, 255);
  const tache = txt(d.tache_principale, 5, 600);
  const type = typeof d.type_entreprise === "string" && TYPES.includes(d.type_entreprise) ? d.type_entreprise : null;
  const tel = d.telephone == null || d.telephone === "" ? null : txt(d.telephone, 7, 40);
  const offre = d.offre == null || d.offre === "" ? null : (typeof d.offre === "string" && OFFRES.includes(d.offre) ? d.offre : null);
  const okCourriel = courriel && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel);
  if (!prenom || !entreprise || !okCourriel || !tache || !type || d.consentement !== true || (d.telephone && !tel)) {
    return json({ ok: false, erreur: "donnees_invalides" }, 422, h);
  }

  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { error } = await supa.from("demandes_diagnostic").insert({
    prenom, entreprise, type_entreprise: type, courriel, telephone: tel, tache_principale: tache, offre, consentement: true,
  });
  if (error) { console.error("insertion:", error.code); return json({ ok: false }, 500, h); }
  return json({ ok: true }, 201, h);
});
