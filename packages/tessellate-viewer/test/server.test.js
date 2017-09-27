/**
 * Server API integration tests.
 */

jest.mock('../src/fragment-service', () => ({
  fetchFragment: jest.fn()
}));

import supertest from 'supertest';
import * as server from '../src/server';

describe('server', () => {
  let app, request;

  beforeEach(() => {
    app = server.init().listen();
    request = supertest.agent(app);
  });

  afterEach(() => app.close());

  describe('/health', () => {
    it('should return OK', async () => {
      await request
        .get('/health')
        .expect(200)
        .expect('OK');
    });
  });

  describe('/:domain/:name', () => {
    it('should return HTML', async () => {
      const fragmentService = require('../src/fragment-service');
      fragmentService.fetchFragment.mockImplementation(() =>
        Promise.resolve({
          html: '<h1>Hello, test!</h1>',
          link: {
            js: 'http://test.com/test/index.js',
            css: 'http://test.com/test/index.css'
          }
        })
      );

      const { text } = await request
        .get('/zalando.de/test')
        .expect(200)
        .expect('Content-Type', /html/);

      expect(text).toMatchSnapshot();
    });
  });
});
