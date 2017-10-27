import path = require('path');
import TypeConf from 'typeconf';
import { Logger, LoggerInstance, transports } from 'winston';

/**
 * Custom logger for Conf.ts only to avoid a cyclic dependency.
 */
const log: LoggerInstance = new Logger({
  transports: [
    new transports.Console({
      level: process.env.TESSELLATE_LOG_LEVEL
    })
  ]
});

const configFilePath = process.env.TESSELLATE_CONF || '';
if (!configFilePath) {
  log.warn('No config file provided. Consider setting TESSELLATE_CONF.');
}

export const staticDir = path.resolve(__dirname, '../client');

export default new TypeConf().withFile(configFilePath).withEnv('tessellate');
