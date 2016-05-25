/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define(
		'Quote.Model'
,	[	
		'OrderLine.Collection'
		
	,	'Backbone'
	]
,	function (
		OrderLineCollection

	,	Backbone
	)
{
	'use strict';

	//@class Quote.Model 
	//@extends Backbone.Model
	return Backbone.Model.extend({

		//@property {String} urlRoot
		urlRoot: 'services/Quote.Service.ss'

		//@method initialize
		//@param {Object} attributes
	,   initialize: function (attributes)
		{
			// lineItems
			this.on('change:lineItems', function (model, lineItems)
			{
				model.set('lineItems', new OrderLineCollection(lineItems), {silent: true});
			});

			this.trigger('change:lineItems', this, attributes && attributes.lineItems || []);
		}
	});
});