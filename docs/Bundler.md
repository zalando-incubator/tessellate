# tessellate-bundler

Tessellate bundler is a web service that compiles abstract JSON definitions of nested React components into universal JavaScript bundles. This is accomplished by generating code which is then executed inside a [webpack](https://webpack.js.org) sandbox.

## API

The REST API of tessellate-bundler has only one endpoint and method to create new bundles.

**POST** `/bundles/{domain}/{name}`

**Parameters:**

* domain – target domain of the bundle, e.g. zalando.de
* name – target name of the bundle, e.g. my-page
* body – application/json (see [Tessellate JSON](#tessellate-json))

**Responses:**

* 201 created – a new bundle was compiled
* 400 bad request – illegal request payload

## Tessellate JSON

tessellate-bundler creates universal JavaScript bundles which can be rendered by **React** on both the server- and client-side. In order to create such a bundle, the web service requires an abstract description of the recursively nested hierarchy of React components and their properties. Each element in the hierarchy has three attributes: **type**, **props** and **children**. These attributes correspond exactly to the arguments the the [React.createElement()](https://facebook.github.io/react/docs/react-api.html#createelement) function. Here's an example of a simple component hierarchy:

```yaml
type: div
props: null
children:
- type: h1
  props: null
  children:
  - Hello, World!
- type: a
  props:
    href: https://tech.zalando.com
  children:
  - Zalando Technology
```

### type: `string`

The type of element. It can either be the name of a standard HTML element (`div`, `span`, etc.) or the name of a [React component](https://facebook.github.io/react/docs/components-and-props.html) type that can be [required](https://nodejs.org/api/globals.html#globals_require) in the Node execution context of the tessellate-bundler process. In the second case tessellate-bundler is going to generate code with [ES2015 module import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) syntax from the given type. The following schema applies:

`[node-module-name].[component-name]`

* `node-module-name` must be the name of an installed node module.
* `component-name` must be the name of an exported member in the node module or `default`.

As a result the following two kinds of import statements can be generated a type string:

* `import { component-name } from 'node-module-name'`
* `import nodeModuleName from 'node-module-name'` if type is `[node-module-name].default`

**Examples:**

| type               | import                          | React                        |
|--------------------|---------------------------------|------------------------------|
| `'div'`            | *none*                          | `React.createElement('div')` |
| `'my-lib.link'`    | `import { link } from 'my-lib'` | `React.createElement(link)`  |
| `'my-lib.default'` | `import MyLib from 'my-lib'`    | `React.createElement(MyLib)` |

### props: `object | null`

🚧

### children: `Array<TessellateElement | string>`

🚧

### Tessellate JSON schema

```yaml
type: object
properties:
  type:
    type: string
    pattern: "^[a-zA-Z0-9-\\.]+$"
  props:
    oneOf:
    - type: object
    - type: 'null'
  children:
    type: array
    items:
      anyOf:
      - "$ref": "#"
      - type: string
required:
- type
- props
- children
```

Under construction 🏗️ 🚧 👷
