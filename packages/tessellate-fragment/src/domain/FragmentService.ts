import { IMiddleware } from 'koa-router';
import { log } from 'tessellate-server';
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

      log.debug('Received request', ctx.headers, ctx.query);

      const sources = await this.sourcesResolver.resolveSources(headers, query);
      const bundle = await this.bundleProvider.fetchBundle({ sources });

      const props = {};
      const html = this.bundleRenderer.renderToString(bundle.source, props);

      ctx.set('Content-Type', 'text/html;charset=utf-8');
      ctx.set('Link', [
        `<${bundle.links.css}>; rel="stylesheet"`,
        `<${bundle.links.js}>; rel="fragment-script"`
      ]);
      ctx.body = html;
    };
  }
}
