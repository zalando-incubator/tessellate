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
    const [bundle] = await this.webpackRunner.run(source);

    const files = Object.keys(bundle);
    log.info('Made bundle %j', files);
    // TODO: handle case of multiple files
    const jsBundle = files.filter(b => b.endsWith('.js'))[0];
    const cssBundle = files.filter(b => b.endsWith('.css'))[0];

    const js = {
      name: jsBundle,
      source: bundle[jsBundle]
    };
    const css = cssBundle
      ? {
          name: cssBundle,
          source: bundle[cssBundle]
        }
      : undefined;

    return { js, css };
  }
}
