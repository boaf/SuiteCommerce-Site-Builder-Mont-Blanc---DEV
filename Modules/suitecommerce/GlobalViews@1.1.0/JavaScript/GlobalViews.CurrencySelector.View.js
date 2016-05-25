/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module GlobalViews
define(
	'GlobalViews.CurrencySelector.View'
,	[
		'SC.Configuration'
	,	'Utils'
	,	'Facets.Browse.View'

	,	'global_views_currency_selector.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	]
,	function(
		Configuration
	,	Utils
	,	BrowseView

	,	global_views_currency_selector_tpl

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	// @class GlobalViews.CurrencySelector.View @extends Backbone.View
	return Backbone.View.extend({

		template: global_views_currency_selector_tpl

	,	events: {
			'change select[data-toggle="currency-selector"]' : 'setCurrency'
		,	'click select[data-toggle="currency-selector"]' : 'currencySelectorClick'
		}

		// @method currencySelectorClick @param {HTMLEvent} e
	,	currencySelectorClick: function (e)
		{
			e.stopPropagation();
		}
		
		// @method setCurrency @param {HTMLEvent} e
	,	setCurrency: function (e)
		{
			var currency_code = jQuery(e.target).val()
			,	selected_currency = _.find(SC.ENVIRONMENT.availableCurrencies, function (currency)
				{	
					return currency.code === currency_code;
				});

			// We use the param **"cur"** to pass this to the ssp environment
			var current_search = Utils.parseUrlOptions(window.location.search);

			// if we are in a facet result we will remove all facets and navigate to the default search
			// TODO REVIEW THIS
			if (window.location.hash !== '' && _.values(SC._applications)[0].getLayout().currentView instanceof BrowseView)
			{
				window.location.hash = Configuration.defaultSearchUrl || '';
			}

			current_search.cur = selected_currency.code;

			window.location.search = _.reduce(current_search, function (memo, val, name)
			{
				return val ? memo + name + '=' + val + '&' : memo;
			}, '?');
		}

		// @method getContext @return GlobalViews.CurrencySelector.View.Context
	,	getContext: function()
		{
			var available_currencies = _.map(SC.ENVIRONMENT.availableCurrencies, function(currency)
			{
				// @class GlobalViews.CurrencySelector.View.Context.Currency
				return {
					// @property {String} code
					code: currency.code
					// @property {String} internalId
				,	internalId: currency.internalid
					// @property {String} isDefault
				,	isDefault: currency.isdefault
					// @property {String} symbol
				,	symbol: currency.symbol
					// @property {Boolean} symbolPlacement
				,	symbolPlacement: currency.symbolplacement
					// @property {String} displayName
				,	displayName: currency.title || currency.name
					// @property {Boolean} isSelected
				,	isSelected: SC.ENVIRONMENT.currentCurrency.code === currency.code
				};
			});

			// @class GlobalViews.CurrencySelector.View.Context
			return {
				// @property {Boolean} showCurrencySelector
				showCurrencySelector: !!(SC.ENVIRONMENT.availableCurrencies && SC.ENVIRONMENT.availableCurrencies.length > 1)
				// @property {Array<GlobalViews.CurrencySelector.View.Context.Currency>} availableCurrencies
			,	availableCurrencies: available_currencies || []
				// @property {String} currentCurrencyCode
			,	currentCurrencyCode: SC.ENVIRONMENT.currentCurrency.code
				// @property {String} currentCurrencySymbol
			,	currentCurrencySymbol: SC.getSessionInfo('currency').symbol
			};
		}
	});
});