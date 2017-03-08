// @flow

import Koa from 'koa';
import http from 'http';
import compose from 'koa-compose';
import morgan from 'koa-morgan';
import bodyParser from 'koa-bodyparser';
import RxRouter from 'koa-router-rx';
import MetricsApp from './MetricsApp';
import nconf from './nconf';
import error from './error';

import type { Middleware } from 'koa';
import type { Server, IncomingMessage, ServerResponse } from 'http';

type Options = {
  name?: string
};
type Listener = (req: IncomingMessage, res: ServerResponse) => void;

function startServer(listener: Listener, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    let server = http
      .createServer(listener)
      .listen(port, undefined, undefined, e => e ? reject(e) : resolve(server));
  });
}

function stopServer(server: ?Server): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) server.close(e => e ? reject(e) : resolve());
    else reject(new Error('Server not running.'));
  });
}

function additionalMiddleware(middleware: Array<Middleware>): Middleware {
  let composed, length;
  return (ctx, next) => {
    if (!composed || middleware.length !== length) {
      composed = compose(middleware);
      length = middleware.length;
    }
    return composed(ctx, next);
  };
}

export default class TessellateServer {
  app: Koa;
  metrics: Koa;
  router: RxRouter;
  appServer: ?Server;
  metricsServer: ?Server;
  middleware: Array<Middleware>;

  constructor(options: Options = {}) {
    this.app = new Koa();
    this.app.name = options.name;
    this.router = new RxRouter();
    this.metrics = new MetricsApp().app;
    this.middleware = [];

    const morganFormat = String(nconf.get('MORGAN_FORMAT'));
    const morganThresh = parseInt(nconf.get('MORGAN_THRESHOLD'));
    const morganSkip = (req: IncomingMessage, res: ServerResponse) => res.statusCode < morganThresh;

    this.app
      .use(morgan(morganFormat, { skip: morganSkip }))
      .use(error())
      .use(bodyParser({ enableTypes: ['json'] }))
      .use(additionalMiddleware(this.middleware))
      .use(this.router.routes())
      .use(this.router.allowedMethods());
  }

  use(middleware: Middleware, defer: boolean = false): TessellateServer {
    if (defer) {
      this.middleware.push(async (ctx, next) => {
        await next();
        await middleware(ctx, next);
      });
    } else {
      this.middleware.push(middleware);
    }
    return this;
  }

  async start(port: number | string, metricsPort?: number | string): Promise<TessellateServer> {
    if (!port) throw new Error('No port specified!');

    const portNumber = parseInt(port);
    const metricsPortNumber = parseInt(metricsPort);

    const [appServer, metricsServer] = await Promise.all([
      startServer(this.app.callback(), portNumber),
      startServer(this.metrics.callback(), metricsPortNumber || portNumber + 1)
    ]);

    this.appServer = appServer;
    this.metricsServer = metricsServer;

    return this;
  }

  stop(): Promise<any> {
    return Promise.all([stopServer(this.appServer), stopServer(this.metricsServer)]);
  }
}
