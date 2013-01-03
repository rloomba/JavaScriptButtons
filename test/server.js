/*jshint node:true, evil:true */
/*global describe:true, it:true, PAYPAL:true, document:true, window:true */

var fs = require('fs'),
	jsdom = require('jsdom').jsdom;

global.document = jsdom(fs.readFileSync(__dirname + '/index.html').toString());
global.window = document.createWindow();

require('./test.js');
