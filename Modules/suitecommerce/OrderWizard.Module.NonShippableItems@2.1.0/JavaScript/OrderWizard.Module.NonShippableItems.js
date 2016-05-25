/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard
define(
	'OrderWizard.Module.NonShippableItems'
,	[	'Wizard.Module'
	,	'ItemViews.Cell.Navigable.View'
	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'order_wizard_non_shippable_items_module.tpl'

	,	'underscore'
	,	'Utils'
	]
,	function (
		WizardModule
	,	ItemViewsCellNavigableView
	,	BackboneCollectionView
	,	BackboneCompositeView

	,	order_wizard_non_shippable_items_module_tpl

	,	_
	)
{
	'use strict';

	//@class OrderWizard.Module.NonShippalbeItems @extend Wizard.Module
	return WizardModule.extend(
	{
		template: order_wizard_non_shippable_items_module_tpl

	,	initialize: function ()
		{
			WizardModule.prototype.initialize.apply(this, arguments);
			this.wizard.model.on('ismultishiptoUpdated', this.render, this);

			BackboneCompositeView.add(this);
		}

		// Returns the list of non shippable items/lines
	,	getLinesNotShippable: function ()
		{
			return this.wizard.model.getNonShippableLines();
		}

	,	isActive: function()
		{
				return this.wizard.model.get('ismultishipto') && this.wizard.model.shippingAddressIsRequired();
		}

	,	render: function ()
		{
			if (this.isActive())
			{
				this._render();
			}
			else
			{
				this.$el.empty();
			}
		}

	,	childViews: {
			'NonShippableItems.Collection': function ()
			{
				return new BackboneCollectionView({
						collection: this.getLinesNotShippable()
					,	childView: ItemViewsCellNavigableView
					,	viewsPerRow: 1
					,	childViewOptions: {
							navigable: false

						,	detail1Title: _('Qty:').translate()
						,	detail1: 'quantity'

						,	detail2Title: _('Unit price').translate()
						,	detail2: 'rate_formatted'

						,	detail3Title: _('Amount:').translate()
						,	detail3: 'amount_formatted'
						}
				});
			}
		}

		//@method getContext @return {OrderWizard.Module.NonShippalbeItems.Context}
	,	getContext: function ()
		{
			var	lines_not_shippable = this.getLinesNotShippable();

			//@class OrderWizard.Module.NonShippalbeItems.Context
			return {
				//@property {Boolean} showNonShippableLines
				showNonShippableLines: !!(lines_not_shippable && lines_not_shippable.length)
				//@property {Number} nonShippableLinesLength
			,	nonShippableLinesLength: lines_not_shippable.length
			};
		}
	});
});