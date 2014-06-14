if (typeof PAYPAL === 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};

(function (document) {

	'use strict';

	var app = {},
		paypalURL = 'https://{env}.paypal.com/cgi-bin/webscr',
		qrCodeURL = 'https://{env}.paypal.com/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',
		bnCode = 'JavaScriptButton_{type}',
		prettyParams = {
			name: 'item_name',
			number: 'item_number',
			locale: 'lc',
			currency: 'currency_code',
			recurrence: 'p3',
			period: 't3',
			callback: 'notify_url',
			button_id: 'hosted_button_id'
		},
		locales = {
			da_DK: { buynow: 'Køb nu', cart: 'Læg i indkøbsvogn', donate: 'Doner', subscribe: 'Abonner', paynow : 'Betal nu', item_name: 'Vare', number: 'Nummer', amount: 'Pris', quantity: 'Antal' },
			de_DE: { buynow: 'Jetzt kaufen', cart: 'In den Warenkorb', donate: 'Spenden', subscribe: 'Abonnieren', paynow : 'Jetzt bezahlen', item_name: 'Artikel', number: 'Nummer', amount: 'Betrag', quantity: 'Menge' },
			en_AU: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			en_GB: { buynow: 'Buy Now', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			en_US: { buynow: 'Buy with PayPal', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
			es_ES: { buynow: 'Comprar ahora', cart: 'Añadir al carro', donate: 'Donar', subscribe: 'Suscribirse', paynow : 'Pague ahora', item_name: 'Artículo', number: 'Número', amount: 'Importe', quantity: 'Cantidad' },
			es_XC: { buynow: 'Comprar ahora', cart: 'Añadir al carrito', donate: 'Donar', subscribe: 'Suscribirse', paynow : 'Pague ahora', item_name: 'Artículo', number: 'Número', amount: 'Importe', quantity: 'Cantidad' },
			fr_CA: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', paynow : 'Payer maintenant', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			fr_FR: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', paynow : 'Payer maintenant', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			fr_XC: { buynow: 'Acheter', cart: 'Ajouter au panier', donate: 'Faire un don', subscribe: 'Souscrire', paynow : 'Payer maintenant', item_name: 'Objet', number: 'Numéro', amount: 'Montant', quantity: 'Quantité' },
			he_IL: { buynow: 'וישכע הנק', cart: 'תוינקה לסל ףסוה', donate: 'םורת', subscribe: 'יונמכ ףרטצה', paynow : 'כשיו שלם ע', item_name: 'טירפ', number: 'רפסמ', amount: 'םוכס', quantity: 'מותכ' },
			id_ID: { buynow: 'Beli Sekarang', cart: 'Tambah ke Keranjang', donate: 'Donasikan', subscribe: 'Berlangganan', paynow : 'Bayar Sekarang', item_name: 'Barang', number: 'Nomor', amount: 'Harga', quantity: 'Kuantitas' },
			it_IT: { buynow: 'Paga adesso', cart: 'Aggiungi al carrello', donate: 'Donazione', subscribe: 'Iscriviti', paynow : 'Paga Ora', item_name: 'Oggetto', number: 'Numero', amount: 'Importo', quantity: 'Quantità' },
			ja_JP: { buynow: '今すぐ購入', cart: 'カートに追加', donate: '寄付', subscribe: '購読', paynow : '今すぐ支払う', item_name: '商品', number: '番号', amount: '価格', quantity: '数量' },
			nl_NL: { buynow: 'Nu kopen', cart: 'Aan winkelwagentje toevoegen', donate: 'Doneren', subscribe: 'Abonneren', paynow : 'Nu betalen', item_name: 'Item', number: 'Nummer', amount: 'Bedrag', quantity: 'Hoeveelheid' },
			no_NO: { buynow: 'Kjøp nå', cart: 'Legg til i kurv', donate: 'Doner', subscribe: 'Abonner', paynow : 'Betal nå', item_name: 'Vare', number: 'Nummer', amount: 'Beløp', quantity: 'Antall' },
			pl_PL: { buynow: 'Kup teraz', cart: 'Dodaj do koszyka', donate: 'Przekaż darowiznę', subscribe: 'Subskrybuj', paynow : 'Zapłać teraz', item_name: 'Przedmiot', number: 'Numer', amount: 'Kwota', quantity: 'Ilość' },
			pt_BR: { buynow: 'Comprar agora', cart: 'Adicionar ao carrinho', donate: 'Doar', subscribe: 'Assinar', paynow : 'Pagar agora', item_name: 'Produto', number: 'Número', amount: 'Valor', quantity: 'Quantidade' },
			ru_RU: { buynow: 'Купить сейчас', cart: 'Добавить в корзину', donate: 'Пожертвовать', subscribe: 'Подписаться', paynow : 'Оплатить сейчас', item_name: 'Товар', number: 'Номер', amount: 'Сумма', quantity: 'Количество' },
			sv_SE: { buynow: 'Köp nu', cart: 'Lägg till i kundvagn', donate: 'Donera', subscribe: 'Abonnera', paynow : 'Betal nu', item_name: 'Objekt', number: 'Nummer', amount: 'Belopp', quantity: 'Antal' },
			th_TH: { buynow: 'ซื้อทันที', cart: 'เพิ่มลงตะกร้า', donate: 'บริจาค', subscribe: 'บอกรับสมาชิก', paynow : 'จ่ายตอนนี้', item_name: 'ชื่อสินค้า', number: 'รหัสสินค้า', amount: 'ราคา', quantity: 'จำนวน' },
			tr_TR: { buynow: 'Hemen Alın', cart: 'Sepete Ekleyin', donate: 'Bağış Yapın', subscribe: 'Abone Olun', paynow : 'Şimdi öde', item_name: 'Ürün', number: 'Numara', amount: 'Tutar', quantity: 'Miktar' },
			zh_CN: { buynow: '立即购买', cart: '添加到购物车', donate: '捐赠', subscribe: '租用', paynow : '现在支付', item_name: '物品', number: '编号', amount: '金额', quantity: '数量' },
			zh_HK: { buynow: '立即買', cart: '加入購物車', donate: '捐款', subscribe: '訂用', paynow : '现在支付', item_name: '項目', number: '號碼', amount: '金額', quantity: '數量' },
			zh_TW: { buynow: '立即購', cart: '加到購物車', donate: '捐款', subscribe: '訂閱', paynow : '现在支付', item_name: '商品', number: '商品編號', amount: '單價', quantity: '數量' },
			zh_XC: { buynow: '立即购买', cart: '添加到购物车', donate: '捐赠', subscribe: '租用', paynow : '现在支付', item_name: '物品', number: '编号', amount: '金额', quantity: '数量' }
		};

	if (!PAYPAL.apps.ButtonFactory) {

		/**
		 * Initial config for the app. These values can be overridden by the page.
		 */
		app.config = {
			labels: {}
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
			var data = new DataStore(), button, key, env, rawKey;

			if (!business) { return false; }

			// Normalize the data's keys and add to a data store
			for (key in raw) {
				rawKey = raw[key];
				data.add(prettyParams[key] || key, rawKey.value, rawKey.isEditable, rawKey.hasOptions, rawKey.displayOrder);
			}

			// Defaults
			type = type || 'buynow';
			env = 'www';

			if (data.items.env && data.items.env.value) {
				env += '.' + data.items.env.value;
			}

			// Hosted buttons
			if (data.items.hosted_button_id) {
				data.add('cmd', '_s-xclick');
			// Cart buttons
			} else if (type === 'cart') {
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
			data.add('env',  env);

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
	 * Injects button CSS in the <head>
	 *
	 * @return {void}
	 */
	function injectCSS() {
		var css, styleEl;

		if (document.getElementById('paypal-button')) {
			return;
		}

		css = '';
		styleEl = document.createElement('style');

		css += '.paypal-button { white-space: nowrap; }';
		css += '.paypal-button button { white-space: nowrap; overflow: hidden; margin: 0; padding: 0; background: 0; border: 0; font-family: Arial, Helvetica; cursor: pointer; z-index: 0; }';
		css += '.paypal-button-logo { display: inline-block; border: 1px solid #aaa; border-right: 0; border-radius: 4px 0 0 4px; vertical-align: top; }';
		
		// Small
		css += '.paypal-button-logo { width: 25px; height: 25px; }';
		css += '.paypal-button-logo svg { height: 18px; margin: 4px 0 0 -2px; }';
		css += '.paypal-button-content { height: 11px; padding: 8px; font-size: 10px; line-height: 12px; }';

		// Medium
		css += '.medium .paypal-button-logo { width: 25px; height: 29px; }';
		css += '.medium .paypal-button-logo svg { height: 22px; margin: 4px 0 0 -2px; }';
		css += '.medium .paypal-button-content { height: 15px; padding: 8px; font-size: 10px; line-height: 12px; }';

		// Large
		css += '.large .paypal-button-logo { width: 45px; height: 44px; }';
		css += '.large .paypal-button-logo svg { height: 30px; margin: 8px 0 0 -2px; }';
		css += '.large .paypal-button-content { height: 30px; padding: 8px; font-size: 13px; line-height: 32px; }';

		// Primary
		css += '.paypal-button-content { display:inline-block; background: #009cde; border: 1px #009cde; border-radius: 0 4px 4px 0; color: #fff; }';

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
	 * Builds the form DOM structure for a button
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param type (String) The type of the button to render
	 * @return {HTMLElement}
	 */
	function buildForm(data, type) {
		var form = document.createElement('form'),
			btn = document.createElement('button'),
			btnLogo = document.createElement('span'),
			btnContent = document.createElement('span'),
			hidden = document.createElement('input'),
			paraElem = document.createElement('p'),
			labelElem = document.createElement('label'),
			inputTextElem = document.createElement('input'),
			selectElem = document.createElement('select'),
			optionElem = document.createElement('option'),
			items = data.items,
			optionFieldArr = [],
			formError = 0,
			item, child, label, input, key, size, locale, localeText, btnText, selector, optionField, fieldDetails = {}, fieldDetail, fieldValue, field, labelText, addEventMethodName;

		size = items.size && items.size.value || 'large';
		locale = items.lc && items.lc.value || 'en_US';
		localeText = locales[locale] || locales.en_US;
		btnText = localeText[type];

		form.method = 'post';
		form.action = paypalURL.replace('{env}', data.items.env.value);
		form.className = 'paypal-button ' + size;
		form.target = '_top';

		inputTextElem.type = 'text';
		inputTextElem.className = 'paypal-input';
		paraElem.className = 'paypal-group';
		labelElem.className = 'paypal-label';
		selectElem.className = 'paypal-select';

		hidden.type = 'hidden';


		if (data.items.text) {
			btnText = data.items.text.value;
			data.remove('text');
		}

		for (key in items) {
			item = items[key];

			if (item.hasOptions) {
				optionFieldArr.push(item);
			} else if (item.isEditable) {
				input = inputTextElem.cloneNode(true);
				input.name = item.key;
				input.value = item.value;

				label = labelElem.cloneNode(true);
				labelText = app.config.labels[item.key] || localeText[item.key] || item.key;
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

		optionFieldArr = sortOptionFields(optionFieldArr);

		for (key in optionFieldArr) {
			item = optionFieldArr[key];

			if (optionFieldArr[key].hasOptions) {
				fieldDetails = item.value;
				if (fieldDetails.options.length > 1) {
					input = hidden.cloneNode(true);
					//on - Option Name
					input.name = 'on' + item.displayOrder;
					input.value = fieldDetails.label;
				
					selector = selectElem.cloneNode(true);
					//os - Option Select
					selector.name = 'os' + item.displayOrder;

					for (fieldDetail in fieldDetails.options) {
						fieldValue = fieldDetails.options[fieldDetail];

						if (typeof fieldValue === 'string') {
							optionField = optionElem.cloneNode(true);
							optionField.value = fieldValue;
							optionField.appendChild(document.createTextNode(fieldValue));
							selector.appendChild(optionField);
						} else {
							for (field in fieldValue) {
								optionField = optionElem.cloneNode(true);
								optionField.value = field;
								optionField.appendChild(document.createTextNode(fieldValue[field]));
								selector.appendChild(optionField);
							}
						}
					}

					label = labelElem.cloneNode(true);
					labelText = fieldDetails.label || item.key;
					label.htmlFor = item.key;
					label.appendChild(document.createTextNode(labelText));
					label.appendChild(selector);
					label.appendChild(input);
				} else {
					label = labelElem.cloneNode(true);
					labelText = fieldDetails.label || item.key;
					label.htmlFor = item.key;
					label.appendChild(document.createTextNode(labelText));
					
					input = hidden.cloneNode(true);
					input.name = 'on' + item.displayOrder;
					input.value = fieldDetails.label;
					label.appendChild(input);
					
					input = inputTextElem.cloneNode(true);
					input.name = 'os' + item.displayOrder;
					input.value = fieldDetails.options[0] || '';
					input.setAttribute('data-label', fieldDetails.label);

					label.appendChild(input);
				}
				child = paraElem.cloneNode(true);
				child.appendChild(label);

				form.appendChild(child);
			}
		}

		// Safari won't let you set read-only attributes on buttons.
		try {
			btn.type = 'submit';
		} catch (e) {
			btn.setAttribute('type', 'submit');
		}
		btnLogo.className = 'paypal-button-logo';
		btnLogo.innerHTML = '<svg version="1.1" id="paypal_monogram" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g><path fill="#223A78" d="M26.487,17.71c0.579-0.972,1.006-2.144,1.266-3.481c0.23-1.18,0.273-2.237,0.129-3.141c-0.153-0.955-0.521-1.769-1.093-2.421c-0.347-0.395-0.79-0.737-1.319-1.018l-0.021-0.012l0.004-0.006l0.002-0.014c0.184-1.175,0.178-2.158-0.021-3.003c-0.199-0.848-0.604-1.61-1.236-2.331c-1.311-1.494-3.696-2.251-7.09-2.251H7.783c-0.646,0-1.187,0.462-1.288,1.1l-3.882,24.62c-0.035,0.223,0.029,0.448,0.175,0.62c0.146,0.171,0.36,0.27,0.585,0.27h5.792L9.16,26.676l-0.397,2.52c-0.03,0.193,0.025,0.391,0.152,0.539c0.127,0.15,0.313,0.234,0.509,0.234h4.852c0.563,0,1.035-0.402,1.123-0.959l0.047-0.247l0.915-5.796l0.059-0.32c0.092-0.586,0.59-1.01,1.183-1.01h0.726c2.498,0,4.54-0.553,6.07-1.641C25.233,19.402,25.937,18.633,26.487,17.71z"/><g><g><path fill="#223A78" d="M12.129,7.653c0.061-0.39,0.312-0.709,0.648-0.871c0.153-0.073,0.325-0.114,0.504-0.114h7.31c0.865,0,1.672,0.057,2.41,0.176c0.211,0.034,0.417,0.073,0.616,0.117c0.199,0.044,0.393,0.094,0.58,0.149c0.094,0.027,0.187,0.056,0.276,0.086c0.363,0.12,0.699,0.262,1.011,0.427c0.366-2.333-0.003-3.922-1.265-5.36C22.829,0.679,20.319,0,17.106,0H7.783C7.126,0,6.567,0.478,6.465,1.126l-3.883,24.62c-0.076,0.486,0.299,0.926,0.791,0.926h5.756l1.446-9.169L12.129,7.653z"/><path fill="#169BD8" d="M25.484,7.622L25.484,7.622L25.484,7.622c-0.028,0.178-0.06,0.359-0.096,0.546c-1.229,6.313-5.437,8.496-10.81,8.496h-2.735c-0.657,0-1.211,0.478-1.313,1.126l0,0l0,0l-1.401,8.882L8.732,29.19C8.665,29.616,8.994,30,9.424,30h4.852c0.575,0,1.063-0.418,1.153-0.985l0.048-0.246l0.914-5.796l0.059-0.32c0.09-0.567,0.579-0.985,1.153-0.985h0.726c4.7,0,8.381-1.909,9.456-7.433c0.45-2.308,0.218-4.234-0.972-5.588C26.453,8.237,26.006,7.898,25.484,7.622z"/><path fill="#232F5D" d="M24.197,7.109c-0.188-0.055-0.381-0.104-0.58-0.149c-0.199-0.044-0.405-0.083-0.616-0.117c-0.738-0.119-1.545-0.176-2.41-0.176h-7.31c-0.179,0-0.351,0.041-0.504,0.114c-0.337,0.162-0.587,0.481-0.648,0.871l-1.554,9.85l-0.044,0.287c0.102-0.648,0.656-1.126,1.313-1.126h2.735c5.373,0,9.58-2.183,10.81-8.496c0.036-0.187,0.067-0.368,0.096-0.546c-0.312-0.165-0.647-0.307-1.011-0.427C24.384,7.165,24.291,7.137,24.197,7.109z"/></g></g></g></svg>';

		btnContent.className = 'paypal-button-content';
		btnContent.innerHTML = btnText;
		
		btn.appendChild(btnLogo);
		btn.appendChild(btnContent);

		form.appendChild(btn);

		return form;
	}

	/**
	 * Check className exist in element
	 */
	function hasClass(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}

	/**
	 * Add className to element
	 */
	function addClass(ele, cls) {
		if (!hasClass(ele, cls)) {
			ele.className += ' ' + cls;
		}
	}
	/**
	 * Remove className from element
	 */
	function removeClass(ele, cls) {
		var regex;

		if (hasClass(ele, cls)) {
			regex = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(regex, ' ');
		}
	}

	/**
	 * Display all error message
	 */
	function displayErrorMsg(errors) {
		var errMsg = '<ul>';

		for (var i = 0; i < errors.length; i++) {
			errMsg += '<li>' + errors[i] + '</li>';
		}

		return errMsg + '</ul>';
	}

	/**
	 * Sort Optional Fields by display order
	 */
	function sortOptionFields(optionFieldArr) {
		optionFieldArr.sort(function (a, b) {
			return a.displayOrder - b.displayOrder;
		});

		return optionFieldArr;
	}
	/**
	 * Builds the image for a QR code
	 *
	 * @param data {Object} An object of key/value data to set as button params
	 * @param size {String} The size of QR code's longest side
	 * @return {HTMLElement}
	 */
	function buildQR(data, size) {
		var baseUrl = paypalURL.replace('{env}', data.items.env.value),
			img = document.createElement('img'),
			url = baseUrl + '?',
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

		img.src = qrCodeURL.replace('{env}', data.items.env.value).replace('{url}', url).replace('{pattern}', pattern).replace('{size}', size);

		return img;
	}


	/**
	 * Utility function to polyfill dataset functionality with a bit of a spin
	 *
	 * @param el {HTMLElement} The element to check
	 * @return {Object}
	 */
	function getDataSet(el) {
		var dataset = {}, attrs, attr, matches, len, i, j, customFields = [];

		if ((attrs = el.attributes)) {
			for (i = 0, len = attrs.length; i < len; i++) {
				attr = attrs[i];

				if ((matches = attr.name.match(/^data-option([0-9])([a-z]+)([0-9])?/i))) {
					customFields.push({ 'name' : 'option.' + matches[1] + '.' + matches[2] + (matches[3] ? '.' + matches[3] : ''), value: attr.value });
				} else if ((matches = attr.name.match(/^data-([a-z0-9_]+)(-editable)?/i))) {
					dataset[matches[1]] = {
						value: attr.value,
						isEditable: !!matches[2]
					};
				}
			}
		}

		processCustomFieldValues(customFields, dataset);

		return dataset;
	}
	

	/**
	 * Read all custom field values and create a structured object
	 */
	function processCustomFieldValues(customFields, dataset) {
		var result = {}, keyValuePairs, name, nameParts, accessor, cursor;

		for (i = 0; i < customFields.length; i++) {
			keyValuePairs = customFields[i];
			name = keyValuePairs.name;
			nameParts = name.split('.');
			accessor = nameParts.shift();
			cursor = result;
			while (accessor) {
				if (!cursor[accessor]) {
					cursor[accessor] = {};
				}
				if (!nameParts.length) {
					cursor[accessor] = keyValuePairs.value;
				}
				cursor = cursor[accessor];
				accessor = nameParts.shift();
			}
		}

		//Store custom fields in dataset
		var key, i, j, field, selectMap = {}, priceMap = {}, optionArray = [], optionMap = {}, owns = Object.prototype.hasOwnProperty;
		
		for (key in result) {
			if (owns.call(result, key)) {
				field = result[key];
				for (i in field) {
					dataset['option_' + i] = {
						value: { 'options' : '', 'label' : field[i].name},
						hasOptions: true,
						displayOrder: parseInt(i, 10)
					};
					selectMap = field[i].select;
					priceMap = field[i].price;
					optionArray = [];
					for (j in selectMap) {
						optionMap = {};
						if (priceMap) {
							optionMap[selectMap[j]] = selectMap[j] + ' ' + priceMap[j];
							optionArray.push(optionMap);
						} else {
							optionArray.push(selectMap[j]);
						}
					}
					dataset['option_' + i].value.options = optionArray;
				}
			}
		}
	}


	/**
	 * A storage object to create structured methods around a button's data
	 */
	function DataStore() {
		this.items = {};

		this.add = function (key, value, isEditable, hasOptions, displayOrder) {
			this.items[key] = {
				key: key,
				value: value,
				isEditable: isEditable,
				hasOptions : hasOptions,
				displayOrder : displayOrder
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
			node, data, type, business, i, len, buttonId;

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


}(document));


// Export for CommonJS environments
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = PAYPAL;
}
