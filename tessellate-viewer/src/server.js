// @flow

import path from 'path'
import Koa from 'koa'
import morgan from 'koa-morgan'
import koaStatic from 'koa-static'
import nconf from './nconf'
import logger from './logger'
import routes from './routes'
import error from './error'

const log = logger('server')

export function init(): Koa {
  const app = new Koa()
  const morganFormat = nconf.get('MORGAN_FORMAT')
  const morganSkip = (req, res) => res.statusCode < nconf.get('MORGAN_THRESHOLD')

  return app
    .use(morgan(morganFormat, {skip: morganSkip}))
    .use(error)
    .use(koaStatic(path.resolve(__dirname, '../static'), {defer: false, gzip: true}))
    .use(routes)
}

function start(port: number | string = nconf.get('APP_PORT')) {
  init().listen(port)
  log.info(`listening on port ${port}`)
}

// $FlowIssue https://github.com/facebook/flow/issues/1362
if (require.main === module) {
  try {
    start()
  } catch(e) {
    log.error(e)
  }
}
