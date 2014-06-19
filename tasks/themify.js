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
        logo: '$LOGO$',
        primary: '$WORDMARK_PRIMARY$',
        secondary: '$WORDMARK_SECONDARY$',
        strings: '$STRINGS$',
        templates: '$TEMPLATES$'
    };

    function processTemplates(str) {
        var files = grunt.file.expand('src/theme/**/*.html'),
            templates = {},
            name;

        files.forEach(function (file) {
            name = file.split(/src\/theme\/(.*).html/);
            name = name[1];

            templates[name] = trim(grunt.file.read(file));           
        });

        return str.replace(tokens.templates, JSON.stringify(templates));
    }

    function processCss(str) {
	    var styles = trim(grunt.file.read('src/theme/css/index.css'));

	    return str.replace(tokens.styles, styles);
    }

    function processImages(str) {
	    var logo = grunt.file.read('src/theme/images/logo.png', { encoding: null }),
			primary = grunt.file.read('src/theme/images/wordmark_white.png', { encoding: null }),
			secondary = grunt.file.read('src/theme/images/wordmark_blue.png', { encoding: null });

	    str = str.replace(tokens.logo, base64(logo));
	    str = str.replace(tokens.primary, base64(primary));
	    str = str.replace(tokens.secondary, base64(secondary));

	    return str;
    }

    // TODO: Localizr instead
    function processContent(str) {
        var bundles = grunt.file.expand('locales/**/*.properties'),
            content = {},
            props, locale;

        bundles.forEach(function (bundle) {
            locale = bundle.split(/locales\/([A-Z]{2})\/([a-z]{2})\//);
            locale = locale[2] + '_' + locale[1];

            content[locale] = {};

            props = grunt.file.read(bundle);
            props = props.split(/\n/);

            props.forEach(function (line) {
                var pair = line.split(/=(.+)/);

                if (pair[0]) {
                    content[locale][pair[0]] = pair[1];
                }
            });
        });

        str = str.replace(tokens.strings, JSON.stringify(content));

        return str;
    }

    grunt.registerTask('themify', 'Bundles the theme files into the JavaScript.', function () {
        var out = grunt.file.read(src);

        out = processTemplates(out);
        out = processCss(out);
        out = processImages(out);
        out = processContent(out);

        grunt.file.write(src, out);
        grunt.log.ok('Theme applied to ' + src);
    });

};
