/* jshint node: true */

/*
@module gulp.javascript
#gulp javascript

This gulp task will compile the project's javascript output. It support two different kind of compilation:

## Compiling for production

For generating production code we use the amd-optimizer build tool that will generate all the required
JavaScript code dependencies from a application's Starter.js file that is declared in distro.json file
property javascript->entryPoint. Then, some extra tools like minification thorough uglify and/or sourcemap.
Also for performance reasons the final output is transformed using the tool amdclean.
can be done as well. Examples:

	gulp javascript
	gulp javascript --js sourcemap
	gulp javascript --js require
	gulp javascript --noamdclean
	gulp javascript --nouglify

Notice that generating sourcemaps or running uglify can take longer.

##Compiling for development

We support compilation type suited for development using the argument '--js require'. This will generate a requirejs
config file pointing to the real files in Modules/. This way you don't need to do any compilation on your JavaScript
files, just save them and reload your browser. This task is called indirectly when running our development environment using:

	gulp local --js require

##Declaring javascript in ns.package.json

The javascript files that are able to be compiled are those referenced by the property gulp.javascript
in module's ns.package.json file. Also the compiled templates (using gulp templates). Example:

	{
		"gulp": {
			...
		,	"javascript": [
				"JavaScript/*"
			]
		}
	}

*/

'use strict';

var path = require('path')

,	gulp = require('gulp')
,	_ = require('underscore')

,	concat = require('gulp-concat')
,	amdOptimize = require('amd-optimize')
,	sourcemaps = require('gulp-sourcemaps')

,	uglify = require('gulp-uglify')
,	amdclean = require('../amdclean')
,	map = require('map-stream')

,	add = require('gulp-add')
,	gif = require('gulp-if')

,	args   = require('yargs').argv

,	async = require('async')

,	File = require('vinyl')
,	through = require('through')

,	package_manager = require('../package-manager');

// ,	compiler = require('superstartup-closure-compiler')
// ,	closureCompiler = require('gulp-closure-compiler')

var dest = path.join(process.gulp_dest, 'javascript');

function getGlobs()
{
	return _.union(
		[path.join(process.gulp_dest, 'processed-templates', '*.js')]
	,	[path.join(process.gulp_dest, 'processed-macros', '*.js')]
	,	package_manager.getGlobsFor('javascript')
	,	[path.join(process.gulp_dest, 'javascript-dependencies', '*.js')]
	);
}

function processJavascript(cb)
{
	var configs = package_manager.getTaskConfig('javascript', []);

	configs = _.isArray(configs) ? configs : [configs];

	async.each(
		configs
	,	function(config, cb)
		{
			var stream = gulp.src(getGlobs())
				.pipe(package_manager.handleOverrides());

			requireJSCopy();

			var useRequire = args.js === 'require' ||
					package_manager.isGulpLocal && package_manager.getTaskConfig('local.jsRequire', false) && args.js !== 'compile';

			if (!useRequire)
			{
				var indexContent =	'require.config(' + JSON.stringify(config.amdConfig) + ');\n' +
									'require([\'almond\', \'' + config.entryPoint + '\']);\n'

				//	--noamdclean takes precedence over the config.amdclean setting from the distro.json file
				,	useAMDclean = args.noamdclean === undefined && config.amdclean || args.noamdclean !== undefined && !args.noamdclean

				,	indexModule = (!useAMDclean) ? config.entryPoint+'.index' : config.entryPoint;

				stream = stream
					.pipe(gif(!useAMDclean, add(indexModule + '.js', indexContent)))
					.pipe(gif(args.js === 'sourcemap', sourcemaps.init()))
					.pipe(amdOptimize(indexModule, config.amdConfig)).on('error', package_manager.pipeErrorHandler)
					.pipe(concat(config.exportFile))
					.pipe(gif(useAMDclean, map(function (file, cb)
					{
						var cleaned_code = amdclean.clean({
							code: file.contents.toString()
						,	prefixTransform: function(postNormalizedModuleName, preNormalizedModuleName)
							{
								if (preNormalizedModuleName === 'jQuery')
								{
									postNormalizedModuleName = 'jquery';
								}
								return postNormalizedModuleName;
							}
						,	wrap: {
								start: '',
								end: ''
							}
						,	IIFEVariableDeclaration: _.bind(package_manager.IIFEVariableDeclaration, package_manager)
						});

						file.contents = new Buffer(
							'SCM = {}; (function(){' +
							cleaned_code +
							'}())'
						);
						cb(null, file);
					})))
					.pipe(gif(!args.nouglify, uglify({preserveComments: 'some'}))).on('error', package_manager.pipeErrorHandler)
					.pipe(gif(args.js === 'sourcemap', sourcemaps.write('.')));
			}
			else
			{
				stream = stream.pipe(generateStarterLocalFiles(config));
			}

			stream.pipe(gulp.dest(dest));
			stream.on('end', function()
			{
				cb();
			});
		}
	,	function()
		{
			cb();
		}
	);
}


