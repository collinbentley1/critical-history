const inlinePattern = /\[([^\]]+)]\(([^)]+)\)|\*([^*]+)\*/g;

export function splitMarkdownBlocks(markdown: string): string[] {
  return markdown
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function isSafeExternalHref(href: string): boolean {
  try {
    const url = new URL(href, "https://critical-history.local");
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

export function renderMarkdownInto(container: HTMLElement, markdown: string): void {
  const fragment = document.createDocumentFragment();

  for (const block of splitMarkdownBlocks(markdown)) {
    fragment.append(renderMarkdownBlock(block));
  }

  container.replaceChildren(fragment);
}

function renderMarkdownBlock(block: string): HTMLElement {
  const heading = block.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1]?.length === 1 ? "h2" : "h3";
    const element = document.createElement(level);
    appendInlineText(element, heading[2] ?? "");
    return element;
  }

  const bulletLines = block.split("\n").filter(Boolean);
  if (bulletLines.length > 0 && bulletLines.every((line) => line.trimStart().startsWith("* "))) {
    const list = document.createElement("ul");
    for (const line of bulletLines) {
      const item = document.createElement("li");
      appendInlineText(item, line.trimStart().slice(2));
      list.append(item);
    }
    return list;
  }

  const paragraph = document.createElement("p");
  appendInlineText(paragraph, block.replace(/\n/g, " "));
  return paragraph;
}

function appendInlineText(parent: HTMLElement, text: string): void {
  inlinePattern.lastIndex = 0;
  let cursor = 0;

  for (const match of text.matchAll(inlinePattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > cursor) {
      parent.append(document.createTextNode(text.slice(cursor, matchIndex)));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      parent.append(renderLink(match[1], match[2]));
    } else if (match[3] !== undefined) {
      const emphasis = document.createElement("em");
      emphasis.textContent = match[3];
      parent.append(emphasis);
    }

    cursor = matchIndex + match[0].length;
  }

  if (cursor < text.length) {
    parent.append(document.createTextNode(text.slice(cursor)));
  }
}

function renderLink(label: string, href: string): Node {
  if (!isSafeExternalHref(href)) {
    return document.createTextNode(label);
  }

  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.textContent = label;

  if (anchor.protocol === "http:" || anchor.protocol === "https:") {
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
  }

  return anchor;
}
