/*global require, window, module */
(function (module) {

	'use strict';

	if (typeof window !== 'undefined' && navigator && document) {

		require.config({
			paths: {
				'mocha': './mocha'
			},
			shim: {
				'mocha': {
					init: function () {
						return this.mocha;
					}
				}
			}
		});

		require([
			'require',
			'chai',
			'mocha'
		], function (require, chai, mocha) {
			var should = chai.should();

			mocha.setup('bdd');

			require(['test'], function () {
				mocha.run();
			});
		});

	}
}(typeof module === 'undefined' ? {} : module));/*global module:false */
