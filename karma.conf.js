module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha', 'chai'],
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    browsers: ['PhantomJS']
  });
};
