# tessellate-render

Library that renders react components from a string.

### Usage

```javascript
import renderToString from 'tessellate-render'

const code = `
var React = require('react')
exports.Fragment = React.createClass({
  render: function() {
    return React.createElement('h1', null, this.props.text)
  }
})`
const html = renderToString(code, {text: 'Hello, world!'})
```
