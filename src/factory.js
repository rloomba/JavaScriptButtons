'use strict';


var Button = require('./button'),
    Form = require('./form'),
    QR = require('./qr'),
    DataStore = require('./util/datastore'),
    constants = require('./constants');



module.exports = function factory(business, raw, config) {
    var data, el, key, label, type, env;

    if (!business) { return false; }

    // Normalize incoming data if needed
    if (raw.items) {
        data = raw;
    } else {
        data = new DataStore();

        for (key in raw) {
            data.add(key, raw[key]);
        }
    }

    // Defaults
    config = config || {};
    label = config.label || constants.DEFAULT_LABEL;
    type = config.type || constants.DEFAULT_TYPE;

    // Cart buttons
    if (type === 'cart') {
        data.add('cmd', '_cart');
        data.add('add', true);
    // Donation buttons
    } else if (type === 'donate') {
        data.add('cmd', '_donations');
    // Subscribe buttons
    } else if (type === 'subscribe') {
        data.add('cmd', '_xclick-subscriptions');

        // TODO: "amount" cannot be used in prettyParams since it's overloaded
        // Find a better way to do this
        if (data.get('amount') && !data.get('a3')) {
            data.add('a3', data.get('amount'));
        }
    // Buy Now buttons
    } else {
        if (data.get('hosted_button_id')) {
            data.add('cmd', '_s-xclick');
        } else {
            data.add('cmd', '_xclick');
        }
    }

    // Add common data
    data.add('business', business);
    data.add('bn', constants.BN_CODE.replace(/\{label\}/, label));

    // Build the UI components
    if (type === 'qr') {
        el = QR(data, config);
    } else if (type === 'button') {
        el = Button(label, data, config);
    } else {
        el = Form(label, data, config);
    }

    // Inject CSS
    // injectCSS();

    return {
        label: label,
        type: type,
        el: document.createElement('div').innerHTML = el
    };
};
