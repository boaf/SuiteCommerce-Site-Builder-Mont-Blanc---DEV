/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.CategoryCell.View'
,	[			
		'facets_category_cell.tpl'

	,	'Backbone'
	]
,	function(
		facets_category_cell_tpl

	,	Backbone	
	)
{
	'use strict';

	// @class Facets.CategoryCell.View @extends Backbone.View
	return Backbone.View.extend({
		
		// @method getContext @return Facets.CategoryCell.View.Context
		getContext: function ()
		{
			return {
				// @property {String} label
				label: this.model.label

				// @property {String} name
			,	url: this.model.url

				// @property {String} image
			,	image: this.model.image				
			};
		}
	});
});