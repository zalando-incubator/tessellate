const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const nconf = require('nconf')
  .env()
  .add('config', {type: 'literal', store: yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'config.yaml'), 'utf8'))})

module.exports = {
  entry: './client/client.js',
  output: {
    path: path.join(__dirname, 'dist', 'client'),
    filename: 'client.js'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        presets: [
          'es2015',
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
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!./client/index.ejs',
      inject: false,
      production: nconf.get('NODE_ENV') === 'production',
      BUNDLE_TARGET: nconf.get('BUNDLE_TARGET')
    })
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
}
