// @flow

import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackSandbox from 'webpack-sandboxed'
import logger from './logger'
import nconf from './nconf'
import * as utils from './utils'

export type BundleType = {
  js: {
    name: string;
    source: string;
  };
  css?: {
    name: string;
    source: string;
  };
};

const log = logger('bundle-service')

async function _createWebpackSandbox(): Promise<WebpackSandbox> {
  const sandbox = await WebpackSandbox.createInstance({
    config: {
      target: 'web',
      module: {
        loaders: [
          {
            test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
            presets: ['es2015', 'react']
            }
          },
          {
            test: /\.css$/, loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: 'css-loader'
            })
          }
        ]
      },
      output: {
        libraryTarget: 'umd'
      },
      plugins: [
        new webpack.DefinePlugin({process: {env: {NODE_ENV: '"production"'}}}),
        new ExtractTextPlugin('[name]-[hash].min.css')
      ].concat((nconf.get('NODE_ENV') === 'production'
          ? [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin()
          ]
          : [])),
      externals: {
        'react': 'react',
        'react-dom': 'react-dom'
      }
    },
    packages: [
      'style-loader',
      'css-loader',
      'z-shop-ui' // FIXME: make configurable
    ],
    includes: [
      // path.resolve(__dirname, './components')
    ]
  })
  return sandbox
}

const createWebpackSandbox = utils.memoize(_createWebpackSandbox)

export async function make(source: string): Promise<BundleType> {
  log.debug('Create WebpackSandbox...')
  const sandbox = await createWebpackSandbox()
  log.debug('Compile bundle...')
  const [bundle, stats] = await sandbox.run(source)

  const files = Object.keys(bundle)
  log.debug('Made bundle %o', files)
  // TODO: handle case of multiple files
  const jsBundle = files.filter(b => b.endsWith('.js'))[0]
  const cssBundle = files.filter(b => b.endsWith('.css'))[0]

  const js = {
    name: jsBundle,
    source: bundle[jsBundle]
  }
  const css = cssBundle ? {
    name: cssBundle,
    source: bundle[cssBundle]
  } : undefined

  return {js, css}
}
