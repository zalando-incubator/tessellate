// @flow

import Request from 'tessellate-request'

export default function createRequest(properties: Object): Request {
  const authId = properties.auth ? properties.auth.id : undefined
  return new Request(authId)
}
