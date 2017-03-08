// @flow

import type { Parser, ParseResult } from './parsers';

export default function transform(
  content: string,
  parse: Parser<*>,
  root: ParseResult | null = null
): ParseResult {
  const nodes = root ? [root] : [];
  const getLastNode = () => nodes[nodes.length - 1];

  const callbacks = {
    onEnter: (node: ParseResult) => {
      const lastNode = getLastNode();

      if (typeof lastNode === 'object') {
        lastNode.children.push(node);
      } else {
        root = node;
      }
      nodes.push(node);
    },
    onLeave: () => {
      nodes.pop();
    },
    onLiteral: (literal: string) => {
      const lastNode = getLastNode();
      if (typeof lastNode === 'object') {
        lastNode.children.push(literal);
      }
    }
  };

  parse(content, callbacks);

  if (root && typeof root === 'object') return root;
  else throw new Error('Could not transform content.');
}
