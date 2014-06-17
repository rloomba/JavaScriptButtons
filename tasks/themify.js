'use strict';


function trim(str) {
    return str.replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
}


function base64(str) {
	return 'data:image/png;base64,' + str.toString('base64');
}


module.exports = function (grunt) {

    var src = 'dist/all.js';

    var tokens = {
        content: '$STRINGS$',
        styles: '$STYLES$',
        logo: '$LOGO',
        primary: '$WORDMARK_PRIMARY$',
        secondary: '$WORDMARK_SECONDARY$'
    };


    function processCss(file) {
	    var styles = trim(grunt.file.read('src/theme/css/index.css'));

	    return file.replace(tokens.styles, styles);
    }

    function processImages(file) {
	    var logo = grunt.file.read('src/theme/images/logo.png'),
			primary = grunt.file.read('src/theme/images/wordmark_white.png'),
			secondary = grunt.file.read('src/theme/images/wordmark_blue.png');

	    file = file.replace(tokens.logo, base64(logo));
	    file = file.replace(tokens.primary, base64(primary));
	    file = file.replace(tokens.secondary, base64(secondary));

	    return file;
    }

    grunt.registerTask('themify', 'Bundles the theme files into the JavaScript.', function () {
        var out = grunt.file.read(src);

        out = processCss(out);
        out = processImages(out);

        grunt.file.write(src, out);
        grunt.log.ok('Theme applied to ' + src);
    });

};
