import type { LegalBlock } from "@/lib/legal";

/**
 * Rendu du contenu légal — verbatim, mais dans le même système visuel que le
 * reste du site.
 *
 * Une page légale reste une page NEXCY : même échelle typographique, même
 * langage de trait (cote ambre en tête de section, filets), même longueur de
 * ligne maîtrisée. Elle ne doit jamais ressembler à un document Tailwind
 * par défaut posé sur un fond noir.
 *
 * Les titres de section sont numérotés dans la source ; on les laisse tels
 * quels et on les distingue par le filet, pas par un compteur ajouté.
 */
export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <article className="max-w-[46rem]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "title":
            return (
              <h1 key={i} className="t-h1 text-text-primary">
                {block.text}
              </h1>
            );
          case "meta":
            return (
              <p key={i} className="t-tech mt-4 text-text-muted">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2
                key={i}
                className="plan-rule t-h3 mt-16 pt-8 text-text-primary"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="t-body mt-5 text-text-secondary">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mt-5 flex flex-col gap-3">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="t-body flex gap-4 text-text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-px w-4 shrink-0 bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "rule":
            return <hr key={i} className="mt-14 border-0 border-t border-border" />;
          default:
            return null;
        }
      })}
    </article>
  );
}
