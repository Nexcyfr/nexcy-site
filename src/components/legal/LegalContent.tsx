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

/** Identifiant stable d'une section : « 12. Titre » → « section-12 ». */
function sectionId(text: string): string {
  const n = text.match(/^(\d+)\./)?.[1];
  return n ? `section-${n}` : text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  const headings = blocks.flatMap((b) => (b.type === "heading" ? [b.text] : []));

  const toc = (
    <ol className="flex flex-col">
      {headings.map((h) => (
        <li key={h} className="border-t border-border first:border-t-0">
          <a
            href={`#${sectionId(h)}`}
            className="t-body flex min-h-[44px] items-center py-2 text-text-secondary transition-colors duration-200 hover:text-accent"
          >
            {h}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,46rem)] lg:gap-20">
      {headings.length > 0 ? (
        <>
          {/* Mobile et tablette : sommaire repliable, en tête de page. */}
          <details className="group mb-10 border border-border bg-card lg:hidden">
            <summary className="t-tech flex min-h-[52px] cursor-pointer list-none items-center justify-between px-5 text-text-primary [&::-webkit-details-marker]:hidden">
              Sommaire
              <span
                aria-hidden="true"
                className="block h-px w-5 bg-accent transition-transform duration-200 group-open:rotate-90"
              />
            </summary>
            <nav aria-label="Sommaire" className="border-t border-border px-5 pb-2">
              {toc}
            </nav>
          </details>

          {/* Desktop : sommaire fixe à gauche, toujours visible. */}
          <nav
            aria-label="Sommaire"
            className="sticky top-[calc(var(--header-h)+2rem)] hidden max-h-[calc(100svh-var(--header-h)-4rem)] self-start overflow-y-auto pr-4 lg:block"
          >
            <p className="t-tech mb-4 text-text-muted">Sommaire</p>
            {toc}
          </nav>
        </>
      ) : null}

      <LegalArticle blocks={blocks} />
    </div>
  );
}

function LegalArticle({ blocks }: { blocks: LegalBlock[] }) {
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
                id={sectionId(block.text)}
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
