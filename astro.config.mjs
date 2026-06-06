// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.prevail.sh",
  trailingSlash: "ignore",
  integrations: [
    starlight({
    title: "Prevail Docs",
    description:
      "A council of AI for life's hardest questions. Prevail runs Claude, Codex, Antigravity, and Ollama in parallel and a chair model writes the verdict. Local-first, markdown-native, free and open source.",
    tagline: "A council of AI for life's hardest questions.",
    logo: {
      src: "./src/assets/logo.png",
      alt: "Prevail",
      replacesTitle: false,
    },
    favicon: "/favicon.ico",
    head: [
      {
        tag: "meta",
        attrs: { property: "og:image", content: "https://docs.prevail.sh/og-image.png?v=2" },
      },
      {
        tag: "meta",
        attrs: { name: "twitter:image", content: "https://docs.prevail.sh/og-image.png?v=2" },
      },
      {
        tag: "meta",
        attrs: { name: "twitter:card", content: "summary_large_image" },
      },
      {
        tag: "meta",
        attrs: { name: "theme-color", content: "#0a0a0c" },
      },
      {
        tag: "link",
        attrs: {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
      },
      {
        tag: "link",
        attrs: {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
      },
      {
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500;600&display=swap",
        },
      },
    ],
    social: [
      {
        icon: "github",
        label: "GitHub",
        href: "https://github.com/fru-dev3/prevail",
      },
    ],
    editLink: {
      baseUrl: "https://github.com/fru-dev3/prevail-docs/edit/main/",
    },
    customCss: ["./src/styles/theme.css"],
    expressiveCode: {
      themes: ["github-dark", "github-light"],
      styleOverrides: {
        borderRadius: "0.5rem",
        codeFontFamily:
          "'Geist Mono', 'JetBrains Mono', 'SF Mono', Menlo, monospace",
      },
    },
    lastUpdated: true,
    pagination: true,
    sidebar: [
      {
        label: "Start here",
        items: [
          { label: "What is Prevail?", slug: "start/introduction" },
          { label: "Installation", slug: "start/installation" },
          { label: "Quickstart", slug: "start/quickstart" },
          { label: "Core concepts", slug: "start/concepts" },
        ],
      },
      {
        label: "The cockpit",
        items: [
          { label: "Layout & navigation", slug: "cockpit/layout" },
          { label: "Keyboard shortcuts", slug: "cockpit/keyboard" },
          { label: "Slash commands", slug: "cockpit/slash-commands" },
          { label: "The ConfigBar", slug: "cockpit/configbar" },
        ],
      },
      {
        label: "The council",
        items: [
          { label: "How the council works", slug: "council/overview" },
          { label: "Frameworks", slug: "council/frameworks" },
          { label: "Lenses", slug: "council/lenses" },
          { label: "Chair, verdicts & divergence", slug: "council/verdicts" },
        ],
      },
      {
        label: "The vault",
        items: [
          { label: "Vault structure", slug: "vault/structure" },
          { label: "Domains", slug: "vault/domains" },
          { label: "Skills", slug: "vault/skills" },
          { label: "Logs & journal", slug: "vault/logs-journal" },
          { label: "Syncing your vault", slug: "vault/sync" },
        ],
      },
      {
        label: "Connectors",
        items: [
          { label: "Connector overview", slug: "connectors/overview" },
          { label: "Using connectors", slug: "connectors/using" },
          { label: "Building a connector", slug: "connectors/building" },
        ],
      },
      {
        label: "Benchmarks",
        items: [
          { label: "The canonical benchmark", slug: "benchmarks/overview" },
          { label: "Running & scoring", slug: "benchmarks/running" },
        ],
      },
      {
        label: "Going further",
        items: [
          { label: "Telegram & your phone", slug: "advanced/telegram" },
          { label: "Scheduled briefings", slug: "advanced/briefings" },
          { label: "The MCP server", slug: "advanced/mcp" },
        ],
      },
      {
        label: "Desktop app",
        items: [
          { label: "Prevail Desktop", slug: "desktop/overview" },
        ],
      },
      {
        label: "Reference",
        items: [
          { label: "CLI command reference", slug: "reference/cli" },
          { label: "Configuration", slug: "reference/configuration" },
          { label: "Security & threat model", slug: "reference/security" },
          { label: "Extending Prevail", slug: "reference/extending" },
          { label: "Platform support", slug: "reference/platform" },
        ],
      },
    ],
    }),
    mdx(),
    sitemap(),
  ],
});
