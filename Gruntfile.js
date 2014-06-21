'use strict';


module.exports = function (grunt) {


    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-config')(grunt, {
        configPath: require('path').resolve('tasks')
    });


    // Tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['lint', 'build', 'mochaTest']);
    grunt.registerTask('develop', ['browserify', 'themify']);
    grunt.registerTask('build', ['browserify', 'themify', 'uglify', 'usebanner']);


};


