/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define(
	'OrderWizard.Module.MultiShipTo.EnableLink'
,	[	'Wizard.Module'
	,	'OrderWizard.PromocodeUnsupported.View'

	,	'order_wizard_msr_enablelink_module.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		WizardModule
	,	PromocodeUnsupportedView

	,	order_wizard_msr_enablelink_module_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	//@class OrderWizard.Module.MultiShipTo.EnableLink @extend Wizard.Module
	return WizardModule.extend(
	{
		template: order_wizard_msr_enablelink_module_tpl
	,	className: 'OrderWizard.Module.MultiShipTo.EnableLink'

	,	events: {
			'click [data-action="change-status-multishipto"]': 'updateMultiShipToStatus'
		}

		// Determines if the current module is valid to be shown and operate with
	,	isActive: function ()
		{
			var shippable_items = this.wizard.model.getShippableLines();
			return this.wizard.application.getConfig('siteSettings.isMultiShippingRoutesEnabled', false) && (shippable_items.length > 1 || (shippable_items.length === 1 && shippable_items[0].get('quantity') > 1));
		}

	,	initialize: function()
		{
			WizardModule.prototype.initialize.apply(this, arguments);
			if(!this.wizard.model._events['toggle-multi-ship-to'])
			{
				this.wizard.model.on('toggle-multi-ship-to', _.bind(this.toggleMultiShipTo,this));
				this.wizard.model.on('update-multi-ship-to-status', _.bind(this.updateMultiShipToStatus, this));
				this.wizard.model.on('ismultishiptoUpdated', _.bind(this.render, this));
			}
		}
		// Handle the change between module ship to and single ship to
	,	updateMultiShipToStatus: function (e)
		{
			e && e.preventDefault();

			var application = this.wizard.application;

			if (this.wizard.model.get('promocode'))
			{
				this.promocodeUnsupportedView = new PromocodeUnsupportedView({
					model: this.wizard.model
				,	application: application
				,	parent: this
				});
				this.wizard.model.on('toggle-multi-ship-to',this.toggleMultiShipTo,this);
				application.getLayout().showInModal(this.promocodeUnsupportedView);
			}
			else
			{
				this.toggleMultiShipTo();
			}
		}

	,	toggleMultiShipTo: function()
		{
			if (!this.wizard.model.get('ismultishipto'))
			{
				//These unsets are silent in order to avoid problems with other modules
				this.wizard.model.set('shipmethod',  null, {silent: true});
				this.wizard.model.set('sameAs', false, {silent: true});
				this.wizard.model.set('shipaddress', null, {silent: true});
			}

			var self = this;
			this.wizard.model.set('ismultishipto', !this.wizard.model.get('ismultishipto'));

			this.wizard.model.save()
				.done(function ()
				{
					self.wizard.model.trigger('ismultishiptoUpdated');
					Backbone.history.navigate(self.options.change_url || '/', {trigger: true});
					self.render();
				});
		}

		//We override render to just render this module in case the multi ship to feature is enabled
	,	render: function ()
		{
			if (this.isActive())
			{
				this._render();
				this.trigger('ready', true);
			}
		}

		//@method getContext @return {OrderWizard.Module.MultiShipTo.EnableLink.Context}
	,	getContext: function ()
		{
			//@class OrderWizard.Module.MultiShipTo.EnableLink.Context
			return {
				//@property {Boolean} isMultiShipToEnabled
				isMultiShipToEnabled: !!this.model.get('ismultishipto')
			};
		}
	});
});