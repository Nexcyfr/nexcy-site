import type { LegalBlock } from "@/lib/legal";

/**
 * Rendu sobre du contenu légal (Master Brief §17/§18).
 * Fond noir, largeur max 720px, Geist Regular 16px. Verbatim.
 */
export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <article className="mx-auto max-w-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "title":
            return (
              <h1
                key={i}
                className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl"
              >
                {block.text}
              </h1>
            );
          case "meta":
            return (
              <p key={i} className="mt-2 text-sm text-text-muted">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2
                key={i}
                className="mt-12 text-xl font-semibold text-text-primary md:text-2xl"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p
                key={i}
                className="mt-4 text-base leading-relaxed text-text-secondary"
              >
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mt-4 flex flex-col gap-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-base leading-relaxed text-text-secondary"
                  >
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "rule":
            return <hr key={i} className="mt-12 border-0 border-t border-border" />;
          default:
            return null;
        }
      })}
    </article>
  );
}
