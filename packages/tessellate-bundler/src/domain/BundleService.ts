import { IMiddleware } from 'koa-router';
import { log } from 'tessellate-server';
import Bundler from './Bundler';
import ContentRepository from './ContentRepository';
import generateScript from './generate-script';

export type Args = {
  bundler: Bundler;
  contentRepository: ContentRepository;
};

/**
 * BundleService provides HTTP handlers to write and read Tessellate bundles.
 */
export default class BundleService {
  private readonly bundler: Bundler;
  private readonly contentRepository: ContentRepository;

  constructor(args: Args) {
    this.bundler = args.bundler;
    this.contentRepository = args.contentRepository;
  }

  public getBundleWriteHandler(): IMiddleware {
    return async ctx => {
      // Parse bundle parameters.
      const { key } = ctx.params;
      const element = ctx.request.body;
      log.debug('Parsed bundle request %s', key);

      // Generate code and compile bundle.
      const source = generateScript({
        layout: element,
        content: {}
      });
      const bundle = await this.bundler.compile(source);

      // Publish bundle.
      const result = await this.contentRepository.publish({ key, bundle });

      ctx.status = 201;
      ctx.body = result;
    };
  }

  public getBundleReadHandler(): IMiddleware {
    return this.contentRepository.getReadHandler();
  }
}
