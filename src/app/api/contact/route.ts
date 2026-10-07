import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { missingEnv } from "@/lib/env";
import { SITE_URL } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * API du formulaire de contact.
 *
 * Défense en profondeur : Content-Type strict, taille bornée, origine
 * contrôlée, validation Zod serveur indépendante du client, honeypot,
 * Cloudflare Turnstile (fail-closed en production), échappement HTML.
 *
 * Pas de limitation de débit en mémoire : inefficace en serverless (instances
 * éphémères). Turnstile + honeypot portent la protection ; si un abus réel
 * apparaît, brancher un compteur partagé (Upstash Redis) — voir docs/DEPLOYMENT.md.
 *
 * Journalisation : jamais de donnée personnelle (ni nom, ni e-mail, ni message).
 */

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_TIMEOUT_MS = 5_000;

const FALLBACK_CONTACT = "contact.agency@nexcy.fr";

type Failure = { success: false; message: string; code: string };

function fail(status: number, code: string, message: string) {
  return NextResponse.json<Failure>({ success: false, code, message }, { status });
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Requête émise par une page du site ? (refuse les POST inter-sites). */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // clients non navigateurs : Turnstile reste exigé
  try {
    const originHost = new URL(origin).host;
    const allowed = new Set<string>([new URL(SITE_URL).host]);
    const host = req.headers.get("host");
    if (host) allowed.add(host);
    return allowed.has(originHost);
  } catch {
    return false;
  }
}

type TurnstileResult = "ok" | "rejected" | "unavailable";

/**
 * Vérifie le token Turnstile côté serveur.
 * - Production sans clé secrète → refus (fail-closed), jamais de contournement.
 * - Hors production sans clé → toléré (développement local uniquement).
 */
async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return process.env.NODE_ENV === "production" ? "unavailable" : "ok";
  }
  if (!token) return "rejected";

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
      },
    );
    if (!res.ok) return "unavailable";
    const data = (await res.json()) as { success?: boolean };
    return data.success === true ? "ok" : "rejected";
  } catch {
    return "unavailable";
  }
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Valeur sur une seule ligne — protège l'objet de l'e-mail (retours chariot). */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, " ").trim();

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "content-type", "Requête invalide.");
  }
  if (!isSameOrigin(req)) {
    return fail(403, "origin", "Requête refusée.");
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return fail(413, "too-large", "Message trop volumineux.");
  }

  // Configuration critique : en production, l'absence d'une variable doit être
  // explicite (503 + journal serveur), jamais un faux « vérification échouée ».
  if (process.env.NODE_ENV === "production") {
    const missing = missingEnv();
    if (missing.length > 0) {
      console.error(
        `[contact] configuration incomplète — variables manquantes : ${missing.join(", ")}`,
      );
      return fail(
        503,
        "config",
        `Le formulaire est momentanément indisponible. Écrivez-nous à ${FALLBACK_CONTACT}.`,
      );
    }
  }

  const ip = getIp(req);

  let payload: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return fail(413, "too-large", "Message trop volumineux.");
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return fail(400, "invalid-json", "Requête invalide.");
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid-json", "Requête invalide.");
  }

  const turnstileToken =
    typeof payload.turnstileToken === "string" ? payload.turnstileToken : undefined;

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return fail(400, "validation", "Certains champs sont invalides. Vérifiez le formulaire.");
  }
  const data = parsed.data;

  // Honeypot : un robot qui le remplit reçoit un succès silencieux.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ success: true, message: "Reçu." });
  }

  const human = await verifyTurnstile(turnstileToken, ip);
  if (human === "rejected") {
    return fail(
      403,
      "turnstile",
      "La vérification de sécurité a échoué. Actualisez la page et réessayez.",
    );
  }
  if (human === "unavailable") {
    console.error("[contact] vérification Turnstile indisponible ou non configurée");
    return fail(
      503,
      "turnstile-unavailable",
      `La vérification de sécurité est indisponible. Écrivez-nous à ${FALLBACK_CONTACT}.`,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? `NEXCY <${FALLBACK_CONTACT}>`;
  const toEmail = process.env.RESEND_TO_EMAIL ?? FALLBACK_CONTACT;

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY manquante");
    return fail(
      503,
      "config",
      `Le formulaire est momentanément indisponible. Écrivez-nous à ${FALLBACK_CONTACT}.`,
    );
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const firstName = oneLine(data.name).split(" ")[0];

  // 1) Notification vers NEXCY — c'est elle qui conditionne le succès.
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: oneLine(`Nouvelle demande NEXCY — ${firstName} de ${data.company}`),
      text: [
        `Nom       : ${oneLine(data.name)}`,
        `E-mail    : ${data.email}`,
        `Entreprise: ${oneLine(data.company)}`,
        `Projet    : ${data.projectType}`,
        `Budget    : ${data.budget}`,
        `Délai     : ${data.deadline}`,
        ``,
        `Message :`,
        data.message,
        ``,
        `---`,
        `Reçu le ${receivedAt} via nexcy.fr`,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;color:#0A0A0A">
          <h2 style="margin:0 0 16px">Nouvelle demande NEXCY</h2>
          <table style="border-collapse:collapse;font-size:14px">
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">Nom</td><td>${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">E-mail</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">Entreprise</td><td>${escapeHtml(data.company)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">Projet</td><td>${escapeHtml(data.projectType)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">Budget</td><td>${escapeHtml(data.budget)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5A5A5A">Délai</td><td>${escapeHtml(data.deadline)}</td></tr>
          </table>
          <p style="margin:16px 0 4px;color:#5A5A5A;font-size:14px">Message :</p>
          <p style="white-space:pre-wrap;font-size:14px">${escapeHtml(data.message)}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="color:#5A5A5A;font-size:12px">Reçu le ${escapeHtml(receivedAt)} via nexcy.fr</p>
        </div>
      `,
    });
    if (error) throw new Error(error.name);
  } catch (err) {
    console.error(
      "[contact] échec de l'envoi de la notification :",
      err instanceof Error ? err.message : "erreur inconnue",
    );
    return fail(
      502,
      "send",
      `Une erreur s'est produite. Réessayez ou écrivez-nous directement à ${FALLBACK_CONTACT}.`,
    );
  }

  // 2) Accusé de réception — secondaire : son échec ne doit pas faire croire à
  //    un échec global (la demande est déjà reçue ; un nouvel envoi créerait un doublon).
  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Nous avons bien reçu votre demande — NEXCY",
      text: [
        `${oneLine(data.name)},`,
        ``,
        `Votre message a bien été reçu.`,
        ``,
        `Nous prenons le temps de lire chaque demande attentivement avant de vous répondre.`,
        ``,
        `Vous recevrez une réponse de notre part sous 48 heures ouvrées.`,
        ``,
        `NEXCY`,
        FALLBACK_CONTACT,
        `nexcy.fr`,
      ].join("\n"),
    });
  } catch {
    console.error("[contact] accusé de réception non envoyé (la demande est reçue)");
  }

  return NextResponse.json({
    success: true,
    message:
      "Votre demande a bien été reçue. Nous vous répondons sous 48 heures ouvrées.",
  });
}
