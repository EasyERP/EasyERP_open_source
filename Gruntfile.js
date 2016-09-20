/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        apidoc: {
            easyerp: {
                title  : 'EasyErp documentation',
                url    : 'http://192.168.88.88',
                src    : 'routes/',
                dest   : 'apidoc/',
                options: {
                    debug         : true,
                    excludeFilters: ['node_modules/', 'git/']
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
                },

                files: {
                    'public/css/style.css': 'public/scss/style.scss'
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({browsers: ['ie >= 10', 'last 4 versions', '> 1%']}) // add vendor prefixes
                    // require('cssnano')() // minify the result
                ]
            },
            dist   : {
                src: 'public/css/style.css'
            }
        },

        watch: {
            sass: {
                files: 'public/scss/**/*.scss',
                tasks: ['dist-css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch'); // only for css/flexbox branch

    grunt.registerTask('default', ['karma']);
    grunt.registerTask('dist-css', ['sass', 'postcss:dist']);
    grunt.registerTask('compile', ['dist-css', 'apidoc:easyerp']);
};