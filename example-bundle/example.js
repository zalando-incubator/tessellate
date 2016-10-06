import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Styles from './example.css'

/**
 * Root class of the fragment bundle can be rendered on the server.
 */
export class Fragment extends Component {
  render() {
    return <h1>Welcome to {this.props.requestURI}!</h1>
  }
}

/**
 * Render function will be called by the Mosaic layout engine in the browser.
 * @param element - DOM root element to mount React component on.
 */
export default function render(element) {
  // Fetch inlined properties.
  const props = JSON.parse(element.getAttribute('data-props'))

  ReactDOM.render(<Fragment {...props}/>, element)
}
