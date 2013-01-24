/*jshint node:true, evil:true */
/*global describe:true, it:true, PAYPAL:true, document:true, window:true */

var fs = require('fs'),
	should = require('should'),
	jsdom = require('jsdom').jsdom,
	document = jsdom(fs.readFileSync('./test/index.html').toString()),
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
		buttons.buynow.should.equal(4);
	});
	
	it('Should have three cart buttons', function () {
		buttons.cart.should.equal(3);
	});
	
	it('Should have three hosted buttons', function () {
		buttons.hosted.should.equal(3);
	});
	
	it('Should have one QR code', function () {
		buttons.qr.should.equal(1);
	});
});

// Test multi-language support
describe('Multi-language button images', function () {
	
	'use strict';
	
	it('Should have a spanish version of Buy Now button', function () {
		var spanishButton = document.getElementById('buynowSpanish'),
			spanishImage = spanishButton.getElementsByTagName('input')[0].src;
		
		spanishImage.should.include('es_ES');
	});
	
	it('Should have a french version of Cart button', function () {
		var frenchButton = document.getElementById('cartFrench'),
			frenchImage = frenchButton.getElementsByTagName('input')[0].src;
		
		frenchImage.should.include('fr_FR');
	});
	
	it('Should have a german version of Hosted button', function () {
		var germanButton = document.getElementById('hostedGerman'),
			germanImage = germanButton.getElementsByTagName('input')[0].src;
		
		germanImage.should.include('de_DE');
	});
});

// Test multiple button image sizes
describe('Multiple button image sizes', function () {
	
	'use strict';
	
	it('Should have a small version of Buy Now button', function () {
		var buynowSmallButton = document.getElementById('buynowSmall'),
			buynowSmallImg = buynowSmallButton.getElementsByTagName('input')[0].src;
		
		buynowSmallImg.should.include('SM');
	});
	
	it('Should have a small version of Cart button', function () {
		var cartSmallButton = document.getElementById('cartSmall'),
			cartSmallImg = cartSmallButton.getElementsByTagName('input')[0].src;
		
		cartSmallImg.should.include('SM');
	});
	
	it('Should have a small version of Hosted button', function () {
		var hostedSmallButton = document.getElementById('hostedSmall'),
			hostedSmallImg = hostedSmallButton.getElementsByTagName('input')[0].src;
		
		hostedSmallImg.should.include('SM');
	});
});