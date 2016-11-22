// @flow

const acorn = require('acorn-jsx')

type AST = {
  type: string;
  body: Array<ExpressionStatement>;
}

type ExpressionStatement = {
  type: 'ExpressionStatement';
  expression: Expression;
}

type Expression = JSXElement | Literal;

type JSXElement = {
  type: 'JSXElement';
  openingElement: Element;
  closingElement: Element;
  children: Array<Expression>;
};

type Element = {
  type: string;
  attributes: Array<Attribute>;
  name: JSXIdentifier | JSXMemberExpression;
  selfClosing: boolean;
};

type Attribute = {
  type: string;
  name: { type: string; name: string; };
  value: JSXExpressionContainer | Literal;
};

type JSXExpressionContainer = {
  type: 'JSXExpressionContainer';
  expression: ObjectExpression| Literal;
}

type Literal = {
  type: 'Literal';
  value: mixed;
  raw: string;
};

type ObjectExpression = {
  type: 'ObjectExpression';
  properties: Array<Property>;
};

type Property = {
  type: 'Property';
  key: { name: string; };
  value: { value: string; };
};

type JSXIdentifier = {
  type: 'JSXIdentifier';
  name: string;
};

type JSXMemberExpression = {
  type: 'JSXMemberExpression';
  object: JSXIdentifier;
  property: JSXIdentifier;
};

type JsonNode = {
  type: string;
  props: Object | null;
  children: Array<JsonNode>;
};

type JsonData = {
  result: JsonNode | null;
  nodes: Array<JsonNode>;
};

type ProcessingOptions = {|
  onEnter: (element: Element) => void;
  onLeave: (element: Element) => void;
  onLiteral: (literal: Object) => void;
|};

type ParseOptions = {
  typePrefix?: string;
}

type ParseResult = {
  type: string;
  props: Object | null;
  children: Array<ParseResult>;
}

function processAttribute(attribute: Attribute): {[key: string]: mixed} {
  const value = attribute.value
  let result = null

  switch (value.type) {
    case 'Literal': {
      result = value.value
      break
    }
    case 'JSXExpressionContainer': {
      const expression = value.expression
      switch(expression.type) {
        case 'ObjectExpression': {
          result = expression.properties.reduce((props, prop) =>
            Object.assign(props, {[prop.key.name]: prop.value.value}), {})
          break
        }
        case 'Literal': {
          result = expression.value
          break
        }
      }
      break
    }
    default:
      result = null
  }
  return {[attribute.name.name]: result}
}

function processExpression(expression: Expression, opts: ProcessingOptions) {
  if (expression.type === 'JSXElement') {
    opts.onEnter(expression.openingElement)

    for (let child of expression.children) {
      processExpression(child, opts, expression)
    }
    opts.onLeave(expression.openingElement)
  }
  if (expression.type === 'Literal') {
    opts.onLiteral(expression)
  }
}

function traverseAST(ast: AST, opts: ProcessingOptions) {
  for (let statement of ast.body) {
    const expression = statement.expression;
    processExpression(expression, opts)
  }
}

export default function parse(jsx: string, opts: ParseOptions): ParseResult {
  const typePrefix = opts.typePrefix ? `${opts.typePrefix}.` : ''
  const ast: AST = acorn.parse(jsx, {plugins: {jsx: true}})
  let root = null
  const nodes = []

  traverseAST(ast, {
    onEnter: (element: Element) => {
      let type
      if (element.name.type === 'JSXIdentifier') {
        const name = element.name.name
        type = /^[A-Z]/.test(name) ? `${typePrefix}${name}` : name
      } else {
        type = `${typePrefix}${element.name.object.name}.${element.name.property.name}`
      }

      const props = element.attributes.reduce((attrs, attr) => Object.assign(attrs, processAttribute(attr)), {})
      const jsonNode = {
        type,
        props: Object.keys(props).length > 0 ? props : null,
        children: []
      }

      const lastNode = nodes[nodes.length - 1]

      if (lastNode) {
        lastNode.children.push(jsonNode)
      } else {
        root = jsonNode
      }

      nodes.push(jsonNode)
    },
    onLeave: (element: Element) => {
      nodes.pop()
    },
    onLiteral: (literal: Object) => {
      const lastNode = nodes[nodes.length - 1]
      if (/\S+/.test(literal.raw)) {
        lastNode.children.push(literal.value)
      }
    }
  })

  if(!root) throw new Error('Could not parse JSX.')
  else return root
}
