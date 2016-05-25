/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define('ItemViews.Cell.Navigable.View'
,	[	'ItemViews.SelectedOption.View'
	,	'ItemViews.Stock.View'
	,	'ItemViews.Price.View'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'item_views_cell_navigable.tpl'
	,	'item_views_cell_actionable_selected_options_cell.tpl'

	,	'Backbone'
	,	'Utils'
	]
,	function (
		ItemViewsSelectedOptionView
	,	ItemViewsStockView
	,	ItemViewsPriceView

	,	BackboneCollectionView
	,	BackboneCompositeView

	,	item_views_cell_navigable_tpl
	,	item_views_cell_actionable_selected_options_cell_tpl

	,	Backbone
	)
{
	'use strict';

	//@class ItemViews.Navigable.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_cell_navigable_tpl

	,	initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
			this.model = options.model;

			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.Options': function ()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(this.model.get('item').getPosibleOptions())
				,	childView: ItemViewsSelectedOptionView
				,	cellTemplate: item_views_cell_actionable_selected_options_cell_tpl
				,	viewsPerRow: 1
				,	childViewOptions: {
						cartLine: this.model
					}
				});
			}
		,	'ItemViews.Stock.View': function()
			{
				return new ItemViewsStockView({model:this.model.get('item')});
			}
		,	'Item.Price': function ()
			{
				if (this.model.get('rate') && this.model.get('rate_formatted'))
				{
					return new ItemViewsPriceView({
						model: this.model.get('item')
					,	linePrice: this.model.get('rate')
					,	linePriceFormatted: this.model.get('rate_formatted')
					,	origin: 'ITEMVIEWCELL'
					});
				}
			}
		}

		//@method getContext @return ItemViews.Navigable.View.Context
	,	getContext: function ()
		{
			var item = this.model.get('item')
			,	line = this.model;

			//@class ItemViews.Navigable.View.Context
			return {
					//@property {String} itemId
					itemId: item.get('internalid')
					//@property {String} itemName
				,	itemName: item.get('_name')
					//@property {String} cellClassName
				,	cellClassName: this.options.cellClassName
					//@property {Boolean} isNavigable
				,	isNavigable: !!this.options.navigable && !!item.get('_isPurchasable')
					//@property {String} rateFormatted
				,	rateFormatted: line.get('rate_formatted')
					//@property {String} itemSKU
				,	itemSKU: item.get('_sku')
					//@property {Boolean} showOptions
				,	showOptions: !!(line.get('options') && line.get('options').length)
					//@property {String} itemImageURL
				,	itemImageURL: item.get('_thumbnail').url
					//@property {String} itemImageAltText
				,	itemImageAltText: item.get('_thumbnail').altimagetext
					//@property {String} itemURLAttributes
				,	itemURLAttributes: item.get('_linkAttributes')
					//@property {Number} quantity
				,	quantity: line.get('quantity')
					//@property {Boolean} showDetail2Title
				,	showDetail2Title: !!this.options.detail2Title
					//@property {String} detail2Title
				,	detail2Title: this.options.detail2Title
					//@property {String} detail2
				,	detail2: line.get(this.options.detail2)
					//@property {Boolean} showReason
				,	showBlockDetail2: !!line.get(this.options.detail2)
					//@property {Boolean} showDetail3Title
				,	showDetail3Title: !!this.options.detail3Title
					//@property {String} detail3Title
				,	detail3Title: this.options.detail3Title
					//@property {String} detail3
				,	detail3: line.get(this.options.detail3)
					//@property {Boolean} showComparePrice
				,	showComparePrice: line.get('amount') > line.get('total')
					//@property {String} comparePriceFormatted
				,	comparePriceFormatted: line.get('amount_formatted')
			};
		}
	});
});

