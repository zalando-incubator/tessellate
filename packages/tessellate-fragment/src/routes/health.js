// @flow

import type Router from 'koa-router';
import type Route from '.';

export function health(router: Router): Route {
  return router.get('health', '/health', ctx => {
    ctx.body = 'OK';
  });
}
