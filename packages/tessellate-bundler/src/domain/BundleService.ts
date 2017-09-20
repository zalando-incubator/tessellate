import { IMiddleware } from 'koa-router';
import { log } from 'tessellate-server';
import { TessellateElement } from '../model';
import * as scriptBuilder from '../script-builder';
import Bundler from './Bundler';
import ContentRepository from './ContentRepository';

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
      const element = ctx.request.body as TessellateElement;
      log.debug('Parsed bundle request %s/%s', domain, name);

      // Generate code and compile bundle.
      const source = scriptBuilder.build(element);
      const bundle = await this.bundler.compile(source);

      // Publish bundle.
      const { js, css } = await this.contentRepository.publish({ domain, name, bundle });

      ctx.status = 201;
      ctx.body = { js, css };
    };
  }
}
