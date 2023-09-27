import type { CSSProperties } from "react"
// import 'artalk/dist/Artalk.css'
// import Artalk from 'artalk'
import { useEffect } from "react"
import { SITE } from "@config"

type Props = {
  className?: string
  style?: CSSProperties
  pageKey: string
  pageTitle: string
}

export const Comments = (props: Props) => {
  const { className, style, pageKey, pageTitle } = props

  useEffect(() => {
    ;(window as any).Artalk.init({
      el: "#comments",
      pageKey,
      pageTitle,
      server: "https://comment.zwt.one",
      site: SITE.title,
    })
  }, [])

  return <div className={className} style={style} id="comments"></div>
}
