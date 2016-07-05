/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {

    var autoprefixer = require('autoprefixer')({
        browsers: [
            'Chrome >= 35', 
            'Firefox >= 31',
            'Edge >= 12',
            'Explorer >= 10',
            'iOS >= 8',
            'Safari >= 8',
            'Android 2.3',
            'Android >= 4',
            'Opera >= 12'
        ]
    });
    
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
        karma: {
            all: {
                configFile: 'karma.conf.js'
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'file'
                    // style: 'expanded'
                },
                files: {
                    'public/css/style.css': 'public/scss/style.scss'
                }
            }
        },
        postcss: {
            options: {
                // map: true,
                processors: [
                    autoprefixer
                ]
            },
            src: 'public/css/style.css'
        }
    });

    //grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');

    //grunt.registerTask('default', ['jsdoc']);
    grunt.registerTask('default', ['karma']);
    grunt.registerTask('dist-css', ['sass', 'postcss']);
    // grunt.registerTask('scss', ['sass']);
};
