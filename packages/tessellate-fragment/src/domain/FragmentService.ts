import { IMiddleware } from 'koa-router';
import BundleProvider from './BundleProvider';
import BundleRenderer from './BundleRenderer';
import SourcesResolver from './SourcesResolver';

export default class FragmentService {
  private readonly bundleProvider: BundleProvider;
  private readonly bundleRenderer: BundleRenderer;
  private readonly sourcesResolver: SourcesResolver;

  constructor(args: {
    bundleProvider: BundleProvider;
    bundleRenderer: BundleRenderer;
    sourcesResolver: SourcesResolver;
  }) {
    this.bundleProvider = args.bundleProvider;
    this.bundleRenderer = args.bundleRenderer;
    this.sourcesResolver = args.sourcesResolver;
  }

  public getFragmentHandler(): IMiddleware {
    return async ctx => {
      const { headers, query } = ctx.request;

      const sources = this.sourcesResolver.resolveSources({ headers, query });
      const bundle = await this.bundleProvider.fetchBundle(sources);
      // TODO: implement middleware pattern for external content resolution.

      const props = {};
      const html = this.bundleRenderer.renderToString(bundle.source, props);
      const sourceLink  = `<${bundle.sourceLink}>; rel="fragment-script"`;
      const jsLinks = (bundle.links.js || []).map(js => `<${js}>; rel="script"`);
      const cssLinks = (bundle.links.css || []).map(css => `<${css}>; rel="stylesheet"`);

      ctx.set('Content-Type', 'text/html;charset=utf-8');
      ctx.set('Link', [sourceLink, ...jsLinks, ...cssLinks]);
      ctx.body = html;
    };
  }
}
