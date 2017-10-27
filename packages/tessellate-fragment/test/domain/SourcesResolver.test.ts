jest.mock('request-promise-native');
import SourcesResolver from '../../src/domain/SourcesResolver';

describe('SourcesResolver', () => {
  const resolver = new SourcesResolver();

  it('should use configured bundles source', async () => {
    const sources = await resolver.resolveSources({ headers: {}, query: {} });
    expect(sources).toBe('http://localhost:3001/');
  });

  it('merges headers with request uri and host with properties from configuration', async () => {
    const headers = {
      'x-zalando-request-uri': '/foo?q=bar',
      'x-zalando-request-host': 'www.zalando.de'
    };

    const sources = await resolver.resolveSources({ headers, query: {} });
    expect(sources).toBe('http://localhost:3001/www.zalando.de/foo?q=bar');
  });

  it('merges remote properties with properties from configuration and headers', async () => {
    require('request-promise-native').mockImplementation(() =>
      Promise.resolve({ sources: { bundles: { path: 'zalando.de/remote' } } })
    );

    const headers = {
      'x-zalando-request-uri': '/foo',
      'x-zalando-request-host': 'www.zalando.de'
    };
    const query = { sources: 'https://cdn.com/sources.json' };

    const sources = await resolver.resolveSources({ headers, query });
    expect(sources).toBe('http://localhost:3001/www.zalando.de/foo');
  });
});
