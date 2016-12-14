// @flow

import UserCredentials from './user-credentials'
import ClientCredentials from './client-credentials'

export default class Credentials {

  userCredentials: UserCredentials
  clientCredentials: ClientCredentials

  constructor(userCredentials: UserCredentials, clientCredentials: ClientCredentials) {
    this.userCredentials = userCredentials
    this.clientCredentials = clientCredentials
  }

  getUserCredentials() {
    return this.userCredentials
  }

  getClientCredentials() {
    return this.clientCredentials
  }
}
