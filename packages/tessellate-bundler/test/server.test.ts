/// <reference types="jest" />

jest.mock('../src/content-service', () => ({
  publish: jest.fn()
}));

import path = require('path');
import fs = require('mz/fs');
import supertest = require('supertest');
import { conf, TessellateServer } from 'tessellate-server';
import * as server from '../src/server';

describe('server', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  let startedServer: TessellateServer;

  beforeEach(async () => {
    conf.set('PUBLISH_TARGET', 'file://test/fixtures');
  });

  afterEach(async () => startedServer.stop());

  async function startServer() {
    startedServer = await server.start(3001);
    const appRequest = supertest.agent(startedServer.appServer);
    const metricsRequest = supertest.agent(startedServer.metricsServer);
    return { server: startedServer, appRequest, metricsRequest };
  }

  describe('/health', () => {
    it('should return OK', async () => {
      const { appRequest } = await startServer();

      await appRequest.get('/health').expect(200).expect('OK');
    });
  });

  describe('/static', () => {
    it('should serve static files from PUBLISH_TARGET', async () => {
      const { appRequest } = await startServer();

      await appRequest.get('/content.json').expect(200).expect('Content-Type', /json/);
    });
  });

  describe('/bundles/:domain/:name', () => {
    const contentService = require('../src/content-service');
    contentService.publish.mockImplementation(() => Promise.resolve({ js: '', css: '' }));

    it('build a bundle from a JSON payload', async () => {
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
    it('should serve JSON metrics', async () => {
      const { metricsRequest } = await startServer();

      await metricsRequest.get('/metrics').expect(200).expect('Content-Type', /^text\/plain/);
    });
  });
});
