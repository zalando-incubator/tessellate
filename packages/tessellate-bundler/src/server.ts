import kcors = require('kcors');
import koaStatic = require('koa-static');
import path = require('path');
import { conf, log, TessellateServer } from 'tessellate-server';
import url = require('url');
import createBundle from './epics/bundles';
import getHealth from './epics/health';

export function init(): TessellateServer {
  const server = new TessellateServer();

  // Send CORS headers.
  server.use(kcors());

  // Configure static bundle serving if necessary.
  const publishTarget = url.parse(conf.getString('publishTarget', ''));

  if (publishTarget.protocol === 'file:') {
    const { hostname, pathname } = publishTarget;
    if (hostname || pathname) {
      const fileSystemPublishTarget = path.resolve(
        process.cwd(),
        path.join(hostname || '', pathname || '')
      );
      log.info('Serving files from %s', fileSystemPublishTarget);
      server.use(koaStatic(fileSystemPublishTarget, { defer: true, gzip: true }));
    } else {
      throw new Error(`Illegal publish target ${publishTarget}`);
    }
  }

  server.router.get('/health', getHealth);
  server.router.post('/bundles/:domain/:name', createBundle);

  return server;
}

export async function start(port = conf.getNumber('appPort', 3001)): Promise<TessellateServer> {
  const server = await init().start(port, port + 1);
  log.info('Listening on port %d', port);
  return server;
}

export function main() {
  start().catch(log.error);
}

if (require.main === module) {
  main();
}
