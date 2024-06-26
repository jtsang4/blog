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
    const initComment = async () => {
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
