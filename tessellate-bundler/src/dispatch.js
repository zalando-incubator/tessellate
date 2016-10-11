// @flow

import logger from './logger'
import { Problem } from './error'

const log = logger('dispatch')

type DispatchArgs = { [key: string]: mixed }

type DispatchResult<K: Symbol> = { [key: string]: mixed }

type DispatchHandler<K: Symbol, A: DispatchArgs, R: DispatchResult<K>> = (args: A) => Promise<R>

type Registry = { [key: Symbol]: DispatchHandler<*, any, *> }

class DispatchProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Dispatch error.', detail, status: 404})
  }
}

const registry: Registry = {}

export function register<K: Symbol, A: DispatchArgs>(name: K, handler: DispatchHandler<K, A, *>): DispatchHandler<K, A, *> {
  registry[name] = handler
  return handler
}

export default async function dispatch<K: Symbol, A: DispatchArgs>(name: K, args: A): Promise<DispatchResult<K>> {
  if (!registry[name]) {
    log.error('No such handler \'%s\'', name)
    throw new DispatchProblem(`No such handler '${name.toString()}'`)
  }
  const handler: DispatchHandler<K, A, K> = registry[name]
  return await handler(args)
}
