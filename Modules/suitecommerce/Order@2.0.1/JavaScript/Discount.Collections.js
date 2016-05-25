/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order
define('Discount.Collections'
,	[	'Discount.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	// @class Discount.Collection @extends Backbone.Collection
	var Discounts = Backbone.Collection.extend({
		url: 'services/Discount.Service.ss'
		// @property {Discount.Model} model
	,	model: Model
	});

	// @class DiscountReasons.Collection @extends Backbone.Collection
	var DiscountReasons = Backbone.Collection.extend({
		url: 'services/DiscountReason.Service.ss'
		// @property {Discount.Model} model
	,	model: Model
	});

	return {
		Discounts: Discounts
	,	DiscountReasons: DiscountReasons
	};
});