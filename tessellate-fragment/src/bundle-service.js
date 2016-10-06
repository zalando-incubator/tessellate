// @flow

import url from 'url'
import path from 'path'
import request from 'request-promise-native'
import nconf from './nconf'
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
  const jsURL = url.format({
    protocol: 'https',
    hostname: nconf.get('FRAGMENT_BUNDLES'),
    pathname: path.join(name, 'index.js')
  })
  const cssURL = url.format({
    protocol: 'https',
    hostname: nconf.get('FRAGMENT_BUNDLES'),
    pathname: path.join(name, 'index.css')
  })

  log.debug('Fetch bundle %s', jsURL)
  const source = await request(jsURL)
  return {source, links: {js: jsURL, css: cssURL}}
}
