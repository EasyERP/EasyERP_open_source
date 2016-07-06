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
            dist: {
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

    //grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch'); // delete from develop branch

    //grunt.registerTask('default', ['jsdoc']);
    grunt.registerTask('default', ['karma']);
    grunt.registerTask('dist-css', ['sass', 'postcss:dist']);
};

// Old version

// /**
//  * http://gruntjs.com/configuring-tasks
//  */
// module.exports = function (grunt) {
//     // Project configuration.
//     grunt.initConfig({
//         jsdoc    : {
//             dist: {
//                 src    : ['handlers/**/*.js', 'Modules/**/*.js', 'routes/**/*.js', 'models/**/*.js'],
//                 options: {
//                     destination: 'doc',
//                     template   : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
//                     configure  : "jsdoc.json"
//                 }
//             }
//         },
//         karma: {
//             all: {
//                 configFile: 'karma.conf.js'
//             }
//         }
//     });
//
//     //grunt.loadNpmTasks('grunt-jsdoc');
//     grunt.loadNpmTasks('grunt-karma');
//
//     //grunt.registerTask('default', ['jsdoc']);
//     grunt.registerTask('default', ['karma']);
// };
