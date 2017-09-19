import kcors = require('kcors');
import koaStatic = require('koa-static');
import path = require('path');
import { conf, log, TessellateServer } from 'tessellate-server';
import url = require('url');
import { Bundler, BundleService, HealthService, WebpackFactory } from './domain';

export async function init(): Promise<TessellateServer> {
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

  // Load webpack configuration.
  const packages = conf.getObject('npmModules', []) as string[];
  const externals = conf.getObject('npmExternals', []) as string[];
  const production = process.env.NODE_ENV === 'production';

  const webpackFactory = new WebpackFactory({ cssSupport: true, production })
    .withPackages(packages)
    .withExternals(externals);

  const webpackRunner = await webpackFactory.createInstance();
  const bundler = new Bundler({ webpackRunner });
  const bundleService = new BundleService({ bundler });
  const healthService = new HealthService();

  server.router.get('/health', healthService.getHealthHandler());
  server.router.post('/bundles/:domain/:name', bundleService.getBundleHandler());

  return server;
}

export async function start(port = conf.getNumber('appPort', 3001)): Promise<TessellateServer> {
  const server = await init();
  await server.start(port, port + 1);
  log.info('Listening on port %d', port);
  return server;
}

export function main() {
  start().catch(log.error);
}

if (require.main === module) {
  main();
}
