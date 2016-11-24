const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

/**
 * Externalize node_modules.
 */
function nodeModules() {
  return fs.readdirSync('node_modules')
           .filter(dir => ['.bin'].indexOf(dir) === -1)
           .reduce((modules, m) => {
             modules[m] = 'commonjs2 ' + m
             return modules
           }, {
             'react-dom/server': 'commonjs2 react-dom/server'
           })
}

module.exports = {
  entry: './lib/index.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        presets: [
          'latest-minimal',
          'react'
        ],
        plugins: [
          'syntax-flow',
          'transform-flow-strip-types'
        ]
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'global.__REQUIRE_FN__': 'require'
    })
  ],
  externals: nodeModules(),
  node: {
    __dirname: true
  }
}
