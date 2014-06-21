'use strict';


module.exports = function uglify(grunt) {

    return {
        all: {
            files: {
                'dist/all.js': ['dist/all.js']
            }
        }
    };

};
