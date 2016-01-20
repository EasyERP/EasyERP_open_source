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
        jQuery       : './public/js/libs/jquery-2.1.0.min.map',
        Underscore   : './public/js/libs/underscore-min.map.1.6.0',
        Backbone     : './public/js/libs/backbone-min.map.1.1.2',
        templates    : './public/templates',
        text         : './public/js/libs/text',
        Validation: './public/js/Validation'
    },
    shim   : {
        'Underscore': {
            exports: '_'
        },
        'Backbone'  : ['Underscore', 'jQuery']
    },
    // dynamically load all test files
    deps   : allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
