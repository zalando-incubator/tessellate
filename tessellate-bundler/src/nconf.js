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
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    log.warn(`Unable to load ${file}`)
    return {}
  }
}

const configFile = path.resolve(process.cwd(), 'config.yaml')

export default nconf.use('memory')
                    .argv()
                    .env()
                    .add('config', {type: 'literal', store: readYamlFile(configFile)})

export function getFileSystemPublishTarget(): string | null {
  const target = url.parse(nconf.get('PUBLISH_TARGET'))
  if (target.protocol === 'file:') {
    if (!target.hostname || !target.pathname) return null
    else return path.join(target.hostname, target.pathname)
  }
  return null
}
