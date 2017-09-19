import { IMiddleware } from 'koa-router';

/**
 * Provides service availability information.
 */
export default class HealthService {
  public getHealthHandler(): IMiddleware {
    return async ctx => {
      ctx.body = 'OK';
    };
  }
}
