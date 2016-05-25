/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define(
	'OrderWizard.PromocodeUnsupported.View'
,	[	'order_wizard_promocode_unsupported.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		order_wizard_promocode_unsupported_tpl

	,	Backbone
	,	_
	)
{
	'use strict';
	//@class OrderWizard.PromocodeUnsupported.View Handles the case when you want to activate multi ship-to and you have promocode @extends Backbone.View
	return Backbone.View.extend({
		//@property {Function} template
		template: order_wizard_promocode_unsupported_tpl
		//@property {Object} events
	,	events: {
			'click [data-action="continue"]': 'continueHandler'
		}
		//@method initialize
	,	initialize: function ()
		{
			Backbone.View.prototype.initialize.apply(this, arguments);
			this.title = _('Promo Code is not supported').translate();
			this.message = _('We\'re sorry but promo codes are not supported when sending to multiple locations. If you continue the promotion won\'t be applied. ').translate();
		}
		//@method continueHandler
	,	continueHandler: function ()
		{
			this.$('[data-dismiss=modal]').click();
			this.model.trigger('toggle-multi-ship-to');
		}
		//@method getContext @returns OrderWizard.PromocodeUnsupported.View.Context
	,	getContext: function ()
		{
			//@class OrderWizard.PromocodeUnsupported.View.Context
			return {
					//@property {String} title
					title: this.title
					//@property {String} message
				,	message: this.message
			};
		}
	});
});