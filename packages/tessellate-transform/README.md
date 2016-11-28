# tessellate-transform

Library to transform content from JSX or JSON to JSON. The output format can be consumed by tessellate-bundler. For example:

```json
{
  "type": "div",
  "props": {
    "id": 1
  },
  "children": []
}
```

### Usage:

```javascript
import transform from 'tessellate-transform'

const file = {
  content: '...', // content string
  extname: '...'  // .jsx | .json
}
const options = { ... }
const object = transform(file, options)
```

### Command line use:

```
tessellate-transform [OPTIONS] FILE

Options:
  --type-prefix  Prefix for React class names.     [string]
  --json-map     JSON property mapping file.       [file]
  --root         Type of surrounding root element. [string]
```

### Options

##### type-prefix – `typePrefix`
String to directly prepend before each `type` property. Can be used for Node module names.

##### root – `root`
If provided, wraps the resulting JSON in another node with the given string as type.

##### json-map – `jsonMap`
Mapping rules for JSON to Tessellate JSON:

```json
{
  "typeKeys": [],
  "childrenKeys": [],
  "literalKeys": [],
  "ignoreKeys": [],
  "typeMap": {}
}
```

* typeKeys: keys of properties to use as `type`
* childrenKeys: keys of properties to use as `children`
* literalKeys: keys of properties to use as literal `children`
* ignoreKeys: keys of properties to ignore
* typeMap: map of type property values to other type property values
