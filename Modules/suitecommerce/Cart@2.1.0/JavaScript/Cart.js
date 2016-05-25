/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart'
,	[
		'LiveOrder.Model'
	,	'Cart.Confirmation.View'
	,	'Cart.Router'

	,	'underscore'
	,	'jQuery'
	,	'Backbone'
	,	'Profile.Model'
	]
,	function (
		LiveOrderModel
	,	CartConfirmationView
	,	Router

	,	_
	,	jQuery
	,	Backbone
	)
{
	'use strict';

	return {

		/*
		@class Cart

		Defines the Cart module (Model, Collection, Views, Router)

		mountToApp() handles some environment issues

		Add some function to the application and to the layout:

		* showMiniCart()
		* showCartConfirmationModal()
		* goToCart()
		* showCartConfirmation()

		@extends ApplicationModule
		*/

		mountToApp: function (application)
		{
			var layout = application.getLayout()
			,	cart = LiveOrderModel.getInstance();

			// layout.showMiniCart()
			layout.showMiniCart = function ()
			{
				jQuery(document).scrollTop(0);
				// Hide the modal
				layout.$containerModal && layout.$containerModal.length && layout.$containerModal.modal('hide');
				this.headerViewInstance && this.headerViewInstance.showMiniCart();

			};

			// layout.showCartConfirmationModal()
			layout.showCartConfirmationModal = function ()
			{
				this.showInModal(new CartConfirmationView({
					layout: this
				,	application: application
				,	model: cart
				}));
			};

			// layout.goToCart()
			layout.goToCart = function ()
			{
				Backbone.history.navigate('cart', { trigger: true });
			};

			// layout.showCartConfirmation()
			// This reads the configuration object and execs one of the fuctions avome
			layout.showCartConfirmation = function ()
			{
				// Available values are: goToCart, showMiniCart and showCartConfirmationModal
				layout[application.getConfig('addToCartBehavior')]();
			};

			// Check if cart was bootstrapped
			if (!SC.ENVIRONMENT.CART_BOOTSTRAPED)
			{
				// Load the cart information
				LiveOrderModel.loadCart();
			}
			else if (SC.ENVIRONMENT.CART)
			{
				cart.set(SC.ENVIRONMENT.CART);

				cart.cartLoad = cart.cartLoad || jQuery.Deferred();

				cart.isLoading = false;

				cart.cartLoad.resolveWith(SC.ENVIRONMENT.CART);
			}

			application.getCart = function()
			{
				var cart_promise = jQuery.Deferred();

				LiveOrderModel.loadCart().done(function ()
				{
					cart_promise.resolve(cart);
				})
				.fail(function ()
				{
					cart_promise.reject.apply(this, arguments);
				});

				return cart_promise;
			};

			// Initializes the router
			if (application.getConfig('modulesConfig.Cart.startRouter') || true)
			{
				return new Router(application, application.getConfig('modulesConfig.Cart.saveForLater'));
			}

		}
	};
});
