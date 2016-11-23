# tessellate-transform

Library to transform React components from JSX or JSON to JSON. The output format can be consumed by tessellate-bundler.

### Usage:

```javascript
import transform from 'tessellate-transform'

const file = {
  content: '<h1>Hello, world!</h1>',
  extname: '.jsx'
}
const options = {}
const object = await transform(file, options)
```

### Command line use:

```
tessellate-transform [OPTIONS] FILE

Options:
  --type-prefix  Prefix for React class names
```
