import type { Heading, Root } from "mdast"
import { toString as mdastToString } from "mdast-util-to-string"

const TOC = /^(table[ -]of[ -])?contents?$|^toc$/i

// Posts carry a "## Table of Contents" placeholder from the old theme. The
// article layout renders its own navigable contents, so drop the heading.
export function remarkStripToc() {
  return (tree: Root) => {
    tree.children = tree.children.filter(
      node =>
        !(
          node.type === "heading" &&
          (node as Heading).depth === 2 &&
          TOC.test(mdastToString(node).trim())
        )
    )
  }
}
