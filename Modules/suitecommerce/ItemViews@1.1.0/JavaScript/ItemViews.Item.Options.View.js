/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemViews
define(
	'ItemViews.Item.Options.View'
,	[	'item_views_item_options.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function(
		item_views_item_options_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ItemViews.Item.Options.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_views_item_options_tpl

		// @method getContext @returns ItemViews.Item.Options.Context
	,	getContext: function ()
		{
			var options = _.each(this.options.lineOptions, function (option)
			{
				option.displayValue = option.displayvalue || option.value;
				option.showValue = !!option.displayValue;
			});

			//@class ItemViews.Item.Options.Context
			return {
				// @property {Array<Object>} options
				options: options
			};
		}
	});
});