// @flow

import logger from './logger';
import { Problem } from './error';

const log = logger('dispatch');

type DispatchArgs = { [key: string]: mixed };

type DispatchResult = { [key: string]: mixed };

type DispatchHandler<A: DispatchArgs, R: DispatchResult> = (args: A) => Promise<R>;

type Registry = { [key: Symbol]: DispatchHandler<any, any> };

class DispatchProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Dispatch error.', detail, status: 404 });
  }
}

const registry: Registry = {};

export function register<K: Symbol, A: DispatchArgs, R: DispatchResult>(
  name: K,
  handler: DispatchHandler<A, R>
): DispatchHandler<A, R> {
  registry[name] = handler;
  return handler;
}

export default (async function dispatch<K: Symbol, A: DispatchArgs, R: DispatchResult>(
  name: K,
  args: A
): Promise<R> {
  if (!registry[name]) {
    log.error("No such handler '%s'", name);
    throw new DispatchProblem(`No such handler '${name.toString()}'`);
  }
  const handler: DispatchHandler<A, R> = registry[name];
  return await handler(args);
});
