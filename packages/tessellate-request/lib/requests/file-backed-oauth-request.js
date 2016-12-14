// @flow

import ClientOAuth2 from 'client-oauth2'
import request from 'request-promise-native'
import ClientCredentials from '../credentials/client-credentials'
import UserCredentials from '../credentials/user-credentials'
import type {OAuthConfig} from '../configuration/oauth-configuration'
import * as fileCredentialsProvider from '../credentials/file-credentials-provider'

export default class JsonFileBackedOAuthRequest {

  client: ClientOAuth2
  userCredentials: UserCredentials

  constructor(config: OAuthConfig) {
    this.userCredentials = fileCredentialsProvider.getUserCredentials(config.credentials_directory)
    const clientCredentials: ClientCredentials = fileCredentialsProvider.getClientCredentials(config.credentials_directory)

    this.client = new ClientOAuth2({
      clientId: clientCredentials.getClientId(),
      clientSecret: clientCredentials.getClientSecret(),
      accessTokenUri: config.access_token_uri,
      scopes: config.scopes
    })
  }

  async get(url: string): Object {
    const tokenResponse = await this.client.owner.getToken(this.userCredentials.getUsername(), this.userCredentials.getPassword())
    const headers = {
        'Authorization': `Bearer ${tokenResponse.accessToken}`
    }
    return await request({url: url, headers})
  }
}
