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
    btnLogo.innerHTML = constants.LOGO;

    btnContent.className = 'paypal-button-content';
    btnContent.innerHTML = constants.STRINGS[locale][label].replace('{wordmark}', constants.WORDMARK[config.style]);

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

	STRINGS: {
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
	},

	STYLES: '.paypal-button {	white-space: nowrap;	overflow: hidden;	margin: 0;	padding: 0;	background: 0;	border: 0;	font-family: Arial, Helvetica !important;	cursor: pointer;	z-index: 0;}.paypal-button-logo {	display: inline-block;	border: 1px solid #aaa;	border-right: 0;	border-radius: 4px 0 0 4px;	vertical-align: top;}.paypal-button-content {	padding: 6px 8px 10px;	border: 1px solid transparent;	border-radius: 0 4px 4px 0;}.paypal-button-content img {	vertical-align: middle;}/* Small */.paypal-button-logo {	width: 25px;	height: 25px;}.paypal-button-logo img {	width:18px;	height: 18px;	margin: 4px 0 0 -2px;}.paypal-button-content {	height: 9px;	display:inline-block;	font-size: 10px !important;	line-height: 9px !important;}.paypal-button-content img {	width: 60px;	height: 16px;}/* Medium */.paypal-button.medium .paypal-button-logo {	width: 25px;	height: 29px;}.paypal-button.medium .paypal-button-logo img {	width: 22px;	height: 22px;	margin: 4px 0 0 -2px;}.paypal-button.medium .paypal-button-content {	height: 13px;	font-size: 10px !important;	line-height: 13px !important;}.paypal-button.medium .paypal-button-content img {	width: 71px;	height: 19px;}/* Large */.paypal-button.large .paypal-button-logo {	width: 45px;	height: 44px;}.paypal-button.large .paypal-button-logo img {	width: 30px;	height: 30px;	margin: 8px 0 0 -2px;}.paypal-button.large .paypal-button-content {	height: 28px;	padding: 9px 8px 7px;	font-size: 13px !important;	line-height: 28px !important;}.paypal-button.large .paypal-button-content img {	width: 93px;	height: 25px;}/* Primary */.paypal-button.primary .paypal-button-content {	background: #009cde;	border-color: #009cde;	color: #fff;}/* Secondary */.paypal-button.secondary .paypal-button-content {	background: #eee;	border-color: #cfcfcf;	color: #333;}',

	LOGO: 'data:image/png;base64,�PNG

   IHDR   <   <   :��r   tEXtSoftware Adobe ImageReadyq�e<  TIDATx�䚿o�P��K�-R�B�	�J�JH�)C��0"�_ �i6���H��? �fw���`X�ر͝IPUՉ��;�Wz��։?����^,Sk�����&̪�������%�Z�!���|������b��XM�d�b��a ݡ�Ta|PM�C�a_�^b���>@���/�'��3+���,�ޙvJ
