import ExtractTextPlugin = require('extract-text-webpack-plugin');
import { log } from 'tessellate-server';
import webpack = require('webpack');
import webpackSandboxed, { WebpackRunner } from 'webpack-sandboxed';
import TessellateBundle from './TessellateBundle';
import * as utils from './utils';

export type Options = {
  cssSupport?: boolean;
  production?: boolean;
  packages?: string[];
  externals?: { [key: string]: string };
};

async function _createWebpackSandbox(args: Options = {}): Promise<WebpackRunner> {
  const rules: webpack.Rule[] = [
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

  const plugins: webpack.Plugin[] = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
  ];

  const externals: webpack.ExternalsObjectElement = Object.assign({}, args.externals, {
    'react': 'react',
    'react-dom': 'react-dom'
  });

  const packages = args.packages || [];
  packages.push('babel-loader');

  if (args.cssSupport) {
    rules.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    });
    plugins.push(new ExtractTextPlugin('[name]-[hash].min.css'));
    packages.push('style-loader', 'css-loader', 'extract-text-webpack-plugin');
  }

  if (args.production) {
    plugins.push(new webpack.optimize.UglifyJsPlugin(), new webpack.optimize.DedupePlugin());
  }

  return webpackSandboxed({
    config: {
      target: 'web',
      module: {
        rules
      },
      output: {
        libraryTarget: 'umd'
      },
      plugins,
      externals
    },
    packages
  });
}

const createWebpackSandbox = utils.memoize(_createWebpackSandbox);

export async function make(source: string, options: Options = {}): Promise<TessellateBundle> {
  log.info('Create WebpackSandbox with options %j', options);
  const webpackSandbox = await createWebpackSandbox(options);
  const [bundle] = await webpackSandbox.run(source);

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
