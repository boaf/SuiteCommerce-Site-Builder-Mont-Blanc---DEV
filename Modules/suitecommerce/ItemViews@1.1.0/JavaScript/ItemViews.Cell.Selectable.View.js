/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define('ItemViews.Cell.Selectable.View'
,	[
		'ItemViews.SelectedOption.View'
	,	'ItemViews.Item.Options.View'
	,	'ItemViews.Stock.View'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'item_views_cell_selectable.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		ItemViewsSelectedOptionView
	,	ItemViewsItemOptions
	,	ItemViewsStockView

	,	BackboneCollectionView
	,	BackboneCompositeView

	,	item_views_cell_selectable_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class ItemViews.Selectable.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_cell_selectable_tpl

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
				return new ItemViewsItemOptions({
					lineOptions: this.model.get('options')
				});
			}
		,	'Detail1.View': function ()
			{
				var View = this.options.detail1
				,	detail1_options = _.extend({
						model: this.model
					}, this.options.detail1Options || {});

				return new View(detail1_options);
			}
		,	'ItemViews.Stock.View': function()
			{
				return new ItemViewsStockView({model:this.model.get('item')});
			}
		}

		//@method getContext @return ItemViews.Selectable.View.Context
	,	getContext: function ()
		{
			var item = this.model.get('item')
			,	line = this.model;

			//@class ItemViews.Selectable.View.Context
			return {
					//@property {String} itemId
					itemId: item.get('internalid')
					//@property {String} itemtype
				,	itemType: item.get('itemtype')
					//@property {String} itemName
				,	itemName: item.get('_name')
					//@property {String} lineId
				,	lineId: line.id

					//@property {Boolean} isLineSelected
				,	isLineSelected: line.get('check')

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
					//@property {Boolean} isNavigable
				,	isNavigable: !!this.options.navigable
					//@property {String} itemURLAttributes
				,	itemURLAttributes: item.get('_linkAttributes')

					//@property {Boolean} showDetail1Title
				,	showDetail1Title: !!this.options.detail1Title
					//@property {String} detail1Title
				,	detail1Title: this.options.detail1Title
					//@property {String} detail1
				,	detail1: line.get(this.options.detail1)
					//@property {Boolean} isDetail1Composite
				,	isDetail1Composite: _.isFunction(this.options.detail1)

					//@property {Boolean} showDetail2Title
				,	showDetail2Title: !!this.options.detail2Title
					//@property {String} detail2Title
				,	detail2Title: this.options.detail2Title
					//@property {String} detail2
				,	detail2: line.get(this.options.detail2)

					//@property {Boolean} showDetail3Title
				,	showDetail3Title: !!this.options.detail3Title
					//@property {String} detail3Title
				,	detail3Title: this.options.detail3Title
					//@property {String} detail3
				,	detail3: line.get(this.options.detail3)
			};
		}
	});
});
