// @flow

import debug from 'debug';

import type Debugger from 'debug';

const PREFIX = 'tessellate-viewer';

type Logger = {
  debug: Debugger,
  info: Debugger,
  warn: Debugger,
  error: Debugger
};

export default function logger(name: string): Logger {
  return {
    debug: debug(`${PREFIX}:debug:${name}`),
    info: debug(`${PREFIX}:info:${name}`),
    warn: debug(`${PREFIX}:warn:${name}`),
    error: debug(`${PREFIX}:error:${name}`)
  };
}
