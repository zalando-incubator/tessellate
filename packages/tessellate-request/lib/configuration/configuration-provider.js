// @flow

import type { ConfigurationLoader } from './configuration-loader'
import * as configurationLoaderFactory from './configuration-loader-factory'

let configurationLoader: ConfigurationLoader

export function getById(id: string): AuthConfig {
  if(configurationLoader === undefined) {
    configurationLoader = configurationLoaderFactory.create()
  }

  const config = configurationLoader.load().find((element) => element.id === id)

  if(config === undefined) {
    throw new Error(`auth configuration with id "${id}" not found`)
  }

  return config
}
