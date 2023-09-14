import { defineConfig, squooshImageService } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import remarkToc from "remark-toc"
import remarkCollapse from "remark-collapse"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
  site: "https://jtsang.me/",
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  scopedStyleStrategy: "where",
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  image: {
    service: squooshImageService(),
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
})