�乗I�s(H���J���D]!��S֧$�q�磌�ր醕DB�����)	�Y�*��P\��U#���$�?�aGY���%��i���+K�м��" \���w���aZ5���Rt7�zq�8̂��Lg#�<����T��C�Ng��v!�;vS�"p�����V&��Ғa�7n�����~��<��e�p����7@Z��3��a��n<��,�.m��"t^��;�����m��E:�\�-D����9ƀM;��f8�E�`��Fa'�����H�{[�@�ќ�[�sÂ<�xX������Lc��a��
�۔�������8%a��7���Gu9�dÒq@J����@4𚘶Y���s��5ZJ4� �ǵ�6�s�u��GE�v/���u������"a�/ʹ�9�����7����<4�KKE¢Q}V��kS������V����m��[���:�#��Ec�=K��,�d�x�G�i��J�U�c���#x4��� &;t����W �5��5�ݦX��
mv0yJ�:4�e� s�u���	���,I���X��8*0y[�$�Z[80Y��\8p�z!�l���$u�����!c����T�4�����ڀ��q+�6����и?k�޴�`m;4��  ���-�0�    IEND�B`�$',

	WORDMARK: {
		primary: 'data:image/png;base64,�PNG

   IHDR   �   2   ���D   tEXtSoftware Adobe ImageReadyq�e<  �IDATx��]�u�8w���r�� l1,�ࠂ�
B* �����T`� N8pҭ�S��ɖ�Ӽ�e��4��|˄��N�Sr�GGv�رf�$�D&ƿ��e���eǒ�{��8�7�]��%�ܹ�-I�I˲�E!p:	5�h{�\s$��#_4�ڤ;��("/...�:��;(g��cE]i�d `� ���������CW� Sͭ_�0��se
𮃒[���J�˴�F��9�}p��?WQ��ld��5:�d��㸗@weI��8蘴���%;n.��O�qÎ��;V�{�����.���$�;�� t^򺕲�&wM+���DǍZZ(Z6�g�̭�z�N���!1�կA<w�><<��.M��4�3 c�`⺼�2�F�Ǳ���_��E���Kl�P豘hTOɴ�W]0�@������(����D��K!�����8&H��]	t��(,3s��W�����j����Gʎ�
���l
�U	,ix� �k�y �B-T6Ѕ>�!�+.������-$�P>�soϤ�������N�n�D�p!��J y��c��-f�ۓ
X�;D�B�Q��:��)�H��Ė�ƌ���ncRќX��ji�i��4�l1��t� �1&���B�"mz^���Q �&�%$�������7������+��^�"�Ϣ0+JH(�����D]�Fs���mg\�i挼GL�Y�>���h��*�Y��P���G9�FZ��A��\����c���5�T�e�("�8)ZxSsW:��*܏(T�/� ����]�;jƅ[��־���*�L
�'@�� �8(���s��H �ܔ�3��d<I��ɬZ�6\�+@Z�&z�) �F�^��D&����dV�ȕί�=���{�_�e*��/׆��`iҕ��&�ܧ%�X�S���g�)�/z)6�vM3��;[��>��.p���Ό%7�B��֞ޑsa҆qS@�ˤv��(���y۠y�F�vU�EYp��l)��*�� Htf��r�����+�����M��k��q����V��Ц�3��5�
����t`� ��QX� ��9Q���Zc��\@f�����p�#V� �֢e2Q>+�h�K�ώx�s	�Ixj���,.���x��@g�B��>h�3��DQ���'@�,���r��gV�&��A���b@��w�L/����$~}����� ȗ����$6�nN�H�- �[,�7�� ��Z@{(�m�" ���@G2�qbڂ�E@�@�)cr	���E� ��}nj��Ap�NJ��X�F^(]�2� o�3g���cU�6N�-�v�����Q���!Ak�",C���dsG�ʨ粉���'��!2}stpi[��6"������sm�!�$ ����Y���>�!4G`$�}%�ܧ�sU5l����Ì�ۦE)�I �]	t�������^k,
;<�
��,\S�e�<����"����E� 8w���1����]AWT�ܠPB)tPk+³�m����8�W!�,���(v�\�u����BO�������sl( є�b'�g��=��_P�8]m��}���Uڒ[���}F��~�[Ȯ����P) ��!D��C����K��
�X���(�3An�)Z�MF�bFA��;���:�c���dhjI{��h��:JKŞ�H�6B���y�Y���`�B�q8t�ZC����W���J����\z��$�;����bCف��i��_=�>��׶����m�3¸�l����eǲ�!2]G�r!��k^��c[z?-֠�$��D
�Eh1��Lx��"��$j\�\�xRuHf_�=�_Z�[D�����A�|N-tx�4�c^
���4T�C��s��PA�y-��s��A�ٰ��S_����yn��B�-AR���OOѥg��x�{� ���>O� M��	�)w    IEND�B`�',
		secondary: 'data:image/png;base64,�PNG

   IHDR   �   2   ���D   tEXtSoftware Adobe ImageReadyq�e<  ~IDATx��]Mr�:V(�Ü ��� �	bN0P�>�̊�b�OU�	��`��\ ���97x�%cl�[�mȨ�LUlK�_���9#ed����1�CQ|�z&�m@������/K�C.�����t�?��?{���J@�pf�E�����\�`u�"��L�	��ӋN�=�y��=�
�_=�^4��$7��c�/b�-�yCuk�?�����t`� =	�:-3���^���\uO��v��92T����oLsT�<K�'n�ߎ	轚,�˓�+=���%�U\ڠK���z[�D�A�T�@�I��#ܞ%!W��׆�����Z������wF6�����xIʤ]�1����n��b��@XE: ��X�E�-�LQ�^My:q^@���Z�!FSʿMV?��� �Z6��F����sTB�Oe���op�%&����P��
�X{�%�Vn�A���C�3��Z#E@e�q�ؙ�5�s
5��@B��b��+��533��ƕׄ��V����<�@��D��|�l�j�OD�,��jPc|��k??B ���k�7���?l(�ٽb>O��w�xѕ�|��_#��� ���Jknr٫M<�	�rO���F�� �I�CFXC��Q:��۬W�%���1��,�3mޚ|��#,���j�&�9@PF�(Vc�Xz�KVp��0�O�	�07�����C!�/���~j�}Iy���	�:��L,X.X��e��\�;�Sr�+/<��l�f��d�}F�Y�{i�J��D���l$y썻���B-���G���׮��
%��@�[����j�|$��	n�9����E�{���l�r^�qx��)c�7�p��U����
�Iƽo}UB�7���P����2Cn�tW�Xd
%+P�b��bٱƉl2 [�v����G1O<`h���UGȢ�8.4�e�	w^H;�)	��,t�Z���s�g�M����߼�1���C×�
�CJ���*.W�jA6^��1C���
{��mT�l����	�%��M�(K���5$r}6�Ra�ܵ[b�	���sjK6�n>,?X �(W
$��i����$�$���#Qq�	r/c�0Ո;A�p���K����
ۛYc�9�Je���L�c�P����Fy��M���2��2r�;�ØĪBH����w��WXR)ir���E\Pٌ�K4<��	#��d�|�+P)���<��p%C/~Ǻek������~Vi������p\2��[�{52q�~u`�X��Lq	O6�QL֮r�/d��Hr�JC�;�jσ�@%`eC�n��!�	0�	V�I�o5
� �*���!���<���-���&����v�C��pVt3/4)�h� 2�+_�U�go�c����*'���+�-�\���~��bk!xQ�@��̹�l��ը@PBcZ*��F���Y���as�"�: y��#a5�",Cg���sG��oXG.���B��d��A&��-���r��V���/"Z�wA��>W�W��!���|lU���}�[v���4i��eD�J��8ע�-�<�)l	���*%�����e��U��ݖ��a�9���aO��ry"蠀��W���6A�����[D����$���O��w�}$��>�l��r�N�3�U�j�M.�T��/��ȱB�/E$��tآJ=�/e�\lohH7��xz[��ӭ=H����C��c#%4QN��l/wb�YF������P*�+Y�@�6s�Y��j�J����{��g�"�m��9����
:���6)��[`g(1� y�R*��m�k�/��Ԓ�CBo���Qx�N�{���u�yOUݰ���B������QP\?�U@o�j|�N�ͧ���UNp��"Ź�b�q�ʖWS�5d[I�U@����Ɩ�Yo�.�D��" �/%@��[:���F�B��N�!�+�s?�p�<O �ZB�i�Z�"��c��~� F{#�ֹz�w��=�$=!��[ ��?��$��􅻍�3b
�kF��wш�Sǰ �1�w�Mȏ��E���!d�f��e1d,�������� �T����L��O䴢�9�"0L3@?E�q!��'H\���i�!��]�v ���1���` ���_�3�    IEND�B`�'
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

},{"../constants":2}]},{},[1,2,3,4,5,6,8,7])
;