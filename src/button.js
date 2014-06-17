'use strict';


var constants = require('./constants'),
	css = require('./util/css');


module.exports = function Button(label, data, config) {
    var locale = data.get('lc') || 'en_US',
        btn = document.createElement('button'),
        btnLogo = document.createElement('span'),
        btnContent = document.createElement('span');

    // Defaults
    config = config || {};
    config.style = config.style || constants.DEFAULT_STYLE;
    config.size = config.size || constants.DEFAULT_SIZE;

    btn.className += 'paypal-button ' + config.style + ' ' + config.size;

    btnLogo.className = 'paypal-button-logo';
    btnLogo.innerHTML = constants.LOGO;

    btnContent.className = 'paypal-button-content';
    btnContent.innerHTML = constants.STRINGS[locale][label].replace('{wordmark}', constants.WORDMARK[config.style]);

    btn.appendChild(btnLogo);
    btn.appendChild(btnContent);

    css.inject(document.getElementsByTagName('head')[0], constants.STYLES);

    return btn;
};
