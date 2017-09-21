import { IMiddleware } from 'koa-router';
import { log } from 'tessellate-server';
import Bundler from './Bundler';
import ContentRepository from './ContentRepository';
import generateScript from './generate-script';

export type Args = {
  bundler: Bundler;
  contentRepository: ContentRepository;
};

export default class BundleService {
  private readonly bundler: Bundler;
  private readonly contentRepository: ContentRepository;

  constructor(args: Args) {
    this.bundler = args.bundler;
    this.contentRepository = args.contentRepository;
  }

  public getBundleHandler(): IMiddleware {
    return async ctx => {
      // Parse bundle parameters.
      const { domain, name } = ctx.params;
      const element = ctx.request.body;
      log.debug('Parsed bundle request %s/%s', domain, name);

      // Generate code and compile bundle.
      const source = generateScript({
        layout: element,
        content: {}
      });
      const bundle = await this.bundler.compile(source);

      // Publish bundle.
      const { js, css } = await this.contentRepository.publish({ domain, name, bundle });

      ctx.status = 201;
      ctx.body = { js, css };
    };
  }
}