// generates a bootstrapper script that requires the starter script using require.js
function generateStarterLocalFiles(config)
{
	var paths = {};

	var onFile = function(file)
	{
		var normalized_path = path.resolve(file.path)
		,	moduleName = path.basename(normalized_path, '.js')
		,	override_info = package_manager.getOverrideInfo(normalized_path);

		if (override_info.isOverriden)
		{
			normalized_path = override_info.overridePath;
		}

		var relativePath = path.relative(dest, normalized_path).replace(/\\/g,'/').replace(/\.js$/, '');
		paths[moduleName] = relativePath;
	};

	var fixPaths = function()
	{
		_.each(config.amdConfig.paths, function(renamedModuleName, originalModuleName)
		{
			paths[originalModuleName] = paths[renamedModuleName];
		});
	};

	var onEnd = function()
	{
		fixPaths();

		var entry_point = config.entryPoint
		,	require_config = _.defaults({ paths: paths }, config.amdConfig);

		require_config.waitSeconds = 0;
		delete require_config.baseUrl;

		var	starter_content = _.template(
			'try {\nrequire.config(<%= require_config %>);\nrequire(<%= entry_point %>)\n} catch(e) { };'
		,	{
				require_config: JSON.stringify(require_config, null, '\t')
			,	entry_point: JSON.stringify([entry_point])
			}
		);

		var file = new File({
			path: config.exportFile,
			contents: new Buffer(starter_content)
		});

		this.emit('data', file);
		this.emit('end');
	};

	return through(onFile, onEnd);
}

function requireJSCopy()
{
	return gulp.src(package_manager.getGlobsForModule('require.js', 'javascript'))
		.pipe(gulp.dest(dest));
}

var fs = require('fs'); 

function ensureFolder(name)
{
	try
	{
		fs.mkdirSync(name); 
	}
	catch(ex)
	{

	}
}

gulp.task('javascript-entrypoints', [], function()
{
	var configs = package_manager.getTaskConfig('javascript', []);
	ensureFolder(process.gulp_dest); 
	ensureFolder(path.join(process.gulp_dest, 'javascript-dependencies')); 
	_(configs).each(function(config)
	{	
		var dependenciesModuleName = config.entryPoint + '.Dependencies';	
		var fn_params = []; //we must pass the arguments because an amdclean issue
		for (var i = 0; i < _(config.dependencies).keys().length; i++) { fn_params.push('a'+i); };
		var content = 'define(\''+dependenciesModuleName+'\', ' + JSON.stringify(config.dependencies) + ', function('+fn_params.join(',')+'){ return Array.prototype.slice.call(arguments); }); '; 

		fs.writeFileSync(path.join(process.gulp_dest, 'javascript-dependencies', dependenciesModuleName+'.js'), content); 
	}); 
});

gulp.task('javascript', ['templates', 'macros', 'javascript-entrypoints'], processJavascript);

gulp.task('javascript-no-deps', processJavascript);

gulp.task('watch-javascript', ['watch-templates', 'watch-macros'], function()
{
	gulp.watch(package_manager.getGlobsFor('javascript'), ['javascript-no-deps']);
});