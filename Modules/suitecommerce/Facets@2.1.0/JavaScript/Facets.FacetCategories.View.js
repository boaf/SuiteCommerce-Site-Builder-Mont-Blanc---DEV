/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.FacetCategories.View'
,	[
		'Facets.FacetCategoriesList.View.js'

	,	'facets_facet_categories.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'

	,	'underscore'
	]
,	function(
		FacetsFacetCategoriesListView

	,	facets_facet_categories_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView

	,	_
	)
{
	'use strict';

	// @class Facets.FacetCategories.View @extends Backbone.View
	return Backbone.View.extend({

		initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

		// @method getContext @return Facets.FacetCategories.View.Context
	,	getContext: function ()
		{
			var config = this.options.config;
			//@class Facets.FacetCategories.View.Context
			return {
				// @property {String} itemId
				facetHtmlId: _.uniqueId('facetList_')

				// @property {String} facetId
			,	facetId: this.model.id

				// @property {Boolean} isCollapsible
			,	isCollapsible: !config.uncollapsible && config.collapsed
			};
			//@class Facets.FacetCategories.View
		}

	,	childViews: {
			'Facets.FacetCategoriesList': function()
			{
				var translator = this.options.translator
				,	selected = translator.getFacetValue(this.model.id)
				,	tree = translator.getMergedCategoryTree(this.model.values)
				,	tab = selected ? tree[selected.split('/')[0]] : {};

				return new FacetsFacetCategoriesListView({
					facet: this.model
				,	translator: translator
				,	selected: translator.getFacetValue(this.model.id)
				,	urlMemo: tab.urlcomponent
				});
			}
		}
	});
});