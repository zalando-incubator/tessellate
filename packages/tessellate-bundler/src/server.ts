/// <reference path="../typings/index.d.ts" />

import kcors = require('kcors');
import koaStatic = require('koa-static');
import path = require('path');
import { conf, log, TessellateServer } from 'tessellate-server';
import url = require('url');
import createBundle from './epics/bundles';
import getHealth from './epics/health';

function getFileSystemPublishTarget(): string | null {
  const target = url.parse(conf.getString('publishTarget', ''));
  if (target.protocol === 'file:') {
    const { hostname, pathname } = target;
    if (hostname || pathname) {
      return path.resolve(process.cwd(), path.join(hostname || '', pathname || ''));
    } else {
      return null;
    }
  }
  return null;
}

export function init(): TessellateServer {
  const server = new TessellateServer();

  server.use(kcors());

  const fileSystemPublishTarget = getFileSystemPublishTarget();
  if (fileSystemPublishTarget) {
    log.info('Serving files from %s', fileSystemPublishTarget);
    server.use(koaStatic(fileSystemPublishTarget, { defer: true, gzip: true }));
  }

  server.router.get('/health', getHealth);
  server.router.post('/bundles/:domain/:name', createBundle);

  return server;
}

export async function start(port = conf.getNumber('appPort', 3001)): Promise<TessellateServer> {
  const server = await init().start(port, port + 1);
  log.info('listening on port %d', port);
  return server;
}

export function main() {
  start().catch(log.error);
}

if (require.main === module) {
  main();
}
