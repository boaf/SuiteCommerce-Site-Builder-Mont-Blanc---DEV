/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
/*

@module CMSadapter

@class CMSadapterImpl the class that do the actual integration job using the CMS API. Usage:

	var adapter = new CMSadapterImpl(application, CMS);
	adapter.init();

This will start the cms adapter, for example listening to the ESC key to be pressed to load the CMS
administrator and collaborating with with it to accomplish use cases (mostly landing pages).

In addition the PageRouter must be initialized to implement the full pages experience.

*/
define('CMSadapterImpl'
,	[	'jQuery'
	,	'underscore'
	,	'Backbone'
	]
,	function (
		jQuery
	,	_
	,	Backbone
	)
{
	'use strict';

	function Adapter(application, CMS, pageRouter)
	{
		this.CMS = CMS;
		this.application = application;
		this.pageRouter = pageRouter;
	}

	_.extend(Adapter.prototype, {

		init: function ()
		{
			var self = this;

			this.listenForCMS();
			this.application.getLayout().on('afterAppendView', function ()
			{
				self.CMS.trigger('adapter:page:changed');
			});
			this.CMS.trigger('adapter:ready');
		}

	,	listenForCMS: function ()
		{
			// CMS listeners - CMS tells us to do something, could fire anytime.
			var self = this;

			self.CMS.on('adapter:get:setup', function ()
			{
				var setup = {}; // Config values the adapter can give the cms on startup. Currently nothing is used (cms ignores values).
				CMS.trigger('adapter:got:setup', setup);
			});

			self.CMS.on('adapter:get:context', function ()
			{
				var context = self.getCmsContext();
				self.CMS.trigger('adapter:got:context', context);
			});

			self.CMS.on('adapter:landing:pages:reload', function (data, callback)
			{
				callback(self.realoadLandingPages(data));
			});
			self.CMS.on('adapter:landing:pages:add', function (data, callback)
			{
				callback(self.addLandingPages(data));
			});
			self.CMS.on('adapter:landing:page:navigate', function (data, callback)
			{
				// triggered when user selects a landing page in the 'manage pages mode' in cms administrator
				callback(self.navigateLandingPage(data));
			});
			self.CMS.on('adapter:landing:page:update', function (data, callback)
			{
				// triggered when user clicks the 'edit' button of a landing page in the 'manage pages mode' in cms administrator
				callback(self.updateLandingPage(data));
			});
		}


	,	getCmsContext: function ()
		{
			var url = Backbone.history.fragment.split('?')[0]
			,	path = url[0] === '/' ? url : '/' + url;

			var context = {
				path: path
			,	site_id: this.application.getConfig('siteSettings.siteid')
			,	page_type: this.application.getLayout().currentView ? this.application.getLayout().currentView.el.id : ''
			};

			return context;
		}

		// landing pages handlers

		// @method realoadLandingPages called when user clicks on 'manage pages mode' in admin.
		// Remember that might be unpublished landing pages and so in the admin navigation to these ones must work even if they aren't real landing pages.
	,	realoadLandingPages: function (data)
		{
			// console.log('CMS realoadLandingPages', arguments);
			var self = this;
			_.each(data.pages, function(page)
			{
				if (page.type === 1)
				{
					self.pageRouter.addLandingRoute(page);
				}
			});
		}

		// @method addLandingPages NOTE: Add a new page(s) to your collection, also passes a bool value (trigger) that should be used to auto-navigate to the new page.
	,	addLandingPages: function (data)
		{
			this.pageRouter.addLandingRoute(data.page);

			if (data.trigger)
			{
				Backbone.history.navigate(data.page.url, {trigger:true});
			}
			else
			{
				this.CMS.trigger('adapter:page:changed');
			}
		}

		//@method navigateLandingPage handler called when the user navigates inside the admin. NOTE: Provides url so that the page can be reloaded or navigated to (Backbone History, etc).
	,	navigateLandingPage: function (data)
		{
			Backbone.history.navigate(data.url, {trigger:true});
		}

	,	updateLandingPage: function (data)  // Update an existing page with title, header, meta, etc.
		{
			if (data.saving)
			{
				if (data.page.type === 1)
				{
					//update the router internally with possible new urls (virtual - they are not published but for the admin navigation to work correctly)
					this.pageRouter.addLandingRoute(data.page, data.original_url);
				}

				if (data.trigger)
				{
					// Heads up!
					// Edit Live Site > Landing Pages > "Page not found" error for new published landing page
					// navigate wont refresh the page if you are in the same url but it will change the url of the browser
					// loadUrl will navigate to the url but won't change the url of the browser, that's why we use both
					Backbone.history.navigate(data.page.url, { trigger: false });
					Backbone.history.loadUrl(data.page.url);
				}
				else
				{
					this.CMS.trigger('adapter:page:changed');
				}
			}
		}
	});

	return Adapter;
});
