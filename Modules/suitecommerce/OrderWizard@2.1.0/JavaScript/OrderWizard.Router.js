/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define('OrderWizard.Router'
,	[	
		'Wizard.Router'
	,	'Session'
	,	'OrderWizard.Step'
	,	'LiveOrder.Model'
	,	'Profile.Model'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		WizardRouter
	,	Session
	,	OrderWizardStep
	,	LiveOrderModel
	,	ProfileModel

	,	_
	,	Backbone
	)
{
	'use strict';
	//@class OrderWizard.Router @extends Wizard.Router
	return WizardRouter.extend({
		//@property {OrderWizard.Step} step
		step: OrderWizardStep
		//@method initialize
	,	initialize: function ()
		{
			WizardRouter.prototype.initialize.apply(this, arguments);

			this.profileModel = ProfileModel.getInstance();

			if (this.application.getConfig('startCheckoutWizard') && !~_.indexOf(this.stepsOrder, ''))
			{
				this.route('', 'startWizard');
				this.route('?:options', 'startWizard');
			}
		}
		//@method startWizard
	,	startWizard: function ()
		{
			Backbone.history.navigate(this.getFirstStepUrl(), {trigger: false, replace:true});
			this.runStep();
		}
		//@method hidePayment
	,	hidePayment: function ()
		{
			return this.application.getConfig('siteSettings.checkout.hidepaymentpagewhennobalance') === 'T' && this.model.get('summary').total === 0;
		}
		//@method isPaypal
	,	isPaypal: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && selected_paymentmethod.get('type') === 'paypal';
		}
		//@method isPaypalComplete
	,	isPaypalComplete: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && selected_paymentmethod.get('type') === 'paypal' && selected_paymentmethod.get('complete');
		}
		//@method isExternalCheckout
	,	isExternalCheckout: function ()
		{
			var selected_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
			return selected_paymentmethod && !!~selected_paymentmethod.get('type').indexOf('external_checkout');
		}
	,	isMultiShipTo: function ()
		{
			return this.model.get('ismultishipto');
		}
		//@method runStep
	,	runStep: function (options)
		{
			// Computes the position of the user in the flow
			var url = (options) ? Backbone.history.fragment.replace('?' + options, '') : Backbone.history.fragment
			,	position = this.getStepPosition(url)
			,	content = ''
			,	page_header = ''
			,	last_order_id = _.parseUrlOptions(options).last_order_id;

			if (last_order_id && !this.model.get('confirmation').get('internalid'))
			{
				if (this.profileModel.get('isGuest') !== 'T')
				{
					//checkout just finnished and user refreshed the doc.
					page_header = _('Your Order has been placed').translate();
					content = _('If you want to review your last order you can go to <a href="#" data-touchpoint="$(0)" data-hashtag="#/ordershistory/view/salesorder/$(1)">Your Account</a>. ')
						.translate('customercenter', last_order_id) +
						_('Or you can continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ').translate();
				}
				else
				{
					page_header = _('Your Shopping Cart is empty').translate();
					content = _('Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>. ').translate();
				}

				var layout = this.application.getLayout();

				return layout.internalError && layout.internalError(content, page_header, _('Checkout').translate());
			}

			// if you have already placed the order you can not be in any other step than the last
			if (this.model && this.model.get('confirmation') && (this.model.get('confirmation').get('confirmationnumber') || this.model.get('confirmation').get('tranid')) && position.toLast !== 0)
			{
				window.location = Session.get('touchpoints.home');
				return;
			}

			WizardRouter.prototype.runStep.apply(this, arguments);

		}
	});
});
