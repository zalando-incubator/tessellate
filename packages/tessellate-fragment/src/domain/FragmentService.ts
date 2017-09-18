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

      const sources = await this.sourcesResolver.resolveSources(headers, query);
      const { bundle, props } = await this.bundleProvider.fetchBundle({ headers, sources });

      const content = {};
      props.content = content;

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
