'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	assets = require('./assets'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	plugins = gulpLoadPlugins({
		rename: {
			'gulp-angular-templatecache': 'templateCache'
		}
	}),
	path = require('path');

// CSS linting task
gulp.task('csslint', function (done) {
	return gulp.src(assets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter())
		.pipe(plugins.csslint.reporter(function (file) {
			if (!file.csslint.errorCount) {
				done();
			}
		}));
});

// JS linting task
gulp.task('jshint', function () {
	var _assets = _.union(
		assets.server.gulpConfig,
		assets.client.js
	);

	return gulp.src(_assets)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
});

// JS minifying task
gulp.task('uglify', function () {
	var _assets = _.union(
		assets.client.js,
		assets.client.templates
	);

	return gulp.src(_assets)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('application.min.js'))
		.pipe(gulp.dest('./landcoverportal/static/dist/'));
});

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(assets.client.css)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat('application.min.css'))
		.pipe(gulp.dest('./landcoverportal/static/dist/'));
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
	//runSequence('csslint', 'jshint', done);
	runSequence('csslint', 'jshint', function() {
        done();
    });
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
	runSequence('lint', ['uglify', 'cssmin'], done);
});
