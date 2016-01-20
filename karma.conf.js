// Karma configuration
// Generated on Wed Jan 20 2016 15:07:41 GMT+0200 (EET)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'requirejs', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            'test/uiSpecs/testMain.js',

            {pattern: 'public/js/libs/jquery-2.1.0.min.map.js', included: false, watching: false},
            {pattern: 'public/js/libs/underscore-min.map.1.6.0.js', included: false, watching: false},
            {pattern: 'public/js/libs/backbone-min.map.1.1.2.js', included: false, watching: false},
            {pattern: 'public/js/libs/text.js', included: false, watching: false},
            {pattern: 'public/js/Validation.js', included: false, watching: false},
            {pattern: 'public/js/models/**/*.js', included: false, watching: false},
            {pattern: 'test/uiSpecs/**/*.test.js', included: false, watching: true}
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'public/js/models/**/*.js': ['coverage'],
            'public/js/collections/**/*.js': ['coverage']
        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'Safari', 'IE'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
}
