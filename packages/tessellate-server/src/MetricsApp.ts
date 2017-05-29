import Koa = require('koa');
import Router = require('koa-router');
import prometheus = require('prom-client');
import prometheusGCStats = require('prometheus-gc-stats');

export default class MetricsApp {
  app: Koa;
  router: Router;

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
