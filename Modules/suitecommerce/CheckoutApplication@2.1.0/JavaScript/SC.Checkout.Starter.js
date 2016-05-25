/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define(
	'SC.Checkout.Starter'
,	[
		'SC.Checkout'
	,	'underscore'
	,	'jQuery'
	,	'Backbone'

	,	'SC.Checkout.Starter.Dependencies' // Auto generated at build time using configuration from distro.json

	]
,	function(
		application
	,	_
	,	jQuery
	,	Backbone

	,	entryPointModules
	)
{

	'use strict';

	jQuery(function ()
	{
		//var application = SC.Application('Checkout');

		application.getConfig().siteSettings = SC.ENVIRONMENT.siteSettings || {};

		if (SC.ENVIRONMENT.checkout_skip_login)
		{
			application.Configuration.checkout_skip_login = SC.ENVIRONMENT.checkout_skip_login;
			delete SC.ENVIRONMENT.checkout_skip_login;
		}

		application.start(entryPointModules, function ()
		{
			// Checks for errors in the context
			if (SC.ENVIRONMENT.contextError)
			{
				// Shows the error.
				if (SC.ENVIRONMENT.contextError.errorCode === 'ERR_WS_EXPIRED_LINK')
				{
					application.getLayout().expiredLink(SC.ENVIRONMENT.contextError.errorMessage);
				}
				else
				{
					application.getLayout().internalError(SC.ENVIRONMENT.contextError.errorMessage, 'Error ' + SC.ENVIRONMENT.contextError.errorStatusCode + ': ' + SC.ENVIRONMENT.contextError.errorCode);
				}
			}
			else
			{
				var fragment = _.parseUrlOptions(location.search).fragment;

				if (fragment && !location.hash)
				{
					location.hash = decodeURIComponent(fragment);
				}

				Backbone.history.start();
			}

			if (SC.ENVIRONMENT.siteSettings.sitetype === 'STANDARD' && SC.ENVIRONMENT.siteSettings.showcookieconsentbanner === 'T')
			{
				//if cookie consent banner is going to be displayed, fix the navigation issue
				_.preventAnchorNavigation('div#cookieconsent a');
			}
			application.getLayout().appendToDom();
		});
	});
});