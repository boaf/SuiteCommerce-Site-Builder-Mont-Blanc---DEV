/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.Details.View'
,	[
		'GlobalViews.FormatPaymentMethod.View'
	,	'Backbone.CollectionView'
	,	'Address.Details.View'
	,	'ItemViews.Cell.Actionable.View'
	,	'OrderHistory.Item.Actions.View'
	,	'ItemViews.Item.QuantityAmount.View'
	,	'OrderHistory.Payments.View'
	,	'OrderHistory.Other.Payments.View'
	,	'OrderHistory.ReturnAutorization.View'
	,	'OrderHistory.ShippingGroup.View'
	,	'OrderHistory.Summary.View'
	,	'GlobalViews.Message.View'
	,	'Backbone.CompositeView'
	,	'SC.Configuration'
	,	'Transaction.Collection'


	,	'order_history_details.tpl'
	,	'order_history_details_shipped_items.tpl'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Tracker'
	,	'LiveOrder.Model'
	,	'bignumber'
	,	'Utils'
	]
,	function (
		GlobalViewsFormatPaymentMethodView
	,	BackboneCollectionView
	,	AddressView
	,	ItemViewsCellActionableView
	,	OrderHistoryItemActionsView
	,	ItemViewsItemQuantityAmountView
	,	OrderHistoryPayments
	,	OrderHistoryOtherPayments
	,	OrderHistoryReturnAutorizationView
	,	OrderHistoryShippingGroupView
	,	OrderHistorySummary
	,	GlobalViewsMessageView
	,	BackboneCompositeView
	,	Configuration
	,	TransactionCollection


	,	order_history_details_tpl
	,	order_history_details_shipped_items_tpl

	,	Backbone
	,	_
	,	jQuery
	,	Tracker
	,	LiveOrderModel
	,	BigNumber
	,	Utils
	)
{
	'use strict';

	//@class OrderHistory.Details.View @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: order_history_details_tpl

		//@property {String} title
	,	title: _('Purchase Details').translate()

		//@property {String} page_header
	,	page_header: _('Purchase Details').translate()

		//@property {Object} attributes
	,	attributes: {
			'class': 'OrderDetailsView'
		}

		//@property {Object} events
	,	events: {
			'click [data-action="add-to-cart"]': 'addToCart'
		,	'click [data-action="go-to-returns"] a': 'goToReturns'
		}

		//@method getReturnAuthorizations
	,	getReturnAuthorizations: function ()
		{
			var return_authorizations = this.model.get('returnauthorizations')
			,	total_lines = 0;

			return_authorizations.each(function (return_authorization)
			{
				total_lines += return_authorization.get('lines') ? return_authorization.get('lines').length : 0;
			});

			return_authorizations.totalLines = total_lines;

			return return_authorizations;
		}

		//@method getRecipts
	,	getRecipts: function()
		{
			
			if (!this.receipts)
			{
				var receipts_lines = _.values(this.model.get('receipts').models);
				this.receipts = new TransactionCollection();

				if (receipts_lines.length)
				{
					this.receipts.add(receipts_lines);
				}
			}
			return this.receipts;
		}

		//@method isAnyLinePurchasable
	,	getPayments: function()
		{
			return _.where(this.model.get('adjustments'), {recordtype: 'customerpayment'});
		}
	,	getCreditMemos: function()
		{
			return _.where(this.model.get('adjustments'), {recordtype: 'creditmemo'});
		}
	,	getDepositApplications: function()
		{
			return _.where(this.model.get('adjustments'), {recordtype: 'depositapplication'});
		}
		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'ordershistory';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
						text: _('Purchase History').translate()
					,	href: '/purchases'
				}
			, 	{
						text: '#' + this.model.get('tranid')
					,	href :'/purchases/view/' + this.model.get('recordtype') + '/' + this.model.get('id')
				}
			];
		}

		//@method render
	,	render: function ()
		{
			this.paymentmethod = this.model.get('paymentmethods') && this.model.get('paymentmethods').findWhere({primary: true});
			this.billaddress = this.model.get('addresses').get(this.model.get('billaddress'));
			this.shipaddress = this.model.get('addresses').get(this.model.get('shipaddress'));

			Backbone.View.prototype.render.apply(this, arguments);
		}
		//@method trackEventReorder
	,	trackEventReorder: function (item)
		{
			item && Tracker.getInstance().trackEvent({
				category: 'Reorder'
			,	action: 'button'
			,	label: item.get('_url') + item.getQueryString()
			,	value: 1
			});
		}
		//@method addToCart
	,	addToCart: function (e)
		{
			e.preventDefault();

			var	self = this
			,	line_id = this.$(e.target).data('line-id')
			,	$form = this.$(e.target).closest('[data-type="order-item"]')
			,	$alert_placeholder = $form.find('[data-type=alert-placeholder]')
			,	quantity = this.$(e.target).data('partial-quantity') || this.$(e.target).data('item-quantity')
			,	selected_line = this.model.get('lines').get(line_id)
			,	item_to_cart = selected_line.get('item');

			item_to_cart.set('quantity', quantity);
			item_to_cart.setOptionsArray(selected_line.get('options'), true);

			LiveOrderModel.getInstance().addItem(item_to_cart).done(function ()
			{
				self.trackEventReorder(item_to_cart);

				var message = quantity > 1 ? 
					_('$(0) Items successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>').translate(quantity) :
					_('Item successfully added to <a href="#" data-touchpoint="viewcart">your cart</a><br/>').translate();

				var alert = new GlobalViewsMessageView({
						message: message
					,	type: 'success'
					,	closable: true
				});

				alert.show($alert_placeholder, 6000);
			});

		}

		//@method goToReturns scroll the page up to the order's return
	,   goToReturns: function (e)
		{
			e.preventDefault();

			var $return_authorizations_header = this.$('[data-target="#returns-authorizations"]').first();
			this.$('#returns-authorizations').first().collapse('show');

			jQuery('html, body').animate({
				scrollTop: $return_authorizations_header.offset().top
			}, 500);
		}

		//@method initialize
	,	initialize: function (options)
		{
			this.application = options.application;

			this.is_basic = !!this.application.getConfig('isBasic');

			var self = this;

			this.model.on('change:cancel_response', function (model, response_code)
			{
				var message = ''
				,	type = '';

				if (!!response_code)
				{
					if (response_code === 'ERR_ALREADY_APPROVED_STATUS')
					{
						message = _('You cannot cancel this order because it has already been approved.').translate();
						type = 'error';
					}
					else if (response_code === 'ERR_ALREADY_CANCELLED_STATUS')
					{
						message = _('This order has already been cancelled.').translate();
						type = 'warning';
					}
					else if (response_code === 'OK')
					{
						message = _('The order was successfully cancelled.').translate();
						type = 'success';
					}

					if (message && type)
					{
						self.once('afterViewRender', function()	
						{
							this.showError(message, type, true);
						});
					}
				}
			});

			BackboneCompositeView.add(this);
		}

		//@method getNonShippableItems
	,	getNonShippableLines: function ()
		{
			return this.model.get('lines').where({linegroup: 'nonshippable'});
		}
	,	getInStoreLines: function ()
		{
			return this.model.get('lines').where({linegroup: 'instore'});
		}
	,	getShippableLines: function ()
		{
			return this.model.get('lines').where({linegroup: 'shippable'});
		}
	,	getShipGroups: function ()
		{
			var self = this
			,	shippable_lines = this.getShippableLines()
			,	is_multi_ship_to = this.model.get('ismultishipto')
			,	ship_groups = {}
			,	amount = 0;

			_.each(shippable_lines || [], function (line)
			{
				if (line.get('quantitybackordered') || line.get('quantitypicked') || line.get('quantitypacked'))
				{

					var shipaddress = is_multi_ship_to ? line.get('shipaddress') : self.model.get('shipaddress')
					,	shipmethod = is_multi_ship_to ? line.get('shipmethod') : self.model.get('shipmethod');

					ship_groups[shipaddress] = ship_groups[shipaddress] || {
							internalid: shipaddress
						,	shipaddress: self.model.get('addresses').findWhere({internalid: shipaddress})
						,	shipmethod: self.model.get('shipmethods').findWhere({internalid: shipmethod}) 
						,	pending: {
								lines: []
							, 	status: {
									internalid: 'pending' 
								,	name: _('Pending Shipment').translate()
								}
							}
						,	fulfillments: new TransactionCollection([
								{
									internalid: 'picked'
								,	lines:[]
								,	status: {
										internalid: 'picked' 
									,	name: _('Processing').translate()
									}
								}
							,	{
									internalid: 'packed'
								,	lines:[]
								,	status: {
										internalid: 'packed' 
									,	name: _('Packing').translate()
									}
								}
							])
					};
					
					if (line.get('quantitybackordered'))
					{	
						var pending_line;

						if (line.get('quantitypacked') === line.get('quantity'))
						{
							pending_line = line;
						}
						else
						{
							pending_line = line.clone();

							pending_line.set('quantity', line.get('quantitybackordered'));
						
							amount = BigNumber(line.get('rate')).times(pending_line.get('quantity')).toNumber();

							pending_line.set('amount', amount);
							pending_line.set('amount_formatted', Utils.formatCurrency(amount));
						
							pending_line.set('item', line.get('item').attributes);
						}
						
						ship_groups[shipaddress].pending.lines.push(pending_line);
					}

					if (line.get('quantitypicked'))
					{	
						var picked_line;

						if (line.get('quantitypicked') === line.get('quantity'))
						{
							picked_line = line;
						}
						else
						{
							picked_line = line.clone();

							picked_line.set('quantity', line.get('quantitypicked'));
						
							amount = BigNumber(line.get('rate')).times(picked_line.get('quantity')).toNumber();

							picked_line.set('amount', amount);
							picked_line.set('amount_formatted', Utils.formatCurrency(amount));
						
							picked_line.set('item', line.get('item').attributes);
						}
						
						ship_groups[shipaddress].fulfillments.get('picked').get('lines').add(picked_line);
					}
					
					if (line.get('quantitypacked'))
					{	
						var packed_line;

						if (line.get('quantitypacked') === line.get('quantity'))
						{
							packed_line = line;
						}
						else
						{
							packed_line = line.clone();

							packed_line.set('quantity', line.get('quantitypacked'));
							
							amount = BigNumber(line.get('rate')).times(packed_line.get('quantity')).toNumber();

							packed_line.set('amount', amount);
							packed_line.set('amount_formatted', Utils.formatCurrency(amount));
						
							packed_line.set('item', line.get('item').attributes);
						}
						
						ship_groups[shipaddress].fulfillments.get('packed').get('lines').add(packed_line);
					}
				}
				
			});

			this.model.get('fulfillments').each(function (fulfillment)
			{
				var shipaddress = self.model.get('addresses').findWhere({internalid: fulfillment.get('shipaddress')})
				,	shipmethod = self.model.get('shipmethods').findWhere({internalid: fulfillment.get('shipmethod')});

				fulfillment.set('shipaddress', shipaddress);
				fulfillment.set('shipmethod', shipmethod);

				var lines = _.compact(fulfillment.get('lines').map(function (line)
				{
					var	fulfilled_line
					,	original_line = self.model.get('lines').get(line.get('internalid'));

					if (original_line && original_line.get('linegroup') === 'shippable') //ignore instore lines
					{
						if (original_line.get('quantity') === line.get('fulfilled'))
						{
							fulfilled_line = original_line;
						}
						else
						{
							fulfilled_line = original_line.clone();

							fulfilled_line.set('quantity', line.get('quantity'));
							
							amount = BigNumber(original_line.get('rate')).times(fulfilled_line.get('quantity')).toNumber();

							fulfilled_line.set('amount', amount);
							fulfilled_line.set('amount_formatted', Utils.formatCurrency(amount));
						
							fulfilled_line.set('item', original_line.get('item'), {silent: true});
						}

						return fulfilled_line;
					}

				}));


				if (lines.length)
				{
					ship_groups[shipaddress.get('internalid')] = ship_groups[shipaddress.get('internalid')] || {
							internalid: shipaddress.get('internalid')
						,	shipaddress: shipaddress
						,	shipmethod: shipmethod
						,	fulfillments: new TransactionCollection()
					};
					ship_groups[shipaddress.get('internalid')].fulfillments.add(fulfillment.clone().set('lines', lines));
				}
				
			});

			ship_groups = _.filter(ship_groups, function (ship_group)
			{
				ship_group.fulfillments.reset(ship_group.fulfillments.filter(function (fulfillment)
				{
					return fulfillment.get('lines').length > 0;
				}), {silent: true});
				
				return ship_group.fulfillments.length > 0 || (ship_group.pending && ship_group.pending.lines.length > 0);
			});

			return _.values(ship_groups);
		}

		//@property {Object} childViews
	,	childViews: {
		
			'FormatPaymentMethod': function ()
			{
				return new GlobalViewsFormatPaymentMethodView({model: this.paymentmethod});
			}

		,	'Billing.Address.View': function ()
			{
				return new AddressView({
					model: this.billaddress
				,	hideDefaults: true
				,	hideActions: true
				});
			}
		
		,	'NonShippableLines': function ()
			{
				return new BackboneCollectionView({
					collection: this.non_shippable_lines || this.getNonShippableLines()
				,	childView: ItemViewsCellActionableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true
					,	application: this.application
					,	SummaryView: ItemViewsItemQuantityAmountView
					,	ActionsView: OrderHistoryItemActionsView
					}
				});
			}

		,	'InStoreLines': function ()
			{
				return new BackboneCollectionView({
					collection: this.in_store_lines || this.getInStoreLines()
				,	childView: ItemViewsCellActionableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true
					,	application: this.application
					,	SummaryView: ItemViewsItemQuantityAmountView
					,	ActionsView: OrderHistoryItemActionsView
					}
				});
			}
	
		,	'ReturnAutorization': function ()
			{
				return new BackboneCollectionView({
					collection: this.getReturnAuthorizations()
				,	childView: OrderHistoryReturnAutorizationView
				,	viewsPerRow: 1
				});
			}

		,	'Payments': function ()
			{
				return new BackboneCollectionView({
					collection: this.getPayments()
				,	childView: OrderHistoryPayments
				,	childViewOptions: {
						application: this.application
					,	is_basic: this.is_basic
					,	recordtype: this.model.get('recordtype')
					}
				});
			}

		,	'OtherPayments': function ()
			{
				return new OrderHistoryOtherPayments({
					credit_memos: this.getCreditMemos()
				,	deposit_applications : this.getDepositApplications()
				,	show_links: this.is_basic
				});
			}

		,	'Summary': function() 
			{
				return new OrderHistorySummary({
					model: this.model
				,	application: this.application
				,	is_basic: this.is_basic
				});
			}
			
		,	'ShipGroups': function ()
			{
				return new BackboneCollectionView({
					collection: this.getShipGroups()
				,	childView: OrderHistoryShippingGroupView
				,	cellTemplate: order_history_details_shipped_items_tpl
				,	viewsPerRow: 1
				,	childViewOptions:
					{
						application: this.application
					}
				});
			}
		}

		//@method getContext @returns OrderHistory.Details.View.Context
	,	getContext: function()
		{
			this.isInStore = this.model.get('origin') === Configuration.transactionRecordOriginMapping.inStore.origin;

			this.accordionLimit = Configuration.accordionCollapseLimit;

			this.non_shippable_lines = this.getNonShippableLines();
			this.in_store_lines = this.getInStoreLines();

			var return_authorizations = this.getReturnAuthorizations()			
			,	order_ship_method = this.model.get('shipmethod')
			,	delivery_method_name = ''
			,	status = this.model.get('status');

			if (order_ship_method && this.model.get('shipmethods')._byId[order_ship_method])
			{
				delivery_method_name = this.model.get('shipmethods')._byId[order_ship_method].getFormattedShipmethod();
			}
			else if (order_ship_method && order_ship_method.name)
			{
				delivery_method_name = order_ship_method.name;
			}

			//@class OrderHistory.Details.View.Context
			return {
					//@property {OrderHistory.Model} model
					model : this.model
					//@property {Boolean} showNonShippableItems
				,	showNonShippableLines: !!this.non_shippable_lines.length
					//@property {Boolean} showNonShippableLinesAccordion
				,	showNonShippableLinesAccordion: this.non_shippable_lines.length > this.accordionLimit
					//@property {Array} nonShippableItems
				,	nonShippableLines: this.non_shippable_lines
					//@property {Boolean} nonShippableItemsLengthGreaterThan1
				,	nonShippableLinesLengthGreaterThan1: this.non_shippable_lines.length > 1
					//@property {Boolean} showNonShippableItems
				,	showInStoreLines: !!this.in_store_lines.length
					//@property {Boolean} showInStoreLinesAccordion
				,	showInStoreLinesAccordion: this.in_store_lines.length > this.accordionLimit
					//@property {Array} nonShippableItems
				,	inStoreItems: this.in_store_lines
					//@property {Boolean} nonShippableItemsLengthGreaterThan1
				,	inStoreLinesLengthGreaterThan1: this.in_store_lines.length > 1
					//@property {OrderLine.Collection} lines
				,	lines: this.model.get('lines')
					//@property {Boolean} collapseElements
				,	collapseElements: this.application.getConfig('collapseElements')
					//@property {Address.Model} billAddress
				,	showBillAddress: !!this.billaddress
					//@property {Boolean} showOrderShipAddress
				,	showOrderShipAddress: !!this.model.get('shipaddress')
					//@property {Address.Model} orderShipaddress
				,	orderShipaddress: this.model.get('shipaddress') ? this.model.get('addresses').get(this.model.get('shipaddress')) : null
					//@property {Boolean} showReturnAuthorizations
				,	showReturnAuthorizations: !!return_authorizations.length
					//@property {Object} returnAuthorizations
				,	returnAuthorizations: return_authorizations
					//@property {String} deliveryMethodName
				,	deliveryMethodName: delivery_method_name || ''
					//@property {Boolean} showDeliveryMethod
				,	showDeliveryMethod: !!delivery_method_name
					//@property {Boolean} isInStore
				,	isInStore: this.isInStore
					//@property {Boolean} showPaymentMethod
				,	showPaymentMethod: !this.getPayments().length
					//@property {Boolean} initiallyCollapsed
				,	initiallyCollapsed: (_.isPhoneDevice()) ? '' : 'in'
					//@property {Boolean} initiallyCollapsedArrow
				,	initiallyCollapsedArrow: (_.isPhoneDevice()) ? 'collapsed' : ''
					//@property {String} originName
				,	originName: _.findWhere(_.values(Configuration.transactionRecordOriginMapping), {origin: this.model.get('origin')}).name
					//@property {String} title
				,	title: _.findWhere(_.values(Configuration.transactionRecordOriginMapping), {origin: this.model.get('origin')}).detailedName
					//@property {Boolean} showPaymentEventFail
				,	showPaymentEventFail: this.model.get('paymentevent').holdreason === 'FORWARD_REQUESTED' && status.internalid !== 'cancelled' && status.internalid !== 'closed'
			};
		}

	});

});
