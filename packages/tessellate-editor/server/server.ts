import Koa = require('koa');
import koaStatic = require('koa-static');
import conf, { staticDir } from './conf';
import error from './error';
import { log } from './logger';

export function init(): Koa {
  const app = new Koa();
  log.info('Serving files from %s', staticDir);
  return app.use(error).use(koaStatic(staticDir, { gzip: true, maxage: 31536000 }));
}

async function start(port = conf.getNumber('appPort', 3004)) {
  init().listen(port);
  log.info('listening on port %d', port);
}

export function main() {
  start().catch(e => log.error(e));
}

if (require.main === module) {
  start();
}
