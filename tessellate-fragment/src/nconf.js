// @flow

import fs from 'fs'
import nconf from 'nconf'
import yaml from 'js-yaml'

function readYamlFile(file: string): Object {
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
}

export default nconf.use('memory')
                    .argv()
                    .env()
                    .add('config', {type: 'literal', store: readYamlFile('config.yaml')})
