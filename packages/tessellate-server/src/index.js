// @flow

import Koa from 'koa'
import morgan from 'koa-morgan'
import nconf from './nconf'
import error from './error'
import { router, routes } from './routes'

import type { Context, RouteInitializerIndex } from './routes'

type Options = {
  name: string;
  init: (routes: RouteInitializerIndex<Context>) => void;
}

export default class App {
  app: Koa;

  constructor(options: Options) {
    this.app = new Koa()
    const morganFormat = nconf.get('MORGAN_FORMAT')
    const morganSkip = (req, res) => res.statusCode < nconf.get('MORGAN_THRESHOLD')

    // Initialize route logic.
    options.init(routes)

    this.app
      .use(morgan(morganFormat, {skip: morganSkip}))
      .use(error)
      .use(router.routes())
      .use(router.allowedMethods())
  }

  start(port: number | string): Koa {
    return this.app.listen(port)
  }
}
