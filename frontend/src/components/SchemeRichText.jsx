import React from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Safe, zero-HTML-injection Markdown renderer for verified myScheme rich text.
 * Supports mode headers ([Online]/[Offline]), blockquotes (> ...), bullet lists (- / *),
 * ordered lists (1. / 1) / (i)), bold (**...**), markdown links ([label](url)),
 * and auto-linked https:// URLs.
 */

const INLINE_TOKEN_RE =
  /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s<>"')\]]+))/g;

function renderInline(text, keyPrefix) {
  if (!text) return null;
  const parts = [];
  let lastIndex = 0;
  let match;
  let idx = 0;

  INLINE_TOKEN_RE.lastIndex = 0;
  while ((match = INLINE_TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // [label](https://...)
      const isUrlLabel = /^https?:\/\//i.test(match[2].trim()) || !match[2].includes(" ");
      parts.push(
        <a
          key={`${keyPrefix}-ml-${idx++}`}
          href={match[3]}
          target="_blank"
          rel="noreferrer"
          data-cursor="open"
          className={`link-underline inline font-heading font-semibold text-teal-ink [overflow-wrap:anywhere] ${
            isUrlLabel ? "break-all" : "break-words"
          }`}
        >
          {match[2]}
          <ArrowUpRight className="ml-0.5 inline h-3 w-3 shrink-0 align-baseline" aria-hidden="true" />
        </a>
      );
    } else if (match[4]) {
      // **bold**
      const isTeBold = /[\u0C00-\u0C7F]/.test(match[4]);
      parts.push(
        <strong
          key={`${keyPrefix}-b-${idx++}`}
          className={`font-semibold text-navy-950 ${isTeBold ? "font-telugu" : "font-heading"}`}
        >
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // bare https:// URL
      let rawUrl = match[5];
      let trailing = "";
      while (/[.,;:!?]$/.test(rawUrl)) {
        trailing = rawUrl.slice(-1) + trailing;
        rawUrl = rawUrl.slice(0, -1);
      }
      parts.push(
        <React.Fragment key={`${keyPrefix}-u-${idx++}`}>
          <a
            href={rawUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="open"
            className="link-underline break-all font-heading font-semibold text-teal-ink"
          >
            {rawUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    lastIndex = INLINE_TOKEN_RE.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function parseBlocks(rawText) {
  const lines = String(rawText || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Mode pill like [Online], [Offline], [Online - via CSC]
    if (/^\[(Online|Offline|Online\s*-\s*via\s*CSC|Both)\]$/i.test(trimmed)) {
      blocks.push({ type: "mode", text: trimmed.slice(1, -1) });
      i++;
      continue;
    }

    // Blockquote lines starting with >
    if (trimmed.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const cleaned = lines[i].trim().replace(/^>\s?/, "").trim();
        if (cleaned) quoteLines.push(cleaned);
        i++;
      }
      if (quoteLines.length > 0) {
        blocks.push({ type: "quote", lines: quoteLines });
      }
      continue;
    }

    // Bullet list (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list (1. or 1) )
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Markdown heading (### or standalone **Heading**)
    if (/^#{1,6}\s+/.test(trimmed)) {
      blocks.push({ type: "heading", text: trimmed.replace(/^#{1,6}\s+/, "").replace(/^\*\*|\*\*$/g, "").trim() });
      i++;
      continue;
    }

    if (/^\*\*[^*]{3,110}\*\*:?$/.test(trimmed)) {
      blocks.push({ type: "heading", text: trimmed.replace(/^\*\*|\*\*:?$/g, "").trim() });
      i++;
      continue;
    }

    // Paragraph (group consecutive plain lines)
    const paraLines = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !/^#{1,6}\s+/.test(lines[i].trim()) &&
      !/^\[(Online|Offline|Online\s*-\s*via\s*CSC|Both)\]$/i.test(lines[i].trim()) &&
      !/^\*\*[^*]{3,110}\*\*:?$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }

  return blocks;
}

export default function SchemeRichText({ text, className = "" }) {
  if (!text || !String(text).trim()) return null;
  const blocks = parseBlocks(text);

  return (
    <div className={`space-y-3.5 font-body text-[0.94rem] leading-relaxed text-navy-900/85 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === "mode") {
          return (
            <div key={bIdx} className="pt-1">
              <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal-mist/70 px-3.5 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-teal-ink">
                Application Mode · {block.text}
              </span>
            </div>
          );
        }

        if (block.type === "heading") {
          const isTeHeading = /[\u0C00-\u0C7F]/.test(block.text);
          return (
            <h4
              key={bIdx}
              className={`pt-2 text-base font-bold text-navy-950 ${
                isTeHeading ? "font-telugu" : "font-heading"
              }`}
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "quote") {
          return (
            <div
              key={bIdx}
              className="space-y-1.5 rounded-2xl border-l-[3px] border-teal-deep bg-frost/90 px-4 py-3 text-sm text-navy-950"
            >
              {block.lines.map((line, lIdx) => (
                <p key={lIdx}>{renderInline(line, `q-${bIdx}-${lIdx}`)}</p>
              ))}
            </div>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={bIdx} className="space-y-2 pl-1">
              {block.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 break-words">
                    {renderInline(item, `ul-${bIdx}-${idx}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={bIdx} className="space-y-2.5 pl-0">
              {block.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-950 font-heading text-[0.65rem] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1 break-words">
                    {renderInline(item, `ol-${bIdx}-${idx}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={bIdx} className="break-words">
            {renderInline(block.text, `p-${bIdx}`)}
          </p>
        );
      })}
    </div>
  );
}
