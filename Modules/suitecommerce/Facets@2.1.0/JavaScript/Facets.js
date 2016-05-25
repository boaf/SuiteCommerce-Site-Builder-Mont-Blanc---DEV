/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets AKA Item List. @class Facets This is the index, routes in the router are assigned here @extends ApplicationModule 
define(
	'Facets'
,	[	'Facets.Translator'
	,	'Facets.Model'
	,	'Facets.Router'
	,	'Categories'

	,	'underscore'
	]
,	function (
		Translator
	,	Model
	,	Router
	,	Categories

	,	_
	)
{
	'use strict';

	function prepareRouter (application, router)
	{
		// we are constructing this regexp like:
		// /^\b(toplevelcategory1|toplevelcategory2|facetname1|facetname2|defaulturl)\b\/(.*?)$/
		// and adding it as a route

		// Get the facets that are in the sitesettings but not in the config.
		// These facets will get a default config (max, behavior, etc.) - Facets.Translator
		// Include facet aliases to be conisdered as a possible route
		var facets_data = application.getConfig('siteSettings.facetfield')
		,	facets_to_include = [];		

		_.each(facets_data, function(facet) 
		{			
			facets_to_include.push(facet.facetfieldid);

			// If the facet has an urlcomponent defined, then add it to the possible values list.
			facet.urlcomponent && facets_to_include.push(facet.urlcomponent);

			// Finally, include URL Component Aliases...
			_.each(facet.urlcomponentaliases, function(facet_alias) 
			{
				facets_to_include.push(facet_alias.urlcomponent);
			});
		});

		facets_to_include = _.union(facets_to_include, _.pluck(application.getConfig('facets'), 'id'));
		facets_to_include = _.uniq(facets_to_include);

		// Here we generate an array with:
		// * The default url
		// * The Names of the facets that are in the siteSettings.facetfield config
		// * And the url of the top level categories
		var components = _.compact(_.union(
			[application.translatorConfig.fallbackUrl]
		,	facets_to_include || []
		,	Categories.getTopLevelCategoriesUrlComponent() || []
		));

		// Generate the regexp and adds it to the instance of the router
		var facet_regex = '^\\b(' + components.join('|') + ')\\b(.*?)$';

		router.route(new RegExp(facet_regex), 'facetLoading');
	}

	function setTranslatorConfig (application)
	{
		// Formats a configuration object in the way the translator is expecting it
		application.translatorConfig = {
			fallbackUrl: application.getConfig('defaultSearchUrl')
		,	defaultShow: _.find(application.getConfig('resultsPerPage'), function (show) { return show.isDefault; }).items || application.getConfig('resultsPerPage')[0].items
		,	defaultOrder: _.find(application.getConfig('sortOptions'), function (sort) { return sort.isDefault; }).id || application.getConfig('sortOptions')[0].id
		,	defaultDisplay: _.find(application.getConfig('itemsDisplayOptions'), function (display) { return display.isDefault; }).id || application.getConfig('itemsDisplayOptions')[0].id
		,	facets: application.getConfig('facets')
		,	facetDelimiters: application.getConfig('facetDelimiters')
		,	facetsSeoLimits: application.getConfig('facetsSeoLimits')
		};
	}

	return {
		Translator: Translator
	,	Model:  Model
	,	Router: Router
	,	setTranslatorConfig: setTranslatorConfig
	,	prepareRouter: prepareRouter
	,	mountToApp: function (application)
		{
			setTranslatorConfig(application);

			var routerInstance = new Router(application);

			prepareRouter(application, routerInstance);

			// Wires some config to the model
			Model.mountToApp(application);
			
			return routerInstance;
		}
	};
});
