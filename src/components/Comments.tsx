import type { CSSProperties } from "react"
import { useEffect } from "react"
import { SITE } from "@config"
import { init } from "artalk"
import "artalk/dist/Artalk.css"

type Props = {
  className?: string
  style?: CSSProperties
  pageKey: string
  pageTitle: string
  commentServer: string
}

export const Comments = (props: Props) => {
  const { className, style, pageKey, pageTitle, commentServer } = props

  useEffect(() => {
    const theme =
      localStorage.getItem("theme") ??
      document.documentElement.getAttribute("data-theme") ??
      "light"

    const artalk = init({
      el: "#comments",
      pageKey,
      pageTitle,
      server: commentServer,
      site: SITE.title,
      darkMode: theme === "dark",
    })
    window.artalk = artalk

    return () => {
      artalk.destroy()
      if (window.artalk === artalk) {
        window.artalk = undefined
      }
    }
  }, [pageKey, pageTitle, commentServer])

  return <div className={className} style={style} id="comments" />
}
