// @flow

import path from 'path';
import Koa from 'koa';
import morgan from 'koa-morgan';
import koaStatic from 'koa-static';
import nconf from './nconf';
import logger from './logger';
import error from './error';

const log = logger('server');

export function init(): Koa {
  const app = new Koa();
  const morganFormat = nconf.get('MORGAN_FORMAT');
  const morganSkip = (req, res) => res.statusCode < nconf.get('MORGAN_THRESHOLD');

  const staticDir = nconf.get('STATIC_DIR') || path.resolve(__dirname, '../client');
  log.info('Serving files from %s', staticDir);

  return app
    .use(morgan(morganFormat, { skip: morganSkip }))
    .use(error)
    .use(koaStatic(staticDir, { defer: false, gzip: true }));
}

async function start(port: number | string = nconf.get('APP_PORT')) {
  init().listen(port);
  log.info('listening on port %d', port);
}

export function main() {
  start().catch(log.error);
}

if (require.main === module) {
  start();
}
