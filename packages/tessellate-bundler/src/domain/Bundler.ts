import { log, Problem } from 'tessellate-server';
import { WebpackRunner } from 'webpack-sandboxed';
import { TessellateBundle } from '../model';

export class BundlerProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Bundler error.', detail });
  }
}

export type Args = {
  webpackRunner: WebpackRunner;
};

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

    const js = Object.entries(bundle)
      .filter(([name, _]) => name.endsWith('.js'))
      .map(([name, data]) => ({ name, data }));

    const css = Object.entries(bundle)
      .filter(([name, _]) => name.endsWith('.css'))
      .map(([name, data]) => ({ name, data }));

    return { js, css };
  }
}
