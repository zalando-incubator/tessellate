// @flow

import logger from './logger'
import { Problem } from './error'

const log = logger('dispatch')

type DispatchArgs = {
  headers: { [key: string]: string };
  query: { [key: string]: string };
}

type DispatchResult = {
  body?: string;
  headers?: { [key: string]: string | Array<string> };
}

type DispatchHandler = (args: DispatchArgs) => Promise<DispatchResult>

class DispatchProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Dispatch error.', detail, status: 404})
  }
}

const registry = {}

export function register(name: string, handler: DispatchHandler): DispatchHandler {
  registry[name] = handler
  return handler
}

export default async function dispatch(name: string, args: DispatchArgs): Promise<DispatchResult> {
  if (!registry[name]) {
    log.error('No such handler \'%s\'', name)
    throw new DispatchProblem(`No such handler '${name}'`)
  }
  return await registry[name](args)
}
