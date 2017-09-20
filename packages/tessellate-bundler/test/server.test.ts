jest.mock('mkdirp', () => (_: string, callback: () => void) => callback());
require('mz/fs').writeFile = jest.fn(() => Promise.resolve());

import fs = require('mz/fs');
import path = require('path');
import supertest = require('supertest');
import { conf, TessellateServer } from 'tessellate-server';
import * as server from '../src/server';

describe('server', () => {
  (jest as any).setTimeout(30000);

  let startedServer: TessellateServer;

  beforeEach(async () => {
    conf.set('publishTarget', 'file://test/fixtures');
    jest.resetAllMocks();
  });

  afterEach(async () => startedServer.stop());

  async function startServer() {
    startedServer = await server.start(3001);
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

  describe('/static', () => {
    test('serve static files from PUBLISH_TARGET', async () => {
      const { appRequest } = await startServer();

      await appRequest
        .get('/content.json')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe.skip('/bundles/:domain/:name', () => {
    const contentService = require('../src/content-service');

    test('build a bundle from a JSON payload', async () => {
      contentService.publish.mockImplementation(() => Promise.resolve({ js: '', css: '' }));

      const json = await fs.readFile(path.resolve(__dirname, 'fixtures', 'content.json'));
      const element = JSON.parse(json.toString());
      const { appRequest } = await startServer();

      await appRequest
        .post('/bundles/zalando.de/test')
        .send(element)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(contentService.publish).toBeCalled();
    });
  });

  describe('/metrics', () => {
    test('serve JSON metrics', async () => {
      const { metricsRequest } = await startServer();

      await metricsRequest
        .get('/metrics')
        .expect(200)
        .expect('Content-Type', /^text\/plain/);
    });
  });
});
