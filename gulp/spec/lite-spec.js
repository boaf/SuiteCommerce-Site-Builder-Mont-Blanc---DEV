// this test verify the behavior of gulp javascript when distro.isSCLite changes

var shell = require('shelljs')
,	path = require('path')
,	fs = require('fs')
,	package_manager = require('../package-manager')
,	exec = require('./exec')
,	distroUtil = require('./distro-util')
,	_ = require('underscore')

,	distributionFolder = package_manager.distro.folders.distribution

describe('ssp-files', function() 
{

	it('make sure the module is not installed', function() 
	{
		distroUtil.uninstallModule('cool_store_custom/MyModule@1.0'); 
		shell.rm('-rf', distributionFolder)
	});	

	it('backup distro.json, install module and execute gulp javascript', function(cb) 
	{
		shell.cp('-f', 'distro.json', 'distro_backup.json'); 
		distroUtil.installModule('assets/custom_modules/MyModule@1.0', 'cool_store_custom');
		
		var distro = distroUtil.read()
		_.each(distro.tasksConfig.javascript, function (config)
		{
			config.dependencies.push('MyModule');
		});
		distro.isSCLite = true;
		distroUtil.write(distro)

		exec('gulp', ['javascript', '--nouglify'], function(code)
		{
			expect(code).toBe(0); 		
			cb();
		});
	});	

	it('when isSCLite is disabled, javascripts and templates must be compiled', function()
	{
		_.each(package_manager.distro.tasksConfig.javascript, function (config)
		{
			var jsFile = shell.cat(distributionFolder+'/javascript/' + config.exportFile);
			expect(jsFile.indexOf('this is a marking from MyModule@1.0 router that should be generated as js dependency') !== -1).toBe(true);
			expect(jsFile.indexOf('this is a marking from MyModule template') !== -1).toBe(true);
			// template manifest are not generated
			expect(shell.test('-f', distributionFolder+'/templates-manifest-'+path.basename(config.exportFile, '.js')+'.json')).toBe(false)
		});
	}); 


	// it('backup distro.json, install module, set isSCLite=true and execute gulp javascript', function(cb) 
	// {
	// 	shell.cp('-f', 'distro.json', 'distro_backup.json'); 
	// 	distroUtil.installModule('assets/custom_modules/MyModule@1.0', 'cool_store_custom');
		
	// 	var distro = distroUtil.read()
	// 	_.each(distro.tasksConfig.javascript, function (config)
	// 	{
	// 		config.dependencies.push('MyModule');
	// 	});
	// 	distro.isSCLite = true;
	// 	distroUtil.write(distro)

	// 	exec('gulp', ['javascript', '--nouglify'], function(code)
	// 	{
	// 		expect(code).toBe(0); 		
	// 		cb();
	// 	});
	// });	
		
	// it('when isSCLite is on, javascripts must be compiled but not templates. Instead template manifests must be generated', function()
	// {
	// 	_.each(package_manager.distro.tasksConfig.javascript, function (config)
	// 	{
	// 		var jsFile = shell.cat(distributionFolder+'/javascript/' + config.exportFile)
	// 		if(package_manager.isSCLiteRelease())
	// 		{
	// 			expect(!jsFile).toBe(true);
	// 		}
	// 		else
	// 		{
	// 			expect(jsFile.indexOf('this is a marking from MyModule@1.0 router that should be generated as js dependency') !== -1).toBe(true);
	// 			expect(jsFile.indexOf('this is a marking from MyModule template') === -1).toBe(true);

	// 			var manifest = JSON.parse(shell.cat(distributionFolder+'/templates-manifest-'+path.basename(config.exportFile, '.js')+'.json'))
	// 			expect(_.contains(manifest, 'mymodule_details.tpl.js'));
	// 		}
			
	// 	});
	// }); 

	// it('set isSCLite=false and execute gulp javascript', function(cb) 
	// {
	// 	shell.rm('-rf', distributionFolder) 
	// 	var distro = distroUtil.read()
	// 	distro.isSCLite = false;
	// 	distroUtil.write(distro)

	// 	exec('gulp', ['javascript', '--nouglify'], function(code)
	// 	{
	// 		expect(code).toBe(0); 		
	// 		cb();
	// 	});
	// });	

	// it('when isSCLite is disabled, javascripts and templates must be compiled', function()
	// {
	// 	_.each(package_manager.distro.tasksConfig.javascript, function (config)
	// 	{
	// 		var jsFile = shell.cat(distributionFolder+'/javascript/' + config.exportFile);
	// 		if(package_manager.isSCLiteRelease())
	// 		{
	// 			expect(!jsFile).toBe(true);
	// 		}
	// 		else
	// 		{
	// 			expect(jsFile.indexOf('this is a marking from MyModule@1.0 router that should be generated as js dependency') !== -1).toBe(true);
	// 			expect(jsFile.indexOf('this is a marking from MyModule template') !== -1).toBe(true);
	// 			// template manifest are not generated
	// 			expect(shell.test('-f', distributionFolder+'/templates-manifest-'+path.basename(config.exportFile, '.js')+'.json')).toBe(false)

	// 		}
	// 	});
	// }); 


	it('restore backup', function()
	{
		shell.mv('-f', 'distro_backup.json', 'distro.json')
		distroUtil.uninstallModule('cool_store_custom/MyModule2@1.0'); 
	}); 

});
