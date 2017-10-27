import { Configuration } from 'webpack';
import path = require('path');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CompressionPlugin = require('compression-webpack-plugin');

export default function(): Configuration {
  return {
    entry: './client/client.ts',
    output: {
      path: path.join(__dirname, 'dist', 'client'),
      filename: 'client_[chunkhash].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: path.resolve(__dirname, './client/tsconfig.json')
          }
        },
        { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
        {
          test: /\.ya?ml$/,
          exclude: /node_modules/,
          loader: 'raw-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.png', '.jpg', '.css']
    },
    plugins: [
      new CompressionPlugin({
        test: /\.(js|json|css|svg|png|jpe?g|map)$/
      }),
      new HtmlWebpackPlugin({
        template: './client/index.ejs',
        inject: false,
        production: process.env.NODE_ENV === 'production'
      })
    ],
    devtool: 'source-map'
  };
}
