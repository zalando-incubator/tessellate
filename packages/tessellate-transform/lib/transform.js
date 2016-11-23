// @flow

import createJSXParser from './parsers/jsx-parser'

import type { FileType } from './'
import type { ParseOptions, ParseResult } from './parsers'

export default function transform(type: FileType, jsx: string, opts: ParseOptions): * {
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

  switch(type)  {
    case '.jsx':
      createJSXParser(opts)(jsx, callbacks)
      break
    default:
      throw new Error(`Unsupported type ${type}`)
  }

  if(!root || typeof root !== 'object') throw new Error('Could not parse JSX.')
  else return root
}
