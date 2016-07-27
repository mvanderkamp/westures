var webpack = require('webpack');
var path = require('path');
var plugins = [];
var minimize = process.argv.indexOf('--minimize') !== -1;
var filename = 'zingtouch.js';

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    mangle: true,
    outputs: {
      comments: false
    }
  }));
  filename = 'zingtouch.min.js';
}

module.exports = {
  entry: './src/core/main.js',
  output: {
    filename: __dirname + '/dist/' + filename
  },
  module: {
    loaders: [
      {
        //test: path.join(__dirname, 'src'),
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: plugins
};
