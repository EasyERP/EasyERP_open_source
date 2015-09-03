/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['handlers/**/*.js', 'Modules/**/*.js', 'routes/**/*.js', 'models/**/*.js'],
                options: {
                    destination: 'doc',
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "jsdoc.json"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jsdoc']);
};
