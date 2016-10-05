module.exports = {
  entry: './example.js',
  target: 'web',
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  output: {
    path: __dirname,
    filename: 'example.min.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
}
