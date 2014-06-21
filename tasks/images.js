'use strict';


function base64(str) {
    return 'data:image/png;base64,' + str.toString('base64');
}


module.exports = function images(grunt) {

    var src = 'dist/all.js',
        tokens = {
            logo: '$LOGO$',
            primary: '$WORDMARK_PRIMARY$',
            secondary: '$WORDMARK_SECONDARY$'
        };

    function processImages(str) {
        var logo = grunt.file.read('src/theme/images/logo.png', { encoding: null }),
            primary = grunt.file.read('src/theme/images/wordmark_white.png', { encoding: null }),
            secondary = grunt.file.read('src/theme/images/wordmark_blue.png', { encoding: null });

        str = str.replace(tokens.logo, base64(logo));
        str = str.replace(tokens.primary, base64(primary));
        str = str.replace(tokens.secondary, base64(secondary));

        return str;
    }

    grunt.registerTask('images', 'Base64 encodes images and injects them into the JavaScript', function () {
        var out = grunt.file.read(src);

        out = processImages(out);

        grunt.file.write(src, out);
    });

};
