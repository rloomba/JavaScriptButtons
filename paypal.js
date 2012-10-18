if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	var PAYPAL_URL = 'https://www.paypal.com/cgi-bin/webscr',
		CART_BTN_URL = '//www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif',
		BUY_BTN_URL = '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif',
		MINICART_URL = 'http://www.minicartjs.com/build/minicart.js';


	// Don't execute the code multiple times!
	if (PAYPAL.apps.DynamicButton) {
		return;
	}


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
		 */
		app.renderButton = function (el, type, data) {
			var merchantId = el.src.split('?merchant=')[1],
				form = document.createElement('form'),
				btn = document.createElement('input'),
				hidden = document.createElement('input'),
				btn, hidden, input, key;

			form.method = 'post';
			form.action = PAYPAL_URL;
			form.appendChild(btn);
			hidden.type = 'hidden';
			btn.type = 'image';

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

			if (merchantId) {
				data.business = merchantId
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
		};

		/**
		 * Initializes the script and renders all buttons found in the DOM
		 */
		app.init = function () {
			var nodes = document.getElementsByTagName('script'),
				node, data, button, i, len;

			for (i = 0, len = nodes.length; i < len; i++) {
				node = nodes[i];
				data = node.dataset;

				if ((button = data.button)) {
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


	PAYPAL.apps.DynamicButton.init();

}());

