/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemDetails
define(
	'ItemDetails.Router'
,	[
		'underscore'
	,	'Backbone'
	,	'AjaxRequestsKiller'
	]
,	function(
		_
	,	Backbone
	,	AjaxRequestsKiller
	)
{
	'use strict';

	// @class ItemDetails.Router This will listen to any route that should display Product Detailed
	// Page Parses any options passed as parameters @extends Backbone.Router
	return Backbone.Router.extend({

		routes: {
			':url': 'productDetailsByUrl'
		}

		//@method initialize
		//@param {ItemDetails.Router.InitializeParameters}
		//@return {Void}
	,	initialize: function (options)
		{
			this.application = options.application;
			// we will also add a new reg-exp route to this, that will cover any URL with slashes in it so in the case
			// you want to handle URLs like /cat1/cat2/urlcomponent, as this are the last routes to be evaluated,
			// it will only get here if there is no other more appropriate one
			this.route(/^(.*?)$/, 'productDetailsByUrl');
			this.Model = options.model;
			this.View = options.view;

			// This is the fall-back URL if a product does not have a URL component.
			this.route('product/:id', 'productDetailsById');
			this.route('product/:id?:options', 'productDetailsById');
		}

		// @method productDetailsByUrl dispatch the 'view product details by URL' page.
		// @param {String} url
		// @return {Void}
	,	productDetailsByUrl: function (url)
		{
			if (!url)
			{
				return;
			}

			// if there are any options in the URL
			var options = null;

			if (~url.indexOf('?'))
			{
				options = SC.Utils.parseUrlOptions(url);
				url = url.split('?')[0];
			}
			// Now go grab the data and show it
			if (options)
			{
				this.productDetails({url: url}, url, options);
			}
			else
			{
				this.productDetails({url: url}, url);
			}
		}

		// @method productDetailsById dispatch the 'view product details by id' page
		// @param {String} id
		// @param {String} options
		// @return {Void}
	,	productDetailsById: function (id, options)
		{
			// Now go grab the data and show it
			this.productDetails({id: id}, '/product/' + id, SC.Utils.parseUrlOptions(options));
		}

		// @method productDetails dispatch the 'view product details' page . This is the base implementation
		// @param {String} api_query
		// @param {String} base_url
		// @param {Object} options All the URL options specified when navigated
		// @return {Void}
	,	productDetails: function (api_query, base_url, options)
		{
			// Decodes URL options
			_.each(options, function (value, name)
			{
				options[name] = decodeURIComponent(value);
			});

			var application = this.application
			,	model = new this.Model()
				// we create a new instance of the ProductDetailed View
			,	view = new this.View({
					model: model
				,	baseUrl: base_url
				,	application: this.application
				});

			model.application = this.application;
			model.fetch({
				data: api_query
			,	killerId: AjaxRequestsKiller.getKillerId()
			,	pageGeneratorPreload: true
			}).then(
				// Success function
				function (data, result, jqXhr)
				{
					if (!model.isNew())
					{
						// once the item is fully loaded we set its options
						model.parseQueryStringOptions(options);

						if (!(options && options.quantity))
						{
							model.set('quantity', model.get('_minimumQuantity'));
						}

						if (api_query.id && model.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server')
						{
							nsglobal.statusCode = 301;
							nsglobal.location = model.get('_url') + model.getQueryString();
						}

						if (data.corrections && data.corrections.length > 0)
						{
							if (model.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server')
							{
								nsglobal.statusCode = 301;
								nsglobal.location = '/' + data.corrections[0].url + model.getQueryString();
							}
							else
							{
								return Backbone.history.navigate('#' + data.corrections[0].url + model.getQueryString(), {trigger: true});
							}
						}

						// we first prepare the view
						view.prepareViewToBeShown();

						// then we show the content
						view.showContent(options);
					}
					else if (jqXhr.status >= 500)
					{
						application.getLayout().internalError();
					}
					else if (jqXhr.responseJSON.errorCode !== 'ERR_USER_SESSION_TIMED_OUT')
					{
						// We just show the 404 page
						application.getLayout().notFound();
					}
				}
				// Error function
			,	function (jqXhr)
				{
					// this will stop the ErrorManagment module to process this error
					// as we are taking care of it
					try
					{
						jqXhr.preventDefault = true;
					}
					catch (e)
					{
						// preventDefault could be read-only!
						console.log(e.message);
					}

					if (jqXhr.status >= 500)
					{
						application.getLayout().internalError();
					}
					else if (jqXhr.responseJSON.errorCode !== 'ERR_USER_SESSION_TIMED_OUT')
					{
						// We just show the 404 page
						application.getLayout().notFound();
					}
				}
			);
		}
	});
});


//@class ItemDetails.Router.InitializeParameters
//@property {ApplicationSkeleton} application
//@property {ItemDetails.Model} model
//@property {ItemDetails.View} view
