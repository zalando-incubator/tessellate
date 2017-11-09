import { conf, log, TessellateServer } from 'tessellate-server';
import {
  BundleProvider,
  BundleRenderer,
  FragmentService,
  HealthService,
  SourcesResolver
} from './domain';

export function init(): TessellateServer {
  const server = new TessellateServer();
  const healthService = new HealthService();
  const bundleProvider = new BundleProvider();
  const bundleRenderer = new BundleRenderer();
  const bundlesSource = conf.getString('bundlesSource');
  if (!bundlesSource) {
    throw new Error('Missing configuration: "bundlesSource"');
  }
  const sourcesResolver = new SourcesResolver({ bundlesSource });
  const fragmentService = new FragmentService({
    bundleProvider,
    bundleRenderer,
    sourcesResolver
  });

  server.router.get('/health', healthService.getHealthHandler());
  server.router.get('/fragment', fragmentService.getFragmentHandler());

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
