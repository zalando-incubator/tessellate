jest.mock('fs')

import { FileConfigurationLoader } from '../../lib/configuration/file-configuration-loader'

describe('get configuration from file', () => {

  it('returns configurations', () => {
    const configurations = [
        {
          id: 'id',
          type: 'type',
          credentials_directory: '/credentials/',
          access_token_uri: 'https://accesstokens.com',
          scopes: ''
        }
    ]

    const mockReadFileSync = require('fs').readFileSync
    mockReadFileSync.mockImplementation(() => JSON.stringify(configurations))
    const fileConfigurationLoader = new FileConfigurationLoader('/file.json')

    const loadedConfigurations = fileConfigurationLoader.load()
    expect(loadedConfigurations).toHaveLength(1)
    expect(loadedConfigurations[0].id).toEqual('id')
    expect(mockReadFileSync).toHaveBeenCalledWith('/file.json', 'utf8')
  })
})
