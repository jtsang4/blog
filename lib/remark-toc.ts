/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-toc').Options} Options
 */

import { toc } from 'mdast-util-toc'
import type { Options } from 'mdast-util-toc'
import type { Root } from 'mdast'

/**
 * Generate a table of contents (TOC).
 *
 * Looks for the first heading matching `options.heading` (case insensitive),
 * removes everything between it and an equal or higher next heading, and
 * replaces that with a list representing the rest of the document structure,
 * linking to all further headings.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function remarkToc(options: Options) {
  const settings = {
    ...options,
    heading: (options && options.heading) || '(table[ -]of[ -])?contents?|toc',
    tight: options && typeof options.tight === 'boolean' ? options.tight : true
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree: Root) {
    const result = toc(tree, settings)

    if (
      result.endIndex === undefined ||
      result.endIndex === -1 ||
      result.index === undefined ||
      result.index === -1 ||
      !result.map
    ) {
      return
    }

    const startIndex = result.index;
    tree.children = [
      ...tree.children.slice(0, startIndex),
      result.map,
      ...tree.children.slice(startIndex)
    ]
  }
}