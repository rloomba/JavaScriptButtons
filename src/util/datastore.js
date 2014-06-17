'use strict';


var constants = require('../constants');


function DataStore() {
    this.items = {};
}


DataStore.prototype.add = function addData(key, val) {
	// Remap nice values
	key = constants.PRETTY_PARAMS[key] || key;

	// Convenience to let you use add(key, 'some value')
	if (typeof val === 'string') {
		val = {
			key: key,
			value: val
		};
	}

    this.items[key] = {
        key: key,
        value: val.value,
        isEditable: !!val.isEditable,
        hasOptions : !!val.hasOptions,
        displayOrder : !!val.displayOrder
    };
};


DataStore.prototype.get = function getData(key) {
	var item = this.items[key];

	return item && item.value;
};


DataStore.prototype.remove = function removeData(key) {
    delete this.items[key];
};


DataStore.prototype.pluck = function pluckData(key) {
	var val = this.get(key);
	this.remove(key);

	return val;
};


DataStore.prototype.parse = function parseData(el) {
    var attrs, attr, matches, len, i;

    if ((attrs = el.attributes)) {
        for (i = 0, len = attrs.length; i < len; i++) {
            attr = attrs[i];

            // var customFields = [];
            //if ((matches = attr.name.match(/^data-option([0-9])([a-z]+)([0-9])?/i))) {
            //    customFields.push({ 'name' : 'option.' + matches[1] + '.' + matches[2] + (matches[3] ? '.' + matches[3] : ''), value: attr.value });
            //} else
            if ((matches = attr.name.match(/^data-([a-z0-9_]+)(-editable)?/i))) {
				this.add(matches[1], {
					value: attr.value,
					isEditable: !!matches[2]
				});
            }
        }
    }

    //processCustomFieldValues(customFields, dataset);

	return this;
};



// function processCustomFieldValues(customFields, dataset) {
//     var result = {}, keyValuePairs, name, nameParts, accessor, cursor;

//     for (i = 0; i < customFields.length; i++) {
//         keyValuePairs = customFields[i];
//         name = keyValuePairs.name;
//         nameParts = name.split('.');
//         accessor = nameParts.shift();
//         cursor = result;
//         while (accessor) {
//             if (!cursor[accessor]) {
//                 cursor[accessor] = {};
//             }
//             if (!nameParts.length) {
//                 cursor[accessor] = keyValuePairs.value;
//             }
//             cursor = cursor[accessor];
//             accessor = nameParts.shift();
//         }
//     }

//     //Store custom fields in dataset
//     var key, i, j, field, selectMap = {}, priceMap = {}, optionArray = [], optionMap = {}, owns = Object.prototype.hasOwnProperty;

//     for (key in result) {
//         if (owns.call(result, key)) {
//             field = result[key];
//             for (i in field) {
//                 dataset['option_' + i] = {
//                     value: { 'options' : '', 'label' : field[i].name},
//                     hasOptions: true,
//                     displayOrder: parseInt(i, 10)
//                 };
//                 selectMap = field[i].select;
//                 priceMap = field[i].price;
//                 optionArray = [];
//                 for (j in selectMap) {
//                     optionMap = {};
//                     if (priceMap) {
//                         optionMap[selectMap[j]] = selectMap[j] + ' ' + priceMap[j];
//                         optionArray.push(optionMap);
//                     } else {
//                         optionArray.push(selectMap[j]);
//                     }
//                 }
//                 dataset['option_' + i].value.options = optionArray;
//             }
//         }
//     }
// }






module.exports = DataStore;
