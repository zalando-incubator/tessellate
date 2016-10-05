import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Example extends Component {
  render() {
    return <div>
      <h1>Hello, world!</h1>
      <script defer={true} dangerouslySetInnerHTML={{
          __html: `window.__PROPS__ = ${JSON.stringify(this.props)}`
      }}/>
    </div>
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const props = window.__PROPS__ || {}
  console.log('Retrieved inlined properties:', props)
  ReactDOM.render(<Example {...props}/>, document.getElementById('main'))
}
