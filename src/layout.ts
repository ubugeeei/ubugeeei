import { COLORS, RESET } from "./styles";

const ESC_CHAR = String.fromCharCode(0x1b);
const BEL_CHAR = String.fromCharCode(0x07);
const OSC_LINK_PREFIX = `${ESC_CHAR}]8;;`;
const OSC_LINK_CLOSE = `${OSC_LINK_PREFIX}${BEL_CHAR}`;
const ansiPattern = new RegExp(
  `${ESC_CHAR}\\[[0-9;]*m|${ESC_CHAR}\\]8;;[^${BEL_CHAR}]*${BEL_CHAR}`,
  "g",
);
const graphemeSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

type DisplayToken =
  | { type: "ansi"; value: string }
  | { type: "grapheme"; value: string; width: number };

function isZeroWidthCodePoint(code: number): boolean {
  return (
    code === 0x200d ||
    (code >= 0x0300 && code <= 0x036f) ||
    (code >= 0xfe00 && code <= 0xfe0f) ||
    (code >= 0xe0100 && code <= 0xe01ef)
  );
}

function isRegionalIndicator(code: number): boolean {
  return code >= 0x1f1e6 && code <= 0x1f1ff;
}

function isEmojiCodePoint(code: number): boolean {
  return (
    (code >= 0x1f000 && code <= 0x1faff) ||
    (code >= 0x2600 && code <= 0x26ff) ||
    (code >= 0x2700 && code <= 0x27bf)
  );
}

function isWideCodePoint(code: number): boolean {
  return (
    (code >= 0x1100 && code <= 0x115f) ||
    (code >= 0x2e80 && code <= 0x9fff) ||
    (code >= 0xac00 && code <= 0xd7af) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0xfe10 && code <= 0xfe1f) ||
    (code >= 0xfe30 && code <= 0xfe6f) ||
    (code >= 0xff00 && code <= 0xff60) ||
    (code >= 0xffe0 && code <= 0xffe6) ||
    (code >= 0x20000 && code <= 0x2ffff)
  );
}

function isTerminalWideSymbol(code: number): boolean {
  return code === 0x2022 || code === 0x203f || code === 0x25e0 || code === 0x2739;
}

function getGraphemeWidth(segment: string): number {
  const codePoints = Array.from(segment, (char) => char.codePointAt(0) || 0);
  const visible = codePoints.filter((code) => !isZeroWidthCodePoint(code));

  if (visible.length === 0) {
    return 0;
  }

  if (visible.every(isRegionalIndicator)) {
    return 4;
  }

  if (codePoints.some(isEmojiCodePoint)) {
    return 2;
  }

  if (visible.some(isWideCodePoint)) {
    return 2;
  }

  if (visible.some(isTerminalWideSymbol)) {
    return 2;
  }

  return 1;
}

function getConservativeGraphemeWidth(segment: string): number {
  const codePoints = Array.from(segment, (char) => char.codePointAt(0) || 0);
  const visible = codePoints.filter((code) => !isZeroWidthCodePoint(code));

  if (visible.length === 0) {
    return 0;
  }

  if (visible.every(isRegionalIndicator)) {
    return 4;
  }

  if (visible.every((code) => code >= 0x20 && code <= 0x7e)) {
    return 1;
  }

  return 2;
}

function pushTextTokens(
  tokens: DisplayToken[],
  text: string,
  widthFn: (segment: string) => number = getGraphemeWidth,
): void {
  for (const { segment } of graphemeSegmenter.segment(text)) {
    tokens.push({ type: "grapheme", value: segment, width: widthFn(segment) });
  }
}

