/* global module: false, process: false */
module.exports = function (grunt) {
	var isProd = (grunt.option('production') !== undefined) ? Boolean(grunt.option('production')) : process.env.GRUNT_ISPROD === '1';
	var staticTargetDir = './assets/';

	if (!isProd) {
		grunt.log.subhead('Running Grunt in DEV mode');
	}

	var stylesheetDir = 'stylesheets';

	grunt.initConfig({
		appcache: {
			prod: {
				dest: 'manifest.appcache',
				cache: [
					'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
					'assets/images/foursquare-connect.png',
					'assets/images/blank_boy.png',
					'assets/**/*.*.css',
					'assets/**/*.*.svg',
					'assets/**/lowQuality/**/*.*.*',
					'assets/debug.css'
				],
				network: '*',
				fallback: '/ /offline.html'
			},
			dev: {
				dest: 'manifest.appcache',
				cache: [],
				network: '*',
				fallback: '/ /offline.html'
			}
		},
		jshint: {
			js: {
				options: {
					'bitwise': true,
					'curly': true,
					'eqeqeq': true,
					'es3': true,
					'immed': true,
					'latedef': true,
					'newcap': true,
					'noarg': true,
					'noempty': true,
					'nonew': true,
					'quotmark': 'single',
					'unused': true,
					'undef': true,
					'trailing': true,
					'laxbreak': true,
					'maxerr': 100,
					'browser': true,
					'jquery': true,
					'globals': {
						'require': false,
						'define': false,
						's': false,
						'Swipe': false,
						'skrollr': false,
						'console': false
					},
					reporter: require('jshint-stylish')
				},
				files: {
					src: [
						'Gruntfile.js',
						'js/**/*.js',
						'!**/*.min.js',
						'!js/history*.js'
					]
				}
			}
		},
		clean: {
			all: [staticTargetDir, 'robots.txt', 'manifest.appcache'],
			cache: ['manifest.appcache'],
			robots: ['robots.txt'],
			css: [staticTargetDir + '*.css'],
			hash: [staticTargetDir + 'assets.map'],
			hooks: ['.git/hooks/*'],
			hashless: [
					staticTargetDir + '/**/*.*',
					'!' + staticTargetDir + '/assets.map',
					'!' + staticTargetDir + '/**/debug.css',
					'!' + staticTargetDir + '/**/debug.*.css',
					'!' + staticTargetDir + '/**/*.*.*',
					staticTargetDir + '/**/*.min.svg',
					staticTargetDir + '/**/*.min.css',
					staticTargetDir + '/**/*.min.js'
			]
		},
		compass: {
			dist: {
				options: {
					config: 'configs/config.rb'
				}
			}
		},
		copy: {
			hooks: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['git-hooks/**/*'],
						dest: '.git/hooks'
					}
				]
			},
			js: {
				files: [
					{
						expand: true,
						src: ['js/**/*.js'],
						dest: staticTargetDir
					}
				]
			},
			images: {
				files: [
					{
						expand: true,
						src: ['images/**/*.jpg', 'images/**/*.png', 'images/**/*.svg', 'images/**/*.ico'],
						dest: staticTargetDir
					}
				]
			},
			debug: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['templates/debug.css'],
						dest: staticTargetDir
					}
				]
			},
			analytics: {
				files: [
					{
						expand: false,
						flatten: true,
						src: 'templates/google_analytics.js',
						dest: staticTargetDir+'/js/analytics.js'
					}
				]
			}
		},
		cssmin: {
			minify: {
				expand: true,
				src: [staticTargetDir + stylesheetDir + '/**/*.css'],
				ext: '.min.css'
			}
		},
		watch: {
			js: {
				files: [
					'js/**/*.js',
					'templates/**/*.js'
				],
				tasks: ['compile:js'],
				options: {
					spawn: false
				}
			},
			css: {
				files: [stylesheetDir + '/**/*.scss', stylesheetDir + '/**/*.css'],
				tasks: ['compile:css', 'create:hash', 'create:cache'],
				options: {
					spawn: false
				}
			},
			assets: {
				files: ['images/**/*.*'],
				tasks: ['compile:images', 'create:hash'],
				options: {
					spawn: false
				}
			}
		},
		cssmetrics: {
			dist: {
				src: ['assets/**/*.css'],
				options: {
					quiet: false,
					maxSelectors: 4096,
					maxFileSize: 10240000
				}
			}
		},
		hash: {
			options: {
				// assets.map must go where Play can find it from resources at runtime.
				// Everything else goes into frontend-static bundling.
				mapping: staticTargetDir + 'assets.map',
				srcBasePath: staticTargetDir,
				destBasePath: staticTargetDir,
				flatten: false,
//				hashLength: (isProd) ? 32 : 0
				hashLength: 0

			},
			files: {
				expand: true,
				cwd: staticTargetDir,
				src: '**/*',
				filter: 'isFile',
				dest: staticTargetDir,
				rename: function (dest, src) {
					// remove .. when hash length is 0
					return dest + src.split('/').slice(0, -1).join('/');
				}
			}
		},
		'file-creator': {
			'debug': {
				'assets/debug.css': function (fs, fd, done) {
					fs.writeSync(fd, '');
					done();
				}
			},
			'analytics': {
				'assets/js/analytics.js': function (fs, fd, done) {
					fs.writeSync(fd, '');
					done();
				}
			}

		},
		robotstxt: {
			beta: {
				policy: [
					{
						ua: '*',
						disallow: '/'
					}
				]
			},
			production: {
				policy: [
					{
						ua: '*',
						disallow: ''
					}
				]
			}
		},
		scsslint: {
			all: [
				'stylesheets/**/*.scss',
				'!stylesheets/_mq.scss'
			],
			options: {
				config: 'configs/scss-lint.yml',
				bundleExec: true,
				reporterOutput: null,
				colorizeOutput: true
			}
		},
		svgmin: {                       // Task
			options: {                  // Configuration that will be passed directly to SVGO
				plugins: [
					{
						removeViewBox: false
					},
					{
						removeUselessStrokeAndFill: false
					},
					{
						convertPathData: {
							straightCurves: false // advanced SVGO plugin option
						}
					}
				]
			},
			dist: {                     // Target
				files: [
					{               // Dictionary of files
						expand: true,       // Enable dynamic expansion.
						cwd: 'assets/images',     // Src matches are relative to this path.
						src: ['**/*.svg'],  // Actual pattern(s) to match.
						dest: 'assets/images',       // Destination path prefix.
						ext: '.min.svg'     // Dest filepaths will have this extension.
						// ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
					}
				]
			}
		},
		replace: {
			'base-hash': {
				src: ['assets/assets.map'],
				overwrite: true,
				replacements: [
					{
						from: /\"([^\"]+)\":\s\"([^\"]+)\"/g,
						to: '"$1": "/assets/$2"'
					}
				]
			},
			'production-hash': {
				src: ['assets/assets.map'],
				overwrite: true,
				replacements: [
					{
						from: /\"([^\"]+)\":\s\"\/?([^\"]+)\"/g,
						to: '"$1": "http://static.tailored-tunes.com/$2"'
					}
				]
			},
			appcache: {
				src: ['manifest.appcache'],
				overwrite: true,                 // overwrite matched source files
				replacements: [
					{
						from: /(assets.*)/g,
						to: 'http://static.tailored-tunes.com/$1'
					}
				]
			},
			'static-image': {
				src: ['assets/**/*.css'],
				overwrite: true,
				replacements: [
					{
						from: /\"(images\/.*)/g,
						to: '"/assets/$1'
					}
				]

			},
			'static-image-prod': {
				src: ['assets/**/*.css'],
				overwrite: true,
				replacements: [
					{
						from: /\/(assets\/images\/.*)/g,
						to: 'http://images.tailored-tunes.com/$1'
					}
				]

			},
			dev: {
				src: ['manifest.appcache'],
				overwrite: true,                 // overwrite matched source files
				replacements: [
					{
						from: /(images.*)/g,
						to: 'http://images.tailored-tunes.com/$1'
					},
					{
						from: /\# rev.*/g,
						to: ''
					}
				]
			}
		}
	});

	// Load the plugins


	grunt.loadNpmTasks('grunt-appcache');        // Handles the appcache

	grunt.loadNpmTasks('grunt-contrib-jshint');  // Checks if javascript codes are nice or not
	grunt.loadNpmTasks('grunt-contrib-clean');   // Removes generated assets
	grunt.loadNpmTasks('grunt-contrib-compass'); // Sass shorthands
	grunt.loadNpmTasks('grunt-contrib-copy');    // Copies files
	grunt.loadNpmTasks('grunt-contrib-cssmin');  // Minifies CSS
	grunt.loadNpmTasks('grunt-contrib-watch');   // Watches for changes and acts on them
	grunt.loadNpmTasks('grunt-css-metrics');     // Makes sure we don't overdo css files

	grunt.loadNpmTasks('grunt-env');             // Loads environment variables

	grunt.loadNpmTasks('grunt-file-creator');    // Creates files (like the debug.css)

	grunt.loadNpmTasks('grunt-hash');            // Creates hashes for the assets

	grunt.loadNpmTasks('grunt-robots-txt');		 // Generates robots.txt

	grunt.loadNpmTasks('grunt-scss-lint');       // Checks if SCSS code is nice or not

	grunt.loadNpmTasks('grunt-svgmin');          // Minifies SVG

	grunt.loadNpmTasks('grunt-text-replace');    // Replaces stuff


	// Tasks
	grunt.registerTask('default', [
		'clean:all',
		'compile',
		'create:hash',
		'robots'
	]);

	grunt.registerTask('compile', function () {
		grunt.task.run([
			'compile:css',
			'compile:js',
			'compile:images'
		]);
	});

	grunt.registerTask('deploy', function () {
		grunt.task.run([
			'copy:js',
			'compile:images',
			'create:debugCss',
			'cssmin',
			'create:hash',
			'create:cache',
			'robots'
		]);
	});

	grunt.registerTask('robots', function() {
		if(isProd) {
			grunt.task.run(['robotstxt:production']);
		} else {
			grunt.task.run(['robotstxt:beta']);
		}
	});

	grunt.registerTask('verify', [
		'jshint',
		'scsslint',
		'cssmetrics'
	]);

	grunt.registerTask('compile:js', [
		'jshint',
		'copy:js',
		'create:tracking'
	]);

	grunt.registerTask('compile:images', [
		'copy:images',
		'svgmin'
	]);

	grunt.registerTask('compile:css', function () {
		grunt.task.run([
			'scsslint',
			'clean:css',
			'create:debugCss',
			'compass',
			'replace:static-image'
		]);

		if (isProd) {
			grunt.task.run('replace:static-image-prod');
		}

		grunt.task.run([
			'cssmin',
			'cssmetrics'
		]);
	});

	grunt.registerTask('create:debugCss', function () {
		grunt.task.run([
			'copy:debug'
		]);

		if (isProd) {
			grunt.task.run([
				'file-creator:debug'
			]);
		}
	});

	grunt.registerTask('create:tracking', function() {
		grunt.task.run([
			'file-creator:analytics'
		]);

		if (isProd) {
			grunt.task.run([
				'copy:analytics'
			]);
		}
	});

	grunt.registerTask('create:hash', function () {
		grunt.task.run([
			'clean:hash',
			'hash',
			'replace:base-hash'
		]);

		if (isProd) {
			grunt.task.run([
				'replace:production-hash'
//				'clean:hashless'
			]);
		}
	});


	grunt.registerTask('create:cache', function () {
		if (isProd) {
			grunt.task.run([
				'appcache:prod',
				'replace:appcache'
			]);
		} else {
			grunt.task.run([
				'appcache:dev',
				'replace:dev'
			]);
		}
	});

	grunt.registerTask('hookmeup', ['clean:hooks', 'copy:hooks']);



};
