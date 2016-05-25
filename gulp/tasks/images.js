/* jshint node: true */
'use strict';

var gulp = require('gulp')
,	path = require('path')
,	package_manager = require('../package-manager')
,	changed = require('gulp-changed');


gulp.task('images', function()
{
	var dest = path.join(process.gulp_dest, 'img');

	return gulp.src(package_manager.getGlobsFor('images'))
		.pipe(package_manager.handleOverrides())
		.pipe(changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('watch-images', [], function()
{
	gulp.watch(package_manager.getGlobsFor('images'), ['images']);
});