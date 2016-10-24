// @flow

import fs from 'fs'
import url from 'url'
import path from 'path'
import nconf from 'nconf'
import yaml from 'js-yaml'
import logger from './logger'

const log = logger('nconf')

function readYamlFile(file: string): Object {
  try {
    log.debug('Using configuration file %s', file)
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    log.warn('Unable to load %s', file)
    return {}
  }
}

const configFile = path.resolve(process.cwd(), 'config.yaml')

export default nconf.use('memory')
                    .argv({
                      'NPM_MODULES': {
                        array: true
                      }
                    })
                    .env()
                    .add('config', {type: 'literal', store: readYamlFile(configFile)})
                    .defaults({
                      APP_PORT: 3001,
                      MORGAN_FORMAT: 'dev',
                      MORGAN_THRESHOLD: 0,
                      PUBLISH_TARGET: 'file://bundles/',
                      NPM_MODULES: [],
                      NPM_EXTERNALS: []
                    })

export function getFileSystemPublishTarget(): string | null {
  const target = url.parse(nconf.get('PUBLISH_TARGET'))
  if (target.protocol === 'file:') {
    if (!target.hostname && !target.pathname) return null
    else return path.resolve(process.cwd(), path.join(target.hostname, target.pathname))
  }
  return null
}
