// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import SandboxVM from './SandboxVM'
import logger from './logger'

const log = logger('render-service')
// Hack: global.__REQUIRE_FN__ must be defined in webpack.config.
const requireFn = global.__REQUIRE_FN__ || require
const sandbox = new SandboxVM({require: requireFn})

export function renderToStaticMarkup(source: string, props: Object = {}): string {
  log.debug('Execute source code....')
  const {Fragment} = sandbox.run(source)
  log.debug('Render string with props %o', props)
  return ReactDOMServer.renderToString(<Fragment {...props}/>)
}
