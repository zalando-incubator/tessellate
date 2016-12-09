// @flow

import supertest from 'supertest-as-promised'
import TessellateServer from '../src/TessellateServer'

describe('TessellateServer', () => {
  let server, appRequest, metricsRequest

  beforeEach(async () => {
    server = await new TessellateServer().start(3001)
    appRequest = supertest.agent(server.appServer)
    metricsRequest = supertest.agent(server.metricsServer)
  })

  afterEach(() => server.stop())

  it('should support a simple route', async () => {
    server.router.get('/', observable => observable.mapTo('Hello, test!'))

    await appRequest.get('/')
      .expect(200)
      .expect('Hello, test!')
  })

  it('should return metrics', async () => {
    await metricsRequest.get('/metrics')
      .expect(200)
      .expect('Content-Type', /^text\/plain/)
  })
})
