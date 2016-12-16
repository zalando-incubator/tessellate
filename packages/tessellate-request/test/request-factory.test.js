jest.mock('../lib/configuration/configuration-provider')
jest.mock('../lib/credentials/file-credentials-provider')
jest.mock('../lib/requests/file-backed-oauth-request')

import * as requestFactory from '../lib/request-factory'
import JsonFileBackedOAuthRequest from '../lib/requests/file-backed-oauth-request'
import DefaultRequest from '../lib/requests/default-request'
import ClientCredentials from '../lib/credentials/client-credentials'
import UserCredentials from '../lib/credentials/user-credentials'

describe('create request', () => {

  it('creates json file backed user credentials request', () => {
    mockAuthConfigWithType('OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER')
    mockClientCredentials()
    mockUserCredentials()

    const request = requestFactory.createAuthRequestById('content-service')

    expect(request instanceof JsonFileBackedOAuthRequest).toBeTruthy()
  })

  it('throws an error if authentication type is not supported', () => {
    mockAuthConfigWithType('UNKNOWN')

    expect(() => {
      requestFactory.createAuthRequestById('content-service')
    }).toThrowError('UNKNOWN authentication type is not supported')
  })

  it('creates default request', () => {
    const request = requestFactory.createDefault()

    expect(request instanceof DefaultRequest).toBeTruthy()
  })
})

function mockAuthConfigWithType(type: string) {
  require('../lib/configuration/configuration-provider').getById.mockImplementation(() => { return {
      id: "content-service",
      type: type,
      credentials_directory: "/path/to/credentials",
      access_token_uri: "https://access.tokens.com",
      scopes: ""
  }})
}

function mockClientCredentials() {
  require('../lib/credentials/file-credentials-provider').getClientCredentials.mockImplementation(() =>
    new ClientCredentials('clientId', 'clientPassword')
  )
}

function mockUserCredentials() {
  require('../lib/credentials/file-credentials-provider').getUserCredentials.mockImplementation(() =>
    new UserCredentials('username', 'password')
  )
}
