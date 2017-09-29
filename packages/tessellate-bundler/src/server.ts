import kcors = require('kcors');
import { conf, log, TessellateServer } from 'tessellate-server';
import { Bundler, BundleService, ContentRepository, HealthService, WebpackFactory } from './domain';

export async function init(): Promise<TessellateServer> {
  const server = new TessellateServer();

  // Send CORS headers.
  server.use(kcors());

  // Load webpack configuration.
  const packages = conf.getObject('npmModules', []) as string[];
  const externals = conf.getObject('npmExternals', []) as string[];
  const production = process.env.NODE_ENV === 'production';

  const webpackFactory = new WebpackFactory({ cssSupport: true, production })
    .withPackages(packages)
    .withExternals(externals);

  const publishTarget = conf.getString('publishTarget', '');
  const contentRepository = new ContentRepository({ target: publishTarget });

  const webpackRunner = await webpackFactory.createInstance();
  const bundler = new Bundler({ webpackRunner });
  const bundleService = new BundleService({ bundler, contentRepository });
  const healthService = new HealthService();

  server.router.get('/health', healthService.getHealthHandler());
  server.router.post('/bundles/:key+', bundleService.getBundleHandler());
  server.router.get('/bundles/:key+', contentRepository.getReadHandler());

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
