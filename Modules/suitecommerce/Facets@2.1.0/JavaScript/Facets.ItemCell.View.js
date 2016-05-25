/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.ItemCell.View'
,	[
		'SC.Configuration'

	,	'ItemViews.Price.View'
	,	'ItemViews.Stock.View'
	,	'GlobalViews.StarRating.View'
	,	'ItemViews.Option.View'
	,	'Utils'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	]
,	function(
		Configuration

	,	ItemViewsPriceView
	,	ItemViewsStockView
	,	GlobalViewsStarRating
	,	ItemViewsOptionView
	,	Utils

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	)
{
	'use strict';

	// @class Facets.ItemCell.View @extends Backbone.View
	return Backbone.View.extend({

		initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

		// @method getContext @returns {Facets.ItemCell.View.Context}
	,	getContext: function ()
		{
			//@class Facets.ItemCell.View.Context
			return {
				// @property {String} itemId
				itemId: this.model.get('_id')
				// @property {String} name
			,	name: this.model.get('_name')
				// @property {String} url
			,	url: this.model.get('_url')
				// @property {Number} minQuantity
			,	minQuantity: parseInt(this.model.get('_minimumQuantity'), 10)
				// @property {Number} rating
			,	rating: this.model.get('_rating')
				// @property {Boolean} canAddToCart
			,	canAddToCart: Configuration.addToCartFromFacetsView && this.model.isReadyForCart()
				// @property {Boolean} isEnvironmentBrowser
			,	isEnvironmentBrowser: SC.ENVIRONMENT.jsEnvironment === 'browser' && !SC.ENVIRONMENT.isTouchEnabled
				// @property {Object} thumbnail
			,	thumbnail: this.model.get('_thumbnail')
				// @property {Object} stockInfo
			,	stockInfo: this.model.getStockInfo()
				// @property {Boolean} itemIsNavigable
			,	itemIsNavigable: !_.isUndefined(this.options.itemIsNavigable) ? !!this.options.itemIsNavigable : true
				//@property {Boolean} showRating
			,	showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled
				//@property {String} track_productlist_list
			,	track_productlist_list: this.model.get('track_productlist_list')
				//@property {String} track_productlist_position
			,	track_productlist_position: this.model.get('track_productlist_position')
				//@property {String} track_productlist_category
			,	track_productlist_category: this.model.get('track_productlist_category')
				//@property {String} sku
			,	sku: this.model.get('_sku')
			};
			//@class Facets.ItemCell.View
		}

	,	childViews: {
			'ItemViews.Price': function()
			{
				return new ItemViewsPriceView({
					model: this.model
				,	origin: 'ITEMCELL'
				});
			}
		,	'ItemViews.Stock': function()
			{
				return new ItemViewsStockView({model: this.model});
			}
		,	'GlobalViews.StarRating': function()
			{
				return new GlobalViewsStarRating({
					model: this.model
				,	showRatingCount: false
				,	queryOptions: Utils.parseUrlOptions(location.href)
				});
			}
		,	'ItemDetails.Options': function()
			{
				return new BackboneCollectionView({
					collection: new Backbone.Collection(_.where(this.model.getPosibleOptions(), {showSelectorInList: true}))
				,	childView: ItemViewsOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
						item: this.model
					}
				});
			}
		}
	});
});
