// @flow

import type { ConfigurationLoader } from './configuration-loader'
import * as configurationLoaderFactory from './configuration-loader-factory'

let configurationLoader: ConfigurationLoader

export function getById(id: string): AuthConfig {
  const config = getOrCreateConfigurationLoader().load().find((element) => element.id === id)

  if(config === undefined) {
    throw new Error(`auth configuration with id "${id}" not found`)
  }

  return config
}

export function getByType(type: string): Array<AuthConfig> {
  return getOrCreateConfigurationLoader().load().filter((element) => element.type === type)
}

function getOrCreateConfigurationLoader() {
  if(configurationLoader === undefined) {
    configurationLoader = configurationLoaderFactory.create()
  }
  return configurationLoader
}
