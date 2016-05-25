/* jshint node: true */

'use strict';

process.gulp_init_cwd = process.env.INIT_CWD || process.cwd();
var gulp = require('gulp')
,	package_manager = require('./gulp/package-manager')
,	path = require('path')
,	fs = require('fs')
,	_ = require('underscore');

process.gulp_dest_distro = path.join(process.gulp_init_cwd, package_manager.distro.folders.distribution);
process.gulp_dest_deploy = path.join(process.gulp_init_cwd, package_manager.distro.folders.deploy);
process.gulp_dest = process.gulp_dest_distro;


fs.readdirSync('./gulp/tasks').forEach(function(task_name)
{
	if (/\.js/.test(task_name))
	{
		require('./gulp/tasks/' + task_name.replace('.js', ''));
	}
});



gulp.task(
	'frontend'
,	[
		'javascript'
	,	'javascript-move'
	,	'copy'
	,	'less'
	,	'sass'
	,	'languages'
	,	'images'
	,	'fonts'
	,	'font-awesome'
	,	'clean-templates'
	,	'clean-sass-tmp'
	]
);

gulp.task(
	'backend'
,	[
		'scripts'
	,	'services'
	,	'ssp-libraries'
	,	'ssp-files'
	]
);

gulp.task(
	'default'
,	[
		'backend'
	,	'frontend'	

	]

,	function ()
	{
		generateManifest();
	}
);

function generateManifest()
{
	var isDeploy = folderExists(package_manager.distro.folders.deploy); 
	var targetFolder = isDeploy ? package_manager.distro.folders.deploy : package_manager.distro.folders.distribution;

	var Uploader = require('ns-uploader');
	Uploader.prototype.buildLocalManifest(targetFolder)
	.then(function(localManifest)
	{
		if (!isDeploy)
		{
			var regex = new RegExp('^' + package_manager.distro.folders.distribution);
			_.each(localManifest, function(entry)
			{
				entry.path = entry.path.replace(regex, package_manager.distro.folders.deploy);
			});
		}
		fs.writeFileSync(path.join(targetFolder, Uploader.prototype.MANIFEST_FILE_NAME), JSON.stringify(localManifest));
	})
	.catch(function()
	{
		// ignore errors - we can still proceed without a manifest
	});
}

function folderExists(folder)
{
	try
	{
		return fs.lstatSync(folder).isDirectory();
	}
	catch (ex)
	{
		return false;
	}
}