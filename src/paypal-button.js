if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = PAYPAL;
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
			cart: '//www.paypalobjects.com/{locale}/i/btn/btn_cart_{size}.gif',
			basic: '//www.paypalobjects.com/{locale}/i/btn/btn_buynow_{size}.gif'
		};

	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buynow: 0,
			cart: 0,
			qr: 0,
			api: 0
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
			var data = {}, button, key, size;

			// Don't render without the correct data
			if (!raw || !raw.business) {
				return false;
			}

			// Normalize the data's keys
			for (key in raw) {
				data[prettyParams[key] || key] = raw[key];
			}

			// Setup defaults
			type = type || 'basic';

			// Hosted buttons
			if (data.hosted_button_id) {
				data.cmd = '_s-xclick';
			// Cart buttons
			} else if (type === 'cart') {
				data.cmd = '_cart';
				data.add = true;
			// Plain text buttons
			} else {
				data.cmd = '_xclick';
			}

			// Create the button name
			data.bn = bnCode.replace(/\{type\}/, type);

			// Build the UI components
			if (type === 'qr') {
				size = data.size;
				delete data.size;

				button = buildQR(data, size);
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
			input, key;

		btn.type = 'image';
		hidden.type = 'hidden';
		form.method = 'post';
		form.action = paypalURL;
		form.appendChild(btn);

		btn.src = getButtonImg(type, data.size, data.lc);

		for (key in data) {
			input = hidden.cloneNode(true);
			input.name = key;
			input.value = data[key];

			form.appendChild(input);
		}

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
			key;

		// QR defaults
		size = size || 250;

		for (key in data) {
			url += key + '=' + encodeURIComponent(data[key]) + '&';
		}

		url = encodeURIComponent(url);

		img.src = 'https://www.paypal.com/webapps/ppint/qrcode?data=' + url + '&pattern=' + pattern + '&' + url + '&height=' + size;

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
		var img = buttonImgs[type] || buttonImgs.basic;

		// Image defaults
		locale = locale || 'en_US';
		size = (size === 'small') ? 'SM' : 'LG';

		return img.replace(/\{locale\}/, locale).replace(/\{size\}/, size);
	}


	/**
	 * Utility function to polyfill dataset functionality for browsers
	 *
	 * @param el {HTMLElement} The element to check
	 * @return {Object}
	 */
	function getDataSet(el) {
		var dataset = el.dataset,
			attrs, attr, matches, len, i;

		if (!dataset) {
			dataset = {};

			if ((attrs = el.attributes)) {
				for (i = 0, len = attrs.length; i < len; i++) {
					attr = attrs[i];

					if ((matches = /^data-(.+)/.exec(attr.name))) {
						dataset[matches[1]] = attr.value;
					}
				}
			}
		}

		return dataset;
	}


	// Init the buttons
	if (typeof document !== 'undefined') {
		var ButtonFactory = PAYPAL.apps.ButtonFactory,
			nodes = document.getElementsByTagName('script'),
			node, data, button, business, i, len;

		for (i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];
			if (!node || !node.src) continue;

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
