// @flow

import uuid from 'uuid'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import SandboxVM from './SandboxVM'
import HTMLRoot from './HTMLRoot'
import logger from '../logger'

const log = logger('render-service')
// Hack: global.__REQUIRE_FN__ must be defined in webpack.config.
const requireFn = global.__REQUIRE_FN__ || require
const sandbox = new SandboxVM({require: requireFn})

export function renderToStaticMarkup(source: string, props: Object = {}): string {
  log.debug('Execute source code....')
  const {Fragment} = sandbox.run(source)
  log.debug('Render static markup with props %o', props)
  const mountPoint = uuid.v4()
  return ReactDOMServer.renderToStaticMarkup(<HTMLRoot Root={Fragment} mountPoint={mountPoint} {...props}/>)
}
