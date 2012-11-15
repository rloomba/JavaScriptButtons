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

	it('Should return an element if no parameters', function () {
		var result = PAYPAL.apps.ButtonFactory.create({
			business: '6XF3MPZBZV6HU',
			item: 'Buy now',
			amount: '1.00'
		});

		result.should.be.a('object');
	});

});