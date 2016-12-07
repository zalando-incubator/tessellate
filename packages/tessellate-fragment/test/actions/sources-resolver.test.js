// @flow

jest.mock('request-promise-native')

import {resolveSources} from '../../src/actions/sources-resolver'
import nconf from '../../src/nconf'

describe('sources-resolver', () => {

  it('should use nconf sources', async () => {
    nconf.set('sources:bundles:path', '/path/to/bundle')

    const sources = await resolveSources({}, {})

    expect(sources.bundles.path).toBe('/path/to/bundle')
  })

  it('merges header properties with properties from nconf', async () => {
    nconf.set('sources:bundles:src', 'http://localhost/bundles')
    nconf.set('sources:bundles:path', '/path/to/bundle')
    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }

    const sources = await resolveSources(headers, {})

    expect(sources.bundles.src).toBe('http://localhost/bundles')
    expect(sources.bundles.path).toBe('zalando.de/foo')
  })

  it('merges remote properties with properties from nconf and headers', async () => {
    require('request-promise-native').mockImplementation(() =>
      Promise.resolve({ sources: { bundles: { path: 'zalando.de/remote' } } }))

    nconf.set('sources:bundles:src', 'http://localhost/bundles')
    nconf.set('sources:bundles:path', '/path/to/bundle')
    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }
    const query = { sources: 'https://cdn.com/sources.json' }

    const sources = await resolveSources(headers, query)

    expect(sources.bundles.src).toBe('http://localhost/bundles')
    expect(sources.bundles.path).toBe('zalando.de/remote')
  })

})
