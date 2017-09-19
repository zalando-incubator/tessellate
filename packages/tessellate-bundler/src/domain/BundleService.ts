import { IMiddleware } from 'koa-router';
import { log } from 'tessellate-server';
import * as contentService from '../content-service';
import * as scriptBuilder from '../script-builder';
import TessellateElement from '../TessellateElement';
import Bundler from './Bundler';

export type Args = {
  bundler: Bundler;
};

export default class BundleService {
  private readonly bundler: Bundler;

  constructor(args: Args) {
    this.bundler = args.bundler;
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
      const { js, css } = await contentService.publish({ domain, name, bundle });

      ctx.status = 201;
      ctx.body = { js, css };
    };
  }
}
