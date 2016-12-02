const path = require('path')
const fs = require('fs')

/**
 * Externalize node_modules.
 */
function nodeModules() {
  return fs.readdirSync('node_modules')
           .filter(dir => ['.bin'].indexOf(dir) === -1)
           .reduce((modules, m) => {
             modules[m] = 'commonjs2 ' + m
             return modules
           }, {})
}

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
        options: {
          presets: [
            'latest-minimal',
            'react'
          ],
          plugins: [
            'syntax-flow',
            'transform-flow-strip-types'
          ],
          babelrc: false
        }
      }
    ]
  },
  externals: nodeModules(),
  node: {
    __dirname: true
  }
}
