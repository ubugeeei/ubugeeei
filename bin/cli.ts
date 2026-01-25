#!/usr/bin/env node

// ANSI escape codes
const ESC = "\x1B";
const OSC = "\x1B]";
const BEL = "\x07";
const RESET = `${ESC}[0m`;
const BOLD = `${ESC}[1m`;
const DIM = `${ESC}[2m`;

const rgb = (r: number, g: number, b: number) => `${ESC}[38;2;${r};${g};${b}m`;

// Color palette - Vue.js inspired with modern touch
const COLORS = {
  // Vue.js green
  vue: rgb(66, 184, 131),
  vueDark: rgb(52, 152, 108),
  vueLight: rgb(100, 207, 159),

  // Accent colors
  cyan: rgb(0, 200, 220),
  orange: rgb(255, 160, 70),
  pink: rgb(255, 100, 150),
  purple: rgb(180, 120, 255),
  yellow: rgb(255, 215, 0),

  // Neutral
  white: rgb(255, 255, 255),
  gray: rgb(150, 150, 150),
  darkGray: rgb(80, 80, 80),
  border: rgb(66, 184, 131),
};

// Gradient colors for name
const GRADIENT = [
  rgb(66, 184, 131), // Vue green
  rgb(60, 170, 140),
  rgb(50, 160, 160),
  rgb(40, 150, 180),
  rgb(30, 140, 200),
  rgb(20, 130, 220),
  rgb(80, 120, 240),
  rgb(140, 110, 255),
];

function gradientText(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const colorIndex = Math.floor((i / text.length) * GRADIENT.length);
    result += GRADIENT[colorIndex] + text[i];
  }
  return result + RESET;
}

