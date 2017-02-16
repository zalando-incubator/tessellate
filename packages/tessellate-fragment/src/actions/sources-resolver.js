// @flow

import nconf from '../nconf'
import request from 'request-promise-native'
import path from 'path'
import url from 'url'
import merge from 'lodash.merge'
import { Problem } from '../error'

type Sources = {
  bundles: {
    src: string;
    path?: string;
  }
};

class SourcesProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Sources generation error.', detail, status: 404})
  }
}

const SOURCES_QUERY_PARAM = 'sources'
const SOURCES_PROPERTY_BY_HEADER_KEY = {
  'x-zalando-request-uri': {
    key: 'bundles:path',
    transformValue: (value, headers) => {
      const { pathname } = url.parse(value)
      const hostname = headers['x-zalando-request-host']
      if (pathname) {
        return path.join(hostname.replace(/^www\./, ''), pathname)
      } else {
        return value.replace(/^https?:\/\//, '').replace(/^www\./, '')
      }
    }
  }
}
const DEFAULT_SOURCES: Sources = { bundles: { src: nconf.get('BUNDLES_SOURCE') } }

export async function resolveSources(headers: Object, query: Object): Promise<Sources> {
  const sources = Object.assign({}, DEFAULT_SOURCES)

  assignSourcePropertiesFromHeaders(headers, sources)
  await assignSourcePropertiesFromQuery(query, sources)

  return sources
}

async function assignSourcePropertiesFromQuery(query: Object, sources: Object) {
  if (SOURCES_QUERY_PARAM in query) {
    const sourcesUrl = query[SOURCES_QUERY_PARAM]
    try {
      const remoteSources = await request({url: sourcesUrl, json: true})
      merge(sources, remoteSources.sources)
    } catch(err) {
      throw new SourcesProblem(`Unable to load properties from ${sourcesUrl}`)
    }
  }
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
      target[lastKey] = SOURCES_PROPERTY_BY_HEADER_KEY[headerName].transformValue(headers[headerName], headers)
    }
  }
}
