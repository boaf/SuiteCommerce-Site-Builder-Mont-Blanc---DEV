/* jshint node: true */
'use strict';

var gulp = require('gulp')
,	path = require('path')
,	package_manager = require('../package-manager')
,	dest = path.join(process.gulp_dest, 'javascript');

gulp.task('javascript-move', function()
{
	return gulp.src(package_manager.getGlobsFor('javascript-move'))
		.pipe(gulp.dest(dest));
});