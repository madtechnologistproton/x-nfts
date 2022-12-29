const path = require('path')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/x-card.ts',
  output: {
    filename: 'x-card.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.css']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff2|png)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  }
}
