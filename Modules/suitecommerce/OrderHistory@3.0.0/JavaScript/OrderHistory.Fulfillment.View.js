/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.Fulfillment.View'
,	[	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'ItemViews.Cell.Actionable.View'
	,	'OrderHistory.List.Tracking.Number.View'
	,	'ItemViews.Item.QuantityAmount.View'
	,	'OrderHistory.Item.Actions.View'
	,	'TrackingServices'
	,	'order_history_fulfillment.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		BackboneCompositeView
	,	BackboneCollectionView
	,	ItemViewsCellActionableView
	,	OrderHistoryListTrackingNumberView
	,	ItemViewsItemQuantityAmountView
	,	OrderHistoryItemActionsView
	,	TrackingServices
	,	order_history_fulfillment_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class OrderHistory.Fulfillment.View @extend Backbone.View
	return Backbone.View.extend({
		//@property {Function} template
		template: order_history_fulfillment_tpl
		//@method initialize
	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}
		//@property {Object} childViews
	,	childViews: {

			'TrackingNumbers': function()
			{
				return new OrderHistoryListTrackingNumberView({
					model: new Backbone.Model({trackingNumbers: this.model.get('trackingnumbers')})
				,	showTrackPackagesLabel: true
				});
			}

		,	'Items.Collection': function ()
			{
				return new BackboneCollectionView({
						collection: this.model.get('lines')
					,	childView: ItemViewsCellActionableView
					,	viewsPerRow: 1
					,	childViewOptions: {
							navigable: true
						,	application: this.options.application
						,	SummaryView: ItemViewsItemQuantityAmountView
						,	ActionsView: OrderHistoryItemActionsView
						,	hideComparePrice: true
						,	useLinePrice: true
					}
				});
			}
		}

		//@method getContext @return OrderHistory.Fulfillment.View.Context
	,	getContext: function ()
		{
			var lines_length = 0;

			_.each(this.model.get('fulfillments'), function (fulfillment)
			{
				lines_length += fulfillment.get('lines').length;
			});

			//@class OrderHistory.Fulfillment.View.Context
			return {
					//@property {Model} model
					model: this.model
					//@property {Boolean} showLines
				,	showLines: !!lines_length
					//@property {Number} linesLength
				,	linesLength: lines_length
					//@property {Boolean} linesLengthGreaterThan1
				,	linesLengthGreaterThan1: lines_length > 1
					//@property {Boolean} collapseElements
				,	collapseElements: this.options.application.getConfig('collapseElements')
					//@property {Boolean} showDeliveryMethod
				,	showDeliveryMethod: !!(this.model.get('shipmethod') && this.model.get('shipmethod').get('name'))
					//@property {String} deliveryMethodName
				,	deliveryMethodName: this.model.get('shipmethod') ? this.model.get('shipmethod').get('name') : ''
					//@property {Boolean} showDeliverySatatus
				,	showDeliveryStatus: !!(this.model.get('status') && this.model.get('status').name)
					//@property {String} deliveryStatus
				,	deliveryStatus: this.model.get('status') ? this.model.get('status').name : ''
					//@property {Boolean} showDate
				,	showDate: !!this.model.get('date')
					//@property {String} date
				,	date: this.model.get('date') ? this.model.get('date') : ''
			};

		}
	});

});