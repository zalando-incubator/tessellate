// @flow

import nconf from '../nconf'
import request from 'request-promise-native'
import path from 'path'
import url from 'url'
import merge from 'lodash.merge'
import { Problem } from '../error'

class SourcesProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Sources generation error.', detail, status: 404})
  }
}

const SOURCES_QUERY_PARAM = 'sources'
const SOURCES_PROPERTY_BY_HEADER_KEY = {
  'x-zalando-request-uri': {
    key: 'bundles:path',
    transformValue: (value) => {
      const {hostname, pathname} = url.parse(value)
      return path.join(hostname.replace(/^www\./, ''), pathname)
    }
  }
}

export async function resolveSources(headers, query) {
  const sources = {}

  assignSourcePropertiesFromConf(sources)
  assignSourcePropertiesFromHeaders(headers, sources)
  await assignSourcePropertiesFromQuery(query, sources)

  return sources
}

async function assignSourcePropertiesFromQuery(query: Object, sources: Object) {
  if (SOURCES_QUERY_PARAM in query) {
    const sourcesUrl = query[SOURCES_QUERY_PARAM]
    try {
      const remoteSources = await request(sourcesUrl)
      merge(sources, remoteSources.sources)
    } catch(err) {
      throw new SourcesProblem(`Unable to load properties from ${sourcesUrl}`)
    }
  }
}

function assignSourcePropertiesFromConf(sources: Object) {
  Object.assign(sources, nconf.get('sources'))
}

function assignSourcePropertiesFromHeaders(headers: Object, sources: Object) {
  for (const headerName of Object.keys(headers)) {
    if (headerName in SOURCES_PROPERTY_BY_HEADER_KEY) {
      let target = sources
      const sourcesKey = SOURCES_PROPERTY_BY_HEADER_KEY[headerName].key
      const keys = sourcesKey.split(':')

      while (keys.length > 1) {
        const key = keys.shift()
        if(!(key in target)) {
          target[key] = {}
        }
        target = target[key]
      }
      const lastKey = keys.shift()
      target[lastKey] = SOURCES_PROPERTY_BY_HEADER_KEY[headerName].transformValue(headers[headerName])
    }
  }
}
