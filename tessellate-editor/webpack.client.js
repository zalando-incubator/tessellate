const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    },
    {
      test: /\.ya?ml$/, exclude: /node_modules/, loader: 'raw'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.ejs',
      inject: false,
      production: process.env.NODE_ENV === 'production'
    })
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
}
