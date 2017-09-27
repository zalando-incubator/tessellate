import merge = require('lodash.merge');
import path = require('path');
import request = require('request-promise-native');
import { conf, Problem } from 'tessellate-server';
import url = require('url');

export type Headers = { [name: string]: string };
export type Sources = { bundles: { src?: string; path?: string } };

type SourcesTransformer = (value: string, headers: Headers) => string;
type SourcesProperty = { key: string; transformValue: SourcesTransformer };

const SOURCES_QUERY_PARAM = 'sources';
const SOURCES_PROPERTY_BY_HEADER_KEY: { [name: string]: SourcesProperty } = {
  'x-zalando-request-uri': {
    key: 'bundles:path',
    transformValue: (value: string, headers: Headers) => {
      const { pathname } = url.parse(value);
      const hostname = headers['x-zalando-request-host'];
      if (pathname) {
        return path.join(hostname.replace(/^www\./, ''), pathname);
      } else {
        return value.replace(/^https?:\/\//, '').replace(/^www\./, '');
      }
    }
  }
};

class SourcesProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Sources generation error.', detail, status: 404 });
  }
}

export default class SourcesResolver {
  public async resolveSources(headers: Headers, query: object): Promise<Sources> {
    const defaultSources: Sources = { bundles: { src: conf.getString('bundlesSource') } };
    const sources = Object.assign({}, defaultSources);

    this.assignSourcePropertiesFromHeaders(headers, sources);
    await this.assignSourcePropertiesFromQuery(query, sources);
    return sources;
  }

  private async assignSourcePropertiesFromQuery(query: any, sources: any) {
    if (SOURCES_QUERY_PARAM in query) {
      const sourcesUrl = query[SOURCES_QUERY_PARAM];
      try {
        const remoteSources = await request({
          url: sourcesUrl,
          json: true,
          gzip: true
        });
        merge(sources, remoteSources.sources);
      } catch (err) {
        throw new SourcesProblem(`Unable to load properties from ${sourcesUrl}`);
      }
    }
  }

  private assignSourcePropertiesFromHeaders(headers: any, sources: any) {
    for (const headerName of Object.keys(headers)) {
      if (headerName in SOURCES_PROPERTY_BY_HEADER_KEY) {
        let target = sources;
        const sourcesKey = SOURCES_PROPERTY_BY_HEADER_KEY[headerName].key;
        const keys = sourcesKey.split(':');

        while (keys.length > 1) {
          const key = keys.shift();
          if (key) {
            if (!(key in target)) {
              target[key] = {};
            }
            target = target[key];
          }
        }
        const lastKey = keys.shift();
        if (lastKey) {
          target[lastKey] = SOURCES_PROPERTY_BY_HEADER_KEY[headerName].transformValue(
            headers[headerName],
            headers
          );
        }
      }
    }
  }
}
