/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module LiveOrder
// @class LiveOrder.Model Model for showing information about an open order. It is a singleton so you can obtain the instance fro anywhere by calling ```LiveOrderModel.getInstance()```
// @extends Order.Model
define('LiveOrder.Model'
,	[	'Order.Model'
	,	'OrderLine.Model'
	,	'OrderLine.Collection'
	,	'Session'
	,	'Tracker'
	,	'Singleton'
	,	'Profile.Model'
	,	'AjaxRequestsKiller'
	,	'SC.Configuration'
	,	'Utils'
	,	'underscore'
	,	'jQuery'
	,	'OrderHistory.Model'
	]
,	function (
		OrderModel
	,	OrderLineModel
	,	OrderLineCollection
	,	Session
	,	Tracker
	,	Singleton
	,	ProfileModel
	,	AjaxRequestsKiller
	,	Configuration
	,	Utils
	,	_
	,	jQuery
	,	OrderHistoryModel
	)
{
	'use strict';

	var LiveOrderLine = {};

	LiveOrderLine.Model = OrderLineModel.extend({
		urlRoot: _.getAbsoluteUrl('services/LiveOrder.Line.Service.ss')
	});

	LiveOrderLine.Collection = OrderLineCollection.extend({
		model: LiveOrderLine.Model
	,	url: _.getAbsoluteUrl('services/LiveOrder.Line.Service.ss')
	});


	var ClassProperties = _.extend({

		// @method loadCart @return {jQuery.Deferred} @static
		loadCart: function()
		{
			// if the Page Generator is on, do not fetch the cart. Instead, return an empty solved promise
			if (SC.isPageGenerator && SC.isPageGenerator())
			{
				return jQuery.Deferred().resolve();
			}

			var cart_instance = this.getInstance();

			if (cart_instance.cartLoad)
			{
				if (cart_instance.isLoading)
				{
					cart_instance.isLoading = false;
				}
				return cart_instance.cartLoad;
			}
			else
			{
				cart_instance.cartLoad = jQuery.Deferred();

				ProfileModel.getPromise().done(function ()
				{
					cart_instance.fetch()
						.done(function ()
						{
							cart_instance.cartLoad.resolve.apply(this, arguments);
						})
						.fail(function ()
						{
							cart_instance.cartLoad.reject.apply(this, arguments);
						})
						.always(function ()
						{
							if (cart_instance.isLoading)
							{
								cart_instance.isLoading = false;
							}
						});
				});
			}

			return cart_instance.cartLoad;
		}

	}, Singleton);


	var LiveOrderModel = OrderModel.extend({

		urlRoot: _.getAbsoluteUrl('services/LiveOrder.Service.ss')

	,	linesCollection: LiveOrderLine.Collection

	,	validation: {
			zip: { fn: _.validateZipCode }
		}

		// @method url redefine url to avoid possible cache problems from browser
	,	url: function()
		{
			var base_url = OrderModel.prototype.url.apply(this, arguments);
			return base_url + (base_url.indexOf('?') >= 0 ? '&' : '?') + 't=' + new Date().getTime();
		}

	,	initialize: function (attributes)
		{
			// call the initialize of the parent object, equivalent to super()
			OrderModel.prototype.initialize.apply(this, arguments);

			this.set('internalid', 'cart');

			this.on('change:confirmation', function (model, confirmation)
			{
				model.set('confirmation', new OrderHistoryModel(confirmation), {silent: true});
			});
			this.trigger('change:confirmation', this, attributes && attributes.confirmation || {});

			// Some actions in the live order may change the url of the checkout so to be sure we re send all the touchpoints
			this.on('change:touchpoints', function (model, touchpoints)
			{
				Session.set('touchpoints', touchpoints);
			});
		}

		// @method getLatestAddition @return {OrderLine.Model}
	,	getLatestAddition: function ()
		{
			var model = null;

			if (this.get('latest_addition'))
			{
				model = this.get('lines').get(this.get('latest_addition'));
			}

			if (!model && this.get('lines').length)
			{
				model = this.get('lines').at(0);
			}

			return model;
		}

		// @method wrapOptionsSuccess @param {Object} options @return {Object}
	,	wrapOptionsSuccess: function (options)
		{
			var self = this;
			// if passing a success function we need to wrap it
			options = options || {};
			options.success = _.wrap(options.success || jQuery.noop, function (fn, item_model, result)
			{
				// This method is called in 2 ways by doing a sync and by doing a save
				// if its a save result will be the raw object
				var attributes = result;
				// If its a sync result will be a string
				if (_.isString(result))
				{
					attributes = item_model;
				}

				// Tho this should be a restful api, the live-order-line returns the full live-order back (lines and summary are interconnected)
				self.set(attributes);

				// Calls the original success function
				fn.apply(self, _.toArray(arguments).slice(1));

				var line = self.get('lines').get(self.get('latest_addition'))
				,	item = line && line.get('item');

				if (item)
				{
					Tracker.getInstance().trackAddToCart(item);
				}
			});

			options.killerId = AjaxRequestsKiller.getKillerId();

			return options;
		}

		// @method addItem @param {ItemDetails.Model} item @param {Object} options @return {jQuery.Deferred}
	,	addItem: function (item, options)
		{
			// Calls the addItems funtion passing the item as an array of 1 item
			return this.addItems([item], options);
		}

		// @method addItem @param {Array<ItemDetails.Model>} item @param {Object} options @return {jQuery.Deferred}
	,	addItems: function (items, options)
		{
			// Obtains the Collection constructor
			var LinesCollection = this.linesCollection;

			// Prepares the input for the new collection
			var lines = _.map(items, function (item)
			{
				var line_options = item.getItemOptionsForCart();

				return {
					item: {
						internalid: item.get('internalid')
					}
				,	quantity: item.get('quantity')
				,	options: _.values(line_options).length ? line_options : null
				};
			});

			// Creates the Collection
			var self = this
			,	lines_collection = new LinesCollection(lines);

			// Add the dummy line for optimistic add to cart - when the request come back with the real data the collection will be reseted.
			if (this.optimistic)
			{
				var price = this.optimistic.item.getPrice()
				,	dummy_line = new OrderLineModel({
						quantity: this.optimistic.quantity
					,	item: this.optimistic.item.attributes
					,	rate_formatted: price.price_formatted
					,	rate: price.price
					});

				dummy_line.get('item').itemOptions = this.optimistic.item.itemOptions;

				// search the item in the cart to merge the quantities
				if (LiveOrderModel.loadCart().state() === 'resolved')
				{
					var itemCart = Utils.findItemInCart(self.optimistic.item, this);

					if (itemCart)
					{
						itemCart.set('quantity', itemCart.get('quantity') + parseInt(this.optimistic.quantity, 10));
						dummy_line = itemCart;
					}
					else
					{
						this.get('lines').add(dummy_line);
					}
				}
				else
				{
					dummy_line.set('quantity', 0);
				}

				this.optimisticLine = dummy_line;
				this.trigger('change');
			}

			// Saves it
			var promise = lines_collection.sync('create', lines_collection, this.wrapOptionsSuccess(options));
			if (promise)
			{
				promise.fail(function()
				{
					// if any error we must revert the optimistic changes.
					if (self.optimistic)
					{
						if (LiveOrderModel.loadCart().state() === 'resolved')
						{
							var itemCart = Utils.findItemInCart(self.optimistic.item, self);

							if (itemCart)
							{
								itemCart.set('quantity', itemCart.get('quantity') - parseInt(self.optimistic.quantity, 10));

								if (!itemCart.get('quantity'))
								{
									self.get('lines').remove(itemCart);
								}
							}

							self.set('latest_addition', self.get('latest_addition_original'));
							self.trigger('change');
						}
					}
				});
			}

			return promise;
		}

		// @method updateItem @param {String} line_id @param {ItemDetails.Model} item @param {Object} options @return {jQuery.Deferred}
	,	updateItem: function (line_id, item, options)
		{
			var line = this.get('lines').get(line_id)
			,	line_options = item.getItemOptionsForCart();

			line.set({
				quantity: item.get('quantity')
			,	options: _.values(line_options).length ? line_options : null
			});

			line.ongoingPromise = line.save({}, this.wrapOptionsSuccess(options));

			return line.ongoingPromise;
		}

		// @method updateLine @param {OrderLine.Model} line @param {Object} options @return {jQuery.Deferred}
	,	updateLine: function (line, options)
		{
			// Makes sure the quantity is a number
			line.set('quantity', parseInt(line.get('quantity'), 10));

			line.ongoingPromise = line.save({}, this.wrapOptionsSuccess(options));

			return line.ongoingPromise;
		}

		// @method removeLine @param {OrderLine.Model} line @param {Object} options @return {jQuery.Deferred}
	,	removeLine: function (line, options)
		{
			line.ongoingPromise = line.destroy(this.wrapOptionsSuccess(options));

			return line.ongoingPromise;
		}

		// @method submit invoked when the user place/submit the order @return {jQuery.Deferred}
	,	submit: function ()
		{
			this.set('internalid', null);

			var self = this
			,	creditcard = this.get('paymentmethods').findWhere({type: 'creditcard'})
			,	paypal = this.get('paymentmethods').findWhere({type: 'paypal'});

			if (creditcard && !creditcard.get('creditcard'))
			{
				this.get('paymentmethods').remove(creditcard);
			}

			if (paypal && !paypal.get('complete'))
			{
				this.get('paymentmethods').remove(paypal);
			}

			if (!this.shippingAddressIsRequired())
			{
				this.unset('shipaddress', {silent: true});
				this.set('sameAs', false, {silent: true});
			}

			return this.save().fail(function ()
			{
				self.set('internalid', 'cart');
			});
		}

		//@method save Override default save method to just return a resolved promise when the cart have already been saved.
		//@return {jQuery.Deferred}
	,	save: function ()
		{
			if (this.get('confirmation') && this.get('confirmation').get('internalid'))
			{
				return jQuery.Deferred().resolve();
			}

			return OrderModel.prototype.save.apply(this, arguments);
		}

		// @method getTotalItemCount
		// @return {Number}
	,	getTotalItemCount: function ()
		{
			return _.reduce(this.get('lines').pluck('quantity'), function (memo, quantity)
			{
				return memo + (parseFloat(quantity) || 1);
			}, 0);
		}

	,	parse: function (response, options)
		{
			if (options && !options.parse)
			{
				return;
			}

			return response;
		}

		// @method getUnsetLines @returns {Array<OrderLine.Model>} the order's lines that have not set its addresses to Multi Ship To yet
	,	getUnsetLines: function ()
		{
			return this.get('lines').filter(function (line) { return !line.get('shipaddress') && line.get('item').get('_isfulfillable'); });
		}

		// @method getNonShippableLines @returns {Array<OrderLine.Model>} the order's line that are NON Shippable
	,	getNonShippableLines: function ()
		{
			return this.get('lines').filter(function (line) { return !line.get('item').get('_isfulfillable'); });
		}

		// @method getSetLines @returns {Array<OrderLine.Model>} the list of lines already set its shipping address
	,	getSetLines: function ()
		{
			return this.get('lines').filter(function (line) { return line.get('shipaddress') && line.get('item').get('_isfulfillable'); });
		}

		// @method getShippableLines @returns {Array<OrderLine.Model>} the order's line that are shippable without taking into account if their have or not set a shipaddress
	,	getShippableLines: function ()
		{
			return this.get('lines').filter(function (line)
			{
				return line.get('item').get('_isfulfillable');
			});
		}
		// @method getItemsIds @returns {Array<String>} an array containing the cart items ids @return {Array<String>}
	,	getItemsIds: function ()
		{
			return this.get('lines').map(function (line)
			{
				return line.get('item').get('internalid');
			});
		}

		//@method getIfThereAreDeliverableItems Determines if at least one item is shippable @return {Boolean}
	,	getIfThereAreDeliverableItems: function ()
		{
			return this.get('lines').length !== this.getNonShippableLines().length;
		}

		// @method shippingAddressIsRequired Checks if the shipping address is require and if all items in the order are nonshippable. @return {Boolean}
	,	shippingAddressIsRequired: function ()
		{
			return this.getIfThereAreDeliverableItems() && Configuration.get('siteSettings.requireshippinginformation', 'F') === 'T';
		}

	}, ClassProperties);

	return LiveOrderModel;
});
