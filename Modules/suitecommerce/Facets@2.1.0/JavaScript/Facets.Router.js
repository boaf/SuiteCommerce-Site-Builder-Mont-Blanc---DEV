/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global nsglobal */
// @module Facets
define('Facets.Router'
,	[	
		'Facets.Browse.View'
	,	'Facets.BrowseCategories.View'
	,	'Facets.Helper'
	,	'Facets.Model'
	,	'Categories'
	,	'AjaxRequestsKiller'
	,	'Profile.Model'

	,	'underscore'
	,	'Backbone'
	]
,	function (
		BrowseView
	,	BrowseCategoriesView
	,	Helper
	,	Model
	,	Categories
	,	AjaxRequestsKiller
	,	ProfileModel

	,	_
	,	Backbone
	)
{
	'use strict';


	// @class Facets.Router Mixes the Translator, Model and View @extends Backbone.Router
	return Backbone.Router.extend({

		initialize: function (application)
		{
			this.application = application;
			this.translatorConfig = application.translatorConfig;
		}

		//@method getFacetsAliasesMapping @param {Array<Object>} corrections
	,	getFacetsAliasesMapping: function (corrections)
		{
			var facets_aliases_mapping = {};

			_.each(corrections, function(correction)
			{
				facets_aliases_mapping[correction.usedAlias] = {
					url: correction.url
				,	type: correction.type ? correction.type : ''
				};
			});

			return facets_aliases_mapping;
		}

		//@method unaliasUrl @param {String} aliased_url @param {Array<Object>} corrections
	,	unaliasUrl: function (aliased_url, corrections)
		{
			if (aliased_url.indexOf('http://') === 0 || aliased_url.indexOf('https://') === 0)
			{
				throw new Error('URL must be relative');
			}

			aliased_url = (aliased_url[0] === '/') ? aliased_url.substr(1) : aliased_url;

			var facet_delimiters = this.translatorConfig.facetDelimiters
			,	facets_n_options = aliased_url.split(facet_delimiters.betweenFacetsAndOptions)
			,	facets = (facets_n_options[0] && facets_n_options[0] !== this.translatorConfig.fallbackUrl) ? facets_n_options[0] : ''
			,	options = facets_n_options[1] || ''
			,	facet_tokens = facets.split(new RegExp('[\\'+ facet_delimiters.betweenDifferentFacets +'\\'+ facet_delimiters.betweenFacetNameAndValue +']+', 'ig'))
			,	translated_facets = ''
			,	facets_aliases_mapping = this.getFacetsAliasesMapping(corrections);

			while (facet_tokens.length > 0)
			{
				var facet_name = facet_tokens.shift()
				,	facet_value = facet_tokens.shift()
				,	facet_name_correction = facets_aliases_mapping[facet_name]
				,	facet_value_correction =  facets_aliases_mapping[facet_value]

					// Just double check if unalias is correct... not undefined and unalias type matches with the url component being analyzed!
				,	facet_name_correction_url = facet_name_correction && facet_name_correction.type.toUpperCase() === 'FACET' ? facet_name_correction.url : null
				,	facet_value_correction_url = facet_value_correction && facet_value_correction.type.toUpperCase() === 'FACET_VALUE' ? facet_value_correction.url : null;
						
				if (facet_name_correction_url && facet_value_correction_url)
				{
					translated_facets += facet_name_correction_url + facet_delimiters.betweenFacetNameAndValue + facet_value_correction_url;
				}
				else if (facet_name_correction_url && !facet_value_correction_url)
				{
					translated_facets += facet_name_correction_url + facet_delimiters.betweenFacetNameAndValue + facet_value;
				}
				else if (!facet_name_correction_url && facet_value_correction_url)
				{
					translated_facets += facet_name + facet_delimiters.betweenFacetNameAndValue + facet_value_correction_url;
				}
				else
				{
					translated_facets += facet_name + facet_delimiters.betweenFacetNameAndValue + facet_value;
				}

				if (facet_tokens.length > 0)
				{
					translated_facets += facet_delimiters.betweenDifferentFacets;
				}
			}

			var unaliased_url = translated_facets;

			if (options)
			{
				unaliased_url += facet_delimiters.betweenFacetsAndOptions + options;
			}

			return unaliased_url;
		}

		// @method facetLoading This handles all the routes of the item list
	,	facetLoading: function ()
		{
			// Creates a translator
			var translator = Helper.parseUrl(Backbone.history.fragment, this.translatorConfig)
			,	url = Backbone.history.fragment;

			//if prices aren't to be shown we take out price related facet
			//and clean up the url
			if (ProfileModel.getInstance().hidePrices())
			{
				translator = translator.cloneWithoutFacetId('onlinecustomerprice');
				Backbone.history.navigate(translator.getUrl());
			}

			// Should we show the category Page?
			if (this.isCategoryPage(translator))
			{
				return this.showCategoryPage(translator);
			}

			// Model
			var model = new Model()
			// and View
			,	view = new BrowseView({
					translator: translator
				,	translatorConfig: this.translatorConfig
				,	application: this.application
				,	model: model
				})
			,	self = this;

			model.fetch({
				data: translator.getApiParams()
			,	killerId: AjaxRequestsKiller.getKillerId()
			,	pageGeneratorPreload: true }).then(function (data) {

				if (data.corrections && data.corrections.length > 0)
				{
					var unaliased_url = self.unaliasUrl(url, data.corrections);

					if (SC.ENVIRONMENT.jsEnvironment === 'server')
					{
						nsglobal.statusCode = 301;
						nsglobal.location = '/' + unaliased_url;
					}
					else
					{
						Backbone.history.navigate('#' + unaliased_url, {trigger: true});
					}
				}
				else
				{
					translator.setLabelsFromFacets(model.get('facets') || []);
					view.showContent();
				}
			});
		}

		// @method isCategoryPage
		// Returs true if this is the top category page,
		// override it if your implementation difers from this behavior
	,	isCategoryPage: function(translator)
		{
			var current_facets = translator.getAllFacets()
			,	categories = Categories.getBranchLineFromPath(translator.getFacetValue('category'));

			return (current_facets.length === 1 && current_facets[0].id === 'category' && categories.length === 1 && _.size(categories[0].categories));
		}

		// @method showCategoryPage @param {Facets.Translator} translator
	,	showCategoryPage: function(translator)
		{
			var view = new BrowseCategoriesView({
				translator: translator
			,	translatorConfig: this.translatorConfig
			,	application: this.application
			});

			view.showContent();
		}
	});
});
