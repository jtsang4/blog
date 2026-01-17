import mermaid from "mermaid"

const renderDiagrams = (graphs: HTMLCollectionOf<Element>) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "default",
  })

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

const tryRenderDiagrams = () => {
  const graphs = document.getElementsByClassName("mermaid")
  if (graphs.length === 0) {
    return
  }
  renderDiagrams(graphs)
}

tryRenderDiagrams()
document.removeEventListener("astro:after-swap", tryRenderDiagrams)
document.addEventListener("astro:after-swap", tryRenderDiagrams)
