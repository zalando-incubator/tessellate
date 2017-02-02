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
  let loaders = [{
    test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
      presets: ['es2015', 'react']
    }
  }]
  let plugins = [
    new webpack.DefinePlugin({process: {env: {NODE_ENV: '"production"'}}})
  ]
  const externals = Object.assign({}, args.externals, {
    'react': 'react',
    'react-dom': 'react-dom'
  })
  let packages = args.packages || []

  if (args.cssSupport) {
    loaders = loaders.concat({
      test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
      })
    })
    plugins = plugins.concat(
      new ExtractTextPlugin('[name]-[hash].min.css')
    )
    packages = packages.concat([
      'style-loader',
      'css-loader'
    ])
  }

  if (args.production) {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin()
    ])
  }

  const sandbox = await WebpackSandbox.createInstance({
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
  return sandbox
}

const createWebpackSandbox = utils.memoize(_createWebpackSandbox)

export async function make(source: string, options: Options = {}): Promise<TessellateBundle> {
  log.debug('Create WebpackSandbox with options %o', options)
  const sandbox = await createWebpackSandbox(options)
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
