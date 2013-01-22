if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	var app = {},
		paypalURL = 'https://www.paypal.com/cgi-bin/webscr',
		bnCode = 'JavaScriptButton_{type}',
		prettyParams = {
			id: 'hosted_button_id',
			name: 'item_name',
			number: 'item_number',
			lang: 'lc'
		},
		buttonImgs = {
			buynow: '//www.paypalobjects.com/{locale}/i/btn/btn_buynow_{size}.gif',
			cart: '//www.paypalobjects.com/{locale}/i/btn/btn_cart_{size}.gif'
		};

	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * Initial config for the app
		 */
		app.config = {
			labels: {
				item_name: 'Item',
				item_number: 'Number',
				amount: 'Amount',
				quantity: 'Quantity'
			}
		};

		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buynow: 0,
			cart: 0,
			hosted: 0,
			qr: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param raw {Object} An object of key/value data to set as button params
		 * @param type (String) The type of the button to render
		 * @param parent {HTMLElement} The element to add the button to (Optional)
		 * @return {HTMLElement}
		 */
		app.create = function (raw, type, parent) {
			var data = new DataStore(), button, key;

			// Don't render without the correct data
			if (!raw || !raw.business) {
				return false;
			}

			// Normalize the data's keys and add to a data store
			for (key in raw) {
				data.add(prettyParams[key] || key, raw[key].value, raw[key].isEditable);
			}

			// Setup defaults
			type = type || 'buynow';

			// Hosted buttons
			if (data.hosted_button_id) {
				type = 'hosted';
				data.add('cmd', '_s-xclick');
			// Cart buttons
			} else if (type === 'cart') {
				data.add('cmd', '_cart');
				data.add('add', true);
			// Plain text buttons
			} else {
				data.add('cmd', '_xclick');
			}

			// Create the button name
			data.add('bn', bnCode.replace(/\{type\}/, type));

			// Build the UI components
			if (type === 'qr') {
				button = buildQR(data, data.items.size);
				data.remove('size');
			} else {
				button = buildForm(type, data);
			}

			// Register it
			this.buttons[type] += 1;

			// Add it to the DOM
			if (parent) {
				parent.appendChild(button);
			}

			return button;
		};


		PAYPAL.apps.ButtonFactory = app;
	}


	/**
	 * Builds the form DOM structure for a button
	 *
	 * @param type (String) The type of the button to render
	 * @param data {Object} An object of key/value data to set as button params
	 * @return {HTMLElement}
	 */
	function buildForm(type, data) {
		var form = document.createElement('form'),
			btn = document.createElement('input'),
			hidden = document.createElement('input'),
			items = data.items,
			item, child, label, input, key;

		btn.type = 'image';
		hidden.type = 'hidden';
		form.method = 'post';
		form.action = paypalURL;
		form.className = 'paypal-button';

		for (key in items) {
			item = items[key];

			input = child = hidden.cloneNode(true);
			input.name = item.key;
			input.value = item.value;

			if (item.isEditable) {
				input.type = 'text';
				input.className = 'paypal-input';

				label = document.createElement('label');
				label.className = 'paypal-label';
				label.appendChild(document.createTextNode(app.config.labels[item.key] + ' ' || ''));
				label.appendChild(input);

				child = document.createElement('p');
				child.className = 'paypal-group';
				child.appendChild(label);
			}

			form.appendChild(child);
		}

		form.appendChild(btn);
		btn.src = getButtonImg(type, data.size, data.lc);

		// If the Mini Cart is present then register the form
		if (PAYPAL.apps.MiniCart && data.cmd === '_cart') {
			var MiniCart = PAYPAL.apps.MiniCart;

			if (!MiniCart.UI.itemList) {
				MiniCart.render();
			}

			MiniCart.bindForm(form);
		}

		return form;
	}


	/**
	 * Builds the image for a QR code
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param size {String} The size of QR code's longest side
	 * @param locale {String} The locale
	 * @return {HTMLElement}
	 */
	function buildQR(data, size, locale) {
		var img = document.createElement('img'),
			url = paypalURL + '?',
			pattern = 13,
			items = data.items,
			item, key;

		// QR defaults
		size = size || 250;

		for (key in items) {
			item = items[key];

			url += item.key + '=' + encodeURIComponent(item.value) + '&amp;';
		}

		url = encodeURIComponent(url);

		img.src = 'https://www.paypal.com/webapps/ppint/qrcode?data=' + url + '&amp;pattern=' + pattern + '&amp;' + url + '&amp;height=' + size;

		return img;
	}


	/**
	 * Utility function to return the rendered button image URL
	 *
	 * @param type {String} The type of button to render
	 * @param size {String} The size of button (small/large)
	 * @param locale {String} The locale
	 * @return {String}
	 */
	function getButtonImg(type, size, locale) {
		var img = buttonImgs[type] || buttonImgs.buynow;

		// Image defaults
		locale = locale || 'en_US';
		size = (size === 'small') ? 'SM' : 'LG';

		return img.replace(/\{locale\}/, locale).replace(/\{size\}/, size);
	}


	/**
	 * Utility function to polyfill dataset functionality with a bit of a spin
	 *
	 * @param el {HTMLElement} The element to check
	 * @return {Object}
	 */
	function getDataSet(el) {
		var dataset = {}, attrs, attr, matches, len, i;

		if ((attrs = el.attributes)) {
			for (i = 0, len = attrs.length; i < len; i++) {
				attr = attrs[i];

				if ((matches = /^data-([a-z]+)(-editable)?/i.exec(attr.name))) {
					dataset[matches[1]] = {
						value: attr.value,
						isEditable: !!matches[2]
					};
				}
			}
		}

		return dataset;
	}


	/**
	 * A storage object to create structured methods around a button's data
	 */
	function DataStore() {
		this.items = {};

		this.add = function (key, value, isEditable) {
			this.items[key] = {
				key: key,
				value: value,
				isEditable: isEditable
			};
		};

		this.remove = function (key) {
			delete this.items[key];
		};
	}


	// Init the buttons
	if (typeof document !== 'undefined') {
		var ButtonFactory = PAYPAL.apps.ButtonFactory,
			nodes = document.getElementsByTagName('script'),
			node, data, button, business, i, len;

		for (i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];

			if (!node || !node.src) { continue; }

			data = node && getDataSet(node);
			button = data && data.button;
			business = data.business = node.src.split('?merchant=')[1];

			if (button && business) {
				ButtonFactory.create(data, button, node.parentNode);

				// Clean up
				node.parentNode.removeChild(node);
			}
		}
	}


}());


// Export for CommonJS environments
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = PAYPAL;
}
