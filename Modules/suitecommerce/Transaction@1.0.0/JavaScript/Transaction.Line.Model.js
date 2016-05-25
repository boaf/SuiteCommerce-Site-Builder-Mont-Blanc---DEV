/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Transaction
define('Transaction.Line.Model'
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

	// @class Transaction.Line.Model Model for showing information about a line in the order @extends Backbone.Model
	return Backbone.Model.extend({

		//@method initialize Override default initialize method to assure that the item property is always of type
		//ItemDetails.Model
		//@param {Transaction.Model.Get.Line} attributes
		//@return {Void}
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
		}

		//@method toJSON Override default method to send only require data to the back-end
		//@return {Transaction.Line.Model.JSON}
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

			//@class Transaction.Line.Model.JSON Class used to send a transaction line representation to the back-end
			//without sending all the heavy weight JSON that is not totally needed by the back-end
			return {
				//@property {Transaction.Line.Model.JSON.Item} item
				//@class Transaction.Line.Model.JSON.Item
				item: {
					//@property {String} internalid
					internalid: this.attributes.item.get('_id')
					//@property {String} type
				,	type: this.attributes.item.get('itemtype')
				}
				//@class Transaction.Line.Model.JSON
				//@property {Number} quantity
			,	quantity: this.attributes.quantity
				//@property {String} internalid
			,	internalid: this.attributes.internalid
				//@property {Object} options
			,	options: options
				//@property {Number?} splitquantity
			,	splitquantity: parseInt(this.attributes.splitquantity, 10)
				//@property {Number} shipaddress
			,	shipaddress: this.attributes.shipaddress
				//@property {Number} shipmethod
			,	shipmethod: this.attributes.shipmethod
			};
			//@class Transaction.Line.Model
		}
	});
});
