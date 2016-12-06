// @flow

import Koa from 'koa'
import RxRouter from 'koa-router-rx'
import prometheus from 'prom-client'
import prometheusGCStats from 'prometheus-gc-stats'

import type { Epic } from 'koa-router-rx'

export default class MetricsApp {
  app: Koa;
  router: RxRouter;

  constructor() {
    this.app = new Koa()
    this.router = new RxRouter()

    this.router.get('/metrics', observable =>
      observable.mapTo(prometheus.register.metrics()))

    this.app
      .use(this.router.routes())
      .use(this.router.allowedMethods())

    // Start collecting GC stats with prometheus.
    prometheusGCStats()()
  }
}
