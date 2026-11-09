import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const FORBIDDEN_TAG_BLOCK_REGEX =
  /<(script|iframe|object|embed|form|style|link|meta|svg|math|base|applet)\b[^>]*>[\s\S]*?<\/\1>/gi;

const FORBIDDEN_TAG_SELF_REGEX =
  /<\/?(script|iframe|object|embed|form|style|link|meta|svg|math|base|applet|input|button|textarea|select)\b[^>]*\/?>/gi;

const INLINE_EVENT_HANDLER_REGEX =
  /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

const DANGEROUS_URI_ATTR_REGEX =
  /\s+(href|src|xlink:href|action|formaction)\s*=\s*(?:"\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"]*"|'\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^']*'|(?:\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^\s>]*))/gi;

export function sanitizeRenderedHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(FORBIDDEN_TAG_BLOCK_REGEX, "")
    .replace(FORBIDDEN_TAG_SELF_REGEX, "")
    .replace(INLINE_EVENT_HANDLER_REGEX, "")
    .replace(DANGEROUS_URI_ATTR_REGEX, ' $1="#"');
}

export function sanitizeExternalUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return "";
  }
  return `https://${trimmed}`;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  const raw = marked.parse(md);
  const parsed = typeof raw === "string" ? raw : "";
  return sanitizeRenderedHtml(parsed);
}
