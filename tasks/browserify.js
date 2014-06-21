'use strict';


module.exports = function browserify(grunt) {

    return {
        all: {
            files: {
                'dist/all.js': ['src/**/*.js']
            }
        }
    };

};
