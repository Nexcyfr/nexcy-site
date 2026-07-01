import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LegalBlock =
  | { type: "title"; text: string }
  | { type: "meta"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "rule" };

const HEADING_RE = /^\d+\.\s+\S/;
const META_RE = /^(Date de publication|Dernière mise à jour|Version)\s*:/;

/**
 * Parse le texte légal (extrait des sources RTF) en blocs structurés.
 * Intégration verbatim — aucune reformulation (Master Brief §17/§18).
 * Pure : aucune dépendance externe.
 */
export function parseLegal(raw: string): LegalBlock[] {
  const lines = raw.replace(/\r/g, "").split("\n");
  const blocks: LegalBlock[] = [];
  let listBuffer: string[] = [];
  let titleUsed = false;

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      flushList();
      continue;
    }

    // Séparateur horizontal (⸻ ou ---)
    if (/^[⸻—–-]{1,}$/.test(line)) {
      flushList();
      blocks.push({ type: "rule" });
      continue;
    }

    // Lignes de type liste : se terminent par « ; »
    if (line.endsWith(";")) {
      listBuffer.push(line.replace(/\s*;$/, ""));
      continue;
    }
    flushList();

    if (!titleUsed) {
      blocks.push({ type: "title", text: line });
      titleUsed = true;
      continue;
    }

    if (META_RE.test(line)) {
      blocks.push({ type: "meta", text: line });
      continue;
    }

    if (HEADING_RE.test(line)) {
      blocks.push({ type: "heading", text: line });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }
  flushList();

  return blocks;
}

/** Lit et parse un fichier légal depuis src/content/legal. */
export function loadLegal(slug: "mentions-legales" | "politique-de-confidentialite"): LegalBlock[] {
  const path = join(process.cwd(), "src", "content", "legal", `${slug}.txt`);
  const raw = readFileSync(path, "utf-8");
  return parseLegal(raw);
}
