/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define('Facets.Model'
,	[	'Backbone.CachedModel'
	,	'ItemDetails.Collection'
	,	'Session'
	,	'Profile.Model'

	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCachedModel
	,	ItemDetailsCollection
	,	Session
	,	ProfileModel

	,	_
	)
{
	'use strict';

	var original_fetch = BackboneCachedModel.prototype.fetch;

	// @class Facets.Model @extends Backbone.CachedModel
	// Connects to the search api to get all the items and the facets
	// A Model Contains a Collection of items and the list of facet groups with its values
	return BackboneCachedModel.extend({

		url: function()
		{
			var profile = ProfileModel.getInstance()
			,	url = _.addParamsToUrl(
				profile.getSearchApiUrl()
			,	_.extend(
					{}
				,	this.searchApiMasterOptions
				,	Session.getSearchApiParams()
				)
			,	profile.isAvoidingDoubleRedirect()
			);

			return url;
		}

	,	initialize: function ()
		{
			// Listen to the change event of the items and converts it to an ItemDetailsCollection
			this.on('change:items', function (model, items)
			{
				if (!(items instanceof ItemDetailsCollection))
				{
					// NOTE: Compact is used to filter null values from response
					model.set('items', new ItemDetailsCollection(_.compact(items)));
				}
			});
		}

		// @method fetch overrides fetch so we make sure that the cache is set to true, so we wrap it
	,	fetch: function (options)
		{
			options = options || {};

			options.cache = true;

			return original_fetch.apply(this, arguments);
		}
	}

,	{
		mountToApp: function (application)
		{
			// sets default options for the search api
			this.prototype.searchApiMasterOptions = application.getConfig('searchApiMasterOptions.Facets', {});
		}
	});
});
