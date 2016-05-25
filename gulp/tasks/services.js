/* jshint node: true */
'use strict';

var gulp = require('gulp')

,	path = require('path')

,	package_manager = require('../package-manager')
,	helpers = require('./helpers');

gulp.task('services', function()
{
	return gulp.src(package_manager.getGlobsFor('services'))
		.pipe(package_manager.handleOverrides())
		.pipe(gulp.dest(path.join(process.gulp_dest, 'services')));
});