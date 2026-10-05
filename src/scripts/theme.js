// Runs blocking in <head> so the right palette is painted on first frame.
;(() => {
  const KEY = "theme"
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const colors = { light: "#f3f1ec", dark: "#12110f" }

  const preferred = () =>
    localStorage.getItem(KEY) || (media.matches ? "dark" : "light")

  const apply = theme => {
    const root = document.documentElement
    root.dataset.theme = theme
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute("content", colors[theme])
    }
    for (const button of document.querySelectorAll("[data-theme-toggle]")) {
      button.setAttribute("aria-pressed", String(theme === "dark"))
    }
    window.artalk?.setDarkMode(theme === "dark")
  }

  const toggle = button => {
    const next = preferred() === "dark" ? "light" : "dark"
    localStorage.setItem(KEY, next)

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!document.startViewTransition || reduce.matches) {
      apply(next)
      return
    }

    // Spread the new palette outward from the toggle
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
    const root = document.documentElement
    root.style.setProperty("--vt-x", `${x}px`)
    root.style.setProperty("--vt-y", `${y}px`)
    root.style.setProperty("--vt-r", `${r}px`)
    root.classList.add("theme-transition")
    const transition = document.startViewTransition(() => apply(next))
    transition.finished.finally(() => root.classList.remove("theme-transition"))
  }

  apply(preferred())
  document.addEventListener("DOMContentLoaded", () => apply(preferred()))
  document.addEventListener("click", event => {
    const button = event.target.closest?.("[data-theme-toggle]")
    if (button) toggle(button)
  })

  // Astro's router swaps <html> attributes on navigation
  document.addEventListener("astro:after-swap", () => apply(preferred()))

  media.addEventListener("change", () => {
    if (!localStorage.getItem(KEY)) apply(preferred())
  })
})()
