const path = require('path')
const {resolve} = path
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

const projectName = resolve(__dirname).split(path.sep).pop()

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist', projectName),
    filename: 'js/main.js'
  },
  externals: {
    'vue': 'Vue'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'public/index.html')
    })
  ]
}