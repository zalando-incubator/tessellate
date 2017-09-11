import expressWinston = require('express-winston');
import { Middleware } from 'koa';
import { Logger, LoggerInstance, transports } from 'winston';
import conf from './conf';

const colorize = process.env.NODE_ENV !== 'production';

/**
 * A [winston](https://github.com/winstonjs/winston) logger instance.
 */
export const log: LoggerInstance = new Logger({
  transports: [
    new transports.Console({
      colorize,
      level: conf.get('logLevel')
    })
  ]
});

/**
 * Create a [winston](https://github.com/winstonjs/winston) logging middleware for koa.
 * @param options [Options](https://github.com/bithavoc/express-winston#options) for winston.
 * @return koa middleware.
 */
export function logger(options?: expressWinston.Options): Middleware {
  const middlewareFn = expressWinston.logger({
    winstonInstance: log,
    expressFormat: true,
    meta: false,
    colorize,
    ...options
  });

  return (ctx, next) =>
    new Promise((resolve, reject) => {
      middlewareFn(ctx.req, ctx.res, (err: Error) => (err ? reject(err) : resolve(ctx)));
    }).then(next);
}
