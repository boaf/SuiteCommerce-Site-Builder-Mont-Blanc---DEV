/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* jshint -W053 */
// We HAVE to use "new String"
// So we (disable the warning)[https://groups.google.com/forum/#!msg/jshint/O-vDyhVJgq4/hgttl3ozZscJ]
/* global order,customer */
// @module LiveOrder
define(
	'LiveOrder.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'Profile.Model'
	,	'StoreItem.Model'
	,	'Utils'
	,	'underscore'
	]
,	function (
		SCModel
	,	Application
	,	Profile
	,	StoreItem
	,	Utils
	,	_
	)
{
	'use strict';

	// @class LiveOrder.Model Defines the model used by the LiveOrder.Service.ss service
	// Available methods allow fetching and updating Shopping Cart's data. Works against the
	// Shopping session order, this is, nlapiGetWebContainer().getShoppingSession().getOrder()
	// @extends SCModel
	return SCModel.extend({

		name: 'LiveOrder'

		// @method get @returns {LiveOrder.Model.Data}
	,	get: function ()
		{
			var order_fields = this.getFieldValues()
			,	result = {};

			// @class LiveOrder.Model.Data object containing high level shopping order object information. Serializeble to JSON and this is the object that the .ss service will serve and so it will poblate front end Model objects
			try
			{
				//@property {Array<LiveOrder.Model.Line>} lines
				result.lines = this.getLines(order_fields);
			}
			catch (e)
			{
				if (e.code === 'ERR_CHK_ITEM_NOT_FOUND')
				{
					return this.get();
				}
				else
				{
					throw e;
				}
			}

			order_fields = this.hidePaymentPageWhenNoBalance(order_fields);

			// @property {Array<String>} lines_sort sorted lines ids
			result.lines_sort = this.getLinesSort();

			// @property {String} latest_addition
			result.latest_addition = context.getSessionObject('latest_addition');

			// @property {LiveOrder.Model.PromoCode} promocode
			result.promocode = this.getPromoCode(order_fields);

			// @property {Boolean} ismultishipto
			result.ismultishipto = this.getIsMultiShipTo(order_fields);

			// Ship Methods
			if (result.ismultishipto)
			{
				// @property {Array<OrderShipMethod>} multishipmethods
				result.multishipmethods = this.getMultiShipMethods(result.lines);

				// These are set so it is compatible with non multiple shipping.
				result.shipmethods = [];
				result.shipmethod = null;

				//Correct promocodes
				if(result.promocode && result.promocode.code)
				{
					order.removePromotionCode(result.promocode.code);
					return this.get(); //Recursive, as it might impact the summary information
				}

			}
			else
			{
				// @property {Array<OrderShipMethod>} shipmethods
				result.shipmethods = this.getShipMethods(order_fields);
				// @property {OrderShipMethod} shipmethod
				result.shipmethod = order_fields.shipmethod ? order_fields.shipmethod.shipmethod : null;
			}

			// Addresses
			result.addresses = this.getAddresses(order_fields);
			result.billaddress = order_fields.billaddress ? order_fields.billaddress.internalid : null;
			result.shipaddress = !result.ismultishipto ? order_fields.shipaddress.internalid : null;

			// @property {Array<ShoppingSession.PaymentMethod>} paymentmethods Payments
			result.paymentmethods = this.getPaymentMethods(order_fields);

			// @property {Boolean} isPaypalComplete Paypal complete
			result.isPaypalComplete = context.getSessionObject('paypal_complete') === 'T';

			// @property {Array<String>} touchpoints Some actions in the live order may change the URL of the checkout so to be sure we re send all the touchpoints
			result.touchpoints = session.getSiteSettings(['touchpoints']).touchpoints;

			// @property {Boolean} agreetermcondition Terms And Conditions
			result.agreetermcondition = order_fields.agreetermcondition === 'T';

			// @property {OrderSummary} Summary
			result.summary = order_fields.summary;

			// @property {Object} options Transaction Body Field
			result.options = this.getTransactionBodyField();

			// @class LiveOrder.Model
			return result;
		}

		// @method update will update the commerce order object with given data. @param {LiveOrder.Model.Data} data
	,	update: function (data)
		{
			var current_order = this.get();

			// Only do this if it's capable of shipping multiple items.
			if (this.isMultiShippingEnabled)
			{
				if (this.isSecure && session.isLoggedIn2())
				{
					order.setEnableItemLineShipping(!!data.ismultishipto);
				}

				// Do the following only if multishipto is active (if the data received determine that MST is enabled and pass the MST Validation)
				if (data.ismultishipto)
				{
					order.removeShippingAddress();

					order.removeShippingMethod();

					this.removePromoCode(current_order);

					this.splitLines(data,current_order);

					this.setShippingAddressAndMethod(data, current_order);
				}
			}

			if (!this.isMultiShippingEnabled || !data.ismultishipto)
			{

				this.setShippingAddress(data, current_order);

				this.setShippingMethod(data, current_order);

				this.setPromoCode(data, current_order);
			}

			this.setBillingAddress(data, current_order);

			this.setPaymentMethods(data);

			this.setTermsAndConditions(data);

			this.setTransactionBodyField(data);

		}

		// @method submit will call order.submit() taking in account paypal payment
	,	submit: function ()
		{
			var payment_method = order.getPayment(['thankyouurl'])
			,	paypal_address = _.find(customer.getAddressBook(), function (address){ return !address.phone && address.isvalid === 'T'; })
			,	confirmation = order.submit();
			// We need remove the paypal's address because after order submit the address is invalid for the next time.
			this.removePaypalAddress(paypal_address);

			context.setSessionObject('paypal_complete', 'F');

			if (this.isMultiShippingEnabled)
			{
				order.setEnableItemLineShipping(false); // By default non order should be MST
			}

			if (confirmation.statuscode !== 'redirect')
			{
				confirmation = _.extend(this.getConfirmation(confirmation.internalid), confirmation);
			}

			return confirmation;
		}

		// @property {Boolean} isSecure
	,	isSecure: request.getURL().indexOf('https') === 0

		// @property {Boolean} isMultiShippingEnabled
	,	isMultiShippingEnabled: context.getSetting('FEATURE', 'MULTISHIPTO') === 'T' && SC.Configuration.isMultiShippingEnabled

		// @method addAddress @param {OrderAddress} address @param {Array<OrderAddress>} addresses @returns {String} the given address internal id
	,	addAddress: function (address, addresses)
		{
			if (!address)
			{
				return null;
			}

			addresses = addresses || {};

			if (!address.fullname)
			{
				address.fullname = address.attention ? address.attention : address.addressee;
			}

			if (!address.company)
			{
				address.company = address.attention ? address.addressee : null;
			}

			delete address.attention;
			delete address.addressee;

			if (!address.internalid)
			{
				address.internalid =	(address.country || '') + '-' +
										(address.state || '') + '-' +
										(address.city || '') + '-' +
										(address.zip || '') + '-' +
										(address.addr1 || '') + '-' +
										(address.addr2 || '') + '-' +
										(address.fullname || '') + '-' +
										address.company;

				address.internalid = address.internalid.replace(/\s/g, '-');
			}

			if (address.internalid !== '-------null')
			{
				addresses[address.internalid] = address;
			}

			return address.internalid;
		}

		// @method hidePaymentPageWhenNoBalance @param {Array<String>}order_fields
	,	hidePaymentPageWhenNoBalance: function (order_fields)
		{
			if (this.isSecure && session.isLoggedIn2() && order_fields.payment && session.getSiteSettings(['checkout']).checkout.hidepaymentpagewhennobalance === 'T' && order_fields.summary.total === 0)
			{
				order.removePayment();
				order_fields = this.getFieldValues();
			}
			return order_fields;
		}

		// @method redirectToPayPal calls order.proceedToCheckout() method passing information for paypal third party checkout provider
	,	redirectToPayPal: function ()
		{
			var touchpoints = session.getSiteSettings( ['touchpoints'] ).touchpoints
			,	continue_url = 'https://' + request.getHeader('Host') + touchpoints.checkout
			,	joint = ~continue_url.indexOf('?') ? '&' : '?';

			continue_url = continue_url + joint + 'paypal=DONE&fragment=' + request.getParameter('next_step');

			session.proceedToCheckout({
				cancelurl: touchpoints.viewcart
			,	continueurl: continue_url
			,	createorder: 'F'
			,	type: 'paypalexpress'
			,	shippingaddrfirst: 'T'
			,	showpurchaseorder: 'T'
			});
		}

		// @method redirectToPayPalExpress calls order.proceedToCheckout() method passing information for paypal-express third party checkout provider
	,	redirectToPayPalExpress: function ()
		{
			var touchpoints = session.getSiteSettings( ['touchpoints'] ).touchpoints
			,	continue_url = 'https://' + request.getHeader('Host') + touchpoints.checkout
			,	joint = ~continue_url.indexOf('?') ? '&' : '?';

			continue_url = continue_url + joint + 'paypal=DONE';

			session.proceedToCheckout({
				cancelurl: touchpoints.viewcart
			,	continueurl: continue_url
			,	createorder: 'F'
			,	type: 'paypalexpress'
			});
		}

		// @method getConfirmation
	,	getConfirmation: function (internalid)
		{
			var confirmation = {internalid: internalid};

			try
			{
				var record = nlapiLoadRecord('salesorder', confirmation.internalid);
				confirmation = this.confirmationCreateResult(record);
			}
			catch (e)
			{
				console.warn('Cart Confirmation could not be loaded, reason: ' + JSON.stringify(e));
			}

			return confirmation;
		}
		// @method confirmationCreateResult
	,	confirmationCreateResult: function (placed_order)
		{
			var result = {
				internalid: placed_order.getId()
			,	tranid: placed_order.getFieldValue('tranid')
			,	summary: {
					subtotal: Utils.toCurrency(placed_order.getFieldValue('subtotal'))
				,	subtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('subtotal'))

				,	taxtotal: Utils.toCurrency(placed_order.getFieldValue('taxtotal'))
				,	taxtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('taxtotal'))

				,	shippingcost: Utils.toCurrency(placed_order.getFieldValue('shippingcost'))
				,	shippingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('shippingcost'))

				,	handlingcost: Utils.toCurrency(placed_order.getFieldValue('althandlingcost'))
				,	handlingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('althandlingcost'))


				,	discounttotal: Utils.toCurrency(placed_order.getFieldValue('discounttotal'))
				,	discounttotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('discounttotal'))


				,	giftcertapplied: Utils.toCurrency(placed_order.getFieldValue('giftcertapplied'))
				,	giftcertapplied_formatted: Utils.formatCurrency(placed_order.getFieldValue('giftcertapplied'))

				,	total: Utils.toCurrency(placed_order.getFieldValue('total'))
				,	total_formatted: Utils.formatCurrency(placed_order.getFieldValue('total'))
				}
			};

			result.promocode = (placed_order.getFieldValue('promocode')) ? {
				internalid: placed_order.getFieldValue('promocode')
			,	name: placed_order.getFieldText('promocode')
			,	code: placed_order.getFieldText('couponcode')
			,	isvalid: true
			} : null;

			result.paymentmethods = [];
			for (var i = 1; i <= placed_order.getLineItemCount('giftcertredemption'); i++)
			{
				result.paymentmethods.push({
					type: 'giftcertificate'
				,	giftcertificate: {
							code: placed_order.getLineItemValue('giftcertredemption', 'authcode_display', i)
						,	amountapplied: placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i)
						,	amountapplied_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i))
						,	amountremaining: placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i)
						,	amountremaining_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i))
						,	originalamount: placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i)
						,	originalamount_formatted:  Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i))
					}
				});
			}

			result.lines = [];

			for (var i = 1; i <= placed_order.getLineItemCount('item'); i++)
			{
				result.lines.push({
						item: {
								internalid: placed_order.getLineItemValue('item', 'item', i)
							// 'item_display' returns the 'sku' or if is a matrix returns 'sku_parent : sku_child'
							// getLineItemValue of 'item_display' returns the same as getLineItemText of 'item'
							,	itemDisplay: placed_order.getLineItemValue('item', 'item_display', i)
						}
						,	quantity: parseInt(placed_order.getLineItemValue('item', 'quantity', i), 10)
						,	rate: parseInt(placed_order.getLineItemValue('item', 'rate', i), 10)
						,	options: placed_order.getLineItemValue('item', 'options', i)
				});
			}

			return result;
		}
		// @method backFromPayPal
	,	backFromPayPal: function ()
		{
			var customer_values = Profile.get()
			,	bill_address = order.getBillingAddress()
			,	ship_address = order.getShippingAddress();

			if (customer_values.isGuest === 'T' && session.getSiteSettings(['registration']).registration.companyfieldmandatory === 'T')
			{
				customer_values.companyname = 'Guest Shopper';
				customer.updateProfile(customer_values);
			}

			if (ship_address.internalid && ship_address.isvalid === 'T' && !bill_address.internalid)
			{
				order.setBillingAddress(ship_address.internalid);
			}

			context.setSessionObject('paypal_complete', 'T');
		}

		// @method removePaypalAddress remove the shipping address or billing address if phone number is null.
		// This is because addresses are not valid created by Paypal. @param {Object} paypal_address
	,	removePaypalAddress: function (paypal_address)
		{
			try
			{
				if (paypal_address && paypal_address.internalid)
				{
					customer.removeAddress(paypal_address.internalid);
				}
			}
			catch (e)
			{
				// ignore this exception, it is only for the cases that we can't remove pay-pal's address.
				// This exception will not send to the front-end
				var error = Application.processError(e);
				console.log('Error ' + error.errorStatusCode + ': ' + error.errorCode + ' - ' + error.errorMessage);
			}
		}

		// @method addLine @param {LiveOrder.Model.Line} line_data
	,	addLine: function (line_data)
		{
			// Adds the line to the order
			var line_id = order.addItem({
				internalid: line_data.item.internalid.toString()
			,	quantity: _.isNumber(line_data.quantity) ? parseInt(line_data.quantity, 10) : 1
			,	options: line_data.options || {}
			});


			if (this.isMultiShippingEnabled)
			{
				// Sets it ship address (if present)
				line_data.shipaddress && order.setItemShippingAddress(line_id, line_data.shipaddress);

				// Sets it ship method (if present)
				line_data.shipmethod && order.setItemShippingMethod(line_id, line_data.shipmethod);
			}

			// Stores the latest addition
			context.setSessionObject('latest_addition', line_id);

			// Stores the current order
			var lines_sort = this.getLinesSort();
			lines_sort.unshift(line_id);
			this.setLinesSort(lines_sort);

			return line_id;
		}

		// @method addLines @param {Array<LiveOrder.Model.Line>} lines_data
	,	addLines: function (lines_data)
		{
			var items = [];

			_.each(lines_data, function (line_data)
			{
				var item = {
						internalid: line_data.item.internalid.toString()
					,	quantity:  _.isNumber(line_data.quantity) ? parseInt(line_data.quantity, 10) : 1
					,	options: line_data.options || {}
				};

				items.push(item);
			});

			var lines_ids = order.addItems(items)
			,	latest_addition = _.last(lines_ids).orderitemid
			// Stores the current order
			,	lines_sort = this.getLinesSort();

			lines_sort.unshift(latest_addition);
			this.setLinesSort(lines_sort);

			context.setSessionObject('latest_addition', latest_addition);

			return lines_ids;
		}

		// @method removeLine @param {String} line_id
	,	removeLine: function (line_id)
		{
			// Removes the line
			order.removeItem(line_id);

			// Stores the current order
			var lines_sort = this.getLinesSort();
			lines_sort = _.without(lines_sort, line_id);
			this.setLinesSort(lines_sort);
		}

		// @method updateLine @param {String} line_id @param {LiveOrder.Model.Line} line_data
	,	updateLine: function (line_id, line_data)
		{
			var lines_sort = this.getLinesSort()
			,	current_position = _.indexOf(lines_sort, line_id)
			,	original_line_object = order.getItem(line_id, [
					'quantity'
				,	'internalid'
				,	'options'
			]);

			this.removeLine(line_id);

			if (!_.isNumber(line_data.quantity) || line_data.quantity > 0)
			{
				var new_line_id;
				try
				{
					new_line_id = this.addLine(line_data);
				}
				catch (e)
				{
					// we try to roll back the item to the original state
					var roll_back_item = {
						item: { internalid: parseInt(original_line_object.internalid, 10) }
					,	quantity: parseInt(original_line_object.quantity, 10)
					};

					if (original_line_object.options && original_line_object.options.length)
					{
						roll_back_item.options = {};
						_.each(original_line_object.options, function (option)
						{
							roll_back_item.options[option.id.toLowerCase()] = option.value;
						});
					}

					new_line_id = this.addLine(roll_back_item);

					e.errorDetails = {
						status: 'LINE_ROLLBACK'
					,	oldLineId: line_id
					,	newLineId: new_line_id
					};

					throw e;
				}

				lines_sort = _.without(lines_sort, line_id, new_line_id);
				lines_sort.splice(current_position, 0, new_line_id);
				this.setLinesSort(lines_sort);
			}
		}

		// @method splitLines @param {LiveOrder.Model.Line} data @param current_order
	,	splitLines: function (data, current_order)
		{
			_.each(data.lines, function (line)
			{
				if (line.splitquantity)
				{
					var splitquantity = typeof line.splitquantity === 'string' ? parseInt(line.splitquantity,10) : line.splitquantity
					,	original_line = _.find(current_order.lines, function (order_line)
						{
							return order_line.internalid === line.internalid;
						})
					,	remaining = original_line ? (original_line.quantity - splitquantity) : -1;

					if (remaining > 0 && splitquantity > 0)
					{
						order.splitItem({
							'orderitemid' : original_line.internalid
						,	'quantities': [
								splitquantity
							,	remaining
							]
						});
					}
				}
			});
		}

		// @method removePromoCode @param {LiveOrder.Model.Data} current_order
	,	removePromoCode: function(current_order)
		{
			if (current_order.promocode && current_order.promocode.code)
			{
				order.removePromotionCode(current_order.promocode.code);
			}
		}

		// @method getFieldValues @returns {Array<String>}
	,	getFieldValues: function ()
		{
			var order_field_keys = this.isSecure && session.isLoggedIn2() ? SC.Configuration.order_checkout_field_keys : SC.Configuration.order_shopping_field_keys;

			if (this.isMultiShippingEnabled)
			{
				if (!_.contains(order_field_keys.items, 'shipaddress'))
				{
					order_field_keys.items.push('shipaddress');
				}
				if (!_.contains(order_field_keys.items, 'shipmethod'))
				{
					order_field_keys.items.push('shipmethod');
				}
				order_field_keys.ismultishipto = null;
			}

			return order.getFieldValues(order_field_keys, false);
		}

		// @method getPromoCode @param {Array<String>} order_fields @return {LiveOrder.Model.PromoCode}
	,	getPromoCode: function (order_fields)
		{
			if (order_fields.promocodes && order_fields.promocodes.length)
			{
				return {
					// @class LiveOrder.Model.PromoCode
					// @property {String} internalid
					internalid: order_fields.promocodes[0].internalid
					// @property {String} code
				,	code: order_fields.promocodes[0].promocode
					// @property {Boolean} isvalid
				,	isvalid: true
				};
				//@class LiveOrder.Model
			}
			else
			{
				return null;
			}
		}

		// @method getMultiShipMethods @param {Array<LiveOrder.Model.Line>} lines
	,	getMultiShipMethods: function (lines)
		{
			// Get multi ship methods
			var multishipmethods = {};

			_.each(lines, function (line)
			{
				if (line.shipaddress)
				{
					multishipmethods[line.shipaddress] = multishipmethods[line.shipaddress] || [];

					multishipmethods[line.shipaddress].push(line.internalid);
				}
			});

			_.each(_.keys(multishipmethods), function (address)
			{
				var methods = order.getAvailableShippingMethods(multishipmethods[address], address);

				_.each(methods, function (method)
				{
					method.internalid = method.shipmethod;
					method.rate_formatted = Utils.formatCurrency(method.rate);
					delete method.shipmethod;
				});

				multishipmethods[address] = methods;
			});

			return multishipmethods;
		}

		// @method getShipMethods @param {Array<String>} order_fields @returns {Array<OrderShipMethod>}
	,	getShipMethods: function (order_fields)
		{
			var shipmethods = _.map(order_fields.shipmethods, function (shipmethod)
			{
				var rate = Utils.toCurrency(shipmethod.rate.replace( /^\D+/g, '')) || 0;

				return {
					internalid: shipmethod.shipmethod
				,	name: shipmethod.name
				,	shipcarrier: shipmethod.shipcarrier
				,	rate: rate
				,	rate_formatted: shipmethod.rate
				};
			});

			return shipmethods;
		}

		// @method getLinesSort @returns {Array<String>}
	,	getLinesSort: function ()
		{
			return context.getSessionObject('lines_sort') ? context.getSessionObject('lines_sort').split(',') : [];
		}

		// @method getPaymentMethods @param {Array<String>} order_fields @returns {Array<ShoppingSession.PaymentMethod>}
	,	getPaymentMethods: function (order_fields)
		{
			var paymentmethods = []
			,	giftcertificates = order.getAppliedGiftCertificates()
			,	payment = order_fields && order_fields.payment
			,	paypal = payment && _.findWhere(session.getPaymentMethods(), {ispaypal: 'T'})
			,	credit_card = payment && payment.creditcard;

			if (credit_card && credit_card.paymentmethod && credit_card.paymentmethod.creditcard === 'T')
			{
				// Main
				paymentmethods.push({
					type: 'creditcard'
				,	primary: true
				,	creditcard: {
						internalid: credit_card.internalid
					,	ccnumber: credit_card.ccnumber
					,	ccname: credit_card.ccname
					,	ccexpiredate: credit_card.expmonth + '/' + credit_card.expyear
					,	ccsecuritycode: credit_card.ccsecuritycode
					,	expmonth: credit_card.expmonth
					,	expyear: credit_card.expyear
					,	paymentmethod: {
							internalid: credit_card.paymentmethod.internalid
						,	name: credit_card.paymentmethod.name
						,	creditcard: credit_card.paymentmethod.creditcard === 'T'
						,	ispaypal: credit_card.paymentmethod.ispaypal === 'T'
						,	isexternal: credit_card.paymentmethod.isexternal === 'T'
						,	key: credit_card.paymentmethod.key
						}
					}
				});
			}
			else if (paypal && payment.paymentmethod === paypal.internalid)
			{
				paymentmethods.push({
					type: 'paypal'
				,	primary: true
				,	complete: context.getSessionObject('paypal_complete') === 'T'
				,	internalid: paypal.internalid
				,	name: paypal.name
				,	creditcard: paypal.creditcard === 'T'
				,	ispaypal: paypal.ispaypal === 'T'
				,	isexternal: paypal.isexternal === 'T'
				,	key: paypal.key
				});
			}
			else if (credit_card && credit_card.paymentmethod && credit_card.paymentmethod.isexternal === 'T')
			{
				paymentmethods.push({
					type: 'external_checkout_' + credit_card.paymentmethod.key
				,	primary: true
				,	internalid: credit_card.paymentmethod.internalid
				,	name: credit_card.paymentmethod.name
				,	creditcard: credit_card.paymentmethod.creditcard === 'T'
				,	ispaypal: credit_card.paymentmethod.ispaypal === 'T'
				,	isexternal: credit_card.paymentmethod.isexternal === 'T'
				,	key: credit_card.paymentmethod.key
				,	errorurl: payment.errorurl
				,	thankyouurl: payment.thankyouurl
				});
			}
			else if (order_fields.payment && order_fields.payment.paymentterms === 'Invoice')
			{
				var customer_invoice = customer.getFieldValues([
					'paymentterms'
				,	'creditlimit'
				,	'balance'
				,	'creditholdoverride'
				]);

				paymentmethods.push({
					type: 'invoice'
				,	primary: true
				,	paymentterms: customer_invoice.paymentterms
				,	creditlimit: parseFloat(customer_invoice.creditlimit || 0)
				,	creditlimit_formatted: Utils.formatCurrency(customer_invoice.creditlimit)
				,	balance: parseFloat(customer_invoice.balance || 0)
				,	balance_formatted: Utils.formatCurrency(customer_invoice.balance)
				,	creditholdoverride: customer_invoice.creditholdoverride
				,	purchasenumber: order_fields.purchasenumber
				});
			}

			if (giftcertificates && giftcertificates.length)
			{
				_.forEach(giftcertificates, function (giftcertificate)
				{
					paymentmethods.push({
						type: 'giftcertificate'
					,	giftcertificate: {
							code: giftcertificate.giftcertcode

						,	amountapplied: Utils.toCurrency(giftcertificate.amountapplied || 0)
						,	amountapplied_formatted: Utils.formatCurrency(giftcertificate.amountapplied || 0)

						,	amountremaining: Utils.toCurrency(giftcertificate.amountremaining || 0)
						,	amountremaining_formatted: Utils.formatCurrency(giftcertificate.amountremaining || 0)

						,	originalamount: Utils.toCurrency(giftcertificate.originalamount || 0)
						,	originalamount_formatted: Utils.formatCurrency(giftcertificate.originalamount || 0)
						}
					});
				});
			}

			return paymentmethods;
		}

		// @method getTransactionBodyField @returns {Object}
	,	getTransactionBodyField: function ()
		{
			var options = {};

			if (this.isSecure)
			{
				_.each(order.getCustomFieldValues(), function (option)
				{
					options[option.name] = option.value;
				});

			}
			return options;
		}

		// @method getAddresses @param {Array<String>} order_fields @returns {Array<OrderAddress>}
	,	getAddresses: function (order_fields)
		{
			var self = this
			,	addresses = {}
			,	address_book = session.isLoggedIn2() && this.isSecure ? customer.getAddressBook() : [];

			address_book = _.object(_.pluck(address_book, 'internalid'), address_book);
			// General Addresses
			if (order_fields.ismultishipto === 'T')
			{
				_.each(order_fields.items || [], function (line)
				{
					if (line.shipaddress && !addresses[line.shipaddress])
					{
						self.addAddress(address_book[line.shipaddress], addresses);
					}
				});
			}
			else
			{
				this.addAddress(order_fields.shipaddress, addresses);
			}

			this.addAddress(order_fields.billaddress, addresses);

			return _.values(addresses);
		}

		// @method getLines Set Order Lines into the result. Standardizes the result of the lines
		// @param {Object} order_fields
		// @returns {Array<LiveOrder.Model.Line>}
	,	getLines: function (order_fields)
		{
			var lines = [];
			if (order_fields.items && order_fields.items.length)
			{
				var self = this
				,	items_to_preload = []
				,	address_book = session.isLoggedIn2() && this.isSecure ? customer.getAddressBook() : []
				,	item_ids_to_clean = [];

				address_book = _.object(_.pluck(address_book, 'internalid'), address_book);

				_.each(order_fields.items, function (original_line)
				{
					// Total may be 0
					var	total = (original_line.promotionamount) ? Utils.toCurrency(original_line.promotionamount) : Utils.toCurrency(original_line.amount)
					,	discount = Utils.toCurrency(original_line.promotiondiscount) || 0
					,	line_to_add;

					// @class LiveOrder.Model.Line represents a line in the LiveOrder
					line_to_add = {
						// @property {String} internalid
						internalid: original_line.orderitemid
						// @property {Number} quantity
					,	quantity: original_line.quantity
						// @property {Number} rate
					,	rate: parseFloat(original_line.rate)
						// @property {String} rate_formatted
					,	rate_formatted: original_line.rate_formatted
						// @property {Number} amount
					,	amount: Utils.toCurrency(original_line.amount)
						// @property {Number} tax_amount
					,	tax_amount: 0
						// @property {Number} tax_rate
					,	tax_rate: null
						// @property {String} tax_rate
					,	tax_code: null
						// @property {Number} discount
					,	discount: discount
						// @property {Number} total
					,	total: total
						// @property {String} item internal id of the line's item
					,	item: original_line.internalid
						// @property {String} itemtype
					,	itemtype: original_line.itemtype
						// @property {Object} options
					,	options: original_line.options
						// @property {OrderAddress} shipaddress
					,	shipaddress: original_line.shipaddress
						// @property {OrderShipMethod} shipmethod
					,	shipmethod: original_line.shipmethod
					};
					// @class LiveOrder.Model

					lines.push(line_to_add);

					if (line_to_add.shipaddress && !address_book[line_to_add.shipaddress])
					{
						line_to_add.shipaddress = null;
						line_to_add.shipmethod = null;
						item_ids_to_clean.push(line_to_add.internalid);
					}
					else
					{
						items_to_preload.push({
							id: original_line.internalid
						,	type: original_line.itemtype
						});
					}
				});

				if (item_ids_to_clean.length)
				{
					order.setItemShippingAddress(item_ids_to_clean, null);
					order.setItemShippingMethod(item_ids_to_clean, null);
				}

				var	restart = false;

				StoreItem.preloadItems(items_to_preload);

				lines.forEach(function (line)
				{
					line.item = StoreItem.get(line.item, line.itemtype);

					if (!line.item)
					{
						self.removeLine(line.internalid);
						restart = true;
					}
					else
					{
						line.rate_formatted = Utils.formatCurrency(line.rate);
						line.amount_formatted = Utils.formatCurrency(line.amount);
						line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount);
						line.discount_formatted = Utils.formatCurrency(line.discount);
						line.total_formatted = Utils.formatCurrency(line.total);
					}
				});

				if (restart)
				{
					throw {code: 'ERR_CHK_ITEM_NOT_FOUND'};
				}

				// Sort the items in the order they were added, this is because the update operation alters the order
				var lines_sort = this.getLinesSort();

				if (lines_sort.length)
				{
					lines = _.sortBy(lines, function (line)
					{
						return _.indexOf(lines_sort, line.internalid);
					});
				}
				else
				{
					this.setLinesSort(_.pluck(lines, 'internalid'));
				}
			}

			return lines;
		}

		// @method getIsMultiShipTo @param {Array<String>} order_fields @returns {Boolean}
	,	getIsMultiShipTo: function (order_fields)
		{
			return this.isMultiShippingEnabled && order_fields.ismultishipto === 'T';
		}

		// @method setLinesSort @param {String} lines_sort @returns {String}
	,	setLinesSort: function (lines_sort)
		{
			return context.setSessionObject('lines_sort', lines_sort || []);
		}

		// @method setBillingAddress @param data @param {LiveOrder.Model.Data} current_order
	,	setBillingAddress: function (data, current_order)
		{
			if (data.sameAs)
			{
				data.billaddress = data.shipaddress;
			}

			if (data.billaddress !== current_order.billaddress)
			{
				if (data.billaddress)
				{
					if (data.billaddress && !~data.billaddress.indexOf('null'))
					{
						// Heads Up!: This "new String" is to fix a nasty bug
						order.setBillingAddress(new String(data.billaddress).toString());
					}
				}
				else if (this.isSecure)
				{
					order.removeBillingAddress();
				}
			}
		}

		// @method setShippingAddressAndMethod @param {LiveOrder.Model.Data} data @param current_order
	,	setShippingAddressAndMethod: function (data, current_order)
		{
			var current_package
			,	packages = {}
			,	item_ids_to_clean = []
			,	original_line;

			_.each(data.lines, function (line)
			{
				original_line = _.find(current_order.lines, function (order_line)
				{
					return order_line.internalid === line.internalid;
				});

				if (original_line && original_line.item && original_line.item.isfulfillable !== false)
				{
					if (line.shipaddress)
					{
						packages[line.shipaddress] = packages[line.shipaddress] || {
							shipMethodId: null
						,	itemIds: []
						};

						packages[line.shipaddress].itemIds.push(line.internalid);
						if (!packages[line.shipaddress].shipMethodId && line.shipmethod)
						{
							packages[line.shipaddress].shipMethodId = line.shipmethod;
						}
					}
					else
					{
						item_ids_to_clean.push(line.internalid);
					}
				}
			});

			//CLEAR Shipping address and shipping methods
			if (item_ids_to_clean.length)
			{
				order.setItemShippingAddress(item_ids_to_clean, null);
				order.setItemShippingMethod(item_ids_to_clean, null);
			}

			//SET Shipping address and shipping methods
			_.each(_.keys(packages), function (address_id)
			{
				current_package = packages[address_id];
				order.setItemShippingAddress(current_package.itemIds, parseInt(address_id, 10));

				if (current_package.shipMethodId)
				{
					order.setItemShippingMethod(current_package.itemIds, parseInt(current_package.shipMethodId, 10));
				}
			});
		}

		// @method setShippingAddress @param {LiveOrder.Model.Data} data @param current_order
	,	setShippingAddress: function (data, current_order)
		{
			if (data.shipaddress !== current_order.shipaddress)
			{
				if (data.shipaddress)
				{
					if (this.isSecure && !~data.shipaddress.indexOf('null'))
					{
						// Heads Up!: This "new String" is to fix a nasty bug
						order.setShippingAddress(new String(data.shipaddress).toString());
					}
					else
					{
						var address = _.find(data.addresses, function (address)
						{
							return address.internalid === data.shipaddress;
						});

						address && order.estimateShippingCost(address);
					}
				}
				else if (this.isSecure)
				{
					order.removeShippingAddress();
				}
				else
				{
					order.estimateShippingCost({
						zip: null
					,	country: null
					});
					order.removeShippingMethod();
				}
			}
		}

		// @method setPaymentMethods @param {LiveOrder.Model.Data} data
	,	setPaymentMethods: function (data)
		{
			// Because of an api issue regarding Gift Certificates, we are going to handle them separately
			var self = this
			,	gift_certificate_methods = _.where(data.paymentmethods, {type: 'giftcertificate'})
			,	non_certificate_methods = _.difference(data.paymentmethods, gift_certificate_methods);

			// Payment Methods non gift certificate
			if (this.isSecure && non_certificate_methods && non_certificate_methods.length && session.isLoggedIn2())
			{
				_.each(non_certificate_methods, function (paymentmethod)
				{
					if (paymentmethod.type === 'creditcard' && paymentmethod.creditcard)
					{

						var credit_card = paymentmethod.creditcard
						,	require_cc_security_code = session.getSiteSettings(['checkout']).checkout.requireccsecuritycode === 'T'
						,	cc_obj = credit_card && {
										internalid: credit_card.internalid
									,	ccnumber: credit_card.ccnumber
									,	ccname: credit_card.ccname
									,	ccexpiredate: credit_card.ccexpiredate
									,	expmonth: credit_card.expmonth
									,	expyear:  credit_card.expyear
									,	paymentmethod: {
											internalid: credit_card.paymentmethod.internalid
										,	name: credit_card.paymentmethod.name
										,	creditcard: credit_card.paymentmethod.creditcard ? 'T' : 'F'
										,	ispaypal:  credit_card.paymentmethod.ispaypal ? 'T' : 'F'
										}
									};

						if (credit_card.ccsecuritycode)
						{
							cc_obj.ccsecuritycode = credit_card.ccsecuritycode;
						}

						if (!require_cc_security_code || require_cc_security_code && credit_card.ccsecuritycode)
						{
							// the user's default credit card may be expired so we detect this using try & catch and if it is we remove the payment methods.
							try
							{
								order.removePayment();

								order.setPayment({
									paymentterms: 'CreditCard'
								,	creditcard: cc_obj
								});

								context.setSessionObject('paypal_complete', 'F');
							}
							catch (e)
							{
								if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
								{
									order.removePayment();
								}
								throw e;
							}
						}
						// if the the given credit card don't have a security code and it is required we just remove it from the order
						else if (require_cc_security_code && !credit_card.ccsecuritycode)
						{
							order.removePayment();
						}
					}
					else if (paymentmethod.type === 'invoice')
					{
						order.removePayment();

						try
						{
							order.setPayment({ paymentterms: 'Invoice' });
						}
						catch (e)
						{
							if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
							{
								order.removePayment();
							}
							throw e;
						}

						if (paymentmethod.purchasenumber)
						{
							order.setPurchaseNumber(paymentmethod.purchasenumber);
						}
						else
						{
							order.removePurchaseNumber();
						}
						context.setSessionObject('paypal_complete', 'F');
					}
					else if (paymentmethod.type === 'paypal' && context.getSessionObject('paypal_complete') === 'F')
					{
						order.removePayment();

						var paypal = _.findWhere(session.getPaymentMethods(), {ispaypal: 'T'});
						paypal && order.setPayment({paymentterms: '', paymentmethod: paypal.key});
					}
					else if (paymentmethod.type && ~paymentmethod.type.indexOf('external_checkout'))
					{
						order.removePayment();

						order.setPayment({
								paymentmethod: paymentmethod.key
							,	thankyouurl: paymentmethod.thankyouurl
							,	errorurl: paymentmethod.errorurl
						});
					}
				});
			}
			else if (this.isSecure && session.isLoggedIn2())
			{
				order.removePayment();
			}

			gift_certificate_methods = _.map(gift_certificate_methods, function (gift_certificate) { return gift_certificate.giftcertificate; });
			this.setGiftCertificates(gift_certificate_methods);
		}

		// @method setGiftCertificates @param {Array<Object>} gift_certificates
	,	setGiftCertificates:  function (gift_certificates)
		{
			// Remove all gift certificates so we can re-enter them in the appropriate order
			order.removeAllGiftCertificates();

			_.forEach(gift_certificates, function (gift_certificate)
			{
				order.applyGiftCertificate(gift_certificate.code);
			});
		}

		// @method setShippingMethod @param {LiveOrder.Model.Data} data @param current_order
	,	setShippingMethod: function (data, current_order)
		{
			if ((!this.isMultiShippingEnabled || !data.ismultishipto) && this.isSecure && data.shipmethod !== current_order.shipmethod)
			{
				var shipmethod = _.findWhere(current_order.shipmethods, {internalid: data.shipmethod});

				if (shipmethod)
				{
					order.setShippingMethod({
						shipmethod: shipmethod.internalid
					,	shipcarrier: shipmethod.shipcarrier
					});
				}
				else
				{
					order.removeShippingMethod();
				}
			}
		}

		// @method setPromoCode @param {LiveOrder.Model.Data} data @param current_order
	,	setPromoCode: function (data, current_order)
		{
			if (data.promocode && (!current_order.promocode || data.promocode.code !== current_order.promocode.code))
			{
				try
				{
					order.applyPromotionCode(data.promocode.code);

					//If we are estimating shipping address it is needed to re-calculate the shipping cost as the promo code can affect it
					if (data.shipaddress && (!this.isSecure || ~data.shipaddress.indexOf('null')))
					{
						var address = _.find(data.addresses, function (address)
						{
							return address.internalid === data.shipaddress;
						});

						address && order.estimateShippingCost(address);
					}
				}
				catch (e)
				{
					order.removePromotionCode(data.promocode.code);
					current_order.promocode && order.removePromotionCode(current_order.promocode.code);
					throw e;
				}
			}
			else if (!data.promocode && current_order.promocode)
			{
				order.removePromotionCode(current_order.promocode.code);
			}
		}

		// @method setTermsAndConditions @param {LiveOrder.Model.Data} data
	,	setTermsAndConditions: function (data)
		{
			var require_terms_and_conditions = session.getSiteSettings(['checkout']).checkout.requiretermsandconditions;

			if (require_terms_and_conditions.toString() === 'T' && this.isSecure && !_.isUndefined(data.agreetermcondition))
			{
				order.setTermsAndConditions(data.agreetermcondition);
			}
		}

		// @method setTransactionBodyField @param {LiveOrder.Model.Data} data
	,	setTransactionBodyField: function (data)
		{
			// Transaction Body Field
			if (this.isSecure && !_.isEmpty(data.options))
			{
				order.setCustomFieldValues(data.options);
			}
		}
	});
});
