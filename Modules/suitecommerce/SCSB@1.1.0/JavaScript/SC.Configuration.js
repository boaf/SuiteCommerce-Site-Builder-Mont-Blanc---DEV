/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SC
// @class SC.Configuration
// All of the applications configurable defaults

define(
	'SC.Configuration'
,	[
		'item_views_option_tile.tpl'
	,	'item_views_option_text.tpl'
	,	'item_views_selected_option.tpl'

	,	'underscore'
	,	'Utils'
	]

,	function (
		item_views_option_tile_tpl
	,	item_views_option_text_tpl
	,	item_views_selected_option_tpl

	,	_
	)
{

	'use strict';

	var Configuration = {

		// @property {String} defaultSearchUrl
		defaultSearchUrl: 'search'

	,	templates: {
			itemOptions: {
				// each apply to specific item option types
				selectorByType:
				{
					select: item_views_option_tile_tpl
				,	'default': item_views_option_text_tpl
				}
				// for rendering selected options in the shopping cart
			,	selectedByType: {
					'default': item_views_selected_option_tpl
				}
			}
		}

		// @param {Object} searchApiMasterOptions options to be passed when querying the Search API
	,	searchApiMasterOptions: {

			Facets: {
				include: 'facets'
			,	fieldset: 'search'
			}

		,	itemDetails: {
				include: 'facets'
			,	fieldset: 'details'
			}

		,	relatedItems: {
				fieldset: 'relateditems_details'
			}

		,	correlatedItems: {
				fieldset: 'correlateditems_details'
			}

			// don't remove, get extended
		,	merchandisingZone: {}

		,	typeAhead: {
				fieldset: 'typeahead'
			}
		}

		// Analytics Settings
		// You need to set up both popertyID and domainName to make the default trackers work
	,	tracking: {
			// [Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
			googleUniversalAnalytics: {
				propertyID: ''
			,	domainName: ''
			}
			// [Google Analytics](https://developers.google.com/analytics/devguides/collection/gajs/)
		,	google: {
				propertyID: ''
			,	domainName: ''
			}
			// [Google AdWords](https://support.google.com/adwords/answer/1722054/)
		,	googleAdWordsConversion: {
				id: 0
			,	value: 0
			,	label: ''
			}
		}

		// @property {Object} imageSizeMapping map of image custom image sizes
		// usefull to be customized for smaller screens
	,	imageSizeMapping: {
			thumbnail: 'thumbnail' // 175 * 175
		,	main: 'main' // 600 * 600
		,	tinythumb: 'tinythumb' // 50 * 50
		,	zoom: 'zoom' // 1200 * 1200
		,	fullscreen: 'fullscreen' // 1600 * 1600
		}
		// @property {String} imageNotAvailable url for the not available image
	,	imageNotAvailable: _.getAbsoluteUrl('img/no_image_available.jpeg')

		// @property {Array} paymentmethods map of payment methods, please update the keys using your account setup information.

	,	paymentmethods: [
			{
				key: '5,5,1555641112' //'VISA'
			,	regex: /^4[0-9]{12}(?:[0-9]{3})?$/
			}
		,	{
				key: '4,5,1555641112' //'Master Card'
			,	regex: /^5[1-5][0-9]{14}$/
			}
		,	{
				key: '6,5,1555641112' //'American Express'
			,	regex: /^3[47][0-9]{13}$/
			}
		,	{
				key: '3,5,1555641112' // 'Discover'
			,	regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/
			}
		,	{
				key: '16,5,1555641112' // 'Maestro'
			,	regex: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/
			}
		,	{
				key: '17,3,1555641112' // External
			,	description: 'This company allows both private individuals and businesses to accept payments over the Internet'
			}
		]

	,	siteSettings: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings || {}

	,	get: function (path, defaultValue)
		{
			return _.getPathFromObject(this, path, defaultValue);
		}

	,	getRegistrationType: function ()
		{
			if (Configuration.get('siteSettings.registration.registrationmandatory') === 'T')
			{
				// no login, no register, checkout as guest only
				return 'disabled';
			}
			else
			{
				if (Configuration.get('siteSettings.registration.registrationoptional') === 'T')
				{
					// login, register, guest
					return 'optional';
				}
				else
				{
					if (Configuration.get('siteSettings.registration.registrationallowed') === 'T')
					{
						// login, register, no guest
						return 'required';
					}
					else
					{
						// login, no register, no guest
						return 'existing';
					}
				}
			}
		}
	};

	// Append Product Lists configuration
	_.extend(Configuration, {
		product_lists: SC.ENVIRONMENT.PRODUCTLISTS_CONFIG
	});

	// Append Cases configuration
	_.extend(Configuration, {
		cases: {
			config: SC.ENVIRONMENT.CASES_CONFIG
		,	enabled: SC.ENVIRONMENT.casesManagementEnabled
		}
	});

	// Append Bronto Integration configuration
	_.extend(Configuration, {
		bronto: {
			accountId: ''
		}
	});

	return Configuration;
});
