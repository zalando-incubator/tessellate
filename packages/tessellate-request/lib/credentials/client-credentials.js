// @flow

export default class ClientCredentials {

  clientId: string
  clientSecret: string

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  getClientId() {
    return this.clientId
  }

  getClientSecret() {
    return this.clientSecret
  }
}
