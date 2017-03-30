---
description: Documentation of tessellate-bundler.
---

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

tessellate-bundler creates universal JavaScript bundles which can be rendered by **React** on both the server- and client-side. In order to create such a bundle, the web service requires an abstract description of the recursively nested hierarchy of React components and their properties. Each element in the hierarchy has three attributes: **type**, **props** and **children**. These attributes correspond exactly to the arguments of the [React.createElement()](https://facebook.github.io/react/docs/react-api.html#createelement) function. Here's an example of a simple component hierarchy:

{% codetabs name="YAML", type="yaml" -%}
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
{%- language name="JSX", type="html" -%}
<div>
  <h1>Hello, World!</h1>
  <a href="https://tech.zalando.com">Zalando Technology</a>
</div>
{%- language name="JavaScript", type="js" -%}
React.createElement(
  'div',
  null,
  React.createElement('h1', null),
  React.createElement(
    'a',
    { href: 'https://tech.zalando.com' },
    'Zalando Technology'
  )
);
{%- endcodetabs %}

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

Properties for a React component. These properties are going to be **inlined** into the compiled JavaScript bundle as JSON and are applied to each respective component upon rendering. However because tessellate-fragment can load and inject properties at render time, it may not be necessary or desired to define all properties in Tessellate JSON.

### children: `Array<TessellateElement | string>`

A list of [child components](https://facebook.github.io/react/docs/jsx-in-depth.html#children-in-jsx) which can either be other Tessellate elements or literal strings.

### Tessellate JSON schema

Tessellate JSON is also defined in terms of a simple, recursive schema. The schema is strict, meaning that all properties are required but they have alternative "empty" values. `props` may be `null` and `children` may be an empty array.

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

## Tessellate bundles

tessellate-bundler compiles [Tessellate JSON](Bundler.md#tessellate-json) into JavaScript bundles which can be rendered with React in both the browser and on the server. The bundle implements the Mosaic [specification](https://github.com/zalando/tailor/blob/master/README.md#fragment-server) for Fragment JavaScript which is *"an AMD module, that exports an `init` function, that will be called with DOM element of the fragment as an argument"*. In fact, tessellate-bundler creates a UMD (universal module definition) module which exports a function that mounts a hierarchy of React components on the given DOM element.

### `export default function render(element)`

* `element: HTMLElement` – DOM node of the fragment.
* returns `void`

This function simply calls `ReactDOM.render()` to render the React component hierarchy on the given DOM node with the inlined properties that are defined in Tessellate JSON and any additional properties injected by tessellate-fragment.

### `export class Fragment extends React.Component`

The root component of the hierarchy declared in Tessellate JSON. Any properties applied to this component are injected into the `data-props` attribute of the root node in this component. This mechanism is necessary to add additional properties to the component hierarchy at render time in tessellate-fragment.

## Further information

* Look at [script-builder.js](https://github.com/zalando-incubator/tessellate/blob/master/packages/tessellate-bundler/src/script-builder/index.js) to see how Tessellate JSON is parsed.
* Read [FragmentScript.js](https://github.com/zalando-incubator/tessellate/blob/master/packages/tessellate-bundler/src/script-builder/FragmentScript.js) to better understand how JavaScript bundles look like.
* See [Configuration](Configuration.md#tessellate-bundler) for details on how to configure tessellate-bundler.
