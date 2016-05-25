/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


//@module OrderHistory
define('OrderHistory.ShippingGroup.View'
,	[	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'ItemViews.Cell.Navigable.View'
	,	'Address.Details.View'
	,	'ItemViews.Cell.Actionable.View'
	,	'ItemViews.Item.QuantityAmount.View'
	,	'OrderHistory.Item.Actions.View'
	,	'OrderHistory.Fulfillment.View'
	,	'order_history_shipping_group.tpl'
	,	'SC.Configuration'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCompositeView
	,	BackboneCollectionView
	,	ItemViewsCellNavigableView
	,	AddressView
	,	ItemViewsCellActionableView
	,	ItemViewsItemQuantityAmountView
	,	OrderHistoryItemActionsView
	,	OrderHistoryFulfillmentView
	,	order_history_shipping_group_tpl
	,	Configuration

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class OrderHistory.ReturnAutorization.View @extend Backbone.View
	return Backbone.View.extend({
		//@property  {Function} template
		template: order_history_shipping_group_tpl
		//@method initialize
	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}
		//@property {Object} childViews
	,	childViews: {

			'Shipping.Address.View': function()
			{
				return new AddressView({
					model: this.model.get('shipaddress')
				,	hideDefaults: true
				,	hideActions: true
				});
			}

		,	'Fullfillments.Collection': function ()
			{
				return new BackboneCollectionView({
						collection: this.model.get('fulfillments')
					,	childView: OrderHistoryFulfillmentView
					,	viewsPerRow: 1
					,	childViewOptions: {
							application: this.options.application
						}
				});
			}

		,	'PendingLines': function ()
			{
				return new BackboneCollectionView({
					collection:  this.model.get('pending').lines
				,	childView: ItemViewsCellActionableView
				,	viewsPerRow: 1				
				,	childViewOptions: {
						navigable: true
					,	useLinePrice: true
					,	application: this.options.application
					,	SummaryView: ItemViewsItemQuantityAmountView
					,	ActionsView: OrderHistoryItemActionsView
					}
				});
			}
		}

		//@method getContext @return OrderHistory.ReturnAutorization.View.Context
	,	getContext: function ()
		{	
			this.accordionLimit = Configuration.accordionCollapseLimit;
			
			var lines_length = 0;

			this.model.get('fulfillments').each(function (fulfillment)
			{
				lines_length += fulfillment.get('lines').length;
			});

			//@class OrderHistory.ReturnAutorization.View.Context
			return {
					//@property {Model} model
					model: this.model
					//@property {String} deliveryMethodName
				,	deliveryMethodName: this.model.get('shipmethod') ? this.model.get('shipmethod').get('name') : ''

				,	showFulfillment: this.model.get('fulfillments').length > 0

				,	showPendingLines: !!this.model.get('pending') && this.model.get('pending').lines.length > 0

				,	targetId: 'products-ship-' + this.model.get('internalid').replace(/[^0-9a-zA-Z]/g, '-')

				,	targetPendingId: 'products-pending-ship-' + this.model.get('internalid').replace(/[^0-9a-zA-Z]/g, '-')

				,	targetAddressId: 'address-ship-' + this.model.get('internalid').replace(/[^0-9a-zA-Z]/g, '-')

				,	showFulfillmentAcordion: lines_length > this.accordionLimit

				,	showOrderAddress: !!( this.model.get('shipaddress') && this.model.get('shipaddress').get('fullname'))

				,	orderAddress: this.model.get('shipaddress')? this.model.get('shipaddress').get('fullname') : ''

				,	initiallyCollapsed: (_.isPhoneDevice()) ? '' : 'in'

				,	initiallyCollapsedArrow: (_.isPhoneDevice()) ? 'collapsed' : ''
			};

		}
	});

});