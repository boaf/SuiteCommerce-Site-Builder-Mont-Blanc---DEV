/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define('ItemViews.Cell.Actionable.Expanded.View'
,	[	'ItemViews.Price.View'
	,	'ItemViews.SelectedOption.View'
	,	'ItemViews.Stock.View'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'item_views_cell_actionable_expanded.tpl'
	,	'item_views_cell_actionable_selected_options_cell.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		ItemViewsPriceView
	,	ItemViewsSelectedOptionView
	,	ItemViewsStockView

	,	BackboneCollectionView
	,	BackboneCompositeView

	,	item_views_cell_actionable_expanded_tpl
	,	item_views_cell_actionable_selected_options_cell_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class ItemViews.Actionable.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_cell_actionable_expanded_tpl

	,	initialize: function (options)
		{
			this.options = options;
			this.application = options.application;
			this.model = options.model;

			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.Price': function ()
			{
				this.model.get('item').set('quantity_total', this.model.get('quantity_total'));

				//There are some cases where you might want to use the price of the line
				//eg: quantity pricing
				if(this.options.useLinePrice === true && typeof this.model.get('rate') !== 'undefined')
				{
					return new ItemViewsPriceView({
						model: this.model.get('item')
					,	linePrice: this.model.get('rate')
					,	linePriceFormatted: this.model.get('rate_formatted')
					,	hideComparePrice: this.options.hideComparePrice
					});
				}
				else
				{
					return new ItemViewsPriceView({
						model: this.model.get('item')
					});
				}
			}
		,	'Item.SelectedOptions': function ()
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
		,	'Item.Summary.View': function ()
			{
				return new this.options.SummaryView(_.extend({
					model: this.model
				,	application: this.application
				}, this.options.summaryOptions || {}));
			}
		,	'Item.Actions.View': function ()
			{
				return new this.options.ActionsView(_.extend({
					model:this. model
				,	application: this.application
				}, this.options.actionsOptions || {}));
			}
		,	'ItemViews.Stock.View': function()
			{
				return new ItemViewsStockView({model:this.model.get('item')});
			}
		}

		//@method getContext @return ItemViews.Actionable.View.Context
	,	getContext: function ()
		{
			var item = this.model.get('item')
			,	thumbnail = item.get('_thumbnail');

			//@class ItemViews.Actionable.View.Context
			return {
					//@property {Model} line
					line: this.model
					//@property {String} lineId
				,	lineId: this.model.get('internalid')
					//@property {Item.Model} item
				,	item: this.model.get('item')
					//@property {String} itemId
				,	itemId: item.get('internalid')
					//@property {String} linkAttributes
				,	linkAttributes: item.get('_linkAttributes')
					//@property {String} imageUrl
				,	imageUrl: this.application.resizeImage(thumbnail.url, 'thumbnail')
					//@property {Boolean} navigable
				,	isNavigable: !!this.options.navigable && !!item.get('_isPurchasable')
					//@property {String} altImageText
				,	altImageText: thumbnail.altimagetext
					//@property {Boolean} showCustomAlert
				,	showCustomAlert: !!item.get('_cartCustomAlert')
					//@property {String} customAlertType
				,	customAlertType: item.get('_cartCustomAlertType') || 'info'
					//@property {Boolean} showActionsView
				,	showActionsView: !!this.options.ActionsView
					//@property {Boolean} showSummaryView
				,	showSummaryView: !!this.options.SummaryView
					//@property {Boolean} showAlert
				,	showAlert: !_.isUndefined(this.options.showAlert) ? !!this.options.showAlert : true
					//@property {Boolean} showGeneralClass
				,	showGeneralClass: !!this.options.generalClass
					//@property {String} generalClass
				,	generalClass: this.options.generalClass
			};
		}
	});

});
