import { IRouterContext } from 'koa-router';
import BundleProvider from '../../src/domain/BundleProvider';
import BundleRenderer from '../../src/domain/BundleRenderer';
import FragmentService from '../../src/domain/FragmentService';
import SourcesResolver from '../../src/domain/SourcesResolver';

describe('FragmentService', () => {
  const BundleProviderMock = jest.fn<BundleProvider>(() => ({
    fetchBundle: async () => ({
      source: 'module.exports = 42;',
      links: {
        js: 'http://statics.com/index.js',
        css: 'http://statics.com/styles.css'
      }
    })
  }));

  const BundleRendererMock = jest.fn<BundleRenderer>(() => ({
    renderToString: jest.fn(() => '<html></html>')
  }));

  const SourcesResolverMock = jest.fn<SourcesResolver>(() => ({
    resolveSources: async () => ({ bundles: {} })
  }));

  const RouterContextMock = jest.fn<IRouterContext>(() => ({
    set: jest.fn(),
    response: {
      headers: {}
    },
    request: {
      headers: {},
      query: {}
    }
  }));

  const bundleProvider = new BundleProviderMock();
  const bundleRenderer = new BundleRendererMock();
  const sourcesResolver = new SourcesResolverMock();
  const routerContext = new RouterContextMock();

  const service = new FragmentService({ bundleProvider, bundleRenderer, sourcesResolver });

  test('render fragment response', async () => {
    const handler = service.getFragmentHandler();
    await handler(routerContext, () => Promise.resolve());

    expect(bundleRenderer.renderToString).toBeCalledWith(
      'module.exports = 42;', // source
      expect.objectContaining({}) // props
    );

    expect(routerContext.body).toEqual('<html></html>');

    expect(routerContext.set).toBeCalledWith('Content-Type', 'text/html;charset=utf-8');
    expect(routerContext.set).toBeCalledWith(
      'Link',
      expect.arrayContaining([
        '<http://statics.com/styles.css>; rel="stylesheet"',
        '<http://statics.com/index.js>; rel="fragment-script"'
      ])
    );
  });
});
