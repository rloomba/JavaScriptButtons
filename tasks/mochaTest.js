'use strict';


module.exports = function mochaTest(grunt) {

    return {
        all: {
            options: {
                reporter: 'spec'
            },
            src: ['test/functional/**/*.js', 'test/unit/**/*.js']
        }
    };

};
