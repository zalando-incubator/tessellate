// @flow

jest.mock('request-promise-native')

import {resolveSources} from '../../src/actions/sources-resolver'

describe('sources-resolver', () => {

  it('should use nconf bundles source', async () => {
    const sources = await resolveSources({}, {})

    expect(sources.bundles.src).toBe('http://localhost:3001')
  })

  it('merges header properties with properties from nconf', async () => {
    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }

    const sources = await resolveSources(headers, {})

    expect(sources.bundles.src).toBe('http://localhost:3001')
    expect(sources.bundles.path).toBe('zalando.de/foo')
  })

  it('merges remote properties with properties from nconf and headers', async () => {
    require('request-promise-native').mockImplementation(() =>
      Promise.resolve({ sources: { bundles: { path: 'zalando.de/remote' } } }))

    const headers = { 'x-zalando-request-uri': 'https://www.zalando.de/foo' }
    const query = { sources: 'https://cdn.com/sources.json' }

    const sources = await resolveSources(headers, query)

    expect(sources.bundles.src).toBe('http://localhost:3001')
    expect(sources.bundles.path).toBe('zalando.de/remote')
  })

})
