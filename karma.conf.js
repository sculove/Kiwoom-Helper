// Karma configuration
// Generated on Fri May 13 2016 14:46:47 GMT+0900 (KST)
var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
        // dependencies
        // './dist/kiwoom-helper.js',
        './node_modules/babel-polyfill/dist/polyfill.js',
        './node_modules/jquery/dist/jquery.min.js',


        // test dependencies
        './node_modules/chai/chai.js',
        './test/chai.conf.js',
        './node_modules/sinon/pkg/sinon.js',

        // src
        './src/*.js',

        // tests
        './test/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/*.js': ['babel', 'coverage'],
        'test/*.spec.js': ['babel', 'coverage']
    },
    babelPreprocessor: {
        options: {
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-umd']
        }
    },
    coverageReporter: {
        type : 'html',
        dir : 'coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],
    mochaReporter: {
      output: 'autowatch'
    },

    // web server port
    port: 9976,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],//, 'Chrome', 'Firefox', 'Safari'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: webpackConfig
  });
};
