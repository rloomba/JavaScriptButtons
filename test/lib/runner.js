/*global require, window, module */
(function (module) {

	'use strict';

	if (typeof window !== 'undefined') {

		require.config({
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

			require(['../spec/test'], function () {
				mocha.run();
			});
		});

	}
}(typeof module === 'undefined' ? {} : module));/*global module:false */
