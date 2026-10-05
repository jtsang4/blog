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

// Diagrams are drawn from the site's own tokens, so they read as part of the
// page in both themes instead of Mermaid's default lavender boxes.
const initializeMermaid = (mermaid: Mermaid) => {
  const css = getComputedStyle(document.documentElement)
  const token = (name: string) => css.getPropertyValue(name).trim()
  const dark = document.documentElement.dataset.theme === "dark"

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    darkMode: dark,
    fontFamily: token("--font-code"),
    flowchart: {
      curve: "basis",
      padding: 18,
      nodeSpacing: 48,
      rankSpacing: 56,
    },
    themeVariables: {
      fontSize: "14px",
      background: "transparent",
      primaryColor: token("--paper"),
      primaryTextColor: token("--ink"),
      primaryBorderColor: token("--ink"),
      secondaryColor: token("--paper-2"),
      tertiaryColor: token("--paper-2"),
      lineColor: token("--muted"),
      textColor: token("--ink"),
      edgeLabelBackground: token("--paper-2"),
      clusterBkg: token("--paper-2"),
      clusterBorder: token("--line"),
      noteBkgColor: token("--paper"),
      noteBorderColor: token("--accent"),
    },
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
      // Draw at natural size; narrow screens scroll rather than shrink text
      const svg = graph.querySelector("svg")
      const width = svg?.viewBox.baseVal.width
      if (svg && width) svg.style.width = `${width}px`
      graph.setAttribute("data-rendered", "")
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

    // Mermaid is ~900 KB; fetch it only once a diagram nears the viewport
    let nearby: IntersectionObserver | undefined
    const watch = () => {
      nearby?.disconnect()
      nearby = new IntersectionObserver(
        entries => {
          if (!entries.some(entry => entry.isIntersecting)) return
          nearby?.disconnect()
          tryRenderDiagrams()
        },
        { rootMargin: "800px 0px" }
      )
      for (const graph of document.getElementsByClassName("mermaid")) {
        nearby.observe(graph)
      }
    }

    // Redraw with the other palette when the reader switches themes
    const retheme = new MutationObserver(() => {
      if (document.querySelector(".mermaid[data-rendered]")) tryRenderDiagrams()
    })
    retheme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    watch()
    document.addEventListener("astro:after-swap", watch)

    return () => {
      document.removeEventListener("astro:after-swap", watch)
      nearby?.disconnect()
      retheme.disconnect()
    }
  }, [])

  return null
}
