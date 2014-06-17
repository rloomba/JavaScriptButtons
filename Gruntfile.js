'use strict';


module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            all: ['src/**/*.js', 'test/**/*.js']
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

        mocha: {
            browser: [ 'test/functional/**/*.html' ],

            options: {
                bail: true,
                log: true,
                mocha: {},
                reporter: 'Spec',
                run: true,
                timeout: 10000
            }
        },

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/unit/**/*.js']
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify'],
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
    grunt.task.loadNpmTasks('grunt-mocha');
    grunt.task.loadNpmTasks('grunt-mocha-test');
    grunt.task.loadNpmTasks('grunt-browserify');


    // Tasks
    grunt.registerTask('lint',  ['jshint']);
    grunt.registerTask('test',  ['lint', 'build', 'mochaTest', 'mocha']);
    grunt.registerTask('build', ['browserify', 'uglify', 'usebanner']);

};


