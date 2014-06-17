;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


var constants = require('./constants'),
	css = require('./util/css');


module.exports = function Button(label, data, config) {
    var locale = data.get('lc') || 'en_US',
        btn = document.createElement('button'),
        btnLogo = document.createElement('span'),
        btnContent = document.createElement('span');

    // Defaults
    config = config || {};
    config.style = config.style || constants.DEFAULT_STYLE;
    config.size = config.size || constants.DEFAULT_SIZE;

    btn.className += 'paypal-button ' + config.style + ' ' + config.size;

    btnLogo.className = 'paypal-button-logo';
    btnLogo.innerHTML = '<img src="' + constants.LOGO + '" />';

    btnContent.className = 'paypal-button-content';
    btnContent.innerHTML = constants.STRINGS[locale][label].replace('{wordmark}', '<img src="' + constants.WORDMARK[config.style] + '" alt="PayPal" />');

    btn.appendChild(btnLogo);
    btn.appendChild(btnContent);

    css.inject(document.getElementsByTagName('head')[0], constants.STYLES);

    return btn;
};

},{"./constants":2,"./util/css":7}],2:[function(require,module,exports){
'use strict';


module.exports = {

	BN_CODE: 'JavaScriptButtons_{label}',

	PAYPAL_URL: 'https://{host}/cgi-bin/webscr',

	QR_URL: 'https://{host}/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',

	QR_PATTERN: 13,

	QR_SIZE: 250,

	PRETTY_PARAMS: {
		name: 'item_name',
		number: 'item_number',
		locale: 'lc',
		currency: 'currency_code',
		recurrence: 'p3',
		period: 't3',
		callback: 'notify_url',
		button_id: 'hosted_button_id'
	},

	DEFAULT_HOST: 'www.paypal.com',

	DEFAULT_TYPE: 'button',

	DEFAULT_LABEL: 'buynow',

	DEFAULT_SIZE: 'large',

	DEFAULT_STYLE: 'primary',

	DEFAULT_ENV: 'www',

	STRINGS: {"en_AU":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate","subscribe":"Subscribe","paynow":"Pay Now","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"},"fr_CA":{"buynow":"Acheter","cart":"Ajouter au panier","donate":"Faire un don","subscribe":"Souscrire","paynow":"Payer maintenant","item_name":"Objet","number":"Numéro","amount":"Montant","quantity":"Quantité"},"zh_CH":{"buynow":"立即购买","cart":"添加到购物车","donate":"捐赠","subscribe":"租用","paynow":"现在支付","item_name":"物品","number":"编号","amount":"金额","quantity":"数量"},"de_DE":{"buynow":"Jetzt kaufen","cart":"In den Warenkorb","donate":"Spenden","subscribe":"Abonnieren","paynow":"Jetzt bezahlen","item_name":"Artikel","number":"Nummer","amount":"Betrag","quantity":"Menge"},"es_ES":{"buynow":"Comprar ahora","cart":"Añadir al carro","donate":"Donar","subscribe":"Suscribirse","paynow":"Pague ahora","item_name":"Artículo","number":"Número","amount":"Importe","quantity":"Cantidad"},"fr_FR":{"buynow":"Acheter","cart":"Ajouter au panier","donate":"Faire un don","subscribe":"Souscrire","paynow":"Payer maintenant","item_name":"Objet","number":"Numéro","amount":"Montant","quantity":"Quantité"},"en_GB":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate","subscribe":"Subscribe","paynow":"Pay Now","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"},"zh_HK":{"buynow":"立即買","cart":"加入購物車","donate":"捐款","subscribe":"訂用","paynow":"现在支付","item_name":"項目","number":"號碼","amount":"金額","quantity":"數量"},"id_ID":{"buynow":"Beli Sekarang","cart":"Tambah ke Keranjang","donate":"Donasikan","subscribe":"Berlangganan","paynow":"Bayar Sekarang","item_name":"Barang","number":"Nomor","amount":"Harga","quantity":"Kuantitas"},"he_IL":{"buynow":"וישכע הנק","cart":"תוינקה לסל ףסוה","donate":"םורת","subscribe":"יונמכ ףרטצה","paynow":"כשיו שלם ע","item_name":"טירפ","number":"רפסמ","amount":"םוכס","quantity":"מותכ"},"it_IT":{"buynow":"Paga adesso","cart":"Aggiungi al carrello","donate":"Donazione","subscribe":"Iscriviti","paynow":"Paga Ora","item_name":"Oggetto","number":"Numero","amount":"Importo","quantity":"Quantità"},"ja_JP":{"buynow":"今すぐ購入","cart":"カートに追加","donate":"寄付","subscribe":"購読","paynow":"今すぐ支払う","item_name":"商品","number":"番号","amount":"価格","quantity":"数量"},"nl_NL":{"buynow":"Nu kopen","cart":"Aan winkelwagentje toevoegen","donate":"Doneren","subscribe":"Abonneren","paynow":"Nu betalen","item_name":"Item","number":"Nummer","amount":"Bedrag","quantity":"Hoeveelheid"},"no_NO":{"buynow":"Kjøp nå","cart":"Legg til i kurv","donate":"Doner","subscribe":"Abonner","paynow":"Betal nå","item_name":"Vare","number":"Nummer","amount":"Beløp","quantity":"Antall"},"pl_PL":{"buynow":"Kup teraz","cart":"Dodaj do koszyka","donate":"Przekaż darowiznę","subscribe":"Subskrybuj","paynow":"Zapłać teraz","item_name":"Przedmiot","number":"Numer","amount":"Kwota","quantity":"Ilość"},"br_PT":{"buynow":"Comprar agora","cart":"Adicionar ao carrinho","donate":"Doar","subscribe":"Assinar","paynow":"Pagar agora","item_name":"Produto","number":"Número","amount":"Valor","quantity":"Quantidade"},"ru_RU":{"buynow":"Купить сейчас","cart":"Добавить в корзину","donate":"Пожертвовать","subscribe":"Подписаться","paynow":"Оплатить сейчас","item_name":"Товар","number":"Номер","amount":"Сумма","quantity":"Количество"},"sv_SE":{"buynow":"Köp nu","cart":"Lägg till i kundvagn","donate":"Donera","subscribe":"Abonnera","paynow":"Betal nu","item_name":"Objekt","number":"Nummer","amount":"Belopp","quantity":"Antal"},"th_TH":{"buynow":"ซื้อทันที","cart":"เพิ่มลงตะกร้า","donate":"บริจาค","subscribe":"บอกรับสมาชิก","paynow":"จ่ายตอนนี้","item_name":"ชื่อสินค้า","number":"รหัสสินค้า","amount":"ราคา","quantity":"จำนวน"},"tr_TR":{"buynow":"Hemen Alın","cart":"Sepete Ekleyin","donate":"Bağış Yapın","subscribe":"Abone Olun","paynow":"Şimdi öde","item_name":"Ürün","number":"Numara","amount":"Tutar","quantity":"Miktar"},"zh_TW":{"buynow":"立即購","cart":"加到購物車","donate":"捐款","subscribe":"訂閱","paynow":"现在支付","item_name":"商品","number":"商品編號","amount":"單價","quantity":"數量"},"en_US":{"buynow":"Buy with {wordmark}","cart":"Add to Cart","donate":"Donate","subscribe":"Subscribe","paynow":"Pay Now","item_name":"Item","number":"Number","amount":"Amount","quantity":"Quantity"}},

	STYLES: '.paypal-button {	white-space: nowrap;	overflow: hidden;	margin: 0;	padding: 0;	background: 0;	border: 0;	font-family: Arial, Helvetica !important;	cursor: pointer;	z-index: 0;}.paypal-button-logo {	display: inline-block;	border: 1px solid #aaa;	border-right: 0;	border-radius: 4px 0 0 4px;	vertical-align: top;}.paypal-button-content {	padding: 6px 8px 10px;	border: 1px solid transparent;	border-radius: 0 4px 4px 0;}.paypal-button-content img {	vertical-align: middle;}/* Small */.paypal-button-logo {	width: 25px;	height: 25px;}.paypal-button-logo img {	width:18px;	height: 18px;	margin: 4px 0 0 -2px;}.paypal-button-content {	height: 9px;	display:inline-block;	font-size: 10px !important;	line-height: 9px !important;}.paypal-button-content img {	width: 60px;	height: 16px;}/* Medium */.paypal-button.medium .paypal-button-logo {	width: 25px;	height: 29px;}.paypal-button.medium .paypal-button-logo img {	width: 22px;	height: 22px;	margin: 4px 0 0 -2px;}.paypal-button.medium .paypal-button-content {	height: 13px;	font-size: 10px !important;	line-height: 13px !important;}.paypal-button.medium .paypal-button-content img {	width: 71px;	height: 19px;}/* Large */.paypal-button.large .paypal-button-logo {	width: 45px;	height: 44px;}.paypal-button.large .paypal-button-logo img {	width: 30px;	height: 30px;	margin: 8px 0 0 -2px;}.paypal-button.large .paypal-button-content {	height: 28px;	padding: 9px 8px 7px;	font-size: 13px !important;	line-height: 28px !important;}.paypal-button.large .paypal-button-content img {	width: 93px;	height: 25px;}/* Primary */.paypal-button.primary .paypal-button-content {	background: #009cde;	border-color: #009cde;	color: #fff;}/* Secondary */.paypal-button.secondary .paypal-button-content {	background: #eee;	border-color: #cfcfcf;	color: #333;}',

	LOGO: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1RJREFUeNrkmr9v01AQx99LoC1SAatCpQgJ0krQSkjgKUOllg4wIsFfABmYaTa2wMZI5g7lPyD9CxoWZnfrBJm7YFja2LHNnUlQVdWJ794PO8pXerLS1ok/vfP37l4sBVNrm+/fwKEmzKoLy//x/ZOn6w0lE/YDHFrCnvwh/AGsDvwDfNvAv+DgiGKEsB1YTQ64ZMBiGv8UxQthGwDdoZxUYXxQTZRDmGFfh15iFNgV5dI+QO+YBL4vyieMtDMrER6l9+4sAaPemQJ2Sgrs5LmXScAUcyhIru4I10oO7Mwa8ERdIf79U9anJLEQcajvqqvz1oDphpVEQp6e/IPWKQnJWbkqkuoCUFyD11UjwOSSJIM/+mFHWRP1hYQlgt9p1Af3HugrS+DQvPoLEbYiAA9ct7W8d7wPy9FhWjXuhdhSdDftenGYOMyCrphMZyOpPB72/LW2VIHpQ4NOZ6YBo3Yhyjt2U9oicLj28LIfv1YBJreV0pJhxTduivjW7ct+9ZIFPNzWEWWNcPikntk3QFq7nAgzgQfGYZP5BRFuPM7dLOUFLm0NxugidF7lBaY7tIX6i/dtv75FOsdchC1E9/TZC/I5xoBNO/QZwGY480X5HGD6lBQFRmEnGNV/nbzd8EjTEntbx0CE0Zz6W89zw4I8znhYihqMreMZwOZMY8vAGmGxiwrq25SontcBB5i+raM4JWHqDqA3Hqyup0cFdTnAZMOScUBK1fQIqZpANAfwmpi2WfoChuVzgOk1GFpKNJcgu8e1oTa5DnO3dcL1R0XDdi+Wo7x1mOXQ/c3tImHTL8q5nRY5wsncHKmZN6CPEN0eF5g8NMRLS0XColF9Vumla1MEjLAN1eGB3FbG1xeLgG3mgR1blrjbOpYjjI1FY9w9S6nDLOBk0XiER89ptbNKDxeYVYNjvcDeEBAjeDSuvuoAJjt0tLKiErVXANM1nR4VrTWYH92mDVjtwAoObQV2EjB5SuI6NMVljQBzt3WYhuUJi6roLEnMCPemElih4TgqAzB5WwenJIVaWzgwWdEdpRpcOHCbeiHcGmyr/o4kdb3R8t7xIWO66gHw6lSmNLP3turQ2oCHjwhxHiv+NpXAgv/QuD9rwN60ArNgbTs06q8AAwC1swu0LaowrwAAAABJRU5ErkJggg==',

	WORDMARK: {
		primary: 'data:image/png;base64,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',
		secondary: 'data:image/png;base64,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'
	}

};

},{}],3:[function(require,module,exports){
'use strict';


var Button = require('./button'),
    Form = require('./form'),
    QR = require('./qr'),
    DataStore = require('./util/datastore'),
    constants = require('./constants');



module.exports = function factory(business, raw, config) {
    var data, el, key, label, type, env;

    if (!business) { return false; }

    // Normalize incoming data if needed
    if (raw.items) {
        data = raw;
    } else {
        data = new DataStore();

        for (key in raw) {
            data.add(key, raw[key]);
        }
    }

    // Defaults
    config = config || {};
    label = config.label || constants.DEFAULT_LABEL;
    type = config.type || constants.DEFAULT_TYPE;

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
        if (data.get('amount') && !data.get('a3')) {
            data.add('a3', data.get('amount'));
        }
    // Buy Now buttons
    } else {
        if (data.get('hosted_button_id')) {
            data.add('cmd', '_s-xclick');
        } else {
            data.add('cmd', '_xclick');
        }
    }

    // Add common data
    data.add('business', business);
    data.add('bn', constants.BN_CODE.replace(/\{label\}/, label));

    // Build the UI components
    if (type === 'qr') {
        el = QR(data, config);
    } else if (type === 'button') {
        el = Button(label, data, config);
    } else {
        el = Form(label, data, config);
    }

    // Inject CSS
    // injectCSS();

    return {
        label: label,
        type: type,
        el: el
    };
};

},{"./button":1,"./constants":2,"./form":4,"./qr":6,"./util/datastore":8}],4:[function(require,module,exports){
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




},{"./button":1,"./constants":2}],5:[function(require,module,exports){
'use strict';


var DataStore = require('./util/datastore'),
    factory = require('./factory'),
    app = {};


app.counter = {
    buynow: 0,
    cart: 0,
    donate: 0,
    subscribe: 0
};


app.create = function (business, data, config, parent) {
    var result = factory(business, data, config);

    if (result) {
        app.counter[result.label] += 1;

        if (parent) {
            parent.appendChild(result.el);
        }
    }

    return result;
};


app.process = function (el) {
    var nodes = document.getElementsByTagName('script'),
        node, data, business, i, len;

    for (i = 0, len = nodes.length; i < len; i++) {
        node = nodes[i];

        if (!node || !node.src) { continue; }

        data = new DataStore();
        data.parse(node);

        // If there's a merchant ID attached then it's a button of interest
        if ((business = node.src.split('?merchant=')[1])) {
            app.create(
                business,
                data,
                {
                    type: data.pluck('type'),
                    label: data.pluck('button'),
                    size: data.pluck('size'),
                    style: data.pluck('style'),
                    host: data.pluck('host')
                },
                node.parentNode
            );

            // Clean up
            node.parentNode.removeChild(node);
        }
    }
};



// Support node and the browser
if (typeof window === 'undefined') {
    module.exports = app;
} else {
    // Make the API available
    if (!window.paypal) {
        window.paypal = {};
        window.paypal.button = app;
    }

    // Bind to existing scripts
    window.paypal.button.process(document);
}

},{"./factory":3,"./util/datastore":8}],6:[function(require,module,exports){
'use strict';


var constants = require('./constants');


module.exports = function QrCode(data, config) {
    var img, url, item, key, size;

    // Defaults
    config = config || {};
    size = config.size || constants.QR_SIZE;
    config.host = config.host || constants.DEFAULT_HOST;

    // Construct URL
    url = constants.PAYPAL_URL;
    url = url.replace('{host}', config.host);
    url = url + '?';

    for (key in data.items) {
        url += key + '=' + encodeURIComponent(data.get(key)) + '&';
    }

    url = encodeURIComponent(url);

    // Build the image
    img = document.createElement('img');
    img.src = constants.QR_URL
		.replace('{host}', config.host)
		.replace('{url}', url)
		.replace('{pattern}', constants.QR_PATTERN)
		.replace('{size}', size);

    return img;
};

},{"./constants":2}],7:[function(require,module,exports){
/* jshint quotmark:double */


"use strict";



module.exports.add = function add(el, str) {
    var re;

    if (!el) { return false; }

    if (el && el.classList && el.classList.add) {
        el.classList.add(str);
    } else {
        re = new RegExp("\\b" + str + "\\b");

        if (!re.test(el.className)) {
            el.className += " " + str;
        }
    }
};


module.exports.remove = function remove(el, str) {
    var re;

    if (!el) { return false; }

    if (el.classList && el.classList.add) {
        el.classList.remove(str);
    } else {
        re = new RegExp("\\b" + str + "\\b");

        if (re.test(el.className)) {
            el.className = el.className.replace(re, "");
        }
    }
};


module.exports.inject = function inject(el, str) {
    var style;

    if (!el) { return false; }

    if (str) {
        style = document.createElement("style");
        style.type = "text/css";

        if (style.styleSheet) {
            style.styleSheet.cssText = str;
        } else {
            style.appendChild(document.createTextNode(str));
        }

        el.appendChild(style);
    }
};

},{}],8:[function(require,module,exports){
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

},{"../constants":2}]},{},[1,2,3,4,5,6,7,8])
;