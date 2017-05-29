import expressWinston = require('express-winston');
import conf from './conf';
import { Logger, LoggerInstance, transports } from 'winston';
import { Middleware } from 'koa';

const colorize = conf.get('NODE_ENV') !== 'production';

export const log: LoggerInstance = new Logger({
  transports: [
    new (transports.Console)({
      colorize,
      level: conf.get('TESSELLATE_LOG_LEVEL')
    })
  ]
});

export function logger(options?: expressWinston.Options): Middleware {
  const middlewareFn = expressWinston.logger({
    winstonInstance: log,
    expressFormat: true,
    meta: false,
    colorize,
    ...options
  });

  return (ctx, next) => new Promise((resolve, reject) => {
    middlewareFn(ctx.req, ctx.res, (err: Error) => err ? reject(err) : resolve(ctx))
  }).then(next);
}
