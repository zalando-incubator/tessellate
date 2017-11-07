import path = require('path');
import { log, Problem } from 'tessellate-server';
import { WebpackRunner } from 'webpack-sandboxed';
import { File, TessellateBundle } from '../model';

export class BundlerProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Bundler error.', detail });
  }
}

export type Args = {
  webpackRunner: WebpackRunner;
};

/**
 * Bundler compiles JavaScript source code to webpack bundles.
 */
export default class Bundler {
  private readonly webpackRunner: WebpackRunner;

  constructor(args: Args) {
    this.webpackRunner = args.webpackRunner;
  }

  public async compile(source: string): Promise<TessellateBundle> {
    log.info('Compile webpack bundle from source.');
    let bundle;
    let stats;
    try {
      [bundle, stats] = await this.webpackRunner.run(source);
    } catch (e) {
      log.error('Webpack error:', e);
      throw new BundlerProblem(e.message);
    }

    log.info('Compiled bundle: %s', stats.toString('minimal'));

    return Object.entries(bundle).reduce(
      (collection, [name, data]) => {
        const extname = path.extname(name).slice(1);
        const file = { name, data } as File;
        const files = collection[extname] || [];
        return Object.assign(collection, { [extname]: files.concat(file) });
      },
      {} as TessellateBundle
    );
  }
}
