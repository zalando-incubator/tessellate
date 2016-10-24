const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './example.js',
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
          presets: ['react', 'es2015']
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
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  plugins: [
    new ExtractTextPlugin('index.css')
  ]
}
