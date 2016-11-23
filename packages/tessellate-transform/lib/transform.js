// @flow

import createJSXParser from './parsers/jsx-parser'

import type { Parser, ParseResult } from './parsers'

export default function transform(content: string, parse: Parser): * {
  let root: ParseResult | null = null
  const nodes = []
  const getLastNode = () => nodes[nodes.length - 1]

  const callbacks = {
    onEnter: (node: ParseResult) => {
      const lastNode = getLastNode()

      if (typeof lastNode === 'object') {
        lastNode.children.push(node)
      } else {
        root = node
      }
      nodes.push(node)
    },
    onLeave: (node: ParseResult) => {
      nodes.pop()
    },
    onLiteral: (literal: string) => {
      const lastNode = getLastNode()
      if (typeof lastNode === 'object') {
        lastNode.children.push(literal)
      }
    }
  }

  parse(content, callbacks)

  if(!root || typeof root !== 'object') throw new Error('Could not parse JSX.')
  else return root
}
