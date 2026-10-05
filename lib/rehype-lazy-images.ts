import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"

// Markdown images (including hot-linked GIFs) shouldn't compete with the
// first screen; Astro's own <Image> output already carries these.
export function rehypeLazyImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return
      node.properties.loading ??= "lazy"
      node.properties.decoding ??= "async"
    })
  }
}
