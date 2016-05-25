/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderWizard.Module.PaymentMethod.Creditcard.js
// --------------------------------
//
define(
	'OrderWizard.Module.PaymentMethod.Invoice'
,	[	'OrderWizard.Module.PaymentMethod'
	,	'OrderPaymentmethod.Model'

	,	'order_wizard_paymentmethod_invoice_module.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		OrderWizardModulePaymentMethod
	,	OrderPaymentmethodModel

	,	order_wizard_paymentmethod_invoice_module_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	return OrderWizardModulePaymentMethod.extend({

		template: order_wizard_paymentmethod_invoice_module_tpl

	,	events: {
			'click [data-toggle="show-terms"]': 'showTerms'
		}

	,	errors: ['ERR_WS_INVALID_PAYMENT', 'ERR_CHK_INVOICE_CREDIT_LIMIT']

	,	showTerms: function()
		{
			var self = this
			,	TermsView = Backbone.View.extend({
					title: _('Terms and Conditions').translate()
				,	render: function ()
					{
						this.$el.html(self.wizard.application.getConfig('invoiceTermsAndConditions'));
						return this;
					}
				});

			this.wizard.application.getLayout().showInModal(new TermsView());
		}

	,	isActive: function ()
		{
			var terms = this.terms = this.getProfile().get('paymentterms');
			return terms && terms.internalid;
		}

	,	getProfile: function ()
		{
			return this.wizard.options.profile;
		}

	,	render: function ()
		{
			if (this.isActive())
			{
				return this._render();
			}
		}

	,	submit: function ()
		{
			var self = this
			,	purchase_order_number =  self.$('[name=purchase-order-number]').val() || '';

			return this.isValid().done(function ()
			{
				self.terms.purchasenumber = purchase_order_number;
				self.paymentMethod = new OrderPaymentmethodModel(
				{
						type: 'invoice'
					,	terms: self.wizard.options.profile.get('paymentterms')
					,	purchasenumber: purchase_order_number
				});

				OrderWizardModulePaymentMethod.prototype.submit.apply(self);
			});
		}
	,	getContext: function ()
		{
			var payment_method =  this.model.get('paymentmethods').findWhere({
					type: 'invoice'
			});
			var purchase_number = (payment_method && payment_method.get('purchasenumber')) || this.terms.purchasenumber || '';

			return {
					//@property {String} termsName
					termsName: this.terms.name
					//@property {Boolean} showTerms
				,	showTerms: this.wizard.application.getConfig('siteSettings.checkout.requiretermsandconditions') === 'T'
					//@property {String} purchaseNumber
				,	purchaseNumber: purchase_number
					//@property {String} balanceAvailable
				,	balanceAvailable: this.wizard.options.profile.get('balance_available_formatted') || ''
			};
		}
	});
});