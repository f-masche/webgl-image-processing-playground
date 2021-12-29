const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.gs$/,
        use: 'raw-loader'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src')
    },
    port: 8000,
    hot: true
  },
  plugins: [
    new webpack.ProvidePlugin({
        THREE: 'three'
    }),
    new HtmlWebpackPlugin({
      title: 'WebGL Image Processing Playground'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
