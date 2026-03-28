export type Locale = "en" | "ja";

export const messages = {
  en: {
    name: "ubugeeei",
    nickname: "もののけ王",
    tagline: "うにをくらえ",
    location: "Tokyo 🇯🇵",
    quote: "発言は全て現代アートだよ( ◠‿◠ )",
    taskSurface: "Tasks / recent work / PR requests",
    uni: "✹ 🦀 🦆 彡..。o",
    interests: [
      "Web Frontend",
      "Vue",
      "Design",
      "Art",
      "Rust",
      "Performance Tuning",
      "Programming Languages",
      "Language Processors",
      "OS and Browser Systems Programming",
      "Engineering Philosophy",
      "OSS",
      "Jazz",
      "Twitter",
    ],
    creator: "Creator of",
    contribute: "Contributing to",
    selectedPosts: "Selected Posts",
  },
  ja: {
    name: "ubugeeei",
    nickname: "もののけ王",
    tagline: "うにをくらえ",
    location: "Tokyo 🇯🇵",
    quote: "発言は全て現代アートだよ( ◠‿◠ )",
    taskSurface: "Tasks / recent work / PR requests",
    uni: "✹ 🦀 🦆 彡..。o",
    interests: [
      "Web Frontend",
      "Vue",
      "Design",
      "Art",
      "Rust",
      "Performance Tuning",
      "Programming Languages",
      "Language Processors",
      "OS and Browser Systems Programming",
      "Engineering Philosophy",
      "OSS",
      "Jazz",
      "Twitter",
    ],
    creator: "Creator of",
    contribute: "Contributing to",
    selectedPosts: "Selected Posts",
  },
};

export type MessageBundle = (typeof messages)["en"];

export type Project = {
  name: string;
  url: string;
  description: string;
};

export type BlogPost = {
  title: string;
  url: string;
};

export type Contribution = {
  name: string;
  url: string;
};

export function detectLocale(): Locale {
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

export const projects: Project[] = [
  {
    name: "chibivue",
    url: "https://github.com/chibivue-land/chibivue",
    description:
      "A minimal Vue.js implementation and online book for learning Vue.js step by step.",
  },
  {
    name: "Vize",
    url: "https://github.com/ubugeeei/vize",
    description:
      "Compiler, linter, typechecker, formatter, story system, and lsp for Vue.js in Rust.",
  },
  {
    name: "Ox Content",
    url: "https://github.com/ubugeeei/ox-content",
    description:
      "Framework-agnostic documentation tooling with a high-performance Markdown parser in Rust.",
  },
  {
    name: "ubugeeei/start",
    url: "https://github.com/ubugeeei/start",
    description: "Opinionated defaults and engineering rules for AI-assisted project creation.",
  },
  {
    name: "ubugeeei/style-guide.vue",
    url: "https://github.com/ubugeeei/style-guide.vue",
    description: "My personal Vue style guide and engineering preferences.",
  },
  {
    name: "ubugeeei/origin",
    url: "https://github.com/ubugeeei/origin",
    description:
      "An opinionated personal macOS workstation configuration built with Nix, nix-darwin, and Home Manager.",
  },
  {
    name: "ubugeeei-taskgraph",
    url: "https://github.com/ubugeeei-taskgraph",
    description:
      "A task management system with a public vault, shared config, and a PR-based request surface.",
  },
  {
    name: "reading-vuejs-core-vapor",
    url: "https://github.com/ubugeeei/reading-vuejs-core-vapor",
    description: "A book for reading and understanding the Vue Vapor implementation.",
  },
  {
    name: "fwgsl",
    url: "https://github.com/ubugeeei/fwgsl",
    description: "A pure functional language for WebGPU that compiles to WGSL.",
  },
  {
    name: "relanote",
    url: "https://github.com/ubugeeei/relanote",
    description: "A music programming language based on relative intervals.",
  },
  {
    name: "Vapor Moon",
    url: "https://github.com/ubugeeei/vapor-moon",
    description:
      "A MoonBit-first SFC toolchain with Vue-like authoring and direct DOM / SSR output.",
  },
  {
    name: "Mbt on Rails",
    url: "https://github.com/ubugeeei/mbt-on-rails",
    description: "A MoonBit-first, Rails-inspired framework skeleton.",
  },
];

export const blogPosts: BlogPost[] = [
  { title: "Characterize Vue.js", url: "https://wtrclred.io/en/posts/07" },
  { title: "React is React, just.", url: "https://wtrclred.io/en/posts/01" },
  { title: "React is React, just. Part 2", url: "https://wtrclred.io/en/posts/08" },
  { title: "What is Vue.js? It's just a language lol", url: "https://wtrclred.io/en/posts/05" },
  { title: "Vue.js is not Easy. It is Approachable.", url: "https://wtrclred.io/en/posts/06" },
  {
    title: "Signals and Signals. And Retained UI.",
    url: "https://wtrclred.io/en/posts/12",
  },
];

export const contributes: Contribution[] = [
  { name: "Vite+", url: "https://github.com/voidzero-dev/vite-plus" },
  { name: "vite-task", url: "https://github.com/voidzero-dev/vite-task" },
  { name: "oxc", url: "https://github.com/oxc-project/oxc" },
];
