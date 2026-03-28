import {
  blogPosts,
  contributes,
  messages,
  projects,
  type BlogPost,
  type Contribution,
  type Locale,
  type Project,
} from "./content";
import { getDisplayWidth, wrapItems, wrapText } from "./layout";
import { link } from "./styles";

const PAGE_WIDTH = Math.min(process.stdout.columns ?? 80, 80);
const INDENT = "  ";
const BODY_WIDTH = Math.max(56, PAGE_WIDTH - getDisplayWidth(INDENT));
const MARK = "UBUGEEEI(1)";

const spaces = [
  { label: "king", text: "chibivue.land", url: "https://chibivue.land" },
  { label: "blog", text: "wtrclred.io", url: "https://wtrclred.io" },
] as const;

const links = [
  { label: "github", text: "ubugeeei", url: "https://github.com/ubugeeei" },
  { label: "twitter", text: "ubugeeei", url: "https://x.com/ubugeeei" },
  { label: "discord", text: "ubugeeei", url: "https://discord.com/users/ubugeeei" },
  {
    label: "sponsor",
    text: "sponsors/ubugeeei",
    url: "https://github.com/sponsors/ubugeeei",
  },
] as const;

const examples = [
  { text: "vuejs/vue-vapor", url: "https://github.com/vuejs/vue-vapor" },
  {
    text: "vuejs-jp/vuefes-2025-website",
    url: "https://github.com/vuejs-jp/vuefes-2025-website",
  },
] as const;

function formatHeader(): string {
  const gap = Math.max(2, PAGE_WIDTH - getDisplayWidth(MARK) * 2);
  return `${MARK}${" ".repeat(gap)}${MARK}`;
}

function formatSection(title: string, lines: string[]): string[] {
  return [title, ...lines, ""];
}

function wrapIndented(text: string, indent = INDENT, width = BODY_WIDTH): string[] {
  return wrapText(text, width).map((line) => `${indent}${line}`);
}

function formatProject(project: Project): string[] {
  return [
    `${INDENT}${link(project.url, project.name)}`,
    ...wrapIndented(project.description, `${INDENT}${INDENT}`),
  ];
}

function formatPost(post: BlogPost, index: number): string[] {
  const lead = `${index + 1}. `;
  const wrapped = wrapText(post.title, BODY_WIDTH - getDisplayWidth(lead));

  return wrapped.map((line, lineIndex) =>
    lineIndex === 0
      ? `${INDENT}${lead}${link(post.url, line)}`
      : `${INDENT}${" ".repeat(getDisplayWidth(lead))}${link(post.url, line)}`,
  );
}

function formatContribution(item: Contribution): string[] {
  return [`${INDENT}${link(item.url, item.name)}`];
}

function formatLabeledLink(label: string, text: string, url: string): string[] {
  return [`${INDENT}${label.padEnd(10)}${link(url, text)}`];
}

export function renderProfile(locale: Locale): string {
  const t = messages[locale];
  const roleLines = [
    `${INDENT}${link("https://vuejs.org/about/team.html", "Vue.js")} Core Team`,
    `${INDENT}${link("https://github.com/vuejs-jp", "Vue.js Japan User Group")} Core Staff`,
    `${INDENT}${link("https://github.com/voidzero-dev/vite-plus", "Vite+")} Core Contributor`,
    `${INDENT}${link("https://github.com/mates-inc", "株式会社メイツ")} Chief Engineer`,
  ];
  const interestLines = wrapItems(t.interests, BODY_WIDTH, ", ").map((line) => `${INDENT}${line}`);

  const lines = [
    formatHeader(),
    "",
    ...formatSection("NAME", [`${INDENT}ubugeeei - software engineer`]),
    ...formatSection("SYNOPSIS", [`${INDENT}npx ubugeeei`]),
    ...formatSection("PROFILE", [
      `${INDENT}${t.nickname}`,
      `${INDENT}${t.tagline}  ${t.uni}`,
      `${INDENT}${t.location}`,
      `${INDENT}${t.quote}`,
    ]),
    ...formatSection("ROLES", roleLines),
    ...formatSection("INTERESTS", interestLines),
    ...formatSection("TASK SURFACE", [
      ...wrapIndented(t.taskSurface),
      ...formatLabeledLink(
        "vault",
        "taskgraph/public-vault",
        "https://github.com/ubugeeei-taskgraph/public-vault",
      ),
    ]),
    ...formatSection("CREATOR OF", projects.flatMap(formatProject)),
    ...formatSection("SELECTED POSTS", blogPosts.flatMap(formatPost)),
    ...formatSection("CONTRIBUTING TO", contributes.flatMap(formatContribution)),
    ...formatSection(
      "SPACES",
      spaces.flatMap((item) => formatLabeledLink(item.label, item.text, item.url)),
    ),
    ...formatSection(
      "LINKS",
      links.flatMap((item) => formatLabeledLink(item.label, item.text, item.url)),
    ),
    ...formatSection(
      "EX",
      examples.map((item) => `${INDENT}${link(item.url, item.text)}`),
    ),
    formatHeader(),
    "",
  ];

  return lines.join("\n");
}
