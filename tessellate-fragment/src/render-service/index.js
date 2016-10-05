// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import SandboxVM from './SandboxVM'
import HTMLRoot from './HTMLRoot'
import logger from '../logger'

const log = logger('render-service')
const sandbox = new SandboxVM({React, ReactDOM})

export function renderToStaticMarkup(source: string, props: Object = {}): string {
  log.debug('Execute source code....')
  const ReactClass = sandbox.run(source)
  log.debug('Render static markup with props %o', props)
  return ReactDOMServer.renderToStaticMarkup(<HTMLRoot Root={ReactClass} mountPoint="main" {...props}/>)
}
