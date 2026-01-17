import type { Root } from "mdast"
import { headingRange } from "mdast-util-heading-range"
import { toString as mdastToString } from "mdast-util-to-string"

function defaultSummarizer(str: string) {
  return `Open ${str}`
}

function isFunction(fn: unknown): fn is (str: string) => string {
  return typeof fn === "function"
}

type Options = {
  test: string
  summary: string | ((str: string) => string)
}

export function remarkCollapse(opts: Options) {
  if (opts == null || opts.test == null)
    throw new Error("options.test must be given")

  const summarizer =
    opts.summary == null
      ? defaultSummarizer
      : typeof opts.summary === "string"
        ? () => opts.summary
        : opts.summary

  if (!isFunction(summarizer))
    throw new Error("options.summary must be function")

  return (root: Root) => {
    headingRange(root, opts.test, (start, nodes, end) => {
      const tocListNode = nodes[0]
      const nodesWithoutToc = nodes.slice(1)
      return [
        start,
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "<details>",
            },
            {
              type: "html",
              value: "<summary>",
            },
            {
              type: "text",
              value: summarizer(mdastToString(start)),
            },
            {
              type: "html",
              value: "</summary>",
            },
          ],
        },
        tocListNode,
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "</details>",
            },
          ],
        },
        ...nodesWithoutToc,
        end,
      ]
    })
  }
}
