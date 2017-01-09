// @flow

import supertest from 'supertest-as-promised'
import TessellateServer from '../src/TessellateServer'

describe('TessellateServer', () => {
  let _server

  afterEach(async () => _server.stop())

  async function startServer(server: TessellateServer): Promise<*> {
    server = _server = await server.start(3001)
    const appRequest = supertest.agent(server.appServer)
    const metricsRequest = supertest.agent(server.metricsServer)
    return {server, appRequest, metricsRequest}
  }

  it('should support a simple route', async () => {
    const {server, appRequest} = await startServer(new TessellateServer())
    server.router.get('/', observable => observable.mapTo('Hello, test!'))

    await appRequest.get('/')
      .expect(200)
      .expect('Hello, test!')
  })

  it('should return metrics', async () => {
    const {server, metricsRequest} = await startServer(new TessellateServer())

    await metricsRequest.get('/metrics')
      .expect(200)
      .expect('Content-Type', /^text\/plain/)
  })

  it('should return metrics', async () => {
    const {server, metricsRequest} = await startServer(new TessellateServer())

    await metricsRequest.get('/metrics')
      .expect(200)
      .expect('Content-Type', /^text\/plain/)
  })

  it('should use additional middleware', async () => {
    const server = new TessellateServer()
    let middlewareWasCalled = false
    server.use((ctx, next) => {
      middlewareWasCalled = true
      ctx.body = 'NOPE'
      return next()
    })

    const {appRequest} = await startServer(server)
    server.router.get('/', observable => observable.mapTo('OK'))

    expect(middlewareWasCalled).toBe(false)

    await appRequest.get('/')
      .expect(200)
      .expect('OK')

    expect(middlewareWasCalled).toBe(true)
  })

  it('should use additional middleware after the server was started', async () => {
    const {server, appRequest} = await startServer(new TessellateServer())
    server.router.get('/', observable => observable.mapTo('OK'))

    let middlewareWasCalled = false

    await appRequest.get('/')
      .expect(200)
      .expect('OK')

    expect(middlewareWasCalled).toBe(false)

    server.use((ctx, next) => {
      middlewareWasCalled = true
      ctx.body = 'NOPE'
      return next()
    })

    expect(middlewareWasCalled).toBe(false)

    await appRequest.get('/')
      .expect(200)
      .expect('OK')

    expect(middlewareWasCalled).toBe(true)
  })

  it('should use deferred middleware', async () => {
    const {server, appRequest} = await startServer(new TessellateServer())
    server.router.get('/', observable => observable.mapTo('NOPE :('))

    server.use(async (ctx, next) => ctx.body = 'YAY :)', true)

    await appRequest.get('/')
      .expect(200)
      .expect('YAY :)')
  })
})
