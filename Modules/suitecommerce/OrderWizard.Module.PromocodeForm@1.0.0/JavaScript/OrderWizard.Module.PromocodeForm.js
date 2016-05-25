/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard.Module.PromocodeForm
define(
	'OrderWizard.Module.PromocodeForm'
,	[
		'Wizard.Module'
	,	'ErrorManagement'
	,	'Backbone.CompositeView'
	,	'Cart.PromocodeForm.View'
	,	'GlobalViews.Message.View'

	,	'order_wizard_promocodeform.tpl'

	,	'underscore'
	,	'jQuery'
	,	'jQuery.serializeObject'
	,	'Utils'
	]
,	function (
		WizardModule
	,	ErrorManagement
	,	BackboneCompositeView
	,	CartPromocodeFormView
	,	GlobalViewsMessageView

	,	order_wizard_promocodeform_tpl

	,	_
	,	jQuery
	)
{
	'use strict';

	// @class OrderWizard.Module.PromocodeForm @extends Wizard.Module
	return WizardModule.extend({
		//@property {Function} template
		template: order_wizard_promocodeform_tpl

		//@property {Object} events
	,	events: {
			'submit form[data-action="apply-promocode"]': 'applyPromocode'
		,	'shown [data-action="show-promo-code-container"]' : 'onPromocodeFormShown'
		}

		//@method initialize
	,	initialize: function (options)
		{
			this.wizard = options.wizard;
			this.currentStep = options.currentStep;

			BackboneCompositeView.add(this);

			this.wizard.model.on('change:promocode', this.render, this);
		}

		//@method render
	,	render: function()
		{
			if (this.state === 'present' && !this.isSaving)
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		//@method isActive
		//@return {Boolean}
	,	isActive: function ()
		{
			var shippable_items = this.wizard.model.getShippableLines();
			return !this.wizard.isMultiShipTo() && !!shippable_items.length;
		}

		// @method applyPromocode Handles the submit of the apply promo code form
	,	applyPromocode: function (e)
		{
			var self = this
			,	$target = jQuery(e.target)
			,	options = $target.serializeObject();

			e.preventDefault();
			e.stopPropagation();

			this.$('[data-type=promocode-error-placeholder]').empty();

			// disable navigation buttons
			this.trigger('change_enable_continue', false);

			// disable inputs and buttons
			$target.find('input, button').prop('disabled', true);
			this.isSaving = true;

			this.wizard.model.save({ promocode: { code: options.promocode } })
			.fail(
				function (jqXhr)
				{
					self.wizard.model.unset('promocode');
					jqXhr.preventDefault = true;
					var message = ErrorManagement.parseErrorMessage(jqXhr, self.wizard.application.getLayout().errorMessageKeys);
					var global_view_message = new GlobalViewsMessageView({
						message: message
					,	type: 'error'
					,	closable: true
					});

					self.$('[data-type=promocode-error-placeholder]').html(global_view_message.render().$el.html());
					$target.find('input[name=promocode]').val('').focus();
					self.isSaving = false;
				}
			).done(
				function ()
				{
					self.isSaving = false;
					$target.find('input[name=promocode]').val('');
					self.render();
				}
			).always(
				function ()
				{
					// enable navigation buttons
					self.trigger('change_enable_continue', true);
					// enable inputs and buttons
					$target.find('input, button').prop('disabled', false);

					self.wizard.model.trigger('promocodeUpdated', 'applied');
				}
			);
		}

		// @method onPromocodeFormShown Handles the shown of promocode form
	,	onPromocodeFormShown: function (e)
		{
			jQuery(e.target).find('input[name="promocode"]').focus();
		}

		//@property {Object} childViews
	,	childViews: {
			'Cart.PromocodeForm': function ()
			{
				var promocode = this.wizard.model.get('promocode');
				return new CartPromocodeFormView({promocode : promocode});
			}
		}

		//@method getContext @returns OrderWizard.Module.CartSummary.Context
	,	getContext: function ()
		{
			var	model = this.wizard.model
			,	promocode = model.get('promocode')
			,	is_promocode_valid = promocode && promocode.isvalid;

			//@class OrderWizard.Module.CartSummary.Context
			return {
					model: model
					//@property {Boolean} isMultiShipTo
				,	isMultiShipTo: !!model.get('ismultishipto')
					//@property {Boolean} showPromocodeForm
				,	showPromocodeForm: !is_promocode_valid
			};
		}

	});
});