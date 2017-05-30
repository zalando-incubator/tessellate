import Koa = require('koa');
import Router = require('koa-router');
import prometheus = require('prom-client');
import prometheusGCStats = require('prometheus-gc-stats');

/**
 * A separate koa application for serving Prometheus metrics.
 */
export default class MetricsApp {
  private readonly router: Router;

  /**
   * Koa application instance.
   */
  readonly app: Koa;

  constructor() {
    this.app = new Koa();
    this.router = new Router();

    this.router.get('/metrics', ctx => {
      ctx.body = prometheus.register.metrics()
    });

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    // Start collecting stats with prometheus.
    prometheus.register.clear();
    prometheus.collectDefaultMetrics();
    prometheusGCStats()();
  }
}
