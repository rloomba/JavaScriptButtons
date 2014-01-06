/*jshint node:true, evil:true */
/*global describe:true, it:true, PAYPAL:true, document:true, window:true, before:true, beforeEach:true */

if (typeof window === 'undefined') {
	var fs = require('fs'),
		should = require('should'),
		jsdom = require('jsdom').jsdom,
		jsdomOptions = { features: { QuerySelector: true }},
		testFile = fs.readFileSync('./test/index.html').toString(),
		document = jsdom(testFile, null, jsdomOptions),
		window = document.createWindow();

	eval(fs.readFileSync('src/paypal-button.js').toString());
}

// Test the object's integrity
describe('JavaScript API', function () {

	'use strict';

	var namespace;

	before(function () {
		namespace = PAYPAL;
	});

	it('Should have a PAYPAL namespace', function () {
		namespace.should.be.an.Object;
	});

	it('Should have a PAYPAL.apps namespace', function () {
		namespace.apps.should.be.an.Object;
	});

	it('Should have a PAYPAL.apps.ButtonFactory namespace', function () {
		namespace.apps.ButtonFactory.should.be.an.Object;
	});

	it('Should have a configuration object', function () {
		namespace.apps.ButtonFactory.config.should.be.an.Object;
	});

	it('Should have a create method', function () {
		namespace.apps.ButtonFactory.create.should.be.a.Function;
	});

	it('Create return false if no parameters', function () {
		var result = namespace.apps.ButtonFactory.create();

		result.should.equal(false);
	});

});


// Test the buttons counter object
describe('Test page button counter', function () {

	'use strict';

	var buttons;

	before(function () {
		buttons = PAYPAL.apps.ButtonFactory.buttons;
	});

	it('Should have seven buy now buttons', function () {
		buttons.buynow.should.equal(7);
	});

	it('Should have two cart buttons', function () {
		buttons.cart.should.equal(2);
	});

	it('Should have two donation buttons', function () {
		buttons.donate.should.equal(2);
	});

	it('Should have two subscribe buttons', function () {
		buttons.subscribe.should.equal(2);
	});

	it('Should have one QR code', function () {
		buttons.qr.should.equal(1);
	});
});

// Test environments
describe('Environments', function () {

	'use strict';

	var sandbox, www;

	before(function () {
		sandbox = document.querySelector('#sandbox form');
		www = document.querySelector('#buynow-sm form');
	});

	it('Should be a sandbox button', function () {
		sandbox.action.should.include('//www.sandbox.paypal');
	});

	it('Should be a www button', function () {
		www.action.should.include('//www.paypal');
	});

});


// Test editable fields
describe('Editable buttons', function () {

	'use strict';

	var inputs;

	before(function () {
		inputs = document.querySelectorAll('#buynow-editable input[type=text]');
	});

	it('Should have three inputs', function () {
		inputs.length.should.equal(3);
	});

	it('Should have a CSS class on the input', function () {
		inputs[0].className.should.include('paypal-input');
	});

	it('Should have a CSS class on the label', function () {
		inputs[0].parentNode.className.should.include('paypal-label');
	});

	it('Should have a CSS class on the container', function () {
		inputs[0].parentNode.parentNode.className.should.include('paypal-group');
	});

});


// Test multi-language support
describe('Multi-language button images', function () {

	'use strict';

	function testLanguage(locale, type, expected) {
		it('Should have a ' + locale + ' version of the ' + type + ' button', function () {
			var button = document.querySelector('#' + type + '-' + locale + ' button[type=submit]'),
				buttonText = button && button.textContent;

			buttonText.should.equal(expected);
		});
	}

	testLanguage('es_ES', 'buynow', 'Comprar ahora');
	testLanguage('de_DE', 'buynow', 'Jetzt kaufen');
	testLanguage('ja_JP', 'buynow', '今すぐ購入');
});


// Test multiple button image sizes
describe('Multiple button image sizes', function () {

	'use strict';

	function testSize(size, type, expected) {
		it('Should have a ' + size + ' version of ' + type + ' button', function () {
			var button = document.querySelector('#' + type + '-' + size + ' button[type=submit]'),
				buttonClass = button && button.className;

			buttonClass.should.include(expected);
		});
	}

	testSize('sm', 'buynow', 'small');
	testSize('sm', 'cart', 'small');
	testSize('lg', 'buynow', 'large');
	testSize('lg', 'cart', 'large');
});
