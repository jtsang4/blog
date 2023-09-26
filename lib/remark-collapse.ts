import { headingRange } from 'mdast-util-heading-range'
import { toString } from 'mdast-util-to-string'
import type { Root } from 'mdast'

function defaultSummarizer (str: string) {
  return 'Open ' + str
}

function isFunction (fn: any) {
  return typeof fn === 'function'
}

type Options = {
  test: string
  summary: string | ((str: string) => string)
}

export default function remarkCollapse(opts: Options) {
  if (opts == null || opts.test == null) throw new Error('options.test must be given')

  const summarizer = opts.summary == null
    ? defaultSummarizer
    : typeof opts.summary === 'string'
    ? () => opts.summary
    : opts.summary

  if (!isFunction(summarizer)) throw new Error('options.summary must be function')

  return function (node: Root) {
    headingRange(node, opts.test, function (start, nodes, end) {
      return [
        start as any,
        {
          type: 'paragraph',
          children: [
            {
              type: 'html',
              value: '<details>'
            },
            {
              type: 'html',
              value: '<summary>'
            },
            {
              type: 'text',
              value: summarizer(toString(start))
            },
            {
              type: 'html',
              value: '</summary>'
            }
          ]
        },
        ...nodes,
        {
          type: 'paragraph',
          children: [
            {
              type: 'html',
              value: '</details>'
            }
          ]
        },
        end
      ]
    })
  }
}