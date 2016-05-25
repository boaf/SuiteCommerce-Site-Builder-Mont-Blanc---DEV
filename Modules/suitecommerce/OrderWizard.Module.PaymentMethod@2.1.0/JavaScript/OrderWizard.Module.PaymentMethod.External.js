/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard @class OrderWizard.Module.PaymentMethod.External @extends OrderWizard.Module.PaymentMethod
define(
	'OrderWizard.Module.PaymentMethod.External'
,	[
		'OrderWizard.Module.PaymentMethod'
	,	'Session'
	,	'OrderPaymentmethod.Model'

	,	'order_wizard_paymentmethod_external_module.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		OrderWizardModulePaymentMethod
	,	Session
	,	OrderPaymentmethodModel

	,	order_wizard_paymentmethod_external_module_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	return OrderWizardModulePaymentMethod.extend({

		template: order_wizard_paymentmethod_external_module_tpl

	,	render: function()
		{
			var checkout_url = Session.get('touchpoints').checkout
			,	joint = ~checkout_url.indexOf('?') ? '&' : '?';

			this.paymentMethod = new OrderPaymentmethodModel(
			{
					type: 'external_checkout_' + this.options.paymentmethod.key
				,	key: this.options.paymentmethod.key
				,	thankyouurl: checkout_url + joint + 'externalpayment=DONE&fragment=' +  this.options.thankyouurl
				,	errorurl: checkout_url + joint + 'externalpayment=FAIL&fragment=' + this.options.errorurl
			});

			this._render();

		}

	,	getContext: function ()
		{
			return {
					//@property {String} imageUrl
					imageUrl: this.options.paymentmethod.imagesrc[0]
					//@property {String} name
				,	name: this.options.paymentmethod.name
					//@property {String} description
				,	description: this.options.description || _('You will be redirected to your external payment site after reviewing your order on next step. Once your order is placed, you will return to our site to see the confirmation of your purchase.').translate()
			};
		}

	});
});