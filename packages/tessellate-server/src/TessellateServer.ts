import Koa = require('koa');
import http = require('http');
import compose = require('koa-compose');
import bodyParser = require('koa-bodyparser');
import KoaRouter = require('koa-router');
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

/**
 * Care a middleware that lazily composes middlewares from a mutable array.
 * This way we can inject additional middlewares into the middleware stack
 * even after the stack was already set up.
 *
 * @param middleware List of middlewares to compose.
 */
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

/**
 * Manages koa servers for the application and optional metrics.
 */
export default class TessellateServer {
  private readonly app: Koa;
  private readonly metrics: Koa;
  appServer?: Server;
  metricsServer?: Server;
  private readonly middleware: Array<Middleware>;

  /**
   * [koa-router](https://github.com/alexmingoia/koa-router/tree/master) instance.
   */
  readonly router: KoaRouter;

  constructor() {
    this.app = new Koa();
    this.router = new KoaRouter();
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

  /**
   * Add koa middleware. This middleware will run after the internal
   * middlewares for logging, error handling and body-parsing.
   * @param middleware Koa middleware to use.
   * @param defer Run the middleware after all other middleware.
   * @return This TessellateServer instance.
   */
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

  /**
   * Start the koa application server. If metricsPort is provided,
   * an optional Prometheus metrics server will be started as well.
   * @param port Required port for the application server.
   * @param metricsPort Optional port for the metrics server.
   * @return This TessellateServer instance.
   */
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

  /**
   * Stop all running servers.
   */
  async stop(): Promise<void> {
    await Promise.all([stopServer(this.appServer), stopServer(this.metricsServer)]);
  }
}
