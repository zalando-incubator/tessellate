// @flow

import nconf from 'nconf'
import fs from 'fs'
import type {OAuthConfig} from './oauth-configuration'

let configurations: Array<OAuthConfig>

export function init() {
  const filePath = nconf.get('OAUTH_CONFIGURATIONS_FILE')
  configurations = filePath === undefined ? [] : JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function get(): Array<OAuthConfig> {
  return configurations.slice()
}
