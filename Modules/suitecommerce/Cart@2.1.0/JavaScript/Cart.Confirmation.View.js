/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Confirmation.View'
,	[
		'ItemViews.Price.View'
	,	'Backbone.CompositeView'
	,	'ItemViews.SelectedOption.View'
	,	'Backbone.CollectionView'

	,	'cart_confirmation_modal.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ItemViewsPriceView
	,	BackboneCompositeView
	,	ItemViewsSelectedOptionView
	,	BackboneCollectionView

	,	cart_confirmation_modal_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Cart.Confirmation.View Cart Confirmation view @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_confirmation_modal_tpl

		// @property {String} title
	,	title: _('Added to Cart').translate()

	,	modalClass: 'global-views-modal-large'
	
		// @property {String} page_header
	,	page_header: _('Added to Cart').translate()

		// @property {Object} attributes
	,	attributes: {
			'id': 'shopping-cart'
		,	'class': 'add-to-cart-confirmation-modal shopping-cart-modal'
		}

		// @property {Object} events
	,	events: {
			'click [data-trigger=go-to-cart]': 'dismisAndGoToCart'
		}

		// @method initialize
	,	initialize: function (options)
		{
			this.model = options.model;
			this.line = this.model.getLatestAddition();

			var self = this
			,	optimistic = this.model.optimistic;

			if (optimistic && optimistic.promise && optimistic.promise.state() === 'pending')
			{
				this.line = options.model.optimisticLine;
				delete this.model.optimisticLine;

				optimistic.promise.done(function ()
				{
					self.line = options.model.getLatestAddition();
					self.render();
				});
			}

			BackboneCompositeView.add(this);
		}

		// @method dismisAndGoToCart
		// Closes the modal and calls the goToCart
	,	dismisAndGoToCart: function (e)
		{
			e.preventDefault();
			this.$containerModal.modal('hide');
			this.options.layout.goToCart();
		}

		// @property {Object} childViews
	,	childViews: {
				'Item.Price': function ()
				{
				return new ItemViewsPriceView({
					model: this.line.get('item')
				,	origin: 'PDPCONFIRMATION'
				});
				}
			,	'Item.SelectedOptions': function ()
				{
					return new BackboneCollectionView({
						collection: new Backbone.Collection(this.line.get('item').getPosibleOptions())
					,	childView: ItemViewsSelectedOptionView
					,	viewsPerRow: 1
					,	childViewOptions: {
							cartLine: this.line
						}
					});
				}
		}

		// @method getContext
		// @return {Cart.Confirmation.View.Context}
	,	getContext: function()
		{
			var item = this.line.get('item');

			// @class Cart.Confirmation.View.Context
			return {
					// @property {OrderLine.Model} line
					line: this.line
					// @property {ItemDetails.Model} item
				,	item: item
					// @property {Boolean} showQuantity
				,	showQuantity: (item.get('_itemType') !== 'GiftCert') && (this.line.get('quantity') > 0)
					//@property {String} itemPropSku
				,	itemPropSku: (item.get('_sku'))
			};
		}
		// @class Cart.Confirmation.View
	});

});
