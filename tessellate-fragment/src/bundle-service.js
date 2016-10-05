// @flow

import path from 'path'
import fs from 'mz/fs'
import logger from './logger'

const log = logger('bundle-service')

export type Bundle = {
  source: string;
  links: {
    js: string;
    css: string;
  };
}

export async function fetchBundle(name: string): Promise<Bundle> {
  log.debug('Fetch bundle %s...', name)
  // TODO: fetch bundle from remote location
  const source = await fs.readFile(path.resolve(__dirname, '../../example-bundle/example.min.js'))
  return {source, links: {js: '', css: ''}}
}
