import supertest = require('supertest');
import { conf, TessellateServer } from 'tessellate-server';
import * as server from '../src/server';

describe('server', () => {
  let startedServer: TessellateServer;

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterEach(async () => startedServer.stop());

  async function startServer() {
    startedServer = await server.start(conf.get('appPort'));
    const appRequest = supertest.agent(startedServer.appServer);
    const metricsRequest = supertest.agent(startedServer.metricsServer);
    return { server: startedServer, appRequest, metricsRequest };
  }

  describe('/health', () => {
    test('return OK', async () => {
      const { appRequest } = await startServer();

      await appRequest
        .get('/health')
        .expect(200)
        .expect('OK');
    });
  });
});
