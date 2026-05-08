import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Parse image markdown with optional style attributes:
 * ![alt](url){width=50,float=right,bleed=true}
 */
function parseImageLine(line: string) {
  const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?$/);
  if (!match) return null;
  const alt = match[1] || "";
  const src = match[2];
  const attrs: Record<string, string> = {};
  if (match[3]) {
    match[3].split(",").forEach((pair) => {
      const [key, value] = pair.trim().split("=");
      if (key && value) attrs[key.trim()] = value.trim();
    });
  }
  return { alt, src, attrs };
}

/** [cta:slug]Texte du bouton[/cta] */
function parseCtaLine(line: string) {
  const match = line.match(/^\[cta:([^\]]+)\](.+)\[\/cta\]$/);
  if (!match) return null;
  return { slug: match[1].trim(), text: match[2].trim() };
}

/** [chiffre]50 ans|de durée de vie[/chiffre] */
function parseChiffreLine(line: string) {
  const match = line.match(/^\[chiffre\](.+?)\|(.+?)\[\/chiffre\]$/);
  if (!match) return null;
  return { value: match[1].trim(), label: match[2].trim() };
}

function getImageStyles(attrs: Record<string, string>) {
  const width = attrs.width ? `${attrs.width}%` : "100%";
  const float = attrs.float as "left" | "right" | undefined;
  const bleed = attrs.bleed === "true";
  if (bleed) {
    return {
      containerClass: "blog-image-bleed my-10",
      style: { width: "100vw", marginLeft: "calc(50% - 50vw)", maxWidth: "100vw" },
    };
  }
  if (float === "left") {
    return {
      containerClass: "my-6 mr-6 float-left clear-left",
      style: { width },
    };
  }
  if (float === "right") {
    return {
      containerClass: "my-6 ml-6 float-right clear-right",
      style: { width },
    };
  }
  if (width !== "100%") {
    return {
      containerClass: "my-8 mx-auto",
      style: { width },
    };
  }
  return {
    containerClass: "my-8",
    style: { width: "100%" },
  };
}

