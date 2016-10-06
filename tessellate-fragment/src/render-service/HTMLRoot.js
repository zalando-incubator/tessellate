// @flow

import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'

export default class HTMLRoot extends Component {
  props: {
    Root: React$Component<*>;
    mountPoint: string;
  }

  render() {
    // Get other props (object-rest-spread is not available)
    const other = Object.keys(this.props)
      .filter(key => ['Root', 'mountPoint'].indexOf(key) === -1)
      .reduce((obj, key) => Object.assign(obj, {[key]: this.props[key]}), {})

    return <div
      id={this.props.mountPoint}
      data-props={JSON.stringify(other)}
      dangerouslySetInnerHTML={{
      __html: ReactDOMServer.renderToString(<this.props.Root {...other}/>)
    }}/>
  }
}
