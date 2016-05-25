/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define('ItemViews.Cell.SelectableActionable.View'
,	[	'ItemViews.Price.View'
	,	'ItemViews.SelectedOption.View'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'item_views_cell_selectable_actionable.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ItemViewsPriceView
	,	ItemViewsSelectedOptionView

	,	BackboneCollectionView
	,	BackboneCompositeView

	,	item_views_cell_selectable_actionable_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class ItemViews.SelectableActionable.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_cell_selectable_actionable_tpl

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
				return new ItemViewsPriceView({
					model: this.model.get('item')
				,	origin: 'ITEMVIEWCELL'
				});
			}
		,	'Item.SelectedOptions': function ()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(this.model.get('item').getPosibleOptions())
				,	childView: ItemViewsSelectedOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
						cartLine: this.model
					}
				});
			}
		,	'Item.Summary.View': function ()
			{
				var child_options = _.extend(
					this.options.summaryOptions || {}
				,	{
						model: this.model
					,	application: this.application
					});

				return new this.options.SummaryView(child_options);
			}
		,	'Item.Actions.View': function ()
			{
				var child_options = _.extend(
					this.options.actionsOptions || {}
				,	{
						model: this.model
					,	application: this.application
					});

				return new this.options.ActionsView(child_options);
			}
		}

		//@method getContext @return ItemViews.SelectableActionable.View.Context
	,	getContext: function ()
		{
			var item = this.model.get('item')
			,	thumbnail = item.get('_thumbnail');

			//@class ItemViews.SelectableActionable.View.Context
			return {
					//@property {Model} line
					line: this.model
					//@property {String} lineId
				,	lineId: this.model.get('internalid')
					//@property {Item.Model} item
				,	item: this.model.get('item')
					//@property {String} itemName
				,	itemName: item.get('_name')
					//@property {String} itemSKU
				,	itemSKU: item.get('_sku')
					//@property {String} itemId
				,	itemId: item.get('internalid')
					//@property {String} linkAttributes
				,	linkAttributes: item.get('_linkAttributes')
					//@property {String} imageUrl
				,	imageUrl: thumbnail.url
					//@property {Boolean} isNavigable
				,	isNavigable: !!this.options.navigable
					//@property {String} altImageText
				,	altImageText: thumbnail.altimagetext
					//@property {Boolean} showCustomAlert
				,	showCustomAlert: !!item.get('_cartCustomAlert')
					//@property {String} alertText
				,	alertText: item.get('_cartCustomAlert')
					//@property {String} customAlertType
				,	customAlertType: item.get('_cartCustomAlertType') || 'info'
					//@property {Boolean} showActionsView
				,	showActionsView: !!this.options.ActionsView
					//@property {Boolean} showSummaryView
				,	showSummaryView: !!this.options.SummaryView
					//@property {Boolean} isLineChecked
				,	isLineChecked: this.model.get('checked')
					//@property {Boolean} activeLinesLengthGreaterThan1
				,	activeLinesLengthGreaterThan1: this.options.activeLinesLength > 1
			};
		}
	});

});
