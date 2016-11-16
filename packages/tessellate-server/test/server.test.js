/**
 * Server API integration tests.
 *
 * @flow
 */

import supertest from 'supertest-as-promised'
import Server from '../src'

describe('server', () => {
  let app, request

  const server = new Server({
    name: 'test',
    init: (routes => {
      routes.test.get(observable => observable.flatMap(({ctx, next}) => ctx.body = 'TEST'))
    })
  })

  beforeEach(() => {
    app = server.start(3001)
    request = supertest.agent(app)
  })

  afterEach(() => app.close())

  describe('/test', () => {
    it('should return TEST', async () => {
      await request.get('/test')
        .expect(200)
        .expect('TEST')
    })
  })
})
