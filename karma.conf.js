module.exports = function (config) {
    config.set({

        basePath: '',

        frameworks: ['mocha', 'requirejs', 'sinon'],

        files: [
            'test/uiSpecs/testMain.js',

            {pattern: 'test/uiSpecs/fixtures/**/*'/*, included: false*/},

            {pattern: 'public/js/libs/jquery-2.1.0.min.map.js', included: false, watching: false},
            {pattern: 'public/js/libs/underscore-min.map.1.6.0.js', included: false, watching: false},
            {pattern: 'public/js/libs/backbone-min.map.1.1.2.js', included: false, watching: false},
            {pattern: 'test/uiSpecs/jqueryPrivate.js', included: false, watching: false},
            {pattern: 'public/js/libs/text.js', included: false, watching: false},
            {pattern: 'public/js/libs/moment/moment.js', included: false, watching: false},
            {pattern: 'public/js/libs/date.format.js', included: false, watching: false},

            {pattern: 'node_modules/chai/chai.js', included: false, watching: false},
            {pattern: 'node_modules/chai-jquery/chai-jquery.js', included: false, watching: false},
            {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', included: false, watching: false},

            {pattern: 'public/js/Validation.js', included: false, watching: false},
            {pattern: 'public/js/models/**/*.js', included: false, watching: false},
            {pattern: 'public/js/views/**/*.js', included: false, watching: false},
            {pattern: 'public/templates/**/*.html', included: false, watching: false},
            {pattern: 'public/js/*.js', included: false, watching: false},

            {pattern: 'test/uiSpecs/**/*.test.js', included: false, watching: true}
        ],

        exclude: [],

        preprocessors: {
            'public/js/models/**/*.js': ['coverage'],
            'public/js/views/**/*.js' : ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir : 'coverage/'
        },

        reporters: ['progress', 'coverage'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['Chrome', 'Firefox', 'Safari', 'IE', 'PhantomJS'],

        singleRun: false,

        client: {
            mocha: {
                ui  : "bdd"
            }
        },

        concurrency: Infinity
    });
};
