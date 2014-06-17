'use strict';


var constants = require('./constants');


module.exports = function QrCode(data, config) {
    var img, url, item, key, size;

    // Defaults
    config = config || {};
    size = config.size || constants.QR_SIZE;
    config.host = config.host || constants.DEFAULT_HOST;

    // Construct URL
    url = constants.PAYPAL_URL;
    url = url.replace('{host}', config.host);
    url = url + '?';

    for (key in data.items) {
        url += key + '=' + encodeURIComponent(data.get(key)) + '&';
    }

    url = encodeURIComponent(url);

    // Build the image
    img = document.createElement('img');
    img.src = constants.QR_URL
		.replace('{host}', config.host)
		.replace('{url}', url)
		.replace('{pattern}', constants.QR_PATTERN)
		.replace('{size}', size);

    return img;
};
