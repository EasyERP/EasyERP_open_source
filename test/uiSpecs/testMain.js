var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;
var App = App || {
        render: function(options){
            "use strict";
            return options;
        }
    };

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',
    paths  : {
        models       : './public/js/models',
        views       : './public/js/views',
        templates    : './public/templates',
        jQuery       : './public/js/libs/jquery-2.1.0.min.map',
        //jqueryPrivate       : './test/uiSpecs/jqueryPrivate',
        Underscore   : './public/js/libs/underscore-min.map.1.6.0',
        Backbone     : './public/js/libs/backbone-min.map.1.1.2',
        text         : './public/js/libs/text',
        Validation: './public/js/Validation',
        custom: './public/js/custom',
        common: './public/js/common',
        constants: './public/js/constants',
        dataService: './public/js/dataService',
        moment: './public/js/libs/moment/moment',
        libs: './public/js/libs',
        chai: './node_modules/chai/chai',
        'chai-jquery': './node_modules/chai-jquery/chai-jquery',
        'sinon-chai': './node_modules/sinon-chai/lib/sinon-chai',
        fixtures: './test/uiSpecs/fixtures'
    },
    shim   : {
        'Underscore': {
            exports: '_'
        },
        'jQuery': {
            exports: '$'
        },
        'chai-jquery': ['jQuery', 'chai'],
        'Backbone'  : ['Underscore', 'jQuery']
    },
    /*map: {
        '*': { 'jQuery': 'jqueryPrivate' },
        'jqueryPrivate': { 'jQuery': 'jQuery' }
    },*/
    // dynamically load all test files
    deps   : allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
