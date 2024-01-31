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
    const artalk = (window as any).Artalk.init({
      el: "#comments",
      pageKey,
      pageTitle,
      server: commentServer,
      site: SITE.title,
    })
    const theme = localStorage.getItem("theme") as string
    artalk.setDarkMode(theme === "dark")
  }, [])

  return <div className={className} style={style} id="comments"></div>
}
