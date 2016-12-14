// @flow

import type {OAuthConfig} from './oauth-configuration'

import * as oAuthConfigurationLoader from './oauth-configuration-file-loader'
oAuthConfigurationLoader.init()

export function getById(id: string): OAuthConfig {
  const config = oAuthConfigurationLoader.get().find((element) => element.id === id)

  if(config === undefined) {
    throw new Error(`${id} OAuth configuration not found`)
  }

  return config
}
