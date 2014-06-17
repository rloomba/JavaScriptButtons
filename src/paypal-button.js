if (typeof PAYPAL === 'undefined' || !PAYPAL) {
    var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};

(function (document) {

    'use strict';

    var app = {},
        paypalURL = 'https://{env}.paypal.com/cgi-bin/webscr',
        qrCodeURL = 'https://{env}.paypal.com/webapps/ppint/qrcode?data={url}&pattern={pattern}&height={size}',
        bnCode = 'JavaScriptButton_{label}',
        logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1RJREFUeNrkmr9v01AQx99LoC1SAatCpQgJ0krQSkjgKUOllg4wIsFfABmYaTa2wMZI5g7lPyD9CxoWZnfrBJm7YFja2LHNnUlQVdWJ794PO8pXerLS1ok/vfP37l4sBVNrm+/fwKEmzKoLy//x/ZOn6w0lE/YDHFrCnvwh/AGsDvwDfNvAv+DgiGKEsB1YTQ64ZMBiGv8UxQthGwDdoZxUYXxQTZRDmGFfh15iFNgV5dI+QO+YBL4vyieMtDMrER6l9+4sAaPemQJ2Sgrs5LmXScAUcyhIru4I10oO7Mwa8ERdIf79U9anJLEQcajvqqvz1oDphpVEQp6e/IPWKQnJWbkqkuoCUFyD11UjwOSSJIM/+mFHWRP1hYQlgt9p1Af3HugrS+DQvPoLEbYiAA9ct7W8d7wPy9FhWjXuhdhSdDftenGYOMyCrphMZyOpPB72/LW2VIHpQ4NOZ6YBo3Yhyjt2U9oicLj28LIfv1YBJreV0pJhxTduivjW7ct+9ZIFPNzWEWWNcPikntk3QFq7nAgzgQfGYZP5BRFuPM7dLOUFLm0NxugidF7lBaY7tIX6i/dtv75FOsdchC1E9/TZC/I5xoBNO/QZwGY480X5HGD6lBQFRmEnGNV/nbzd8EjTEntbx0CE0Zz6W89zw4I8znhYihqMreMZwOZMY8vAGmGxiwrq25SontcBB5i+raM4JWHqDqA3Hqyup0cFdTnAZMOScUBK1fQIqZpANAfwmpi2WfoChuVzgOk1GFpKNJcgu8e1oTa5DnO3dcL1R0XDdi+Wo7x1mOXQ/c3tImHTL8q5nRY5wsncHKmZN6CPEN0eF5g8NMRLS0XColF9Vumla1MEjLAN1eGB3FbG1xeLgG3mgR1blrjbOpYjjI1FY9w9S6nDLOBk0XiER89ptbNKDxeYVYNjvcDeEBAjeDSuvuoAJjt0tLKiErVXANM1nR4VrTWYH92mDVjtwAoObQV2EjB5SuI6NMVljQBzt3WYhuUJi6roLEnMCPemElih4TgqAzB5WwenJIVaWzgwWdEdpRpcOHCbeiHcGmyr/o4kdb3R8t7xIWO66gHw6lSmNLP3turQ2oCHjwhxHiv+NpXAgv/QuD9rwN60ArNgbTs06q8AAwC1swu0LaowrwAAAABJRU5ErkJggg==',
        wordmark = {
            primary: 'data:image/png;base64,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',
            secondary: 'data:image/png;base64,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'
        },
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
            en_AU: { buynow: 'Buy with {wordmark}', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
            en_GB: { buynow: 'Buy with {wordmark}', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
            en_US: { buynow: 'Buy with {wordmark}', cart: 'Add to Cart', donate: 'Donate', subscribe: 'Subscribe', paynow : 'Pay Now', item_name: 'Item', number: 'Number', amount: 'Amount', quantity: 'Quantity' },
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
            subscribe: 0
        };

        /**
         * Renders a button in place of the given element
         *
         * @param business {Object} The ID or email address of the merchant to create the button for
         * @param raw {Object} An object of key/value data to set as button params
         * @param type (String) The type of widget to render, e.g. form or button
         * @param label (String) The label key of the button to render
         * @param parent {HTMLElement} The element to add the button to (Optional)
         * @return {HTMLElement}
         */
        app.create = function (business, raw, type, label, parent) {
            var data = new DataStore(), button, key, env, rawKey;

            if (!business) { return false; }

            // Normalize the data's keys and add to a data store
            for (key in raw) {
                rawKey = raw[key];
                data.add(prettyParams[key] || key, rawKey.value, rawKey.isEditable, rawKey.hasOptions, rawKey.displayOrder);
            }

            // Defaults
            label = label || 'buynow';
            type = type || 'button';
            env = 'www';

            if (data.items.env && data.items.env.value) {
                env += '.' + data.items.env.value;
            }

            // Pluck off unneeded data
            data.remove('type');
            data.remove('label');
            data.remove('env');

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
            data.add('bn', bnCode.replace(/\{label\}/, label));
            data.add('env',  env);

            // Build the UI components
            if (type === 'qr') {
                button = buildQR(data, data.items.size);
                data.remove('size');
            } else if (type === 'button') {
                button = buildButton(data, label);
            } else {
                button = buildForm(data, label);
            }

            // Inject CSS
            injectCSS();

            // Register it
            this.buttons[label] += 1;

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

        css += '.paypal-button { white-space: nowrap; overflow: hidden; margin: 0; padding: 0; background: 0; border: 0; font-family: Arial, Helvetica !important; cursor: pointer; z-index: 0; }';
        css += '.paypal-button-logo { display: inline-block; border: 1px solid #aaa; border-right: 0; border-radius: 4px 0 0 4px; vertical-align: top; }';
        css += '.paypal-button-content { padding: 6px 8px 10px; border: 1px solid transparent; border-radius: 0 4px 4px 0; } ';
        css += '.paypal-button-content img { vertical-align: middle; }';

        // Small
        css += '.paypal-button-logo { width: 25px; height: 25px; }';
        css += '.paypal-button-logo img { width:18px; height: 18px; margin: 4px 0 0 -2px; }';
        css += '.paypal-button-content { height: 9px; display:inline-block; font-size: 10px !important; line-height: 9px !important; }';
        css += '.paypal-button-content img { width: 60px; height: 16px; }';

        // Medium
        css += '.paypal-button.medium .paypal-button-logo { width: 25px; height: 29px; }';
        css += '.paypal-button.medium .paypal-button-logo img { width: 22px; height: 22px; margin: 4px 0 0 -2px; }';
        css += '.paypal-button.medium .paypal-button-content { height: 13px; font-size: 10px !important; line-height: 13px !important; }';
        css += '.paypal-button.medium .paypal-button-content img { width: 71px; height: 19px; }';

        // Large
        css += '.paypal-button.large .paypal-button-logo { width: 45px; height: 44px; }';
        css += '.paypal-button.large .paypal-button-logo img { width: 30px; height: 30px; margin: 8px 0 0 -2px; }';
        css += '.paypal-button.large .paypal-button-content { height: 28px; padding: 9px 8px 7px; font-size: 13px !important; line-height: 28px !important; }';
        css += '.paypal-button.large .paypal-button-content img { width: 93px; height: 25px; }';

        // Primary
        css += '.paypal-button.primary .paypal-button-content { background: #009cde; border-color: #009cde; color: #fff; }';

        // Secondary
        css += '.paypal-button.secondary .paypal-button-content { background: #eee; border-color: #cfcfcf; color: #333; }';

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
     * @param label (String) The label key of the button to render
     * @return {HTMLElement}
     */
    function buildButton(data, label) {
        var items = data.items,
            locale = items.lc && items.lc.value || 'en_US',
            localeText = locales[locale] || locales.en_US,
            btn = document.createElement('button'),
            btnLogo = document.createElement('span'),
            btnContent = document.createElement('span'),
            btnLabel = localeText[label],
            style = items.style && items.style.value || 'primary',
            size = items.size && items.size.value || 'large';

        btn.className += 'paypal-button ' + style + ' ' + size;

        btnLogo.className = 'paypal-button-logo';
        btnLogo.innerHTML = '<img src="' + logo + '" />';

        btnContent.className = 'paypal-button-content';
        btnContent.innerHTML = btnLabel.replace('{wordmark}', '<img src="' + wordmark[style] + '" />');
        
        btn.appendChild(btnLogo);
        btn.appendChild(btnContent);

        return btn;
    }


    /**
     * Builds the form DOM structure for a checkout form
     *
     * @param data {Object} An object of key/value data to set as button params
     * @param type (String) The label key of the button to render
     * @return {HTMLElement}
     */
    function buildForm(data, type) {
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

        form.method = 'post';
        form.action = paypalURL.replace('{env}', data.items.env.value);
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
                labelText = app.config.labels[item.key] || item.key;
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

        btn = buildButton(data, type);

        // Safari won't let you set read-only attributes on buttons.
        try {
            btn.type = 'submit';
        } catch (e) {
            btn.setAttribute('type', 'submit');
        }

        // Add the correct button
        form.appendChild(btn);

        return form;
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
            node, data, type, label, business, i, len, buttonId;

        for (i = 0, len = nodes.length; i < len; i++) {
            node = nodes[i];

            if (!node || !node.src) { continue; }

            data = node && getDataSet(node);
            type = data && data.type && data.type.value;
            label = data && data.button && data.button.value;
            business = node.src.split('?merchant=')[1];

            if (business) {
                ButtonFactory.create(business, data, type, label, node.parentNode);

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
