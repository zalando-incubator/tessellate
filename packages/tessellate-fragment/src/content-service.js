// @flow

import url from 'url'
import logger from './logger'
import { Problem } from './error'
import Request from 'tessellate-request'

const log = logger('content-service')

export async function fetchContent(sources: Object): Promise<Object> {
  if(sources.properties && sources.properties.src) {
    const uri = url.parse(sources.properties.src)
    const baseUrl = url.format({
      protocol: uri.protocol,
      hostname: uri.hostname,
      port: uri.port,
      pathname: sources.properties.path,
      query: sources.properties.query
    })

    const authId = sources.properties.auth ? sources.properties.auth.id : undefined
    const content = await new Request(authId).get(baseUrl)
    return JSON.parse(content)
  }

  return await Promise.resolve({})
}
