/* jshint node: true */
'use strict';

var fs = require('fs')
,	path = require('path')
,	_ = require('underscore')
,	args = require('yargs').argv
,	jsonlint = require('jsonlint')
,	map = require('map-stream')
,	glob = require('glob')
,	gutil = require('gulp-util')
,	xml2js = require('xml2js')
,	override_logger = require('../library/batch-logger')()
,	error_logger = require('../library/batch-logger')();


function getPathFromObject (object, path, default_value)
{
	if (!path)
	{
		return object;
	}
	else if (object)
	{
		var tokens = path.split('.')
		,	prev = object
		,	n = 0;

		while (!_.isUndefined(prev) && n < tokens.length)
		{
			prev = prev[tokens[n++]];
		}

		if (!_.isUndefined(prev))
		{
			return prev;
		}
	}

	return default_value;
}

function parseDistroAndModules()
{
	var distro
	,	distroFolder = process.gulp_init_cwd || process.cwd()
	,	distroFile = args.distro || path.join(distroFolder, 'distro.json');
	try
	{
		distro = jsonlint.parse(fs.readFileSync(distroFile, {encoding: 'utf8'}));
	}
	catch(err)
	{
		err.message = 'Error parsing distro file ' + distroFile + ': ' + err.message;
		throw err;
	}
	PackageManager.distro = distro;

	if (distro.tasksConfig)
	{
		PackageManager.configuration = distro.tasksConfig;
	}

	Object.keys(distro.modules)
		.map(function(m) { return './Modules/' + m + '@' + distro.modules[m] + '/ns.package.json'; })
		.forEach(function(file)
		{
			try
			{
				fs.existsSync(file) &&
				PackageManager.add(
					file,
					jsonlint.parse(fs.readFileSync(file, {encoding: 'utf8'}).toString())
				);
			}
			catch(err)
			{
				err.message = 'Error parsing module file ' + file + ': ' + err.message;
				throw err;
			}
		});

	if (!error_logger.isEmpty())
	{
		error_logger.flush('+- SUMMARY OF OVERRIDE ERRORS');
		process.exit(1);
	}
	else if (!override_logger.isEmpty())
	{
		override_logger.flush('+- SUMMARY OF OVERRIDES');
	}
}


