import ExtractTextPlugin = require('extract-text-webpack-plugin');
import { log } from 'tessellate-server';
import webpack = require('webpack');
import webpackSandboxed, { WebpackRunner } from 'webpack-sandboxed';

export type Args = {
  cssSupport?: boolean;
  production?: boolean;
};

export default class WebpackFactory {
  private readonly rules: webpack.Rule[];
  private readonly cssSupport: boolean;
  private readonly production: boolean;
  private readonly packages: string[];
  private readonly plugins: webpack.Plugin[];
  private readonly externals: webpack.ExternalsObjectElement;

  constructor(args: Args = {}) {
    this.cssSupport = args.cssSupport || false;
    this.production = args.production || false;
    this.packages = [];
    this.plugins = [];
    this.externals = {};

    // Base rules.
    this.rules = [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
          babelrc: false
        }
      }
    ];

    // Required packages.
    this.packages.push('babel-loader');

    // Required plugins.
    this.plugins.push(
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
    );

    // Required externals.
    Object.assign(this.externals, {
      react: 'react',
      'react-dom': 'react-dom'
    });

    if (this.cssSupport) {
      // Additional rules for CSS.
      log.debug('Add webpack CSS rules.');
      this.rules.push({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      });

      // Additional packages for CSS.
      log.debug('Add webpack CSS packages.');
      this.packages.push('style-loader', 'css-loader', 'extract-text-webpack-plugin');

      // Additinal plugins for CSS.
      log.debug('Add webpack CSS plugins.');
      this.plugins.push(new ExtractTextPlugin('[name]-[hash].min.css'));

      if (args.production) {
        // Additional plugins for production.
        log.debug('Add webpack production plugins.');
        this.plugins.push(new webpack.optimize.UglifyJsPlugin());
        this.plugins.push(new webpack.optimize.DedupePlugin());
      }
    }
  }

  public withPackages(packages: string[]): WebpackFactory {
    this.packages.push(...packages);
    return this;
  }

  public withExternals(externals: { [key: string]: string } | string[]): WebpackFactory {
    if (Array.isArray(externals)) {
      const object = externals.reduce((exts, ext) => Object.assign(exts, { [ext]: ext }), {});
      Object.assign(this.externals, object);
    } else {
      Object.assign(this.externals, externals);
    }
    return this;
  }

  public async createInstance(): Promise<WebpackRunner> {
    log.info('Create new webpack instance.');
    return webpackSandboxed({
      config: {
        target: 'web',
        module: {
          rules: this.rules.slice()
        },
        output: {
          libraryTarget: 'umd'
        },
        plugins: this.plugins.slice(),
        externals: Object.assign({}, this.externals)
      },
      packages: this.packages.slice()
    });
  }
}
