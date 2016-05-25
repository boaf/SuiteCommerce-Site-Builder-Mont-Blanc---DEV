/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderReturnauthorization.Model'
,	[	'OrderLine.Collection'
	,	'Backbone'
	]
,	function (
		OrderLinesCollection
	,	Backbone
	)
{
	'use strict';

	// @class OrderReturnauthorization.Model Return Authorizations model @extends Backbone.Model
	return Backbone.Model.extend({
		initialize: function (attributes)
		{
			this.on('change:lines', function (model, lines)
			{
				model.set('lines', new OrderLinesCollection(lines), {silent: true});
			});
			this.trigger('change:lines', this, attributes && attributes.lines || []);
		}
	});


});