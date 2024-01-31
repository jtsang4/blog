import type { CSSProperties } from "react"
import { useEffect } from "react"
import { SITE } from "@config"

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
    const initComment = async () => {
      import("artalk/dist/Artalk.css")
      const { init } = await import("artalk")
      const artalk = init({
        el: "#comments",
        pageKey,
        pageTitle,
        server: commentServer,
        site: SITE.title,
      })
      window.artalk = artalk
      const theme = localStorage.getItem("theme") as string
      artalk.setDarkMode(theme === "dark")
    }
    initComment()
  }, [])

  return <div className={className} style={style} id="comments" />
}
