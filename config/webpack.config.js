const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist/prod')
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: ['file-loader']
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  target: 'web'
}
