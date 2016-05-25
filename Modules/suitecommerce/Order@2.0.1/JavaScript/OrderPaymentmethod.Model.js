/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderPaymentmethod.Model', ['Backbone'], function(Backbone)
{
	'use strict';

	// @class OrderPaymentmethod.Model Payment method Model @extends Backbone.Model
	return Backbone.Model.extend({
		// @method getFormattedPaymentmethod 
		getFormattedPaymentmethod: function ()
		{
			return this.get('type');
		}
	});
});
