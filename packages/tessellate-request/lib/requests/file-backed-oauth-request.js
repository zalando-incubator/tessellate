// @flow

import request from 'request-promise-native'
import * as tokenStorage from '../configurations/token-storage'

export default class JsonFileBackedOAuthRequest {

  authId: string

  constructor(authId: string) {
    this.authId = authId
  }

  async get(url: string): Object {
    const token = await tokenStorage.getTokenById(this.authId)
    return await request.get(url, {
      auth: {
        bearer: token
      }
    })
  }
}
