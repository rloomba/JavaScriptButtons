if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	// Don't execute the code multiple times!
	if (PAYPAL.apps.DynamicButton) {
		return;
	}


	var PAYPAL_URL = 'https://www.paypal.com/cgi-bin/webscr',
		CART_BTN_URL = '//www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif',
		BUY_BTN_URL = '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif',
		MINICART_URL = 'http://www.minicartjs.com/build/minicart.js';


	PAYPAL.apps.DynamicButton = (function () {
		var app = {};

		/**
		 * A count of each type of button on the page
		 */
		app.buttons = {
			buy: 0,
			cart: 0,
			api: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param el {HTMLElement} The element to replace
		 * @param type (String) The type of the button to render
		 * @param data {Object} An object of key/value data to set as button params
		 * @return {Boolean}
		 */
		app.renderButton = function (el, type, data) {
			var merchantId = el.src.split('?merchant=')[1],
				form = document.createElement('form'),
				btn = document.createElement('input'),
				hidden = document.createElement('input'),
				input, key;

			// Don't render if there's no merchant ID
			if (merchantId) {
				data.business = merchantId;
			} else {
				return false;
			}

			btn.type = 'image';
			hidden.type = 'hidden';
			form.method = 'post';
			form.action = PAYPAL_URL;
			form.appendChild(btn);

			// Cart buttons
			if (type === 'cart') {
				data.cmd = '_cart';
				data.add = true;
				btn.src = CART_BTN_URL;
			// Hosted buttons
			} else if (data.hosted_button_id) {
				data.cmd = '_s-xclick';
				btn.src = BUY_BTN_URL;
			// Plain text buttons
			} else {
				data.cmd = '_xclick';
				btn.src = BUY_BTN_URL;
			}

			for (key in data) {
				input = hidden.cloneNode(true);
				input.name = key;
				input.value = data[key];

				form.appendChild(input);
			}

			el.parentNode.replaceChild(form, el);

			// Register it
			this.buttons[type] += 1;

			// Load additional resources
			if (type === 'cart') {
				loadScript(MINICART_URL, function () {
					PAYPAL.apps.MiniCart.render();
				}, 'PAYPAL.apps.MiniCart');
			}

			return true;
		};

		/**
		 * Initializes the script and renders all buttons found in the DOM
		 */
		app.init = function () {
			var nodes = document.getElementsByTagName('script'),
				node, data, button, i, len;

			for (i = 0, len = nodes.length; i < len; i++) {
				node = nodes[i];
				data = getDataSet(node);
				button = data && data.button;

				if (button) {
					this.renderButton(node, button, data);
				}
			}
		};

		return app;
	}());


	/**
	 * Utility function to load another script
	 *
	 * @param url {String} The URL of the script to load
	 * @param callback {Function} The function to execute afterwards
	 * @param identified (String) The signature of the script (used to prevent dual loading)
	 */
	function loadScript(url, callback, identifier) {
		if (!identifier || !window[identifier]) {
			var script = document.createElement('script');
			script.async = true;
			script.src = url;
			script.onload = callback;

			document.body.appendChild(script);
		}
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


	PAYPAL.apps.DynamicButton.init();

}());

