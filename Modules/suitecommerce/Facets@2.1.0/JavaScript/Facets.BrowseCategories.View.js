/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define('Facets.BrowseCategories.View'
,	[	'LiveOrder.Model'
	,	'Cart'
	,	'Facets.Helper'
	,	'Facets.Browse.View'
	,	'Categories'
	,	'Backbone.CollectionView'
	,	'Facets.FacetList.View'
	,	'Facets.CategoryCellList.View'
	,	'facets_category_browse.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'jQuery'
	,	'Bootstrap.Slider'
	,	'Utils'
	]
,	function (
		LiveOrderModel
	,	Cart
	,	Helper
	,	BrowseView
	,	Categories
	,	BackboneCollectionView
	,	FacetsFacetListView
	,	FacetsCategoryCellListView

	,	facets_category_browse_tpl

	,	Backbone
	,	BackboneCompositeView

	,	_
	,	jQuery
	)
{
	'use strict';

	// @class Facets.BrowseCategories.View View that handles the item list
	// @extends Backbone.View
	return Backbone.View.extend({

		template: facets_category_browse_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);

			var self = this;
			this.category = Categories.getBranchLineFromPath(this.options.translator.getFacetValue('category'))[0];
			this.translator = this.options.translator;

			this.hasThirdLevelCategories = _.every(this.category.categories, function (sub_category)
			{
				return _.size(sub_category.categories) > 0;
			});

			this.facets = [];

			if (this.hasThirdLevelCategories)
			{
				_.each(this.category.categories, function (sub_category)
				{
					var facet = {
						configuration: {
							behavior: 'single'
						,	id: 'category'
						,	name: sub_category.itemid
						,	uncollapsible: true
						,	url: self.category.urlcomponent + '/' + sub_category.urlcomponent
						}
					,	values: {
							id: 'category'
						,	values: []
						}
					};
					_.each(sub_category.categories, function (third_level_category)
					{
						var url = self.category.urlcomponent + '/' + sub_category.urlcomponent + '/' + third_level_category.urlcomponent;

						facet.values.values.push({
							label: third_level_category.itemid
						,	url: url
						,	image: third_level_category.storedisplaythumbnail
						});
					});

					self.facets.push(facet);
				});
			}
			else
			{
				var facet = {
					configuration: {
						behavior: 'single'
					,	id: 'category'
					,	name: ''
					,	uncollapsible: true
					,	hideHeading: true
					}
				,	values: {
						id: 'category'
					,	values: []
					}
				};

				_.each(this.category.categories, function (sub_category)
				{
					var url = self.category.urlcomponent + '/' + sub_category.urlcomponent;

					facet.values.values.push({
						label: sub_category.itemid
					,	url: url
					,	image: sub_category.storedisplaythumbnail
					});
				});

				this.facets.push(facet);
			}
		}

		// @method getBreadcrumbPages
	,	getBreadcrumbPages: BrowseView.prototype.getBreadcrumbPages

	,	childViews: {

			'Facets.FacetsList': function()
			{
				return new BackboneCollectionView({
					childView: FacetsFacetListView
				,	collection: this.facets
				,	childViewOptions: {
						translator: this.translator
					,	config: this.config
					}
				});
			}

		,	'Facets.CategoryCellList': function()
			{
				return new BackboneCollectionView({
					childView: FacetsCategoryCellListView
				,	collection: this.facets
				,	childViewOptions: {
						hasTwoOrMoreFacets: this.facets.length > 1
					}
				});
			}
		}

		// @method getTitle @returns {String}
	,	getTitle: function ()
		{
			var title = this.category.pagetitle || this.category.itemid;

			// Update the meta tag 'twitter:title'
			this.setMetaTwitterTitle(title);

			return title;
		}

		// @method setMetaTwitterTitle @param {String} title
	,	setMetaTwitterTitle: function (title)
		{
			var seo_twitter_title = jQuery('meta[name="twitter:title"]');
			seo_twitter_title && seo_twitter_title.attr('content', title);
		}

		// @method getContext @returns {Facets.BrowseCategories.View.Context}
	,	getContext: function()
		{
			// @class Facets.BrowseCategories.View.Context
			return {
				// @property {String} categoryItemid
				categoryItemid: this.category.itemid
			};
		}
	});
});