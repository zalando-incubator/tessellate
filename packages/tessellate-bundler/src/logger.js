// @flow

import debug from 'debug';

const PREFIX = 'tessellate-bundler';

type Logger = {
  debug: *,
  info: *,
  warn: *,
  error: *
};

export default function logger(name: string): Logger {
  return {
    debug: debug(`${PREFIX}:debug:${name}`),
    info: debug(`${PREFIX}:info:${name}`),
    warn: debug(`${PREFIX}:warn:${name}`),
    error: debug(`${PREFIX}:error:${name}`)
  };
}
