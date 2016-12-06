// @flow

jest.mock('request-promise-native', () => {
  return jest.fn(() => {
    return Promise.resolve({ sources: { bundles: { path: 'zalando.de/remote' } } })
  });
});

import {resolveSources} from '../../src/actions/sources-resolver'
import nconf from '../../src/nconf'

describe('sources-resolver', () => {

  it('should use nconf sources', async() => {
    nconf.set('sources:bundles:path', '/path/to/bundle')

    const resolved = await resolveSources({}, {})

    expect(resolved.sources.bundles.path).toBe('/path/to/bundle')
  })

  it('should be possible to override nconf sources with headers', async() => {
    nconf.set('sources:bundles:path', '/path/to/bundle')
    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }

    const resolved = await resolveSources(headers, {})

    expect(resolved.sources.bundles.path).toBe('zalando.de/foo')
  })

  it('should be possible to override nconf and header sources with remote sources file', async() => {
    nconf.set('sources:bundles:path', '/path/to/bundle')
    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }
    const query = { sources: 'https://cdn.com/sources.json' }

    const resolved = await resolveSources(headers, query)

    expect(resolved.sources.bundles.path).toBe('zalando.de/remote')
  })

})