function tokenizeDisplayString(
  str: string,
  widthFn: (segment: string) => number = getGraphemeWidth,
): DisplayToken[] {
  const tokens: DisplayToken[] = [];
  let lastIndex = 0;

  for (const match of str.matchAll(ansiPattern)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      pushTextTokens(tokens, str.slice(lastIndex, index), widthFn);
    }

    tokens.push({ type: "ansi", value: match[0] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < str.length) {
    pushTextTokens(tokens, str.slice(lastIndex), widthFn);
  }

  return tokens;
}

function getDisplayWidthWith(
  str: string,
  widthFn: (segment: string) => number = getGraphemeWidth,
): number {
  let width = 0;

  for (const token of tokenizeDisplayString(str, widthFn)) {
    if (token.type === "grapheme") {
      width += token.width;
    }
  }

  return width;
}

export function getDisplayWidth(str: string): number {
  return getDisplayWidthWith(str);
}

function trimToWidthWith(
  str: string,
  targetWidth: number,
  widthFn: (segment: string) => number = getGraphemeWidth,
): string {
  let result = "";
  let width = 0;
  let hyperlinkOpen = false;

  for (const token of tokenizeDisplayString(str, widthFn)) {
    if (token.type === "ansi") {
      result += token.value;

      if (token.value.startsWith(OSC_LINK_PREFIX)) {
        hyperlinkOpen = token.value !== OSC_LINK_CLOSE;
      }

      continue;
    }

    if (width + token.width > targetWidth) {
      if (hyperlinkOpen) {
        result += OSC_LINK_CLOSE;
      }

      return result + RESET;
    }

    result += token.value;
    width += token.width;
  }

  return result;
}

export function trimToWidth(str: string, targetWidth: number): string {
  return trimToWidthWith(str, targetWidth);
}

function padRightWith(
  str: string,
  targetWidth: number,
  widthFn: (segment: string) => number = getGraphemeWidth,
): string {
  const fitted = trimToWidthWith(str, targetWidth, widthFn);
  const padding = targetWidth - getDisplayWidthWith(fitted, widthFn);
  return fitted + " ".repeat(Math.max(0, padding));
}

export function padRight(str: string, targetWidth: number): string {
  return padRightWith(str, targetWidth);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const WIDTH = clamp((process.stdout.columns ?? 92) - 2, 78, 100);
const FRAME_PADDING_LEFT = 1;
const FRAME_PADDING_RIGHT = 2;
export const INNER_WIDTH = WIDTH - 2 - FRAME_PADDING_LEFT - FRAME_PADDING_RIGHT;
export const COLUMN_GAP = 3;
export const RIGHT_COLUMN_WIDTH = clamp(Math.floor(INNER_WIDTH * 0.38), 32, 38);
export const LEFT_COLUMN_WIDTH = INNER_WIDTH - COLUMN_GAP - RIGHT_COLUMN_WIDTH;

export function createLine(content = "", safetyMargin = 0): string {
  const contentWidth = Math.max(0, INNER_WIDTH - safetyMargin);

  return `${COLORS.border}│${RESET}${" ".repeat(FRAME_PADDING_LEFT)}${padRight(content, contentWidth)}${" ".repeat(FRAME_PADDING_RIGHT + safetyMargin)}${COLORS.border}│${RESET}`;
}

export function createConservativeLine(content = "", safetyMargin = 0): string {
  const contentWidth = Math.max(0, INNER_WIDTH - safetyMargin);

  return `${COLORS.border}│${RESET}${" ".repeat(FRAME_PADDING_LEFT)}${padRightWith(content, contentWidth, getConservativeGraphemeWidth)}${" ".repeat(FRAME_PADDING_RIGHT + safetyMargin)}${COLORS.border}│${RESET}`;
}

export function createSplitSeparator(): string {
  return `${COLORS.border}├${"─".repeat(FRAME_PADDING_LEFT + LEFT_COLUMN_WIDTH + 1)}┬${"─".repeat(RIGHT_COLUMN_WIDTH + 1 + FRAME_PADDING_RIGHT)}┤${RESET}`;
}

export function createColumnLine(left = "", right = ""): string {
  return createLine(
    `${padRight(left, LEFT_COLUMN_WIDTH)} ${COLORS.darkGray}│${RESET} ${padRight(right, RIGHT_COLUMN_WIDTH)}`,
  );
}

export function wrapText(text: string, maxWidth: number): string[] {
  return wrapTextWith(text, maxWidth);
}

export function wrapTextConservative(text: string, maxWidth: number): string[] {
  return wrapTextWith(text, maxWidth, getConservativeGraphemeWidth);
}

function wrapTextWith(
  text: string,
  maxWidth: number,
  widthFn: (segment: string) => number = getGraphemeWidth,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (getDisplayWidthWith(candidate, widthFn) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (getDisplayWidthWith(word, widthFn) <= maxWidth) {
      current = word;
      continue;
    }

    let chunk = "";
    for (const char of word) {
      const chunkCandidate = chunk + char;
      if (getDisplayWidthWith(chunkCandidate, widthFn) <= maxWidth) {
        chunk = chunkCandidate;
        continue;
      }

      if (chunk) {
        lines.push(chunk);
      }
      chunk = char;
    }
    current = chunk;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export function wrapItems(items: string[], maxWidth: number, separator = " • "): string[] {
  const lines: string[] = [];
  let current = "";

  for (const item of items) {
    const candidate = current ? `${current}${separator}${item}` : item;
    if (getDisplayWidth(candidate) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = item;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export function splitTextAfterLead(
  text: string,
  leadPlain: string,
  width: number,
  restIndent: number,
): string[] {
  const words = text.split(" ");
  let firstText = "";
  let index = 0;

  while (index < words.length) {
    const candidate = firstText ? `${firstText} ${words[index]}` : words[index];
    const visible = `${leadPlain} ${candidate}`;
    if (getDisplayWidth(visible) <= width) {
      firstText = candidate;
      index += 1;
      continue;
    }
    break;
  }

  const restText = words.slice(index).join(" ");
  return [
    firstText,
    ...wrapText(restText, width - restIndent).map((line) => `${" ".repeat(restIndent)}${line}`),
  ];
}

export function createColumnBlock(leftLines: string[], rightLines: string[]): string[] {
  const total = Math.max(leftLines.length, rightLines.length);

  return Array.from({ length: total }, (_, index) =>
    createColumnLine(leftLines[index] ?? "", rightLines[index] ?? ""),
  );
}
