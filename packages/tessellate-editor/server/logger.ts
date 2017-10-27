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
      level: conf.getString('logLevel', 'info')
    })
  ]
});
