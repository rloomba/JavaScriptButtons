'use strict';


module.exports = function (grunt) {


    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-config')(grunt, {
        configPath: require('path').resolve('tasks')
    });


    // Aliases for ease of use.
    grunt.registerTask('lint', ['jshint', 'eslint']);
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('mocha', ['mocha_istanbul']);
    grunt.registerTask('themify', ['templates', 'css', 'images', 'content']);
    grunt.registerTask('test', ['lint', 'build', 'coverage']);
    grunt.registerTask('develop', ['browserify', 'themify']);
    grunt.registerTask('build', ['browserify', 'themify', 'uglify', 'usebanner']);


};


