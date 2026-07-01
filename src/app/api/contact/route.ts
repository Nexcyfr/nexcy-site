import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

// ── Rate limiting simple en mémoire (Master Brief §22/§26) ──
// Note : sur serverless, la mémoire n'est pas partagée entre instances.
// Suffisant en phase 1 ; migrer vers Upstash Redis si le volume augmente.
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 heure
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Vérifie le token Turnstile côté serveur. Ignoré si aucune clé configurée (dev). */
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // dev sans Turnstile configuré
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  // Content-Type strict
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ success: false, message: "Requête invalide." }, { status: 415 });
  }

  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Trop de tentatives. Réessayez plus tard." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "JSON invalide." }, { status: 400 });
  }

  const payload = json as Record<string, unknown>;
  const turnstileToken = typeof payload.turnstileToken === "string" ? payload.turnstileToken : undefined;

  // Validation serveur indépendante (Zod)
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Données invalides." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot : si rempli → spam silencieux (Brief §16/§22)
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ success: true, message: "Reçu." });
  }

  // Turnstile
  const human = await verifyTurnstile(turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { success: false, message: "Vérification anti-robot échouée." },
      { status: 403 },
    );
  }

  // Envoi via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "NEXCY <contact.agency@nexcy.fr>";
  const toEmail = process.env.RESEND_TO_EMAIL ?? "contact.agency@nexcy.fr";

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Service d'envoi non configuré. Écrivez-nous à contact.agency@nexcy.fr.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const firstName = data.name.split(" ")[0];

  try {
    // 1) E-mail entrant vers NEXCY
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `Nouvelle demande NEXCY — ${firstName} de ${data.company}`,
      text: [
        `Nom       : ${data.name}`,
        `E-mail    : ${data.email}`,
        `Entreprise: ${data.company}`,
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
          <p style="color:#5A5A5A;font-size:12px">Reçu le ${receivedAt} via nexcy.fr</p>
        </div>
      `,
    });

    // 2) E-mail de confirmation au prospect
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Nous avons bien reçu votre demande — NEXCY",
      text: [
        `${data.name},`,
        ``,
        `Votre message a bien été reçu.`,
        ``,
        `Nous prenons le temps de lire chaque demande attentivement avant de vous répondre.`,
        ``,
        `Vous recevrez une réponse de notre part sous 48 heures ouvrées.`,
        ``,
        `NEXCY`,
        `contact.agency@nexcy.fr`,
        `nexcy.fr`,
      ].join("\n"),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur s'est produite. Veuillez réessayer ou nous contacter directement à contact.agency@nexcy.fr",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "Votre demande a bien été reçue. Nous vous répondons sous 48 heures ouvrées.",
  });
}
