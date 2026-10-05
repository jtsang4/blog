# James Tsang's Blog

> Personal blog of James Tsang – a web developer mainly working on privacy & security, and exploring large language models.

Online site: **https://jtsang.me/**

This repository contains the source code of my personal blog. It is built with Astro and heavily customized to fit my writing workflow. I use it to document topics around programming, privacy & security, self‑hosted tools, and personal reflections.

> This repository contains the source code of my personal blog at https://jtsang.me, built with Astro and customized on top of the AstroPaper theme.

---

## 🧩 Features

- **Blog & essays** – supports both English and Chinese, covering topics such as:
  - Web development and engineering practices
  - Hands‑on notes about privacy and security
  - Usage of tools and self‑hosted services (e.g. DERP / Headscale, password managers, etc.)
  - Personal growth, thoughts and reflections
- **Dark / light themes** – theme switching with a responsive layout for both desktop and mobile.
- **RSS feed** – provides RSS so you can subscribe with your favorite RSS reader.
- **Good performance & accessibility** – generated as static pages with Astro, focused on fast load and simple structure.

---

## 🧱 Tech Stack

- **Framework**: [Astro](https://astro.build/) 5
- **Language**: TypeScript
- **UI components**: React (used in selected components/pages)
- **Styling**: Tailwind CSS
- **Markdown & content processing**:
  - Astro Content Collections
  - Custom Remark plugins for table of contents (TOC), collapsible sections, and Mermaid diagrams
- **Search**: Fuse.js fuzzy search
- **Code quality**: Biome, TypeScript

For full dependencies and tooling configuration, see `package.json`.

---

## 📂 Project Structure

The main project structure (omitting unrelated files) looks like this:

```bash
/
├── public/
│   ├── favicon.png
│   ├── og.jpeg
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   ├── blog/
│   │   ├── _schemas.ts
│   │   └── config.ts
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── config.ts
│   └── types.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── pnpm-workspace.yaml
```

- **Posts**: all posts live in `src/content/blog`, written in Markdown/MDX.
- **Pages & layouts**:
  - `src/pages`: top‑level routes (home, posts listing, etc.).
  - `src/layouts`: layouts for posts, about page and other sections.
- **Components**: navigation, cards, breadcrumbs, callouts and other UI pieces in `src/components`.

Core site configuration (such as the `site` URL, Markdown plugins, Shiki code highlighting, redirects, etc.) is defined in `astro.config.mjs`.

---

## 💻 Local Development

This project uses **pnpm** as the primary package manager (see `pnpm-workspace.yaml`).

### 1. Install dependencies

```bash
# Recommended
pnpm install

# You can also use npm / yarn if you prefer
npm install
# or
yarn install
```

### 2. Start the dev server

```bash
pnpm dev
```

By default, Astro runs on <http://localhost:4321>. If the port is changed, please refer to the logs in your terminal.

### 3. Build & preview

```bash
# Build production assets
pnpm build

# Preview the built site locally
pnpm preview
```

### 4. Linting & formatting

```bash
# Check formatting
pnpm format:check

# Auto‑format
pnpm format

# Lint
pnpm lint
```

Husky and lint‑staged are configured to run checks automatically before commits.

---

## 🌐 Deployment

The site is built as static assets with `astro build` and can be deployed to any static hosting or your own server, for example:

- Object storage + CDN
- Static hosting platforms (Vercel, Netlify, Cloudflare Pages, etc.)
- Self‑hosted servers with Nginx / Caddy, and so on

Typical flow:

```bash
pnpm build
# The output will be in ./dist
```

Then deploy the contents of the `dist` directory to your web server or hosting provider. The production site for this repository is currently available at: <https://jtsang.me/>.

RSS feeds:

- `/rss.xml`
- `/feed` redirects to the RSS feed (configured in the `redirects` section of `astro.config.mjs`).

---

## ✍️ Writing & Content Conventions

- All posts live under `src/content/blog`.
- Astro Content Collections schemas in `src/content/_schemas.ts` are used to validate frontmatter.
- Each post typically includes frontmatter fields like: title, summary, publish date, language (optional), tags, etc.
- Posts can use:
  - Standard Markdown
  - Code blocks with Shiki highlighting
  - Mermaid diagrams (sequence diagrams, flowcharts, etc.) via custom remark plugins

---

## 🙏 Acknowledgements & Origins

This blog was originally bootstrapped from the [AstroPaper](https://github.com/satnaing/astro-paper) theme, and then heavily customized and refactored to match my personal preferences for writing and structure.

If you are looking for a general‑purpose Astro blog theme, you can refer to the original AstroPaper project. If you are curious about how this site is set up, feel free to explore or reuse parts of this codebase.

---

## 📬 Contact

If you have any thoughts about the content, implementation details, or configuration of this blog, feel free to reach out via the contact methods provided on the site.

> Thanks for reading the source code of my blog. Hope some part of it can be useful to you.
