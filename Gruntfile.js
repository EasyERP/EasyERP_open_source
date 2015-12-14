/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jsdoc    : {
            dist: {
                src    : ['handlers/**/*.js', 'Modules/**/*.js', 'routes/**/*.js', 'models/**/*.js'],
                options: {
                    destination: 'doc',
                    template   : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure  : "jsdoc.json"
                }
            }
        },
        modernizr: {
            dist: {

                // Path to save out the built file
                "dest": "build/modernizr-custom.js",
                "uglify" : false,
                "files" : {
                    "src": [
                        "*[^(g|G)runt(file)?].{js,css,scss}",
                        "**[^node_modules]/**/*.{js,css,scss}",
                        "!lib/**/*"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks("grunt-modernizr");

    grunt.registerTask('default', ['jsdoc']);
};
