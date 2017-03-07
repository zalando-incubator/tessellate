/* Server API integration tests. */
/* global jasmine */

jest.mock('../src/content-service', () => ({
  publish: jest.fn()
}))

import path from 'path'
import fs from 'mz/fs'
import supertest from 'supertest'
import nconf from '../src/nconf'
import * as server from '../src/server'

describe('server', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

  let _server

  beforeEach(async () => {
    nconf.set('PUBLISH_TARGET', 'file://test/fixtures')
  })

  afterEach(async () => _server.stop())

  async function startServer(): Promise<*> {
    server = _server = await server.start(3001)
    const appRequest = supertest.agent(server.appServer)
    const metricsRequest = supertest.agent(server.metricsServer)
    return {server, appRequest, metricsRequest}
  }

  describe('/health', () => {
    it('should return OK', async () => {
      const {appRequest} = await startServer()

      await appRequest.get('/health')
        .expect(200)
        .expect('OK')
    })
  })

  describe('/static', () => {
    it('should serve static files from PUBLISH_TARGET', async () => {
      const {appRequest} = await startServer()

      await appRequest.get('/content.json')
        .expect(200)
        .expect('Content-Type', /json/)
    })
  })

  describe('/bundles/:domain/:name', () => {
    const contentService = require('../src/content-service')
    contentService.publish.mockImplementation(() => Promise.resolve({js: '', css: ''}))

    it('build a bundle from a JSON payload', async () => {
      const json = await fs.readFile(path.resolve(__dirname, 'fixtures', 'content.json'))
      const element = JSON.parse(json)
      const {appRequest} = await startServer()

      await appRequest.post('/bundles/zalando.de/test')
        .send(element)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(contentService.publish).toBeCalled()
    })
  })

  describe('/metrics', () => {
    it('should serve JSON metrics', async () => {
      const {metricsRequest} = await startServer()

      await metricsRequest.get('/metrics')
        .expect(200)
        .expect('Content-Type', /^text\/plain/)
    })
  })
})
