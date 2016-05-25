/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Router'
,	[	'Cart.Detailed.View'
	,	'LiveOrder.Model'

	,	'jQuery'
	,	'Backbone'
	]
,	function (
		CartDetailedView
	,	LiveOrderModel

	,	jQuery
	,	Backbone
	)
{
	'use strict';

	// @class Cart.Router responsible to know render the cart when the user navigates to the cart url @extends Backbone.Router
	return Backbone.Router.extend({

		routes: {
			'cart': 'showCart'
		,	'cart?*options': 'showCart'
		}

	,	initialize: function (Application, isSaveForLater)
		{
			this.isSaveForLater = isSaveForLater;
			this.application = Application;
		}

		// @method showCart handles the /cart path by showing the cart view.
	,	showCart: function ()
		{
			var self = this
			,	cart = LiveOrderModel.getInstance()
			,	optimistic_promise = cart.optimistic && cart.optimistic.promise
			,	cart_promise = LiveOrderModel.loadCart();

			jQuery.when(optimistic_promise || jQuery.Deferred().resolve(), cart_promise).done(function ()
			{
				var view = new CartDetailedView({
					model: cart
				,	application: self.application
				});

				view.showContent();
			});
		}
	});
});
