let webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai'],
    files: [
      './src/core/main.js',
      './test/**/*.js',
    ],
    exclude: [],
    preprocessors: {
      './src/**/*.js': ['webpack', 'sourcemap'],
      './test/**/*.js': ['webpack', 'sourcemap'],
    },
    browsers: ['PhantomJS'],
    webpack: webpackConfig,
    webpackMiddleware: {noInfo: true},
    singleRun: true,
    client: {
      captureConsole: true,
    },
  });
};
