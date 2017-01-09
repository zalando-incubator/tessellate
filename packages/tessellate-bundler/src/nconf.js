// @flow

import url from 'url'
import path from 'path'
import { nconf } from 'tessellate-server'

export default nconf
  .argv({
    'NPM_MODULES': {
      array: true
    }
  })
  .defaults({
    APP_PORT: 3001,
    PUBLISH_TARGET: 'file://bundles/',
    NPM_MODULES: [],
    NPM_EXTERNALS: []
  })

export function getFileSystemPublishTarget(): string | null {
  const target = url.parse(nconf.get('PUBLISH_TARGET'))
  if (target.protocol === 'file:') {
    const {hostname, pathname} = target
    if (hostname || pathname) {
      return path.resolve(process.cwd(), path.join(hostname || '', pathname || ''))
    } else {
      return null
    }
  }
  return null
}
