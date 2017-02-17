jest.mock('../../lib/configurations/configuration-loader-factory')

import * as configurationProvider from '../../lib/configurations/configuration-provider'

describe('get configuration by id', () => {

  function createConfigurationsWithId(id) {
    return [
        {
          id: id,
          type: 'type',
          credentials_directory: '/credentials/',
          access_token_uri: 'https://accesstokens.com',
          scopes: ''
        }
    ]
  }

  function mockFactoryWithLoader(loader) {
    const mockLoaderFactory = require('../../lib/configurations/configuration-loader-factory')
    mockLoaderFactory.create.mockImplementation(() => loader)
  }

  const MockFileLoader = class MockFileLoader {
    configurations

    constructor(configurations) {
      this.configurations = configurations
    }
    load(): Array<AuthConfig> {
      return this.configurations
    }
  }

  it('gets configuration by id', () => {
    const configurations = createConfigurationsWithId('id')
    mockFactoryWithLoader(new MockFileLoader(configurations))

    const foundConfig = configurationProvider.getById('id')

    expect(foundConfig).toBe(configurations[0])
  })

  it('throws an error when configuration with id does not exist', () => {
    expect(() => {
      const configurations = createConfigurationsWithId('unknown-id')
      mockFactoryWithLoader(new MockFileLoader(configurations))

      configurationProvider.getById('unknown-id')
    }).toThrowError('auth configuration with id "unknown-id" not found')
  })
})