function renderInline(text: string, keyPrefix: string = ""): React.ReactNode {
  // Parse italics (*text*) AND bold (**text**) AND links
  // We split by bold first, then italics within non-bold parts
  const out: React.ReactNode[] = [];
  let remaining = text;
  let i = 0;
  // Greedy combined regex: bold > italics > links
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(remaining)) !== null) {
    if (m.index > lastIdx) {
      out.push(remaining.slice(lastIdx, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      out.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      out.push(
        <em key={`${keyPrefix}-i-${i++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        out.push(
          <Link
            key={`${keyPrefix}-l-${i++}`}
            href={linkMatch[2]}
            className="text-[#8b2d2d] hover:text-[#6e2323] underline decoration-[#8b2d2d]/30 underline-offset-4 hover:decoration-[#8b2d2d] transition-colors"
          >
            {linkMatch[1]}
          </Link>
        );
      }
    }
    lastIdx = m.index + token.length;
  }
  if (lastIdx < remaining.length) {
    out.push(remaining.slice(lastIdx));
  }
  return out.length > 0 ? out : text;
}

export type MarkdownBlock =
  | { type: "h2"; text: string; lineIndex: number }
  | { type: "h3"; text: string; lineIndex: number }
  | { type: "paragraph"; text: string; lineIndex: number; isFirst?: boolean }
  | { type: "list"; items: string[]; lineIndex: number }
  | { type: "image"; alt: string; src: string; attrs: Record<string, string>; lineIndex: number; raw: string }
  | { type: "cta"; slug: string; text: string; lineIndex: number }
  | { type: "blockquote"; lines: string[]; variant: "exergue" | "highlight"; lineIndex: number }
  | { type: "table"; headers: string[]; rows: string[][]; lineIndex: number }
  | { type: "atelier"; lines: string[]; lineIndex: number }
  | { type: "compare"; columns: string[][]; lineIndex: number }
  | { type: "chiffre"; value: string; label: string; lineIndex: number }
  | { type: "duo"; image: string; pos: "left" | "right"; alt: string; lines: string[]; lineIndex: number }
  | { type: "hr"; lineIndex: number }
  | { type: "empty"; lineIndex: number };

/** Parse markdown content into structured blocks */
export function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;
  let firstParagraphSet = false;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      blocks.push({ type: "hr", lineIndex: i });
      i++;
      continue;
    }

    // Atelier block: [atelier] ... [/atelier]
    if (line.trim() === "[atelier]") {
      const atelierLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "[/atelier]") {
        atelierLines.push(lines[i]);
        i++;
      }
      i++; // skip closing tag
      blocks.push({ type: "atelier", lines: atelierLines, lineIndex: i });
      continue;
    }

    // Compare block: [compare] [col]...[/col] [col]...[/col] [/compare]
    if (line.trim() === "[compare]") {
      const columns: string[][] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "[/compare]") {
        if (lines[i].trim().startsWith("[col]")) {
          const colLines: string[] = [];
          let firstLine = lines[i].trim().slice(5);
          if (firstLine.endsWith("[/col]")) {
            colLines.push(firstLine.slice(0, -6));
            i++;
          } else {
            if (firstLine) colLines.push(firstLine);
            i++;
            while (i < lines.length && !lines[i].includes("[/col]")) {
              colLines.push(lines[i]);
              i++;
            }
            if (i < lines.length) {
              const last = lines[i].replace("[/col]", "");
              if (last.trim()) colLines.push(last);
              i++;
            }
          }
          columns.push(colLines);
        } else {
          i++;
        }
      }
      i++; // skip [/compare]
      blocks.push({ type: "compare", columns, lineIndex: i });
      continue;
    }

    // Chiffre inline: [chiffre]val|label[/chiffre]
    const chiffre = parseChiffreLine(line);
    if (chiffre) {
      blocks.push({ type: "chiffre", ...chiffre, lineIndex: i });
      i++;
      continue;
    }

    // Duo block: [duo image="..." pos="right|left" alt="..."] ... [/duo]
    const duoMatch = line.match(/^\[duo\s+([^\]]+)\]$/);
    if (duoMatch) {
      const attrStr = duoMatch[1];
      const imageMatch = attrStr.match(/image="([^"]+)"/);
      const posMatch = attrStr.match(/pos="(left|right)"/);
      const altMatch = attrStr.match(/alt="([^"]+)"/);
      const image = imageMatch ? imageMatch[1] : "";
      const pos = (posMatch ? posMatch[1] : "right") as "left" | "right";
      const alt = altMatch ? altMatch[1] : "";
      const duoLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "[/duo]") {
        duoLines.push(lines[i]);
        i++;
      }
      i++; // skip [/duo]
      blocks.push({ type: "duo", image, pos, alt, lines: duoLines, lineIndex: i });
      continue;
    }

    // CTA button
    const cta = parseCtaLine(line);
    if (cta) {
      blocks.push({ type: "cta", ...cta, lineIndex: i });
      i++;
      continue;
    }

    // Image
    const img = parseImageLine(line);
    if (img) {
      blocks.push({ type: "image", ...img, lineIndex: i, raw: line });
      i++;
      continue;
    }

    // Markdown table: line starts with | and next line has |---|
    if (line.startsWith("|") && i + 1 < lines.length && /^\|[\s\-|:]+\|$/.test(lines[i + 1].trim())) {
      const headers = line.split("|").slice(1, -1).map((s) => s.trim());
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i].split("|").slice(1, -1).map((s) => s.trim());
        rows.push(cells);
        i++;
      }
      blocks.push({ type: "table", headers, rows, lineIndex: i });
      continue;
    }

    // Blockquote (one or more consecutive `> ` lines)
    if (line.startsWith("> ") || line.trim() === ">") {
      const quoteLines: string[] = [];
      const startI = i;
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i].trim() === ">" || lines[i].trim() === "")) {
        if (lines[i].trim() === "") {
          // allow single empty line within blockquote — but stop if next line isn't a quote
          if (i + 1 < lines.length && (lines[i + 1].startsWith("> ") || lines[i + 1].trim() === ">")) {
            i++;
            continue;
          }
          break;
        }
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      // Decide variant: if any line starts with **bold**, treat as "highlight" (encadré); else "exergue"
      const variant: "exergue" | "highlight" = quoteLines.some((l) => /\*\*[^*]+\*\*/.test(l))
        ? "highlight"
        : "exergue";
      blocks.push({ type: "blockquote", lines: quoteLines, variant, lineIndex: startI });
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3), lineIndex: i });
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4), lineIndex: i });
      i++;
      continue;
    }

    // List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      const startI = i;
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "list", items, lineIndex: startI });
      continue;
    }

    // Empty
    if (line.trim() === "") {
      blocks.push({ type: "empty", lineIndex: i });
      i++;
      continue;
    }

    // Paragraph (mark first one for lettrine)
    const isFirst = !firstParagraphSet;
    if (isFirst) firstParagraphSet = true;
    blocks.push({ type: "paragraph", text: line, lineIndex: i, isFirst });
    i++;
  }

  return blocks;
}

/** Render a paragraph with an optional drop cap on the very first paragraph */
function renderParagraph(text: string, idx: number, withLettrine: boolean): React.ReactNode {
  if (!withLettrine || text.length < 2) {
    return (
      <p key={idx} className="text-slate-700 leading-[1.85] my-5 text-[1.05rem]">
        {renderInline(text, `p-${idx}`)}
      </p>
    );
  }
  // Find first letter (skip leading punctuation/whitespace)
  const match = text.match(/^(\W*)(\w)(.*)$/);
  if (!match) {
    return (
      <p key={idx} className="text-slate-700 leading-[1.85] my-5 text-[1.05rem]">
        {renderInline(text, `p-${idx}`)}
      </p>
    );
  }
  const [, prefix, firstChar, rest] = match;
  return (
    <p key={idx} className="text-slate-700 leading-[1.85] my-5 text-[1.05rem] blog-lettrine-paragraph">
      {prefix}
      <span className="blog-lettrine">{firstChar}</span>
      {renderInline(rest, `p-${idx}`)}
    </p>
  );
}

/** Render parsed blocks to React elements */
export function renderBlocks(blocks: MarkdownBlock[], options: { withLettrine?: boolean } = {}): React.ReactNode[] {
  const allowLettrine = options.withLettrine !== false;
  const visible = blocks.filter((b) => b.type !== "empty");
  const elements: React.ReactNode[] = [];

  for (let idx = 0; idx < visible.length; idx++) {
    const block = visible[idx];
    const prevBlock = idx > 0 ? visible[idx - 1] : null;

    if (
      block.type !== "image" &&
      prevBlock?.type === "image" &&
      prevBlock.attrs.float
    ) {
      elements.push(<div key={`clear-${idx}`} className="clear-both" />);
    }

    switch (block.type) {
      case "image": {
        const { containerClass, style } = getImageStyles(block.attrs);
        elements.push(
          <figure key={idx} className={containerClass} style={style}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt}
              className="w-full h-auto"
              loading="lazy"
            />
            {block.alt && (
              <figcaption className="text-xs text-slate-500 text-center mt-3 italic tracking-wide">
                {block.alt}
              </figcaption>
            )}
          </figure>
        );
        break;
      }

      case "cta": {
        const href = block.slug === "produits" ? "/produits" : `/produits/${block.slug}`;
        elements.push(
          <div key={idx} className="my-10 text-center clear-both">
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-[#0f172a] text-white hover:bg-[#1e293b] font-medium tracking-[0.15em] px-8 py-4 transition-colors text-xs uppercase"
            >
              {block.text}
              <ArrowRight size={14} />
            </Link>
          </div>
        );
        break;
      }

      case "h2":
        elements.push(
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-display font-semibold text-slate-900 mt-16 mb-5 clear-both tracking-tight"
          >
            {block.text}
          </h2>
        );
        break;

      case "h3":
        elements.push(
          <h3
            key={idx}
            className="text-lg sm:text-xl font-display font-semibold text-slate-900 mt-10 mb-3 clear-both tracking-tight"
          >
            {block.text}
          </h3>
        );
        break;

      case "list":
        elements.push(
          <ul key={idx} className="list-none pl-0 space-y-3 my-6">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="text-slate-700 leading-[1.75] text-[1.05rem] pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[0.85em] before:w-3 before:h-px before:bg-[#8b2d2d]"
              >
                {renderInline(item, `li-${idx}-${i}`)}
              </li>
            ))}
          </ul>
        );
        break;

      case "paragraph":
        elements.push(renderParagraph(block.text, idx, allowLettrine && !!block.isFirst));
        break;

      case "blockquote": {
        if (block.variant === "highlight") {
          // Encadré premium (bloc avec gras dedans, ex : désambiguïsation)
          elements.push(
            <aside
              key={idx}
              className="my-10 border-l-2 border-[#8b2d2d] bg-[#f4f1ec] px-6 py-5 clear-both"
            >
              {block.lines.map((l, i) => (
                <p
                  key={i}
                  className="text-slate-800 leading-relaxed text-[0.98rem] my-1"
                >
                  {renderInline(l, `bq-${idx}-${i}`)}
                </p>
              ))}
            </aside>
          );
        } else {
          // Exergue éditorial : phrase clé sortie de la colonne
          elements.push(
            <blockquote
              key={idx}
              className="my-12 -mx-2 sm:-mx-8 px-6 py-2 border-l-[3px] border-[#8b2d2d] clear-both"
            >
              {block.lines.map((l, i) => (
                <p
                  key={i}
                  className="text-xl sm:text-2xl font-display italic text-slate-800 leading-snug"
                >
                  {renderInline(l, `bq-${idx}-${i}`)}
                </p>
              ))}
            </blockquote>
          );
        }
        break;
      }

      case "table":
        elements.push(
          <div key={idx} className="my-10 overflow-x-auto clear-both">
            <table className="w-full border-collapse text-[0.95rem]">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  {block.headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left font-semibold text-slate-900 py-3 px-3 tracking-wide"
                    >
                      {renderInline(h, `th-${idx}-${i}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-slate-200 hover:bg-[#faf8f5] transition-colors"
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-3 px-3 text-slate-700 align-top">
                        {renderInline(cell, `td-${idx}-${ri}-${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;

      case "atelier":
        elements.push(
          <aside
            key={idx}
            className="my-12 bg-[#f4f1ec] border-l-4 border-[#8b2d2d] px-6 py-6 sm:px-8 sm:py-7 clear-both"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#8b2d2d] font-semibold mb-3">
              Le geste de l&apos;artisan
            </p>
            {block.lines
              .filter((l) => l.trim() !== "")
              .filter((l) => !l.match(/^\*\*Le geste de l['']artisan\*\*$/i))
              .map((l, i) => (
                <p key={i} className="text-slate-800 leading-[1.75] text-[1rem] my-2">
                  {renderInline(l, `at-${idx}-${i}`)}
                </p>
              ))}
          </aside>
        );
        break;

      case "compare":
        elements.push(
          <div
            key={idx}
            className="my-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 clear-both"
          >
            {block.columns.map((col, ci) => (
              <div key={ci} className="bg-white p-6 sm:p-7">
                {col
                  .filter((l) => l.trim() !== "")
                  .map((l, li) => {
                    if (l.startsWith("- ") || l.startsWith("* ")) {
                      return (
                        <p key={li} className="text-slate-700 leading-relaxed pl-4 relative my-2 text-[0.98rem] before:content-[''] before:absolute before:left-0 before:top-[0.85em] before:w-2 before:h-px before:bg-[#8b2d2d]">
                          {renderInline(l.slice(2), `cmp-${idx}-${ci}-${li}`)}
                        </p>
                      );
                    }
                    if (/^\*\*[^*]+\*\*$/.test(l.trim())) {
                      return (
                        <p
                          key={li}
                          className="font-display text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200"
                        >
                          {l.trim().slice(2, -2)}
                        </p>
                      );
                    }
                    return (
                      <p key={li} className="text-slate-700 leading-relaxed my-2 text-[0.98rem]">
                        {renderInline(l, `cmp-${idx}-${ci}-${li}`)}
                      </p>
                    );
                  })}
              </div>
            ))}
          </div>
        );
        break;

      case "chiffre":
        elements.push(
          <div
            key={idx}
            className="my-14 bg-[#f4f1ec] py-10 px-6 text-center clear-both"
          >
            <p className="font-display text-5xl sm:text-6xl font-bold text-[#8b2d2d] leading-none mb-3 tracking-tight">
              {block.value}
            </p>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-600">
              {block.label}
            </p>
          </div>
        );
        break;

      case "duo": {
        const imageOnLeft = block.pos === "left";
        const cleanedLines = block.lines.filter((l) => l.trim() !== "");
        elements.push(
          <div
            key={idx}
            className="blog-duo-full my-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 lg:gap-24 items-center clear-both"
          >
            {imageOnLeft && block.image && (
              <figure className="relative aspect-[4/3] order-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.image}
                  alt={block.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </figure>
            )}
            <div className={`flex flex-col justify-center ${imageOnLeft ? "order-2 sm:pl-2" : "order-2 sm:order-1 sm:pr-2"}`}>
              {cleanedLines.map((l, i) => {
                if (/^\*\*[^*]+\*\*$/.test(l.trim())) {
                  return (
                    <h3
                      key={i}
                      className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mb-5 leading-tight tracking-tight"
                    >
                      {l.trim().slice(2, -2)}
                    </h3>
                  );
                }
                if (/^[A-ZÀ-Ÿ\s'’-]{6,}$/.test(l.trim()) && !l.includes("**")) {
                  return (
                    <p
                      key={i}
                      className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3"
                    >
                      {l.trim()}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-slate-700 leading-[1.75] text-[1.02rem] my-3"
                  >
                    {renderInline(l, `duo-${idx}-${i}`)}
                  </p>
                );
              })}
            </div>
            {!imageOnLeft && block.image && (
              <figure className="relative aspect-[4/3] order-1 sm:order-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.image}
                  alt={block.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </figure>
            )}
          </div>
        );
        break;
      }

      case "hr":
        elements.push(
          <div key={idx} className="my-14 flex items-center justify-center clear-both" aria-hidden="true">
            <span className="block w-12 h-px bg-slate-300" />
          </div>
        );
        break;
    }
  }

  elements.push(<div key="clear-end" className="clear-both" />);
  return elements;
}

/** Public render entry point */
export function renderMarkdownContent(content: string, options: { withLettrine?: boolean } = {}): React.ReactNode[] {
  const blocks = parseMarkdownBlocks(content);
  return renderBlocks(blocks, options);
}
