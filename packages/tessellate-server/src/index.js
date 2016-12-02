// @flow

import Koa from 'koa'
import morgan from 'koa-morgan'
import nconf from './nconf'
import error from './error'
import { router, routes } from './routes'

import type { RouteDefinitions, Context, RouteInitializerIndex } from './routes'

type Options = {
  name?: string;
  init: (routes: RouteInitializerIndex<Context>) => void;
  routes?: RouteDefinitions
};

export default class App {
  app: Koa;
  routes: RouteInitializerIndex<Context>;

  constructor(options: Options) {
    this.app = new Koa()
    this.app.name = options.name

    const morganFormat = String(nconf.get('MORGAN_FORMAT'))
    const morganThresh = parseInt(nconf.get('MORGAN_THRESHOLD'))
    const morganSkip = (req, res) => res.statusCode < morganThresh

    // Initialize route logic.
    const routeDefinitions = options.routes ? options.routes : nconf.get('ROUTES')
    this.routes = routes(routeDefinitions)
    options.init(this.routes)

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
