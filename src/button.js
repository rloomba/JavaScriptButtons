'use strict';


var template = require('./util/template'),
    constants = require('./constants'),
	css = require('./util/css'),
    hasCss = false;


module.exports = function Button(label, data, config) {
    var model, locale, style;

    config = config || {};
    locale = data.get('lc') || constants.DEFAULT_LOCALE;
    style = config.style || constants.DEFAULT_STYLE;

    model = {
        style: style,
        size: config.size || constants.DEFAULT_SIZE,
        logo: constants.LOGO,
        wordmark: constants.WORDMARK[style],
        label: constants.STRINGS[locale][label]
    };

    if (!hasCss) {
        hasCss = true;
        css.inject(document.getElementsByTagName('head')[0], constants.STYLES);
    }
    
    return template(constants.TEMPLATE.button, model);
};
