// @flow

import Koa from 'koa'
import morgan from 'koa-morgan'
import RxRouter from 'koa-router-rx'
import nconf from './nconf'
import error from './error'

import type { Server } from 'http'

type Options = {
  name?: string;
};

export default class TessellateServer {
  app: Koa;
  router: RxRouter;
  server: ?Server;

  constructor(options: Options = {}) {
    this.app = new Koa()
    this.app.name = options.name
    this.router = new RxRouter()

    const morganFormat = String(nconf.get('MORGAN_FORMAT'))
    const morganThresh = parseInt(nconf.get('MORGAN_THRESHOLD'))
    const morganSkip = (req, res) => res.statusCode < morganThresh

    this.app
      .use(morgan(morganFormat, {skip: morganSkip}))
      .use(error)
      .use(this.router.routes())
      .use(this.router.allowedMethods())
  }

  start(port: number | string): Promise<TessellateServer> {
    return new Promise((resolve, reject) =>
      this.server = this.app.listen(port, e => e ? reject(e) : resolve(this))
    )
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server)
        this.server.close(e => e ? reject(e) : resolve())
      else
        reject(new Error('Server not running.'))
    })
  }
}
