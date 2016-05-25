/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderShipmethod.Collection'
,	[	'OrderShipmethod.Model'
	,	'Backbone'
	]
,	function (
		OrderShipmethodModel
	,	Backbone
	)
{
	'use strict';

	// @class OrderShipmethod.Collection Shipping methods collection @extends Backbone.Collection
	return Backbone.Collection.extend({
		// @property {OrderShipmethod.Model} model
		model: OrderShipmethodModel

		// @property {String} comparator
	,	comparator: 'name'
	});
});