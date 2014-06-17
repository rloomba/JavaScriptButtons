'use strict';


var constants = require('./constants'),
	Button = require('./button');


module.exports = function Form(type, data, config) {
    var form = document.createElement('form'),
        hidden = document.createElement('input'),
        paraElem = document.createElement('p'),
        labelElem = document.createElement('label'),
        inputTextElem = document.createElement('input'),
        selectElem = document.createElement('select'),
        optionElem = document.createElement('option'),
        items = data.items,
        optionFieldArr = [],
        item, child, label, input, key, selector, optionField, fieldDetails = {}, fieldDetail, fieldValue, field, labelText, btn;

    // Defaults
    config = config || {};
    config.host = config.host || constants.DEFAULT_HOST;

    form.method = 'post';
    form.action = constants.PAYPAL_URL.replace('{host}', config.host);
    form.className = 'paypal-button-widget';
    form.target = '_top';

    inputTextElem.type = 'text';
    inputTextElem.className = 'paypal-input';
    paraElem.className = 'paypal-group';
    labelElem.className = 'paypal-label';
    selectElem.className = 'paypal-select';

    hidden.type = 'hidden';

    for (key in items) {
        item = items[key];


        if (item.hasOptions) {
            optionFieldArr.push(item);
        } else if (item.isEditable) {
            input = inputTextElem.cloneNode(true);
            input.name = item.key;
            input.value = item.value;

            label = labelElem.cloneNode(true);
            // FIXME: This needs to resolve to user strings
            labelText = item.key;
            label.htmlFor = item.key;
            label.appendChild(document.createTextNode(labelText));
            label.appendChild(input);

            child = paraElem.cloneNode(true);
            child.appendChild(label);
            form.appendChild(child);
        } else {
            input = child = hidden.cloneNode(true);
            input.name = item.key;
            input.value = item.value;
            form.appendChild(child);
        }
    }

    // optionFieldArr = sortOptionFields(optionFieldArr);

    // for (key in optionFieldArr) {
    //     item = optionFieldArr[key];

    //     if (optionFieldArr[key].hasOptions) {
    //         fieldDetails = item.value;
    //         if (fieldDetails.options.length > 1) {
    //             input = hidden.cloneNode(true);
    //             //on - Option Name
    //             input.name = 'on' + item.displayOrder;
    //             input.value = fieldDetails.label;

    //             selector = selectElem.cloneNode(true);
    //             //os - Option Select
    //             selector.name = 'os' + item.displayOrder;

    //             for (fieldDetail in fieldDetails.options) {
    //                 fieldValue = fieldDetails.options[fieldDetail];

    //                 if (typeof fieldValue === 'string') {
    //                     optionField = optionElem.cloneNode(true);
    //                     optionField.value = fieldValue;
    //                     optionField.appendChild(document.createTextNode(fieldValue));
    //                     selector.appendChild(optionField);
    //                 } else {
    //                     for (field in fieldValue) {
    //                         optionField = optionElem.cloneNode(true);
    //                         optionField.value = field;
    //                         optionField.appendChild(document.createTextNode(fieldValue[field]));
    //                         selector.appendChild(optionField);
    //                     }
    //                 }
    //             }

    //             label = labelElem.cloneNode(true);
    //             labelText = fieldDetails.label || item.key;
    //             label.htmlFor = item.key;
    //             label.appendChild(document.createTextNode(labelText));
    //             label.appendChild(selector);
    //             label.appendChild(input);
    //         } else {
    //             label = labelElem.cloneNode(true);
    //             labelText = fieldDetails.label || item.key;
    //             label.htmlFor = item.key;
    //             label.appendChild(document.createTextNode(labelText));

    //             input = hidden.cloneNode(true);
    //             input.name = 'on' + item.displayOrder;
    //             input.value = fieldDetails.label;
    //             label.appendChild(input);

    //             input = inputTextElem.cloneNode(true);
    //             input.name = 'os' + item.displayOrder;
    //             input.value = fieldDetails.options[0] || '';
    //             input.setAttribute('data-label', fieldDetails.label);

    //             label.appendChild(input);
    //         }
    //         child = paraElem.cloneNode(true);
    //         child.appendChild(label);

    //         form.appendChild(child);
    //     }
    // }

    btn = new Button(type, data, config);

    // Safari won't let you set read-only attributes on buttons.
    try {
        btn.type = 'submit';
    } catch (e) {
        btn.setAttribute('type', 'submit');
    }

    // Add the correct button
    form.appendChild(btn);

    return form;
};



/**
 * Sort Optional Fields by display order
 */
function sortOptionFields(optionFieldArr) {
    optionFieldArr.sort(function (a, b) {
        return a.displayOrder - b.displayOrder;
    });

    return optionFieldArr;
}



