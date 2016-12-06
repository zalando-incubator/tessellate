// @flow

import Koa from 'koa'
import http from 'http'
import morgan from 'koa-morgan'
import RxRouter from 'koa-router-rx'
import MetricsApp from './MetricsApp'
import nconf from './nconf'
import error from './error'

import type { Server } from 'http'

type Options = {
  name?: string;
};

function startServer(listener: () => void, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    let server = http
      .createServer(listener)
      .listen(port, undefined, undefined,  e => e ? reject(e) : resolve(server))
  })
}

function stopServer(server: ?Server): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) server.close(e => e ? reject(e) : resolve())
    else reject(new Error('Server not running.'))
  })
}

export default class TessellateServer {
  app: Koa;
  metrics: Koa;
  router: RxRouter;
  appServer: ?Server;
  metricsServer: ?Server;

  constructor(options: Options = {}) {
    this.app = new Koa()
    this.app.name = options.name
    this.router = new RxRouter()
    this.metrics = new MetricsApp().app

    const morganFormat = String(nconf.get('MORGAN_FORMAT'))
    const morganThresh = parseInt(nconf.get('MORGAN_THRESHOLD'))
    const morganSkip = (req, res) => res.statusCode < morganThresh

    this.app
      .use(morgan(morganFormat, {skip: morganSkip}))
      .use(error)
      .use(this.router.routes())
      .use(this.router.allowedMethods())
  }

  async start(port: number, metricsPort: number = port + 1): Promise<TessellateServer> {

    const [appServer, metricsServer] = await Promise.all([
      startServer(this.app.callback(), port),
      startServer(this.metrics.callback(), metricsPort)
    ])

    this.appServer = appServer
    this.metricsServer = metricsServer

    return this
  }

  stop(): Promise<any> {
    return Promise.all([
      stopServer(this.appServer),
      stopServer(this.metricsServer)
    ])
  }
}
