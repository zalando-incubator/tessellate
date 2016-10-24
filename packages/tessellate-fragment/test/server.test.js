/**
 * Server API integration tests.
 *
 * @flow
 */

import supertest from 'supertest-as-promised'
import * as server from '../src/server'

describe('server', () => {
  let app, request

  beforeEach(() => {
    app = server.init().listen()
    request = supertest.agent(app)
  })

  afterEach(() => app.close())

  describe('/health', () => {
    it('should return OK', async () => {
      await request.get('/health')
        .expect(200)
        .expect('OK')
    })
  })
})
