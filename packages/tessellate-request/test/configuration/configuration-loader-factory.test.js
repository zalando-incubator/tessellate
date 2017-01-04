import nconf from 'nconf'
nconf.use('memory')

import * as configurationLoaderFactory from '../../lib/configurations/configuration-loader-factory'
import { FileConfigurationLoader } from '../../lib/configurations/file-configuration-loader'

describe('configuration loader factory', () => {

  it('throws an error when AUTH_CONFIGURATION is missing', () => {
    expect(() => {
      const configurationLoader = configurationLoaderFactory.create('file:///config.json')
    }).toThrowError('Tried to create configuration loader, but AUTH_CONFIGURATION is missing')
  })

  it('creates file configuration loader', () => {
    nconf.set('AUTH_CONFIGURATION', 'file:///config.json')
    const configurationLoader = configurationLoaderFactory.create()
    expect(configurationLoader instanceof FileConfigurationLoader).toBeTruthy()
  })

  it('throws an error when url type is not supported', () => {
    nconf.set('AUTH_CONFIGURATION', 'protocol://config.json')
    expect(() => {
      const configurationLoader = configurationLoaderFactory.create('protocol://config.json')
    }).toThrowError('Unable to load auth configuration from protocol://config.json')
  })
})
