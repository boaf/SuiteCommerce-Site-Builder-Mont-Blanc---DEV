/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemViews
define(
	'ItemViews.Stock.View'
,	[
		'item_views_stock.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function(
		item_views_stock_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class ItemViews.Stock.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_views_stock_tpl
	
		// @method getContext @returns {ItemViews.Stock.View.Context}
	,	getContext: function ()
		{
			var stock_info = this.model.getStockInfo();

			//@class ItemViews.Stock.View.Context
			return {
					//@property {Boolean} showOutOfStockMessage
					showOutOfStockMessage: !!(!stock_info.isInStock && stock_info.showOutOfStockMessage)
					//@property {Boolean} showStockDescription
				,	showStockDescription: !!(stock_info.showStockDescription && stock_info.stockDescription)
					//@property {ItemDetails.Model.StockInfo} stockInfo
				,	stockInfo: stock_info
					//@property {ItemDetails.Model} model
				,	model: this.model
					//@property {Boolean} showInStockMessage
				,	showInStockMessage: !(!stock_info.isInStock && stock_info.showOutOfStockMessage) && !!stock_info.showInStockMessage
				,	isAvailableInStore: !!_.isUndefined(this.model.get('_isPurchasable'))
			};
			//@class ItemViews.Stock.View
		}
	});
});