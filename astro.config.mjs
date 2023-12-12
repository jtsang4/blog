import { defineConfig, squooshImageService } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import { remarkToc } from "./lib/remark-toc"
import { remarkCollapse } from "./lib/remark-collapse"
import { mermaid } from "./lib/remark-mermaid"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
  site: "https://jtsang.me/",
  image: {
    service: squooshImageService(),
  },
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
      mermaid,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  redirects: {
    "/feed": "/rss.xml",
    "/如何部署自持的-bitwarden-密码管理器":
      "/posts/how-to-deploy-your-own-bitwarden-password-manager",
    "/好用但不常用的命令行工具":
      "/posts/useful-but-not-commonly-used-cli-tools",
    "/配置服务器仅用密钥进行-ssh-登录":
      "/posts/configure-ssh-login-with-keys-only",
    "/linux-tcp-加速一键安装-常见最新内核脚本-锐速bbrplusbbr2":
      "/posts/linux-tcp-bbr-server-speed-up",
    "/linux-一键-dd-重装脚本": "/posts/linux-one-click-dd-reinstall-script",
    "/拒绝算法推荐用-rss-构建属于自己的信息流":
      "/posts/build-your-own-rss-feed",
    "/i-just-had-a-dream-and-it-was-the-most-terrifying-dream-ive-ever-had":
      "/posts/i-just-had-a-nightmare",
    "/总工程师-42-岁移民从工人做起活出精彩人生--观后感":
      "/posts/42-years-old-immigrant",
    "/我的表达之局限即我的世界之局限": "/posts/my-expression-is-my-limitation",
    "/因理智而悲观因意志而乐观": "/posts/optimistic-and-pessimistic",
    "/纪念多牧君": "/posts/remember-duo-mu-jun",
  },
})
