/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Order
define('Order.Model'
,	[	'OrderLine.Collection'
	,	'OrderShipmethod.Collection'
	,	'Address.Collection'
	,	'CreditCard.Collection'
	,	'OrderPaymentmethod.Collection'

	,	'underscore'
	,	'Backbone'
	]
,	function (
		OrderLinesCollection
	,	OrderShipmethodCollection
	,	AddressesCollection
	,	CreditCardsCollection
	,	OrderPaymentmethodCollection

	,	_
	,	Backbone
	)
{
	'use strict';

	// @class Order.Model Model for showing information about an order @extends Backbone.Model
	return Backbone.Model.extend({

		linesCollection: OrderLinesCollection

	,	defaults: {
			//@property {Address.Collection} addresses
			'addresses': null
			//@property {Address.Collection} shipmethods
		,	'shipmethods': null
		}

	,	initialize: function (attributes)
		{
			this.on('change:lines', function (model, lines)
			{
				model.set('lines', new model.linesCollection(lines), {silent: true});
			});
			this.trigger('change:lines', this, attributes && attributes.lines || []);

			this.on('change:shipmethods', function (model, shipmethods)
			{
				model.set('shipmethods', new OrderShipmethodCollection(shipmethods), {silent: true});
			});
			this.trigger('change:shipmethods', this, attributes && attributes.shipmethods || []);

			this.on('change:multishipmethods', function (model, multishipmethods)
			{
				if (multishipmethods)
				{
					_.each(_.keys(multishipmethods), function(address_id) {
						multishipmethods[address_id] = new OrderShipmethodCollection(multishipmethods[address_id], {silent: true});
					});
				}

				model.set('multishipmethods', multishipmethods, {silent: true});
			});
			this.trigger('change:multishipmethods', this, attributes && attributes.multishipmethods || []);

			this.on('change:addresses', function (model, addresses)
			{
				model.set('addresses', new AddressesCollection(addresses), {silent: true});
			});
			this.trigger('change:addresses', this, attributes && attributes.addresses || []);

			this.on('change:paymentmethods', function (model, paymentmethods)
			{
				model.set('paymentmethods', new OrderPaymentmethodCollection(paymentmethods), {silent: true});
			});
			this.trigger('change:paymentmethods', this, attributes && attributes.paymentmethods || []);
		}
	});
});
