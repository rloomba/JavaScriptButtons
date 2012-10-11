if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	function renderForm(el, data) {
		var type = data.type,
			isCart = (type === 'cart'),
			form = document.createElement('form'),
			input, btn, key;

		form.method = 'post';
		form.action = 'https://www.paypal.com/cgi-bin/webscr';

		btn = document.createElement('input');
		btn.type = 'image';

		if (isCart) {
			data.cmd = '_cart';
			data.add = true;
			data.bn = 'WPS_CART_DYNAMIC_BTN';

			btn.src = '//www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif';
		} else {
			data.cmd = '_xclick';
			data.bn = 'WPS_BUY_NOW_DYNAMIC_BTN';

			btn.src = '//www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif';
		}

		for (key in data) {
			input = document.createElement('input');
			input.type = 'hidden';
			input.name = key;
			input.value = data[key];

			form.appendChild(input);
		}

		form.appendChild(btn);
		el.parentNode.replaceChild(form, el);
	}


	function loadMiniCart() {
		if (!PAYPAL.apps.MiniCart) {
			var script = document.createElement('script');
			script.src = 'http://www.minicartjs.com/build/minicart.js';
			script.onload = function () {
				if (PAYPAL.apps.MiniCart) {
					PAYPAL.apps.MiniCart.render();
				}
			}

			document.body.appendChild(script);
		}
	}


	PAYPAL.apps.DynamicButton = (function () {
		var app = {};

		app.render = function () {
			var nodes = document.getElementsByTagName('script'),
				hasCart = false,
				node, data, type, i, len;

			for (i = 0, len = nodes.length; i < len; i++) {
				node = nodes[i];
				data = node.dataset;
				type = data.type;

				if (type) {
					renderForm(node, data);
				}

				if (type === 'cart') {
					hasCart = true;
				}
			}

			if (hasCart) {
				loadMiniCart();
			}
		};

		return app;
	}());


}());


PAYPAL.apps.DynamicButton.render();

