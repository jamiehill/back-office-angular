// Karma configuration
// Generated on Thu May 08 2014 06:46:46 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    files: [
        // 'bower_components/jquery/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
    ],
    exclude: [],
    browserify: {
      // extensions: ['.coffee'],
      // ignore: [],
      transform: ['partialify'],
      debug: false,
      // noParse: ['jquery'],
      watch: true,
      files: [
        'src/**/*.js',
        {
            pattern: 'src/**/*.js',
            watched: true,
            included: false,
            served: false
        }
      ]
    },
    preprocessors: {
        "/**/*.browserify": "browserify"
    },

    plugins: [
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-browserifast',
        'karma-spec-reporter'
    ],

    

    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
    
  });
};
