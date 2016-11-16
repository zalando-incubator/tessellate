// @flow

import fs from 'fs'
import path from 'path'
import nconf from 'nconf'
import yaml from 'js-yaml'

function readYamlFile(file: string): Object {
  try {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    console.warn(`Unable to load ${file}`)
    return {}
  }
}

function readRoutesFile(file: string): Object {
  const routes = readYamlFile(file)
  if (Object.keys(routes).length === 0) {
    console.warn(`No routes in ${file}`)
  }
  return routes
}

const configFile = path.resolve(process.cwd(), 'config.yaml')
const routesFile = path.resolve(process.cwd(), 'routes.yaml')

export default nconf.use('memory')
                    .argv()
                    .env()
                    .add('config', {type: 'literal', store: readYamlFile(configFile)})
                    .add('config', {type: 'literal', store: {ROUTES: readRoutesFile(routesFile)}})
