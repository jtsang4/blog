const primaryColorScheme = "" // "light" | "dark"

function isDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function getPreferTheme() {
  // return theme value in local storage if it is set
  const currentTheme = localStorage.getItem("theme")
  if (currentTheme) return currentTheme

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme

  // return user device's prefer color scheme
  return isDarkMode() ? "dark" : "light"
}

function setPreference() {
  reflectPreference()
}

function reflectPreference() {
  const themeValue = getPreferTheme()
  document.firstElementChild.setAttribute("data-theme", themeValue)

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue)

  if (window.artalk) {
    window.artalk.setDarkMode(localStorage.getItem("theme") === "dark")
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference()

function setupTheme() {
  // set on load so screen readers can get the latest value on the button
  reflectPreference()

  // now this script can find and listen for clicks on the control
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme")
    const nextTheme = currentTheme === "light" ? "dark" : "light"
    localStorage.setItem("theme", nextTheme)
    setPreference()
  })
}

window.addEventListener("load", setupTheme)
document.removeEventListener("astro:before-swap", setupTheme)
document.addEventListener("astro:after-swap", setupTheme)

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light"
    setPreference()
  })