const link = (url: string, text: string) => `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;

const messages = {
  en: {
    name: "ubugeeei",
    nickname: "もののけ王",
    tagline: "うにをくらえ",
    uni: "🦀彡..。o",
    interests: "Jazz, Art, Compiler, Vue",
    memberOf: "Member of",
    author: "Author of",
    kingOf: "King of",
    chiefEngineerOf: "Chief Engineer of",
    contribute: "Contribute",
    blog: "Blog",
  },
  ja: {
    name: "ubugeeei",
    nickname: "もののけ王",
    tagline: "うにをくらえ",
    uni: "🦀彡..。o",
    interests: "Jazz, Art, Compiler, Vue",
    memberOf: "Member of",
    author: "Author of",
    kingOf: "King of",
    chiefEngineerOf: "Chief Engineer of",
    contribute: "Contribute",
    blog: "Blog",
  },
};

function detectLocale(): "en" | "ja" {
  const args = process.argv.slice(2);
  if (args.includes("--ja") || args.includes("-j") || args.includes("--japanese")) return "ja";
  if (args.includes("--en") || args.includes("-e") || args.includes("--english")) return "en";
  if (
    (process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || "")
      .toLowerCase()
      .startsWith("ja")
  )
    return "ja";
  return "en";
}

const projects = [
  { name: "chibivue", url: "https://github.com/chibivue-land/chibivue" },
  {
    name: "reading-vuejs-core-vapor",
    url: "https://github.com/ubugeeei/reading-vuejs-core-vapor",
  },
  { name: "vize", url: "https://github.com/ubugeeei/vize" },
  { name: "ox-content", url: "https://github.com/ubugeeei/ox-content" },
  { name: "relanote", url: "https://github.com/ubugeeei/relanote" },
  { name: "learn.nuxt.com (ja)", url: "https://github.com/nuxt/learn.nuxt.com" },
  {
    name: "jp-vue-companies",
    url: "https://github.com/chibivue-land/japanese-companies-using-vuejs",
  },
];

const contributes = [
  { name: "vuejs/core (mainly vapor)", url: "https://github.com/vuejs/core" },
  { name: "oxc", url: "https://github.com/oxc-project/oxc" },
  { name: "vuefes", url: "https://github.com/vuejs-jp/vuefes-2025" },
];

function getDisplayWidth(str: string): number {
  // eslint-disable-next-line no-control-regex -- ANSI escape sequence stripping requires control characters
  const clean = str.replace(/\x1b\[[0-9;]*m|\x1b\]8;;[^\x07]*\x07/g, "");
  let width = 0;
  for (const char of clean) {
    const code = char.codePointAt(0) || 0;
    if (
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0x9fff) ||
      (code >= 0xac00 && code <= 0xd7af) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe1f) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f300 && code <= 0x1f9ff) ||
      (code >= 0x20000 && code <= 0x2ffff)
    )
      width += 2;
    else width += 1;
  }
  return width;
}

function padRight(str: string, targetWidth: number): string {
  const padding = targetWidth - getDisplayWidth(str);
  return str + " ".repeat(Math.max(0, padding));
}

const WIDTH = 62;
const INNER_WIDTH = WIDTH - 4;

function createLine(content: string): string {
  return `${COLORS.border}│${RESET} ${padRight(content, INNER_WIDTH)} ${COLORS.border}│${RESET}`;
}

function createEmptyLine(): string {
  return `${COLORS.border}│${RESET}${" ".repeat(WIDTH - 2)}${COLORS.border}│${RESET}`;
}

function createSeparator(): string {
  return `${COLORS.border}├${"─".repeat(WIDTH - 2)}┤${RESET}`;
}

function main() {
  const t = messages[detectLocale()];

  const topBorder = `${COLORS.border}╭${"─".repeat(WIDTH - 2)}╮${RESET}`;
  const bottomBorder = `${COLORS.border}╰${"─".repeat(WIDTH - 2)}╯${RESET}`;

  const projectLinks = projects.map((p) => link(p.url, COLORS.cyan + p.name + RESET));
  const contributeLinks = contributes.map((p) => link(p.url, COLORS.purple + p.name + RESET));

  const lines = [
    "",
    topBorder,
    createEmptyLine(),
    createLine(`${BOLD}${gradientText(t.name)}${RESET}  ${COLORS.gray}${t.nickname}${RESET}`),
    createLine(`${COLORS.orange}${t.tagline}${RESET}  ${t.uni}`),
    createLine(`${DIM}${COLORS.gray}${t.interests}${RESET}`),
    createEmptyLine(),
    createSeparator(),
    createEmptyLine(),
    createLine(`${COLORS.yellow}★${RESET} ${COLORS.white}${t.memberOf}${RESET}`),
    createLine(
      `  ${link("https://vuejs.org", COLORS.vue + BOLD + "Vue.js" + RESET)}  ${link("https://vuejs-jp.org", COLORS.vue + "Vue.js Japan" + RESET)}`,
    ),
    createEmptyLine(),
    createLine(`${COLORS.pink}♛${RESET} ${COLORS.white}${t.kingOf}${RESET}`),
    createLine(`  ${link("https://chibivue.land", COLORS.cyan + "chibivue.land" + RESET)}`),
    createEmptyLine(),
    createLine(`${COLORS.orange}⚙${RESET} ${COLORS.white}${t.chiefEngineerOf}${RESET}`),
    createLine(
      `  ${link("https://github.com/mates-system", COLORS.cyan + "@mates-system" + RESET)}`,
    ),
    createEmptyLine(),
    createSeparator(),
    createEmptyLine(),
    createLine(`${COLORS.vue}✦${RESET} ${COLORS.white}${t.author}${RESET}`),
    createLine(`  ${projectLinks.slice(0, 2).join(", ")}`),
    createLine(`  ${projectLinks.slice(2, 4).join(", ")}`),
    createLine(`  ${projectLinks.slice(4, 6).join(", ")}`),
    createLine(`  ${projectLinks.slice(6).join(", ")}`),
    createEmptyLine(),
    createLine(`${COLORS.purple}◈${RESET} ${COLORS.white}${t.contribute}${RESET}`),
    createLine(`  ${contributeLinks.join(", ")}`),
    createEmptyLine(),
    createLine(`${COLORS.cyan}✎${RESET} ${COLORS.white}${t.blog}${RESET}`),
    createLine(`  ${link("https://wtrclred.io", COLORS.cyan + "wtrclred.io" + RESET)}`),
    createEmptyLine(),
    createSeparator(),
    createEmptyLine(),
    createLine(
      `${COLORS.white}GitHub${RESET}   ${link("https://github.com/ubugeeei", COLORS.gray + "github.com/ubugeeei" + RESET)}`,
    ),
    createLine(
      `${COLORS.white}Twitter${RESET}  ${link("https://x.com/ubugeeei", COLORS.gray + "@ubugeeei" + RESET)}`,
    ),
    createLine(
      `${COLORS.white}Discord${RESET}  ${link("https://discord.com/users/ubugeeei", COLORS.gray + "ubugeeei" + RESET)}`,
    ),
    createLine(
      `${COLORS.pink}Sponsor${RESET}  ${link("https://github.com/sponsors/ubugeeei", COLORS.pink + "github.com/sponsors/ubugeeei" + RESET)}`,
    ),
    createEmptyLine(),
    bottomBorder,
    "",
  ];

  console.log(lines.join("\n"));
}

main();
