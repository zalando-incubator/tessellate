// @flow
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackSandbox from 'webpack-sandboxed'
import logger from './logger'
import * as utils from './utils'

type Options = {
  cssSupport?: boolean;
  production?: boolean;
  packages?: Array<string>;
  externals?: { [key: string]: string };
}

const log = logger('bundle-service')

async function _createWebpackSandbox(args: Options = {}): Promise<WebpackSandbox> {
  const loaders = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: [['es2015', {modules: false}], 'react'],
      babelrc: false
    }
  }]
  const plugins = [
    new webpack.DefinePlugin({process: {env: {NODE_ENV: '"production"'}}})
  ]
  const externals = Object.assign({}, args.externals, {
    'react': 'react',
    'react-dom': 'react-dom'
  })
  const packages = args.packages || []

  if (args.cssSupport) {
    loaders.push({
      test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
      })
    })
    plugins.push(
      new ExtractTextPlugin('[name]-[hash].min.css')
    )
    packages.push(
      'style-loader',
      'css-loader'
    )
  }

  if (args.production) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin()
    )
  }

  return WebpackSandbox.createInstance({
    config: {
      target: 'web',
      module: {
        loaders
      },
      output: {
        libraryTarget: 'umd'
      },
      plugins,
      externals
    },
    packages
  })
}

const createWebpackSandbox = utils.memoize(_createWebpackSandbox)

export async function make(source: string, options: Options = {}): Promise<TessellateBundle> {
  log.debug('Create WebpackSandbox with options %o', options)
  const sandbox = await createWebpackSandbox(options)
  log.debug('Compile bundle...')
  const [bundle] = await sandbox.run(source)

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
