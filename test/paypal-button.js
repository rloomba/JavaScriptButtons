/*jshint node:true, evil:true */
/*global describe:true, it:true, PAYPAL:true */


var fs = require('fs'),
	should = require('should');


eval(fs.readFileSync('src/paypal-button.js').toString());



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