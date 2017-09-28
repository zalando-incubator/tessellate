import { log } from 'tessellate-server';
import { WebpackRunner } from 'webpack-sandboxed';
import { TessellateBundle } from '../model';

export type Options = {
  cssSupport?: boolean;
  production?: boolean;
  packages?: string[];
  externals?: { [key: string]: string };
};

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
    const [bundle, stats] = await this.webpackRunner.run(source);

    log.info('Compiled bundle %j', stats.toJson());

    const js = Object.entries(bundle)
      .filter(([name, _]) => name.endsWith('.js'))
      .map(([name, data]) => ({ name, data }));

    const css = Object.entries(bundle)
      .filter(([name, _]) => name.endsWith('.css'))
      .map(([name, data]) => ({ name, data }));

    return { js, css };
  }
}
