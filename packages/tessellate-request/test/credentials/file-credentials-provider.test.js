jest.mock('fs')

import * as credentialsProvider from '../../lib/credentials/file-credentials-provider'
import type {OAuthConfig} from '../../lib/configuration/oauth-configuration'
import UserCredentials from '../../lib/credentials/user-credentials'
import ClientCredentials from '../../lib/credentials/client-credentials'

describe('file credentials', () => {

  it('gets client credentials', () => {
    const clientJson: string = JSON.stringify({client_id: 'id', client_secret: 'secret'})
    require('fs').readFileSync.mockImplementation(() => clientJson)

    const clientCredentials: ClientCredentials = credentialsProvider.getClientCredentials('/credentials/path')

    expect(clientCredentials.getClientId()).toBe('id')
    expect(clientCredentials.getClientSecret()).toBe('secret')
  })

  it('gets user credentials', () => {
    const userJson: string = JSON.stringify({application_username: 'name', application_password: 'password'})
    require('fs').readFileSync.mockImplementation(() => userJson)

    const userCredentials: UserCredentials = credentialsProvider.getUserCredentials('/credentials/path')

    expect(userCredentials.getUsername()).toBe('name')
    expect(userCredentials.getPassword()).toBe('password')
  })
})
