/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ApplicationSkeleton
// Defines the top level components of an application like the name, layout, or the start function
define('ApplicationSkeleton'
,	[	'ApplicationSkeleton.Layout'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	,	'Console.Polyfill'
	,	'json2'
	]
,	function (
		Layout
	,	_
	,	Backbone
	,	Utils
	)
{
	'use strict';

	// @class ApplicationSkeleton Defines the top level components of an application like the name, layout, or the start function 
	// @extends Backbone.Events
	// @constructor Enforces new object to be created even if you do ApplicationSkeleton() (without new) @param {String} name
	function ApplicationSkeleton (name)
	{
		if (!(this instanceof ApplicationSkeleton))
		{
			return new ApplicationSkeleton();
		}

		// @property {SCA.Configuration} Application Default settings
		this.Configuration = {};

		// @property {String} name the name of this application instance
		this.name = name;
	}

	// @method resizeImage Wraps the SC.Utils.resizeImage and passes in the settings it needs 
	// @param {String} url @param {String} size
	ApplicationSkeleton.prototype.resizeImage = function (url, size)
	{
		url = url || this.getConfig('imageNotAvailable') ||  _.getAbsoluteUrl('img/no_image_available.jpeg');
		var mapped_size = this.getConfig('imageSizeMapping.'+ size, size);
		return Utils.resizeImage(this.getConfig('siteSettings.imagesizes', []), url, mapped_size);
	};


	// @property {ApplicationSkeleton.Layout} Layout
	// This View will be created and added to the dom as soon as the app starts.
	// All module's views will get into the dom through this view by calling either showContent, showContent
	ApplicationSkeleton.prototype.Layout = Layout;

	// @method getLayout @returns {ApplicationSkeleton.Layout}
	ApplicationSkeleton.prototype.getLayout = function getLayout ()
	{
		this._layoutInstance = this._layoutInstance || new this.Layout(this);
		return this._layoutInstance;
	};


	// @method getConfig
	// @returns {Any} the configuration object of the aplication
	// if a path is applied, it returns that attribute of the config
	// if nothing is found, it returns the default value
	// @param {String} path @param {String} default_value
	ApplicationSkeleton.prototype.getConfig = function getConfig (path, default_value)
	{
		return _.getPathFromObject(this.Configuration, path, default_value);
	};

	// @method start starts this application by mounting configured modules and triggering events 'afterModulesLoaded' and 'afterStart'
	// @param {Array<SubClassOf<ApplicationModule>>}
	// @param {Array<SubClassOf<ApplicationModule>>} modules @param {Function} done_fn the handler to be called once the application finish starting
	ApplicationSkeleton.prototype.start = function start (modules, done_fn)
	{
		// @event beforeStart triggered before loading modules so users have a chance to include new modules at this point.
		this.trigger('beforeStart', self);

		var self = this;

		// @property {Array<SubClassOf<ApplicationModule>>} modules We set the modules to the aplication the keys are the modules_list (names)
		// and the values are the loaded modules returned in the arguments by require.js
		self.modules = modules;

		// @property {Array<Any>} modulesMountToAppResult stores the resuts of each modules mountToApp method call
		self.modulesMountToAppResult = [];

		// we mount each module to our application
		_.each(self.modules, function (module)
		{
			if (module && _.isFunction(module.mountToApp))
			{
				self.modulesMountToAppResult.push(module.mountToApp(self));
			}
		});

		// This checks if you have registered modules
		if (!Backbone.history)
		{
			throw new Error('No Backbone.Router has been initialized (Hint: Are your modules properly set?).');
		}

		// @event afterModulesLoaded triggered after all modules have been loaded
		self.trigger('afterModulesLoaded', self);

		done_fn && _.isFunction(done_fn) && done_fn(self);

		// @event afterStart triggered after the application finish starting and after the start() callback is called.
		self.trigger('afterStart', self);
	};

	// We allow ApplicationSkeleton to listen and trigger custom events
	// http://backbonejs.org/#Events
	_.extend(ApplicationSkeleton.prototype, Backbone.Events);

	return ApplicationSkeleton;
});

// @class ApplicationModule An Application is mainly composed by modules, and those can be mounted to an application 
// instance by implementing a mountToApp it is the entry point of an application module. When the application start() it
// will mount all its configured modules using that method.
// @method mountToApp A module mounts it self in given application instace, for example, initialize some Backbone.Routers 
// @param {ApplicationSkeleton}
