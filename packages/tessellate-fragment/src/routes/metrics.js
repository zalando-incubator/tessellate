// @flow

import prometheus from 'prom-client';

import type Router from 'koa-router';
import type Route from '.';

export function metrics(router: Router): Route {
  return router.get('metrics', '/metrics', ctx => {
    ctx.body = prometheus.register.getMetricsAsJSON();
  });
}
