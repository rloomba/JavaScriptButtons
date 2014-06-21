'use strict';


module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            all: ['src/**/*.js', 'test/**/*.js', '!test/functional/lib/*.js']
        },

        browserify: {
            all: {
                files: {
                    'dist/all.js': ['src/**/*.js']
                }
            }
        },

        uglify: {
            all: {
                files: {
                    'dist/all.js': ['dist/all.js']
                }
            }
        },

        usebanner: {
            all: {
                options: {
                    banner: grunt.file.read('.banner')
                },
                files: {
                    src: [ 'dist/**/*.js' ]
                }
            }
        },

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/functional/**/*.js']
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*'],
                tasks: ['develop'],
                options: {
                    spawn: false
                }
            }
        }
    });


    // Dependencies
    grunt.task.loadNpmTasks('grunt-contrib-jshint');
    grunt.task.loadNpmTasks('grunt-contrib-uglify');
    grunt.task.loadNpmTasks('grunt-contrib-watch');
    grunt.task.loadNpmTasks('grunt-banner');
    grunt.task.loadNpmTasks('grunt-mocha-test');
    grunt.task.loadNpmTasks('grunt-browserify');
    grunt.task.loadTasks('./tasks');


    // Tasks
    grunt.registerTask('lint',  ['jshint']);
    grunt.registerTask('test',  ['lint', 'build', 'mochaTest']);
    grunt.registerTask('develop', ['browserify', 'themify']);
    grunt.registerTask('build', ['browserify', 'themify', 'uglify', 'usebanner']);

};


