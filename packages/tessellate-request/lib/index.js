// @flow

import requestPromiseNative from 'request-promise-native'
import nconf from 'nconf'
import path from 'path'
import fs from 'fs'

import type {SmartRequest} from './requests/smart-request'
import * as requestFactory from './request-factory'

export default class Request {

  delegateRequest: SmartRequest

  constructor(oAuthId?: string) {
    if(oAuthId) {
      this.delegateRequest = requestFactory.createOAuthRequestById(oAuthId)
    } else {
      this.delegateRequest = requestFactory.createDefault()
    }
  }

  async get(url: string): Object {
    return await this.delegateRequest.get(url)
  }

}
