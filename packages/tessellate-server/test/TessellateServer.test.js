// @flow

import supertest from 'supertest-as-promised'
import TessellateServer from '../src/TessellateServer'

describe('TessellateServer', () => {
  let server, request

  beforeEach(async () => {
    server = await new TessellateServer().start(3001)
    request = supertest.agent(server.server)
  })

  afterEach(() => server.stop())

  it('should support a simple route', async () => {
    server.router.get('/', observable => observable.mapTo('Hello, test!'))

    await request.get('/')
      .expect(200)
      .expect('Hello, test!')
  })
})
