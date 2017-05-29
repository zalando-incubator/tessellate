import Koa = require('koa');
import http = require('http');
import compose = require('koa-compose');
import bodyParser = require('koa-bodyparser');
import RxRouter = require('koa-router');
import MetricsApp from './MetricsApp';
import error from './error';
import { logger } from './logger';
import { Middleware } from 'koa';
import { Server, IncomingMessage, ServerResponse } from 'http';

type Listener = (req: IncomingMessage, res: ServerResponse) => void;

function startServer(listener: Listener, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    let server = http
      .createServer(listener)
      .listen(port, undefined, undefined, (e: Error) => (e ? reject(e) : resolve(server)));
  });
}

function stopServer(server?: Server): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (server) server.close((e: Error) => (e ? reject(e) : resolve()));
    else reject(new Error('Server not running.'));
  });
}

function additionalMiddleware(middleware: Array<Middleware>): Middleware {
  let composed: Middleware;
  let length: number;
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
  appServer?: Server;
  metricsServer?: Server;
  middleware: Array<Middleware>;

  constructor() {
    this.app = new Koa();
    this.router = new RxRouter();
    this.metrics = new MetricsApp().app;
    this.middleware = [];

    this.app
      .use(logger())
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

  async start(port: number, metricsPort?: number): Promise<TessellateServer> {
    // Start the main server.
    const servers = [startServer(this.app.callback(), port)];

    // Only start the metrics server if a metrics port is provided.
    if (metricsPort) {
      servers.push(startServer(this.metrics.callback(), metricsPort));
    }

    // Wait for all the servers to start...
    const [appServer, metricsServer] = await Promise.all(servers);

    this.appServer = appServer;
    this.metricsServer = metricsServer;

    return this;
  }

  stop(): Promise<any> {
    return Promise.all([stopServer(this.appServer), stopServer(this.metricsServer)]);
  }
}
