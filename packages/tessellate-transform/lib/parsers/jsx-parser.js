// @flow

const acorn = require('acorn-jsx');

import type { ParseOptions, ParseResult, ParseCallbacks, Parser } from './';

type AST = {
  type: string,
  body: Array<ExpressionStatement>
};

type ExpressionStatement = {
  type: 'ExpressionStatement',
  expression: Expression
};

type Expression = JSXElement | Literal | JSXText;

type JSXElement = {
  type: 'JSXElement',
  openingElement: Element,
  closingElement: Element,
  children: Array<Expression>
};

type Element = {
  type: string,
  attributes: Array<Attribute>,
  name: JSXIdentifier | JSXMemberExpression,
  selfClosing: boolean
};

type Attribute = {
  type: string,
  name: { type: string, name: string },
  value: JSXExpressionContainer | Literal
};

type JSXExpressionContainer = {
  type: 'JSXExpressionContainer',
  expression: ObjectExpression | Literal
};

type JSXText = {
  type: 'JSXText',
  value: string,
  raw: string
};

type Literal = {
  type: 'Literal',
  value: mixed,
  raw: string
};

type ObjectExpression = {
  type: 'ObjectExpression',
  properties: Array<Property>
};

type Property = {
  type: 'Property',
  key: { name: string },
  value: { value: string }
};

type JSXIdentifier = {
  type: 'JSXIdentifier',
  name: string
};

type JSXMemberExpression = {
  type: 'JSXMemberExpression',
  object: JSXIdentifier,
  property: JSXIdentifier
};

type ProcessingCallbacks = {|
  onEnter: (element: Element) => void,
  onLeave: (element: Element) => void,
  onLiteral: (literal: Literal | JSXText) => void
|};

function processAttribute(attribute: Attribute): { [key: string]: mixed } {
  const value = attribute.value;
  let result = null;

  switch (value.type) {
    case 'JSXText':
    case 'Literal': {
      result = value.value;
      break;
    }
    case 'JSXExpressionContainer': {
      const expression = value.expression;
      switch (expression.type) {
        case 'ObjectExpression': {
          result = expression.properties.reduce(
            (props, prop) => Object.assign(props, { [prop.key.name]: prop.value.value }),
            {}
          );
          break;
        }
        case 'JSXText':
        case 'Literal': {
          result = expression.value;
          break;
        }
      }
      break;
    }
  }
  return { [attribute.name.name]: result };
}

function processExpression(expression: Expression, callbacks: ProcessingCallbacks) {
  if (expression.type === 'JSXElement') {
    callbacks.onEnter(expression.openingElement);

    for (let child of expression.children) {
      processExpression(child, callbacks);
    }
    callbacks.onLeave(expression.openingElement);
  }
  if (expression.type === 'Literal' || expression.type === 'JSXText') {
    callbacks.onLiteral(expression);
  }
}

function traverseAST(ast: AST, callbacks: ProcessingCallbacks) {
  for (let statement of ast.body) {
    const expression = statement.expression;
    processExpression(expression, callbacks);
  }
}

function parseElementType(element: Element, typePrefix: string): string {
  if (element.name.type === 'JSXIdentifier') {
    const name = element.name.name;
    const isCustomClassName = /^[A-Z]/.test(name);
    return isCustomClassName ? `${typePrefix}${name}` : name;
  } else if (element.name.type === 'JSXMemberExpression') {
    return `${typePrefix}${element.name.object.name}.${element.name.property.name}`;
  } else {
    throw new Error(`Unsupported element name type ${element.name.type}`);
  }
}

function parseElementAttrs(element: Element): { [key: string]: mixed } {
  return element.attributes.reduce((attrs, attr) => Object.assign(attrs, processAttribute(attr)), {
  });
}

function parseElement(element: Element, typePrefix: string): ParseResult {
  const type = parseElementType(element, typePrefix);
  const props = parseElementAttrs(element);
  const jsonNode: ParseResult = {
    type,
    props: Object.keys(props).length > 0 ? props : null,
    children: ([]: Array<ParseResult>)
  };
  return jsonNode;
}

function parseLiteral(literal: Literal | JSXText): ?string {
  const isNotJustWhitespace = /\S+/.test(literal.raw);
  if (isNotJustWhitespace && typeof literal.value === 'string') {
    return literal.value;
  }
}

class StackCache<T> {
  cache: Array<T>;
  ids: Array<number>;
  id: number;

  constructor() {
    this.cache = [];
    this.ids = [];
    this.id = 0;
  }

  push(item: T): T {
    this.cache[this.id] = item;
    this.ids.push(this.id);
    this.id += 1;
    return item;
  }

  pop(): T {
    return this.cache[this.ids.pop()];
  }
}

function parseJSX(jsx: string, callbacks: ParseCallbacks, opts: ParseOptions) {
  const ast: AST = acorn.parse(jsx, { plugins: { jsx: true } });
  const typePrefix = opts.typePrefix ? `${opts.typePrefix}.` : '';
  const cache = new StackCache();

  traverseAST(ast, {
    onEnter: (element: Element) => {
      callbacks.onEnter(cache.push(parseElement(element, typePrefix)));
    },
    onLeave: () => {
      callbacks.onLeave(cache.pop());
    },
    onLiteral: (literal: Literal | JSXText) => {
      const string = parseLiteral(literal);
      if (string) callbacks.onLiteral(string);
    }
  });
}

export default function createParser(opts: ParseOptions = {}): Parser<string> {
  return (jsx: string, callbacks: ParseCallbacks) => parseJSX(jsx, callbacks, opts);
}
