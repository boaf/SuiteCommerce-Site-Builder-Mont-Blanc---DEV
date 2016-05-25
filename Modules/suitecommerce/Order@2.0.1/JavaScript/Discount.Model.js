/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order
define('Discount.Model', ['ItemDetails.Model'], function (ItemDetailsModel)
{
	'use strict';
	// @class Discount.Model @extends ItemDetails.Model
	return ItemDetailsModel.extend({
		validation: {
			rate: {
				required: function(value, attr, model) {
					return model.id === SC.ENVIRONMENT.defaultDiscountId;
				}
			,	fn: function(value, attr, model) {
					var parsedRate = Math.abs(parseFloat(model.rate));
					return !parsedRate || parsedRate < 0.01;
				}
			}
		,	itemid: { 
				required: function(value, attr, model) {
					return !!model.rate;
				}
			}
		,	id: {
				required: false
			}
		}

		// @method isModelValid @return {Boolean}
	,	isModelValid: function ()
		{
			var valid = true
			,	model = {
				id: this.get('id')
			,	rate: this.get('rate')
			,	itemid: this.get('itemid')
			};
			if (this.validation.rate.required(null, null, model))
			{
				valid = valid && !this.validation.rate.fn(null, null, model);
			}

			if (this.validation.itemid.required(null, null, model))
			{
				valid = valid && model.itemid;
			}

			return valid;
		}
	,	set: function (attributes, val, options)
		{
			if (typeof attributes !== 'object')
			{
				var key = attributes;
				attributes = {};
				attributes[key] = val;
			}

			if (attributes.rate)
			{
				var rate = attributes.rate;

				if(rate[rate.length - 1] === '%')
				{
					if (!rate.match(/^-/))
					{
						rate = attributes.rate = '-' + rate;
					}

					attributes.isPercentage = true;
					attributes.appliedRate = (1 + parseFloat(rate.replace('%', '')) / 100) ;
				}
				else 
				{
					if (!rate.match || !rate.match(/^-/))
					{
						rate = attributes.rate = '-' + rate;
					}
					attributes.isPercentage = false;
					attributes.appliedRate = -parseFloat(rate).toFixed(2);
				}
			}
			ItemDetailsModel.prototype.set.call(this, attributes, val, options);
		}

		// @method getPrice @param {Number} originalAmount @return {Number}
	,	getPrice: function (originalAmount)
		{
			var totalPrice = 0;
			if (this.get('isPercentage'))
			{
				totalPrice = originalAmount * this.get('appliedRate');
			}
			else
			{
				totalPrice = originalAmount - this.get('appliedRate');
			}
			return totalPrice;
		}

		// @method getDisplayRate @param {Number} originalAmount @return {String}
	,	getDisplayRate: function (originalAmount)
		{
			if (this.get('isPercentage'))
			{
				return SC.Utils.formatCurrency(-(originalAmount - originalAmount * this.get('appliedRate')));
			}
			else
			{
				return SC.Utils.formatCurrency(-this.get('appliedRate'));
			}
		}
	});
});