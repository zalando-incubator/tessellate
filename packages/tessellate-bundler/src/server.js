// @flow

import path from 'path'
import Koa from 'koa'
import morgan from 'koa-morgan'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import kcors from 'kcors'
import logger from './logger'
import routes from './routes'
import error from './error'
import nconf, { getFileSystemPublishTarget } from './nconf'
import './actions'

const log = logger('server')

export function init(): Koa {
  const app = new Koa()
  const morganFormat = nconf.get('MORGAN_FORMAT')
  const morganSkip = (req, res) => res.statusCode < nconf.get('MORGAN_THRESHOLD')

  app
    .use(morgan(morganFormat, {skip: morganSkip}))
    .use(error)
    .use(kcors())
    .use(bodyParser({enableTypes: ['json'], strict: true}))
    .use(routes)

  const fileSystemPublishTarget = getFileSystemPublishTarget()
  if (fileSystemPublishTarget) {
    log.info('Serving files from %s', fileSystemPublishTarget)
    app.use(koaStatic(fileSystemPublishTarget, {defer: true, gzip: true}))
  }

  return app
}

export function start(port: number | string = nconf.get('APP_PORT')) {
  init().listen(port)
  log.info('listening on port %d', port)
}

// $FlowIssue https://github.com/facebook/flow/issues/1362
if (require.main === module) {
  try {
    start()
  } catch(e) {
    log.error(e)
  }
}
