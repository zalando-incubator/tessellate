// @flow

import fs from 'fs'
import path from 'path'
import nconf from 'nconf'
import yaml from 'js-yaml'

function fileExists(file: string): boolean {
  try {
    fs.statSync(file)
  } catch (e) {
    if (e.code == 'ENOENT') return false
    else throw e
  }
  return true
}

function readFile(file: string, parser: (s: string) => Object): Object {
  try {
    return parser(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    console.error(`Unable to read ${file}`)
    return {}
  }
}

function readJSONFile(file: string): Object {
  return readFile(file, JSON.parse)
}

function readYamlFile(file: string): Object {
  return readFile(file, yaml.safeLoad)
}

function readYamlOrJSONFile(file: string): Object {
  const basePath = file.replace(path.extname(file), '')
  const jsonPath = basePath + '.json'
  const yamlPath = basePath + '.yaml'

  if (fileExists(yamlPath)) {
    return readYamlFile(yamlPath)
  }
  else if (fileExists(jsonPath)) {
    return readJSONFile(jsonPath)
  }
  else {
    console.warn(`No such file: ${file}`)
    return {}
  }
}

const readConfigFile = () => readYamlOrJSONFile(path.resolve(process.cwd(), 'config'))

export default nconf.use('memory')
                    .argv()
                    .env()
                    .add('config', {type: 'literal', store: readConfigFile()})
                    .defaults({
                      MORGAN_FORMAT: 'common',
                      MORGAN_THRESHOLD: 0
                    })
