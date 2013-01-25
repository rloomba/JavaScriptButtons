/*jshint node:true, evil:true */
/*global describe:true, it:true, PAYPAL:true, document:true, window:true */

var fs = require('fs'),
	should = require('should'),
	jsdom = require('jsdom').jsdom,
	jsdomOptions = { features: { QuerySelector: true }},
	testFile = fs.readFileSync('./test/index.html').toString(),
	document = jsdom(testFile, null, jsdomOptions),
	window = document.createWindow();

eval(fs.readFileSync('src/paypal-button.js').toString());


// Test the object's integrity
describe('PAYPAL.apps.ButtonFactory', function () {
	'use strict';

	it('Should have a PAYPAL object', function () {
		PAYPAL.should.be.a('object');
	});

	it('Should have a PAYPAL.apps object', function () {
		PAYPAL.apps.should.be.a('object');
	});

	it('Should have a PAYPAL.apps.ButtonFactory object', function () {
		PAYPAL.apps.ButtonFactory.should.be.a('object');
	});

});


// Test the create method
describe('PAYPAL.apps.ButtonFactory.create', function () {
	'use strict';

	it('Should be a function', function () {
		PAYPAL.apps.ButtonFactory.create.should.be.a('function');
	});

	it('Should return false if no parameters', function () {
		var result = PAYPAL.apps.ButtonFactory.create();

		result.should.equal(false);
	});
});


// Test the buttons counter object
describe('PAYPAL.apps.ButtonFactory.buttons', function () {

	'use strict';

	var buttons = PAYPAL.apps.ButtonFactory.buttons;

	it('Should have four buy now buttons', function () {
		buttons.buynow.should.equal(6);
	});

	it('Should have three cart buttons', function () {
		buttons.cart.should.equal(2);
	});

	it('Should have three hosted buttons', function () {
		buttons.hosted.should.equal(2);
	});

	it('Should have one QR code', function () {
		buttons.qr.should.equal(1);
	});
});



// Test multi-language support
describe('Multi-language button images', function () {
	'use strict';

	function testLanguage(locale, type) {
		it('Should have a ' + locale + ' version of the ' + type + ' button', function () {
			var image = document.querySelector('#' + type + '-' + locale + ' input[type="image"]'),
				imagePath = image && image.src;

			imagePath.should.include(locale);
		});
	}

	testLanguage('es_ES', 'buynow');
	testLanguage('fr_FR', 'buynow');
	testLanguage('de_DE', 'buynow');
});


// Test multiple button image sizes
describe('Multiple button image sizes', function () {
	'use strict';

	function testSize(size, type) {
		it('Should have a ' + size + ' version of ' + type + ' button', function () {
			var image = document.querySelector('#' + type + '-' + size + ' input[type="image"]'),
				imagePath = image && image.src;

			imagePath.should.include('SM');
		});
	}

	testSize('sm', 'buynow');
	testSize('sm', 'cart');
	testSize('sm', 'hosted');
});

