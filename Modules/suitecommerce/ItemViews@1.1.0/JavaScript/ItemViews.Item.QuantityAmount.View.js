/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define('ItemViews.Item.QuantityAmount.View'
,	[	'ItemViews.Stock.View'

	,	'item_views_item_quantity.tpl'

	,	'Backbone'
	]
,	function (
		ItemViewsStockView

	,	item_views_item_quantity_tpl

	,	Backbone
	)
{
	'use strict';

	//@class ItemViews.Item.QuantityAmount.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_item_quantity_tpl

		//@method getContext @return {ItemViews.Item.QuantityAmount.View.Context}
	,	getContext: function ()
		{
			//@class ItemViews.Item.QuantityAmount.View.Context
			return {
				//@property {Model} line
				line: this.model
				//@property {String} lineId
			,	lineId: this.model.get('internalid')
				//@property {Boolean} showQuantity
			,	showQuantity: this.model.get('item').get('_itemType') !== 'Discount'
				//@property {Boolean} showDiscount
			,	showDiscount: !!this.model.get('discount')
				//@property {Boolean} showAmount
			,	showAmount: !!this.model.get('amount')
			};
		}
	});

});
