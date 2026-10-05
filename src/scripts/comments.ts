import { SITE } from "@config"
import { init } from "artalk"
import "artalk/dist/Artalk.css"
import "../styles/artalk.css"

// Loaded on demand by Comments.astro once the thread nears the viewport
export const mountComments = (el: HTMLElement) => {
  const { pageKey, pageTitle, server } = el.dataset
  const artalk = init({
    el,
    pageKey,
    pageTitle,
    server: server ?? "",
    site: SITE.title,
    darkMode: document.documentElement.dataset.theme === "dark",
  })
  window.artalk = artalk
  return artalk
}
