// @flow

import request from 'request-promise-native';

export default class DefaultRequest {
  async get(url: string): Object {
    return await request(url);
  }
}
