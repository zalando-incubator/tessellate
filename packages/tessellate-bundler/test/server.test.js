/**
 * Server API integration tests.
 */

jest.mock('../src/content-service')

import path from 'path'
import fs from 'mz/fs'
import supertest from 'supertest-as-promised'
import nconf from '../src/nconf'
import * as server from '../src/server'

describe('server', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

  let serv, request

  beforeEach(async () => {
    nconf.set('PUBLISH_TARGET', 'file://test/fixtures')
    serv = await server.init().start()
    request = supertest.agent(serv.app)
  })

  afterEach(() => serv.stop())

  describe('/health', () => {
    it('should return OK', async () => {
      await request.get('/health')
        .expect(200)
        .expect('OK')
    })
  })

  describe('/static', () => {
    it('should serve static files from PUBLISH_TARGET', async () => {
      await request.get('/content.json')
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

      await request.post('/bundles/zalando.de/test')
        .send(element)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(contentService.publish).toBeCalled()
    })
  })

  describe('/metrics', () => {
    it('should serve JSON metrics', async () => {
      await request.get('/metrics')
        .expect(200)
        .expect('Content-Type', /json/)
    })
  })
})
