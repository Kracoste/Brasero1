import Link from "next/link";

/**
 * Parse image markdown with optional style attributes:
 * ![alt](url)
 * ![alt](url){width=50}
 * ![alt](url){width=50,float=right}
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

function getImageStyles(attrs: Record<string, string>) {
  const width = attrs.width ? `${attrs.width}%` : "100%";
  const float = attrs.float as "left" | "right" | undefined;

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
  // Centré / pleine largeur
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

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linkParts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        linkParts.push(part.slice(lastIndex, match.index));
      }
      linkParts.push(
        <Link
          key={`link-${idx}-${match.index}`}
          href={match[2]}
          className="text-[#8B4513] hover:underline font-medium"
        >
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }
    if (linkParts.length > 0) {
      if (lastIndex < part.length) {
        linkParts.push(part.slice(lastIndex));
      }
      return <span key={idx}>{linkParts}</span>;
    }
    return part;
  });
}

export type MarkdownBlock =
  | { type: "h2"; text: string; lineIndex: number }
  | { type: "h3"; text: string; lineIndex: number }
  | { type: "paragraph"; text: string; lineIndex: number }
  | { type: "list"; items: string[]; lineIndex: number }
  | { type: "image"; alt: string; src: string; attrs: Record<string, string>; lineIndex: number; raw: string }
  | { type: "empty"; lineIndex: number };

/** Parse markdown content into structured blocks */
export function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Image
    const img = parseImageLine(line);
    if (img) {
      blocks.push({ type: "image", ...img, lineIndex: i, raw: line });
      i++;
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

    // Paragraph
    blocks.push({ type: "paragraph", text: line, lineIndex: i });
    i++;
  }

  return blocks;
}

/** Render parsed blocks to React elements */
export function renderBlocks(blocks: MarkdownBlock[]): React.ReactNode[] {
  const visible = blocks.filter((b) => b.type !== "empty");
  const elements: React.ReactNode[] = [];

  for (let idx = 0; idx < visible.length; idx++) {
    const block = visible[idx];
    const prevBlock = idx > 0 ? visible[idx - 1] : null;

    // Clear floats when transitioning from a floated image to a non-image block
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
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </figure>
        );
        break;
      }
      case "h2":
        elements.push(
          <h2 key={idx} className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-12 mb-4 clear-both">
            {block.text}
          </h2>
        );
        break;
      case "h3":
        elements.push(
          <h3 key={idx} className="text-xl sm:text-2xl font-display font-semibold text-slate-900 mt-8 mb-3 clear-both">
            {block.text}
          </h3>
        );
        break;
      case "list":
        elements.push(
          <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
            {block.items.map((item, i) => (
              <li key={i} className="text-slate-700 leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        break;
      case "paragraph":
        elements.push(
          <p key={idx} className="text-slate-700 leading-relaxed my-4">
            {renderInline(block.text)}
          </p>
        );
        break;
    }
  }

  // Final clearfix
  elements.push(<div key="clear-end" className="clear-both" />);
  return elements;
}

/** Simple render function for public blog pages */
export function renderMarkdownContent(content: string): React.ReactNode[] {
  const blocks = parseMarkdownBlocks(content);
  return renderBlocks(blocks);
}
