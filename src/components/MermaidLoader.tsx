import mermaid from "mermaid"
import { useEffect } from "react"

const initializeMermaid = () => {
  const theme =
    localStorage.getItem("theme") ??
    document.documentElement.getAttribute("data-theme") ??
    "light"

  mermaid.initialize({
    startOnLoad: false,
    theme: theme === "dark" ? "dark" : "default",
  })
}

const renderDiagrams = () => {
  const graphs = document.getElementsByClassName("mermaid")
  if (graphs.length === 0) {
    return
  }

  initializeMermaid()

  for (const graph of graphs) {
    const content = graph.getAttribute("data-content")
    if (!content) {
      continue
    }

    const id = `mermaid-${Math.round(Math.random() * 100000)}`
    mermaid.render(id, content).then(result => {
      graph.innerHTML = result.svg
    })
  }
}

export default function MermaidLoader() {
  useEffect(() => {
    const tryRenderDiagrams = () => {
      renderDiagrams()
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
