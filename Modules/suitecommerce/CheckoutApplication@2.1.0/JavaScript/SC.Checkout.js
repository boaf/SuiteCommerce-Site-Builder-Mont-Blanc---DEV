/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*!
* Description: SuiteCommerce Reference Checkout
*
* @copyright (c) 2000-2013, NetSuite Inc.
* @version 1.0
*/

// Application.js
// --------------
// Extends the application with Checkout specific core methods
define(
	'SC.Checkout'
,	[
		'SC.Checkout.Configuration'

	,	'Application'

	,	'SC.Checkout.Layout'

	,	'Session'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'

	,	'Backbone.Model'
	,	'Backbone.Sync'
	,	'Backbone.Validation.callbacks'
	,	'Backbone.Validation.patterns'
	,	'Backbone.View'
	,	'Backbone.View.render'
	,	'Backbone.View.saveForm'
	,	'Backbone.View.toggleReset'
	,	'Bootstrap.Slider'
	,	'jQuery.ajaxSetup'
	,	'jQuery.serializeObject'
	,	'String.format'
	]
,	function(
		Configuration

	,	Application

	,	CheckoutLayout
	,	Session

	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	var Checkout = SC.Application('Checkout');

	Checkout.Configuration = _.extend(Checkout.Configuration, Configuration);

	Checkout.Layout = CheckoutLayout;

	// This makes that Promo codes and GC travel to different servers (secure and unsecure)
	Checkout.on('afterStart', function()
	{
		// TODO Move this to a Render Plugin and install only if we are on sitebuilder.
		// Fix sitebuilder links, Examines the event target to check if its a touchpoint
		// and replaces it with the new version ot the touchpoint
		function fixCrossDomainNavigation(e)
		{
			var $element = jQuery(e.target);
			if (!$element.closest('#main').length)
			{
				var href = e.target.href
				,	touchpoints = Session.get('touchpoints');

				_.each(touchpoints, function(touchpoint)
				{
					if (~touchpoint.indexOf(href.split('?')[0]))
					{
						e.target.href = touchpoint;
					}
				});
			}
		}
		// As this fixCrossDomainNavigation only alters the href of the a we can append it
		// to the mouse down event, and not to the click thing will make us work a lot more :)
		jQuery(document.body).on('mousedown', 'a', fixCrossDomainNavigation);
		jQuery(document.body).on('touchstart', 'a', fixCrossDomainNavigation);
	});

	// Setup global cache for this application
	jQuery.ajaxSetup({cache:false});

	return Checkout;
});
