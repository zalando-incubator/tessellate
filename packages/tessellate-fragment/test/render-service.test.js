/**
 * @flow
 */

import supertest from 'supertest-as-promised'
import * as renderService from '../src/render-service'

describe('render-service', () => {

  // React component with UMD module definition (only supports CommonJS)
  const source = `
  (function (root, factory) {
    if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
      factory(exports, require('react'))
    }
  }(this, function (exports, React) {
    exports.Fragment = React.createClass({
      render: function() {
         return React.createElement('div', null,
          React.createElement('h1', null, 'Hello, world!'),
          React.createElement('p', null, this.props.text))
       }
    })
  }))
  `

  describe('renderToStaticMarkup', () => {
    it('should render a JavaScript component string to HTML', () => {
      const html = renderService.renderToStaticMarkup(source, {text: 'This is only a test.'})
      expect(html).toMatchSnapshot()
    })
  })
})
