if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	'use strict';


	var app = {},
		paypalURL = 'https://www.paypal.com/cgi-bin/webscr',
		qrCodeURL = 'https://www.paypal.com/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',
		bnCode = 'JavaScriptButton_{type}',
		prettyParams = {
			name: 'item_name',
			number: 'item_number',
			lang: 'lc',
			recurrence: 'p3',
			period: 't3'
		},
		buttonText = {
			de_DE: { buynow: 'Jetzt kaufen', cart: 'In den Warenkorb', donate: 'Spenden', subscribe: 'Abonnieren' },
			en_US: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe' },
			es_ES: { buynow: 'Comprar ahora', cart: 'Añadir al carro', donate: 'Donar', subscribe: 'Suscribirse' },
			fr_FR: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire' }
		};

	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * Initial config for the app. These values can be overridden by the page.
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
			donate: 0,
			qr: 0,
			subscribe: 0
		};

		/**
		 * Renders a button in place of the given element
		 *
		 * @param business {Object} The ID or email address of the merchant to create the button for
		 * @param raw {Object} An object of key/value data to set as button params
		 * @param type (String) The type of the button to render
		 * @param parent {HTMLElement} The element to add the button to (Optional)
		 * @return {HTMLElement}
		 */
		app.create = function (business, raw, type, parent) {
			var data = new DataStore(), button, key;

			if (!business) { return false; }

			// Normalize the data's keys and add to a data store
			for (key in raw) {
				data.add(prettyParams[key] || key, raw[key].value, raw[key].isEditable);
			}

			// Defaults
			type = type || 'buynow';

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
				if (data.items.amount && !data.items.a3) {
					data.add('a3', data.items.amount.value);
				}
			// Buy Now buttons
			} else {
				data.add('cmd', '_xclick');
			}

			// Add common data
			data.add('business', business);
			data.add('bn', bnCode.replace(/\{type\}/, type));

			// Build the UI components
			if (type === 'qr') {
				button = buildQR(data, data.items.size);
				data.remove('size');
			} else {
				button = buildForm(data, type);
			}

			// Inject CSS
			injectCSS();

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
	 * @param data {Object} An object of key/value data to set as button params
	 * @param type (String) The type of the button to render
	 * @return {HTMLElement}
	 */
	function buildForm(data, type) {
		var form = document.createElement('form'),
			btn = document.createElement('button'),
			hidden = document.createElement('input'),
			items = data.items,
			item, child, label, input, key, size, locale;

		form.method = 'post';
		form.action = paypalURL;
		form.className = 'paypal-button';
		form.target = '_top';

		hidden.type = 'hidden';

		for (key in items) {
			item = items[key];

			if (item.isEditable) {
				input = document.createElement('input');
				input.type = 'text';
				input.className = 'paypal-input';
				input.name = item.key;
				input.value = item.value;

				label = document.createElement('label');
				label.className = 'paypal-label';
				label.appendChild(document.createTextNode(app.config.labels[item.key] + ' ' || ''));
				label.appendChild(input);

				child = document.createElement('p');
				child.className = 'paypal-group';
				child.appendChild(label);
			} else {
				input = child = hidden.cloneNode(true);
				input.name = item.key;
				input.value = item.value;
			}

			form.appendChild(child);
		}

		size = items.size && items.size.value || 'large';
		locale = items.lc && items.lc.value || 'en_US';

		btn.type = 'submit';
		btn.className = 'paypal-button ' + size;
		btn.appendChild(document.createTextNode(buttonText[locale][type]));

		form.appendChild(btn);

		// If the Mini Cart is present then register the form
		if (PAYPAL.apps.MiniCart && data.items.cmd.value === '_cart') {
			var MiniCart = PAYPAL.apps.MiniCart;

			if (!MiniCart.UI.itemList) {
				MiniCart.render();
			}

			MiniCart.bindForm(form);
		}

		return form;
	}

	/**
	 * Injects button CSS in the <head>
	 *
	 * @return {void}
	 */
	function injectCSS() {
		var css, styleEl, paypalButton, paypalInput;

		if (document.getElementById('paypal-button')) {
			return;
		}

		css = '';
		styleEl = document.createElement('style');
		paypalButton = '.paypal-button';
		paypalInput = paypalButton + ' button[type=submit]';

		css += paypalButton + ' { white-space: nowrap; }';
		css += paypalInput + ' { white-space: nowrap; overflow: hidden; outline: none; text-decoration: none; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; box-sizing: border-box; max-width: 100%; position: relative; margin: 0; background-color: #FFAA00;  background: -moz-linear-gradient(top, #FFF8FC 0%, #FFAA00 50%, #FFAA00 80%, #FFF8FC 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFF8FC), color-stop(50%,#FFAA00), color-stop(80%,#FFAA00), color-stop(100%,#FFF8FC)); background: -webkit-linear-gradient(top, #FFF8FC 0%,#FFAA00 50%,#FFAA00 80%,#FFF8FC 100%); background: -o-linear-gradient(top, #FFF8FC 0%,#FFAA00 50%,#FFAA00 80%,#FFF8FC 100%); background: -ms-linear-gradient(top, #FFF8FC 0%,#FFAA00 50%,#FFAA00 80%,#FFF8FC 100%); background: linear-gradient(to bottom, #FFF8FC 0%,#FFAA00 50%,#FFAA00 80%,#FFF8FC 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#FFF8FC", endColorstr="#FFAA00",GradientType=0 );border: #FB8900 solid 1px; -moz-border-radius: 12px; -webkit-border-radius: 12px; border-radius: 12px; color: #0E3168; font-weight: bold; text-shadow: 0 1px 0 rgba(255,255,255,.5); -webkit-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none; cursor: pointer; max-width: 100%; overflow: hidden; font-style: italic; font-family: "Arial", bold, italic; }';
		css += paypalInput + '.small { padding: 3px 15px; font-size: 12px; }';
		css += paypalInput + '.large { padding: 4px 19px; font-size: 14px; }';

		styleEl.type = 'text/css';
		styleEl.id = 'paypal-button';

		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = css;
		} else {
			styleEl.appendChild(document.createTextNode(css));
		}

		document.getElementsByTagName('head')[0].appendChild(styleEl);
	}


	/**
	 * Builds the image for a QR code
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param size {String} The size of QR code's longest side
	 * @return {HTMLElement}
	 */
	function buildQR(data, size) {
		var img = document.createElement('img'),
			url = paypalURL + '?',
			pattern = 13,
			items = data.items,
			item, key;

		// QR defaults
		size = size && size.value || 250;

		for (key in items) {
			item = items[key];
			url += item.key + '=' + encodeURIComponent(item.value) + '&';
		}

		url = encodeURIComponent(url);
		img.src = qrCodeURL.replace('{url}', url).replace('{pattern}', pattern).replace('{size}', size);

		return img;
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

				if ((matches = /^data-([a-z0-9]+)(-editable)?/i.exec(attr.name))) {
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
			node, data, type, business, i, len;

		for (i = 0, len = nodes.length; i < len; i++) {
			node = nodes[i];

			if (!node || !node.src) { continue; }

			data = node && getDataSet(node);
			type = data && data.button && data.button.value;
			business = node.src.split('?merchant=')[1];

			if (business) {
				ButtonFactory.create(business, data, type, node.parentNode);

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
