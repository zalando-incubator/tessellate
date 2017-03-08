// @flow

import type { SmartRequest } from './requests/smart-request';
import * as requestFactory from './requests/request-factory';

export default class Request {
  delegateRequest: SmartRequest;

  constructor(authId?: string) {
    if (authId) {
      this.delegateRequest = requestFactory.createAuthRequestById(authId);
    } else {
      this.delegateRequest = requestFactory.createDefault();
    }
  }

  async get(url: string): Object {
    return await this.delegateRequest.get(url);
  }
}
