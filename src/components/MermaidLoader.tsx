import mermaidScriptUrl from "mermaid/dist/mermaid.min.js?url"
import { useEffect } from "react"

type Mermaid = typeof import("mermaid").default
type MermaidGlobal = typeof globalThis & { mermaid?: Mermaid }

let mermaidPromise: Promise<Mermaid> | undefined

const getMermaid = () => (globalThis as MermaidGlobal).mermaid

const loadMermaidScript = (src: string) =>
  new Promise<Mermaid>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => {
      const mermaid = getMermaid()
      if (mermaid) {
        resolve(mermaid)
        return
      }

      reject(new Error("Mermaid did not initialize"))
    }
    script.onerror = () => {
      script.remove()
      reject(new Error(`Failed to load Mermaid from ${src}`))
    }
    document.head.append(script)
  })

const loadMermaid = () => {
  const mermaid = getMermaid()
  if (mermaid) {
    return Promise.resolve(mermaid)
  }

  mermaidPromise ??= loadMermaidScript(mermaidScriptUrl)
    .catch(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return loadMermaidScript(`${mermaidScriptUrl}?retry=${Date.now()}`)
    })
    .catch(error => {
      mermaidPromise = undefined
      throw error
    })

  return mermaidPromise
}

const initializeMermaid = (mermaid: Mermaid) => {
  const theme =
    localStorage.getItem("theme") ??
    document.documentElement.getAttribute("data-theme") ??
    "light"

  mermaid.initialize({
    startOnLoad: false,
    theme: theme === "dark" ? "dark" : "default",
  })
}

const renderDiagrams = async () => {
  const graphs = Array.from(document.getElementsByClassName("mermaid"))
  if (graphs.length === 0) {
    return
  }

  const mermaid = await loadMermaid()
  initializeMermaid(mermaid)

  await Promise.all(
    graphs.map(async (graph, index) => {
      const content = graph.getAttribute("data-content")
      if (!content) {
        return
      }

      const id = `mermaid-${Date.now()}-${index}`
      const result = await mermaid.render(id, content)
      graph.innerHTML = result.svg
    })
  )
}

export default function MermaidLoader() {
  useEffect(() => {
    const tryRenderDiagrams = () => {
      void renderDiagrams().catch(error => {
        console.error("Failed to render Mermaid diagrams", error)
      })
    }

    tryRenderDiagrams()
    document.removeEventListener("astro:after-swap", tryRenderDiagrams)
    document.addEventListener("astro:after-swap", tryRenderDiagrams)

    return () => {
      document.removeEventListener("astro:after-swap", tryRenderDiagrams)
    }
  }, [])

  return null
}
