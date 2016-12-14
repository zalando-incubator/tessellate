// @flow

jest.mock('../../lib/configuration/oauth-configuration-file-loader')

import * as configurationProvider from '../../lib/configuration/oauth-configuration-provider'
import type {OAuthConfig} from '../../lib/configuration/oauth-configuration'

describe('get configuration by id', () => {

  it('gets configuration by id', () => {
    const configurations: Array<OAuthConfig> = [
        {
          id: 'id',
          type: 'type',
          credentials_directory: '/credentials/',
          access_token_uri: 'https://accesstokens.com',
          scopes: ''
        }
    ]

    require('../../lib/configuration/oauth-configuration-file-loader')
      .get.mockImplementation(() => configurations)

    const foundConfig = configurationProvider.getById('id')

    expect(configurations[0]).toBe(foundConfig)
  })

  it('throws an error when configuration with id does not exist', () => {
    expect(() => {
      configurationProvider.getById('unknown-id')
    }).toThrowError('unknown-id OAuth configuration not found')
  })
})
