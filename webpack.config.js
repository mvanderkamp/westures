var webpackConfig = require('./webpack.config.js');
var path = require('path');
module.exports = {
  entry: './src/core/main.js',
  output: {
    filename: __dirname + '/dist/zingtouch.min.js',
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  webpack: webpackConfig
};
