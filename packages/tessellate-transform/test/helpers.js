// @flow

import type { Parser } from '../lib/parsers';

export function traverse<T>(parse: Parser<T>, content: T): * {
  const nodes = [];
  const entered = [];
  const left = [];
  const literals = [];

  parse(content, {
    onEnter: node => {
      entered.push(node);
      nodes.push(node);
    },
    onLeave: node => {
      left.push(node);
      expect(node).toBe(nodes.pop());
    },
    onLiteral: string => {
      literals.push(string);
    }
  });

  return { nodes, entered, left, literals };
}
