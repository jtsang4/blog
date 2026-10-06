// Client-side navigation fetches the next page with fetch(), which may hand
// back a copy of the HTML cached from an older deploy. Its hashed CSS and JS
// no longer exist, so swapping it in leaves an unstyled page. Compare build
// ids and ask the server again when they differ.
const buildOf = (doc: Document) =>
  doc.querySelector<HTMLMetaElement>('meta[name="build-id"]')?.content

document.addEventListener("astro:before-preparation", event => {
  if (event.formData) return
  const load = event.loader
  event.loader = async () => {
    await load()
    if (event.defaultPrevented || event.signal.aborted) return
    const current = buildOf(document)
    if (buildOf(event.newDocument) === current) return

    try {
      const response = await fetch(event.to.href, {
        cache: "no-cache",
        signal: event.signal,
      })
      const fresh = new DOMParser().parseFromString(
        await response.text(),
        "text/html"
      )
      if (buildOf(fresh) === current) {
        for (const el of fresh.querySelectorAll("noscript")) el.remove()
        event.newDocument = fresh
        return
      }
    } catch {
      // Fall through to a full load
    }
    // Still a different deploy (the site changed since this page loaded):
    // let the browser load the page, now freshly cached, from scratch
    event.preventDefault()
  }
})
