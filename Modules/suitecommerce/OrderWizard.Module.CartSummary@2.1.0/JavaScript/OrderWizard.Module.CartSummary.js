/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.CartSummary
define(
	'OrderWizard.Module.CartSummary'
,	[
		'Wizard.Module'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'GlobalViews.FormatPaymentMethod.View'

	,	'order_wizard_cart_summary.tpl'
	,	'cart_summary_gift_certificate_cell.tpl'

	,	'underscore'
	,	'Utils'
	]
,	function (
		WizardModule
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	GlobalViewsFormatPaymentMethodView

	,	order_wizard_cart_summary_tpl
	,	cart_summary_gift_certificate_cell_tpl

	,	_
	)
{
	'use strict';

	// @class OrderWizard.Module.CartSummary @extends Wizard.Module
	return WizardModule.extend({
		//@property {Function} template
		template: order_wizard_cart_summary_tpl

		//@property {String} className
	,	className: 'OrderWizard.Module.CartSummary'

		//@property {Object} attributes
	,	attributes: {
			'id': 'order-wizard-layout'
		,	'class': 'order-wizard-layout'
		}

		//@property {Object} events
	,	events: {
			'click [data-action="remove-promocode"]': 'removePromocode'
		,	'click [data-action="change-status-multishipto-sidebar"]' : 'changeStatusMultiShipTo'
		}

		//@method initialize
	,	initialize: function (options)
		{
			var self = this;

			this.wizard = options.wizard;
			this.currentStep = options.currentStep;

			//on change model we need to refresh summary
			this.wizard.model.on('change:summary change:paymentmethods', function ()
			{
				//This is an ugly hack to solve the case when the change event trigger first than the confirmation and the lines are converted to collections and models
				if (!_.isArray(self.wizard.model.get('lines')) && self.wizard.model.get('confirmation') && _.isObject(self.wizard.model.get('confirmation').attributes))
				{
					self.render();
				}
			});

			BackboneCompositeView.add(this);
		}

	,	isActive: function ()
		{
			return this.options.isConfirmation ? this.wizard.model.get('confirmation').get('internalid') : true;
		}
		//@method render
		//@return {Void}
	,	render: function()
		{
			if (this.state === 'present' )
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		// @method changeStatusMultiShipTo
		// @return {Void}
	,	changeStatusMultiShipTo: function()
		{
			this.wizard.model.trigger('update-multi-ship-to-status');
		}

		// @method removePromocode Handles the remove promocode button
		// @return {Void}
	,	removePromocode: function (e)
		{
			var self = this;

			e.preventDefault();

			// disable navigation buttons
			this.trigger('change_enable_continue', false);

			this.wizard.model.save({ promocode: null }).always(function ()
			{
				// enable navigation buttons
				self.trigger('change_enable_continue', true);

				self.wizard.model.trigger('promocodeUpdated', 'removed');
			});
		}

		//@property {Object} childViews
	,	childViews: {
			'GiftCertificates': function ()
			{
				var	gift_certificates = this.wizard.model.get('paymentmethods').where({type: 'giftcertificate'}) || [];

				return new BackboneCollectionView({
						collection: gift_certificates
					,	cellTemplate: cart_summary_gift_certificate_cell_tpl
					,	viewsPerRow: 1
					,	childView: GlobalViewsFormatPaymentMethodView
					,	rowTemplate: null
				});
			}
		}
		//@method getContext
		//@returns {OrderWizard.Module.CartSummary.Context}
	,	getContext: function ()
		{
			var confirmation = this.wizard.model.get('confirmation')
				// You need to read from confirmation from the wizards that have the isExternalCheckout and the return value is true (when returning from an external payment method)
			,	model = confirmation && confirmation.get('internalid') && this.wizard.isExternalCheckout ? confirmation : this.wizard.model
			,	summary = model.get('summary') || {}
			,	promocode = model.get('promocode')
			,	item_count = _.countItems(model.get('lines'))
			,	is_promocode_valid = promocode && promocode.isvalid;

			//@class OrderWizard.Module.CartSummary.Context
			return {
					model: model
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {Boolean} itemCountGreaterThan1
				,	itemCountGreaterThan1: item_count > 1
					//@property {Boolean} showPromocode
				,	showPromocode: !!is_promocode_valid
					//@property {Array} giftCertificates
				,	giftCertificates: model.get('paymentmethods').where({type: 'giftcertificate'}) || []
					//@property {Boolean} showGiftCertificates
				,	showGiftCertificates: !!summary.giftcertapplied
					//@property {Boolean} showDiscount
				,	showDiscount: !!summary.discounttotal
					//@property {Boolean} showHandlingCost
				,	showHandlingCost: !!summary.handlingcost
					//@property {Boolean} showRemovePromocodeButton
				,	showRemovePromocodeButton: !!this.options.allow_remove_promocode
					//@property {Boolean} showWarningMessage
				,	showWarningMessage: !!this.options.warningMessage
					//@property {String} warningMessage
				,	warningMessage: this.options.warningMessage
					//@property {Boolean} showEditCartMST
				,	showEditCartMST: this.wizard.isMultiShipTo() && !this.options.isConfirmation
			};
		}

	});
});