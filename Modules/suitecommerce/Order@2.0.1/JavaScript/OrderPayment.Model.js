/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderPayment.Model'
,	[	'CreditCardUtils'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		CreditCardUtils
	,	Backbone
	,	_)
{
	'use strict';

	// @class OrderPayment.Model Payment Model @extends Backbone.Model
	return Backbone.Model.extend({

		// @method getFormattedPaymentmethod
		getFormattedPaymentmethod: function ()
		{
			return this.get('paymentmethod');
		}

		// @method getPaymentType @param {String} ccnumber @param {Array} payment_types @return {String}
	,	getPaymentType: function(ccnumber, payment_types)
		{
			var type = CreditCardUtils.getType(ccnumber, payment_types);
			if (type)
			{
				return type;
			} else {
				throw new Error(_('Credit card type not configured').translate());
			}
		}

		// @method addManualFormat @param {Object} data @param {Array} payment_types 
	,	addManualFormat: function (data, payment_types)
		{
			data.paymentmethod = this.getPaymentType(data.ccnumber, payment_types);
			this.set(data);
		}

		// @method addRawFormat @param {Object} options @param {Array} payment_types 
	,	addRawFormat: function (options, payment_types)
		{
			var data = CreditCardUtils.parseTrack(options.raw);
			data.paymentmethod = this.getPaymentType(data.ccnumber, payment_types);
			data.payment = options.payment;
			data.signature = options.signature;
			this.set(data);
		}
	});
});
