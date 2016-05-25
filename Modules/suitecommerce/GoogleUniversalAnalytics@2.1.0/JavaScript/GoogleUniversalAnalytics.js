/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module GoogleUniversalAnalytics
(function (win, name)
{
	'use strict';
	// [Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
	// We customized the tracking default start script so it doesn't loads analytics.js
	// (Tracking Start)[https://developers.google.com/analytics/devguides/collection/analyticsjs/#quickstart]
	win.GoogleAnalyticsObject = name;
	win[name] = win[name] || function ()
	{
		(win[name].q = win[name].q || []).push(arguments);
	};
	win[name].l = 1 * new Date();

	//@class GoogleUniversalAnalytics @extends ApplicationModule
	// ------------------
	// Loads google analytics script and extends application with methods:
	// * trackPageview
	// * trackEvent
	// * trackTransaction
	// Also wraps layout's showInModal
	define('GoogleUniversalAnalytics'
	,	[	'Tracker'
		,	'underscore'
		,	'jQuery'
		,	'Backbone'
		]
	,	function (
			Tracker
		,	_
		,	jQuery
		,	Backbone
		)
	{
		var GoogleUniversalAnalytics = {

			//@property {Boolean} doCallback Indicates if this module do a callback after some particular events
			doCallback: true

			//@method trackPageview
			//@param {String} url
			//@return {GoogleUniversalAnalytics}
		,	trackPageview: function (url)
			{
				if (_.isString(url))
				{
					// [Page Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#overriding)
					win[name]('send', 'pageview', url);
				}

				return this;
			}

			//@method trackEvent
			//@param {TrackEvent} event
			//@return {GoogleUniversalAnalytics}
		,	trackEvent: function (event)
			{
				if (event && event.category && event.action)
				{
					// [Event Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation)
					win[name]('send', 'event', event.category, event.action, event.label, parseFloat(event.value) || 0, {
						'hitCallback': event.callback
					,	'page': event.page || '/'+Backbone.history.fragment
					});
				}

				return this;
			}

			//@method addItem
			//@param {Object<String:id,String:name>} item
			//@return {GoogleUniversalAnalytics}
		,	addItem: function (item)
			{
				if (item && item.id && item.name)
				{
					// [Adding Items](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem)
					win[name]('ecommerce:addItem', item);
				}

				return this;
			}

			//@method addTrans
			//@param {Object} transaction
			//@return {GoogleUniversalAnalytics}
		,	addTrans: function (transaction)
			{
				if (transaction && transaction.id)
				{
					// [Adding a Transaction](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans)
					win[name]('ecommerce:addTransaction', transaction);
				}

				return this;
			}

			//@method trackTrans
			//@return {GoogleUniversalAnalytics}
		,	trackTrans: function ()
			{
				// [Sending Data](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#sendingData)
				win[name]('ecommerce:send');
				return this;
			}

			//@method trackTransaction
			// Based on the created SalesOrder we trigger each of the analytics
			// ecommerce methods passing the required information
			// [Ecommerce Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce)
			//@param {LiveOrder.Model} order
			//@return {GoogleUniversalAnalytics|Void}
		,	trackTransaction: function (order)
			{
				if (order && order.get('confirmation'))
				{
					var transaction_id = order.get('confirmation').confirmationnumber
					,	order_summary = order.get('summary')
					,	item = null;

					GoogleUniversalAnalytics.addTrans({
						id: transaction_id
					,	revenue: order_summary.subtotal
					,	shipping: order_summary.shippingcost + order_summary.handlingcost
					,	tax: order_summary.taxtotal
					,	currency: SC.getSessionInfo && SC.getSessionInfo('currency') ? SC.getSessionInfo('currency').code : ''

					,	page: '/' + Backbone.history.fragment
					});

					order.get('lines').each(function (line)
					{
						item = line.get('item');

						GoogleUniversalAnalytics.addItem({
							id: transaction_id
						,	affiliation: SC.ENVIRONMENT.siteSettings.displayname
						,	sku: item.get('_sku')
						,	name: item.get('_name')
						,	category: item.get('_category')
						,	price: line.get('rate')
						,	quantity: line.get('quantity')
						});
					});

					return GoogleUniversalAnalytics.trackTrans();
				}
			}

			//@method setAccount
			//@param {SC.Configuration} config
			//@return {Void}
		,	setAccount: function (config)
			{
				if (config && _.isString(config.propertyID) && _.isString(config.domainName))
				{
					// [Multiple Trackers on The Same Domain](https://developers.google.com/analytics/devguides/collection/analyticsjs/domains#multitrackers)
					// https://support.google.com/analytics/answer/1034342?hl=en
					win[name]('create', config.propertyID, {
						'cookieDomain': config.domainName
					,	'allowLinker': true
					});

					this.propertyID = config.propertyID;
					this.domainName = config.domainName;
				}

				return this;
			}

			//@method addCrossDomainParameters
			// [Decorating HTML Links](https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain#decoratelinks)
			//@param {string} url
			//@return {String} url
		,	addCrossDomainParameters: function (url)
			{
				// We only need to add the parameters if the URL we are trying to go
				// is not a sub domain of the tracking domain
				if (_.isString(url) && !~url.indexOf(this.domainName))
				{
					win[name](function (tracker)
					{
						win.linker = win.linker || new win.gaplugins.Linker(tracker);

						var track_url = win.linker.decorate(url);

						// This validation is due to Tracking Blockers overriding the default analytics methods
						if (typeof track_url === 'string')
						{
							url = track_url;
						}
					});
				}

				return url;
			}

			//@method loadScript
			//@return {jQuery.Promise|Void}
		,	loadScript: function ()
			{
				// [Load the eCommerce Plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#loadit)
				win[name]('require', 'ecommerce', 'ecommerce.js');
				return SC.ENVIRONMENT.jsEnvironment === 'browser' && jQuery.getScript('//www.google-analytics.com/analytics.js');
			}

			//@method mountToApp
			//@param {ApplicationSkeleton} application
			//@return {Void}
		,	mountToApp: function (application)
			{
				var tracking = application.getConfig('tracking.googleUniversalAnalytics');

				// if track page view needs to be tracked
				if (tracking && tracking.propertyID)
				{
					// we get the account and domain name from the configuration file
					GoogleUniversalAnalytics.setAccount(tracking);

					Tracker.getInstance().trackers.push(GoogleUniversalAnalytics);

					// the analytics script is only loaded if we are on a browser
					application.getLayout().once('afterAppendView', jQuery.proxy(GoogleUniversalAnalytics, 'loadScript'));
				}
			}
		};

		return GoogleUniversalAnalytics;
	});
})(window, 'ga');
