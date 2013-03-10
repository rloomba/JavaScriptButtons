module.exports = function (grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			all: {
				src: [ "src/*.js", "test/*.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			}
		},
		uglify: {
			dist: {
				src: [ "<banner:meta.banner>", "src/paypal-button.js" ],
				dest: "dist/paypal-button.min.js",
				options: {
					banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd, h:MM:ss TT\') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */"
				}
			},
			bundled: {
				src: [ "<banner:meta.banner>", "lib/MiniCart/minicart.js", "src/paypal-button.js" ],
				dest: "dist/paypal-button-minicart.min.js",
				options: {
					banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd, h:MM:ss TT\') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */"
				}
			}
		}
	});

	// Load grunt tasks from npm packages
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default task.
	grunt.registerTask("default", [ "uglify" ]);

};