var PackageManager = {

	contents: []

,	overrides: {
			//index of all override files
			index: {}

			//{originalPath: string, {isOverriden: boolean, overridePath: string, moduleName: string }}		
		,	map: {}
	}

,	getOverrideInfo: function(original_file_path)
	{
		var override_info = this.overrides.map[original_file_path];
		if (!override_info)
		{
			override_info = { isOverriden: false };
		}

		return override_info;
	}

,	isOverrideFile: function(file_path)
	{
		var normalized_path = path.resolve(file_path);
		return !!this.overrides.index[normalized_path];
	}

,	add: function(file_path, content)
	{
		var self = this
		,	base_dir = path.dirname(file_path)
		,	module_name = path.basename(base_dir).split('@')[0];

		var module_exist = _.some(this.contents, function(module)
		{
			return module.moduleName === module_name;
		});
		if (module_exist)
		{
			error_logger.push(
					'+- Module ', gutil.colors.cyan(module_name), 
					' is defined twice. Please use a different name when overriding.');
		}

		this.contents.push({
			path: file_path
		,	baseDir: base_dir
		,	absoluteBaseDir: path.resolve(process.cwd(), base_dir)
		,	moduleName: module_name
		,	content: content.gulp
		,	jshint: content.jshint !== 'false'
		});

		_.each(content.overrides, function(val, key) {
			
			var original_path = path.resolve(path.join(self.distro.folders.modules, key));
			var override_path = path.resolve(path.join(base_dir, val));

			//check for duplicate overrides
			var override_info = self.getOverrideInfo(original_path);
			if (override_info.isOverriden)
			{
				error_logger.push(
					'+- ', gutil.colors.cyan(path.normalize(original_path)), 
					' is overridden more than once. Overridden in modules: ', gutil.colors.cyan(override_info.moduleName), ' and ', gutil.colors.cyan(module_name));
			}

			//check to see if original file exists
			if (!fs.existsSync(original_path))
			{
				error_logger.push(
					'+- Source file: ', gutil.colors.cyan(original_path), 
					' does not exists. Defined in module ', gutil.colors.cyan(module_name));
			}

			//check to see if override file exists
			if (!fs.existsSync(override_path))
			{
				error_logger.push(
					'+- Override file: ', gutil.colors.cyan(override_path), 
					' does not exists. Defined in module ', gutil.colors.cyan(module_name));
			}			

			self.overrides.map[original_path] = {
					isOverriden: true
				,	moduleName: module_name
				,	overridePath: override_path
			};
			self.overrides.index[override_path] = true;

			override_logger.push('+- File: ', gutil.colors.cyan(original_path), ' overridden with: ', gutil.colors.cyan(override_path));
		});
	}

,	handleOverrides: function(){
		
		var self = this;
		return map(function(file,cb)
		{
			var normalized_path = path.resolve(file.path)
			,	is_override_file = !!self.overrides.index[normalized_path];
			
			if (is_override_file)
			{
				//filter out override files, we are replacing the contents of the original ones. 
				//https://www.npmjs.com/package/map-stream (filter)
				cb();
			}
			else
			{
				var override_info = self.getOverrideInfo(normalized_path);
				if (override_info.isOverriden)
				{
					//if original file is overridden replace its stat and content.
					//stat needs to change for other gulp-plugins to work properly (i.e. changed)
					file.stat = fs.statSync(override_info.overridePath);
					file.contents = new Buffer(fs.readFileSync(override_info.overridePath));
				}

				cb(null, file);	
			}
		});
	}

,	getGlobsFor: function()
	{
		var keys = arguments;
		return _.chain(this.contents).map(function(ns_pkg)
		{
			return this.getGlobsForNSPackage(ns_pkg, keys);
		}, this).flatten().value();
	}

,	getGlobsForNSPackage: function(ns_pkg, keys)
	{
		var pkg_keys = Object.keys(ns_pkg.content || {})
		,	key_to_use =_.find(keys, function(key){ return ~pkg_keys.indexOf(key); })
		,	results = [];

		
		if (key_to_use && ns_pkg.content[key_to_use].length)
		{
			ns_pkg.content[key_to_use].forEach(function(oneglob)
			{
				results.push(ns_pkg.baseDir + '/' + oneglob);
			});
		}

		return results;
	}

,	parseFile: function(file)
	{
		var fileParts = /\/([a-zA-Z\.]+)@.*\/([a-zA-Z\.]+.js)/gi.exec(file);
		var fileModule = fileParts[1];
		var fileName = fileParts[2];
		return {file: file, module: fileModule, name: fileName};
	}

,	getGlobsForModule: function(module)
	{
		var keys = _.rest(arguments)
		,	ns_pkg = _.findWhere(this.contents, { moduleName: module });
		if (!ns_pkg)
		{
			throw new Error('Module not found: ' + module);
		}
		return this.getGlobsForNSPackage(ns_pkg, keys);
	}

,	getFlattenGlobsFor: function(keys, modules, ignoreJsHint)
	{
		var c = _.chain(this.contents);

		if(!ignoreJsHint)
		{
			c = c.where({jshint: true});
		}

		return c.filter(function(module)
			{
				if(!modules)
				{
					return true;
				}
				else
				{
					return _.indexOf(modules, module.moduleName) >= 0;
				}
			})
			.map(function(ns_pkg)
			{
				return this.getGlobsForNSPackage(ns_pkg, keys);
			}, this)
			.flatten()
			.value();
	}

,	getGlobsForJSHint: function(modules)
	{
		return this.getFlattenGlobsFor(['javascript', 'ssp-libraries', 'services', 'services:new'], modules);
	}

,	getFilesMapFor: function(key)
	{
		var result = {};
		this.contents.forEach(function(ns_pkg)
		{
			ns_pkg.content && ns_pkg.content[key] && Object.keys(ns_pkg.content[key]).length && Object.keys(ns_pkg.content[key]).forEach(function(file_path)
			{
				result[path.resolve(ns_pkg.baseDir + '/' + file_path)] = ns_pkg.content[key][file_path];
			});
		});
		return result;
	}

,	getTaskConfig: function(path, default_value)
	{
		return getPathFromObject(this.configuration, path, default_value);
	}

,	getLicensePathForModuleName: function(module_id)
	{
		if (!this.license_paths)
		{
			var licence_glob = path.join(process.cwd(), 'Modules', '**/*.license');
			this.license_paths = glob.sync(licence_glob);
		}

		var suffix = module_id + '.license'
		,	module_license_path = _.find(this.license_paths, function(path)
		{
			//ends with the module_id.license
			return path.indexOf(suffix, path.length - suffix.length) >= 0;
		});

		return module_license_path;
	}

,	IIFEVariableDeclaration: function(module_name, module_id)
	{
		var module_license_path = this.getLicensePathForModuleName(module_id)
		,	result = 'SCM[\''+module_id+'\'] = ' + module_name;

		if (module_license_path)
		{
			var license = fs.readFileSync(module_license_path, {encoding: 'utf8'});
			result = license + result;
		}

		return result;
	}

,	getModuleFolder: function (moduleName)
	{
		var jasmineModule = null;
		_(this.distro.modules).each(function(value, name)
		{
			if (name.indexOf(moduleName) === 0)
			{
				jasmineModule = name + '@' + value;
			}
		});
		return jasmineModule;
	}

,	getModuleForPath: function (path, is_relative)
	{
		return _.find(this.contents, function (module)
		{
			return path.indexOf(is_relative ? module.baseDir : module.absoluteBaseDir) === 0;
		});
	}

,	getProjectMetadata: function()
	{
		var modules = [];
		_(this.distro.modules).each(function(version, name)
		{
			modules.push(name + '@' + version);
		});
		var jsEntryPoints = _(this.distro.tasksConfig.javascript).map(function(js)
		{
			return js.entryPoint;
		});

		return {
			name: this.distro.name
		,	version: this.distro.version
		,	'javascript entrypoints': jsEntryPoints
		,	'ssp-libraries entrypoint': this.distro.tasksConfig['ssp-libraries'].entryPoint
		,	modules: modules//.join(', ')
		};
	}

,	getReleaseMetadata: function(cb)
	{
		
		var releaseMetadataFile = 'release.xml'

			// keys allowed to be returned from the XML
		,	keys = [
				'name'
			,	'bundle_id'
			,	'baselabel'
			,	'version'
			,	'datelabel'
			,	'buildno'
			]

		,	distroFolder = process.gulp_init_cwd || process.cwd()
		,	releaseFile = args.distro || path.join(distroFolder, releaseMetadataFile);
		
		fs.readFile(releaseFile, {encoding: 'utf8'}, function(err, xml)
		{
			if(err)
			{
				cb(err);
				return;
			}

			xml2js.parseString(xml, js2Metadata);
		});		

		function js2Metadata(err, parsedMetadata)
		{
			if(err)
			{
				cb(err);
				return;
			}

			var metadata = _.chain(parsedMetadata)
				.find(_.isObject)
				.result('param')
				.first()
				.value()

			,	mappedKeys = _.map(keys, function(key)
				{
					return _.first(_.result(metadata, key));
				})

			,	res = _.object(keys, mappedKeys);

			cb(null, res);
		}
	}
};

PackageManager.pipeErrorHandler = function(error)
{
	gutil.log(gutil.colors.red('SOURCE CODE ERROR'));
	if(_(error).keys().length === 0)
	{
		gutil.log(error);
	}
	else
	{
		_(error).each(function(val, key)
		{
			gutil.log(gutil.colors.red(key), val);
		});
	}
	if(PackageManager.isGulpLocal)
	{
		this.emit('end');
	}
	else
	{
		process.exit(1);
	}
};

parseDistroAndModules();


module.exports = PackageManager;