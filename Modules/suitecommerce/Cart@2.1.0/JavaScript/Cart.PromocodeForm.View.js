/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'Cart.PromocodeForm.View'
,	[	
		'cart_promocode_form.tpl'

	,	'underscore'
	,	'Backbone'
	]
,	function (

		cart_promocode_form_tpl

	,	_
	,	Backbone
	)
{
	'use strict';

	// @class Cart.PromocodeForm.View @extends Backbone.View
	return Backbone.View.extend({
			
		// @property {Function} template
		template: cart_promocode_form_tpl
		
	,	bindings: {
			'[name="fullname"]': 'fullname'	
		}

		// @method initialize
	,	initialize: function (options)
		{
			this.promocode = options.promocode;
		}

		// @method getContext @return {Cart.PromocodeForm.View.Context}
	,	getContext: function ()
		{
			// @class Cart.PromocodeForm.View.Context
			return {
				// @property {Object} promocode
				promocode: this.promocode
				// @property {Boolean} showErrorMessage
			,	showErrorMessage: !!( this.promocode && this.promocode.error )
				// @property {String} errorMessage
			,	errorMessage: this.promocode && this.promocode.error || ''
				// @property {String} code
			,	code: this.promocode && this.promocode.code || ''
			};
			// @class Cart.PromocodeForm.View
		}
	});
});