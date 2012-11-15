if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	var app = {},
		paypalURL = 'https://www.paypal.com/cgi-bin/webscr',
		prettyParams = {
			id: 'hosted_button_id',
			name: 'item_name',
			number: 'item_number'

		},
		buttonImgs = {
			buynow: '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif',
			cart: '//www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif',
			basic: '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif'
		};


	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buy: 0,
			cart: 0,
			qr: 0,
			api: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param parent {HTMLElement} The element to add the button to
		 * @param type (String) The type of the button to render
		 * @param data {Object} An object of key/value data to set as button params
		 * @return {Boolean}
		 */
		app.create = function (parent, type, data) {
			var normalized = {}, button, key;

			// Don't render without the merchant ID
			if (!data.business) {
				return false;
			}

			// Normalize the data's keys
			for (key in data) {
				normalized[prettyParams[key] || key] = data[key];
			}

			// Hosted buttons
			if (normalized.hosted_button_id) {
				normalized.cmd = '_s-xclick';
			// Cart buttons
			} else if (type === 'cart') {
				normalized.cmd = '_cart';
				normalized.add = true;
			// Plain text buttons
			} else {
				normalized.cmd = '_xclick';
			}

			// Build the UI components
			if (type === 'qr') {
				button = buildQR(normalized);
			} else {
				button = buildForm(type, normalized);
			}

			// Add it to the DOM
			parent.appendChild(button);

			// Register it
			this.buttons[type] += 1;

			return true;
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

		btn.src = getButtonImg(type);

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
	 * @return {HTMLElement}
	 */
	function buildQR(data) {
		var img = document.createElement('img'),
			size = data.size || 250,
			url = paypalURL + '?',
			pattern = 13,
			key;

		for (key in data) {
			url += key + '=' + data[key] + '&';
		}

		url = encodeURIComponent(url);

		img.src = 'https://www.paypal.com/webapps/ppint/qrcode?data=' + url + '&pattern=' + pattern + '&' + url + '&height=' + size;

		return img;
	}


	/**
	 * Utility function to return the rendered button image URL
	 *
	 * @param type {String} The type of button to render
	 * @return {String}
	 */
	function getButtonImg(type) {
		return buttonImgs[type] || buttonImgs.basic;
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
			data = node && getDataSet(node);
			button = data && data.button;
			business = data.business = node.src.split('?merchant=')[1];

			if (button && business) {
				ButtonFactory.create(node.parentNode, button, data);

				// Clean up
				node.parentNode.removeChild(node);
			}
		}
	}


}());