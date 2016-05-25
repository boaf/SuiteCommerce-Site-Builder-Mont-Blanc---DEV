/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order 
define('OrderLine.Model'
,	[	'ItemDetails.Model'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		ItemDetailsModel
	,	_
	,	Backbone
	)
{
	'use strict';

	// @class OrderLine.Model Model for showing information about a line in the order @extends Backbone.Model
	return Backbone.Model.extend({

		initialize: function (attributes)
		{
			this.on('change:item', function (model, item)
			{
				model.set('minimumquantity', item.minimumquantity);

				model.set('item', new ItemDetailsModel(_.extend(item, {
					line_id: model.get('internalid')
				,	options: model.get('options')
				,	quantity: model.get('quantity')
				,	minimumquantity: model.get('minimumquantity')
				})), {silent: true});
			});

			this.trigger('change:item', this, attributes && attributes.item || {});

			this.on('error', function (model, jqXhr)
			{
				var result = JSON.parse(jqXhr.responseText)
				,	error_details = result.errorDetails;

				if (error_details && error_details.status === 'LINE_ROLLBACK')
				{
					model.set('internalid', error_details.newLineId);
				}
			});

			// Extend the model with Backbone.Validation.mixin to validate it without a View
			_.extend(this, Backbone.Validation.mixin);
		}

	,	validation:
		{
			quantity: { fn: function()
				{
					if (this.get('quantity') < this.get('item').get('_minimumQuantity', true))
					{
						return _('The minimum quantity for this item is $(0).').translate(this.get('item').get('_minimumQuantity', true));
					}
				}
			}
		}

	,	toJSON: function ()
		{
			var options = this.attributes.options;

			// Custom attributes include the id and value as part of the array not the format expected in service
			if (options instanceof Array)
			{
				var newOptions = {};

				_.each(options, function (e)
				{
					newOptions[e.id.toLowerCase()] = e.value;
				});

				options = newOptions;
			}

			var matrix_parent_id = this.attributes.item.get('_matrixParent') && this.attributes.item.get('_matrixParent').get('_id');

			return {
				item: {
					internalid: matrix_parent_id ? matrix_parent_id : this.attributes.item.get('_id')
				}
			,	quantity: this.attributes.quantity
			,	internalid: this.attributes.internalid
			,	options: options
			,	splitquantity: parseInt(this.attributes.splitquantity, 10)
			,	shipaddress: this.attributes.shipaddress
			,	shipmethod: this.attributes.shipmethod
			};
		}

		// @method getPrice @return {price:Number,price_formatted:String,compare_price:Number,compare_price_formatted:String}
	,	getPrice: function ()
		{
			var item_price = this.attributes.item.getPrice();

			return {
				price: this.get('rate')
			,	price_formatted: this.get('rate_formatted')
			,	compare_price: item_price.compare_price
			,	compare_price_formatted: item_price.compare_price_formatted
			};
		}
	});
});