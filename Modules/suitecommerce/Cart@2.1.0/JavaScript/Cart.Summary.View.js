/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'Cart.Summary.View'
,	[
		'SC.Configuration'
	,	'Cart.PromocodeForm.View'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'GlobalViews.FormatPaymentMethod.View'
	,	'Profile.Model'
	,	'Session'

	,	'cart_summary.tpl'
	,	'cart_summary_gift_certificate_cell.tpl'

	,	'underscore'
	,	'Backbone'
	]
,	function (

		Configuration
	,	CartPromocodeFormView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	GlobalViewsFormatPaymentMethodView
	,	ProfileModel
	,	Session

	,	cart_summary_tpl
	,	cart_summary_gift_certificate_cell_tpl

	,	_
	,	Backbone
	)
{
	'use strict';

	// @class Cart.Summary.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_summary_tpl

		// @method initialize
	,	initialize: function (options)
		{
			this.model = options.model;
			BackboneCompositeView.add(this);
		}

		// @property {Object} childViews
	,	childViews: {
				'Cart.PromocodeFrom': function ()
				{
					return new CartPromocodeFormView({ promocode: this.model.get('promocode') });
				}
			,	'GiftCertificates': function ()
				{
					var	gift_certificates = this.model.get('paymentmethods').where({type: 'giftcertificate'}) || [];

					return new BackboneCollectionView({
							collection: gift_certificates
						,	cellTemplate: cart_summary_gift_certificate_cell_tpl
						,	viewsPerRow: 1
						,	childView: GlobalViewsFormatPaymentMethodView
						,	rowTemplate: null
					});
				}
		}

		//@method getUrlLogin
		//@param {Void}
		//@return {String}
	,	getUrlLogin: function ()
		{
			var login = Session.get('touchpoints.login'),
				currentTouchpoint = this.model.application && this.model.application.Configuration.currentTouchpoint ? this.model.application.Configuration.currentTouchpoint : 'home';

			login += '&origin=' + currentTouchpoint;

			if (this.$el.closest('.modal-product-detail').size() > 0) //we are in the quick view
			{
				var hashtag = this.$el.closest('.modal-product-detail').find('[data-name="view-full-details"]').data('hashtag');
				login += '&origin_hash=' + encodeURIComponent(hashtag.replace('#/', ''));
			}
			else
			{
				login += '&origin_hash=' + encodeURIComponent(Backbone.history.fragment);
			}

			return login;
		}

		// @method getContext @return Cart.Summary.View.Context
	,	getContext: function ()
		{
			var	continueURL = Configuration.siteSettings.sitetype === 'ADVANCED' ? Configuration.defaultSearchUrl : ''
			,	is_wsdk = false
			,	summary = this.model.get('summary')
			,	item_count = _.reduce(this.model.get('lines').pluck('quantity'), function (memo, quantity) { return memo + (parseFloat(quantity) || 1); }, 0)
			,	shipping_address = this.model.get('addresses').get(this.model.get('shipaddress')) || new Backbone.Model()
			,	default_country = shipping_address.get('country') || Configuration.siteSettings.defaultshipcountry
			,	shipping_zip_code = shipping_address.get('zip')
			,	promocode = this.model.get('promocode')
			,	gift_certificates = this.model.get('paymentmethods').where({type: 'giftcertificate'}) || []
			,	single_country = _.size(Configuration.siteSettings.countries) === 1
			,	is_zipcode_require
			,	selected_country
			,	countries_list
			,	is_estimated_shipping_valid
			,	show_estimation_form = true
			,	countries = _.clone(Configuration.siteSettings.countries);

			//Determine if the Zip Code is require and just leave selected the current address
			if (countries && default_country && countries[default_country])
			{
				selected_country = _.findWhere(countries, {selected:true});
				if (selected_country)
				{
					selected_country.selected = false;
				}

				countries[default_country].selected = true;
				is_zipcode_require = countries[default_country].isziprequired !== 'F';
				selected_country = countries[default_country];
				countries_list = _.toArray(countries);
			}
			else
			{
				selected_country = _.findWhere(countries, {selected:true});
				countries_list = _.toArray(countries);

				if (!selected_country)
				{
					selected_country = _.first(countries_list);
				}
				is_zipcode_require = selected_country.isziprequired !== 'F';
			}

			//Determine if the current address is valid (completed)
			if (_.isString(shipping_address.id) && shipping_address.id !== '-------null')
			{
				is_estimated_shipping_valid = is_zipcode_require ? !!shipping_zip_code : !!shipping_address.get('country');
			}
			else
			{
				is_estimated_shipping_valid = false;
			}

			//Check is WSDK is configured
			if (Configuration.siteSettings.iswsdk && Configuration.siteSettings.wsdkcancelcarturl)
			{
				continueURL = Configuration.siteSettings.wsdkcancelcarturl;
				is_wsdk = true;
			}

			//Calculate if the estimation form should be rendered or not
			if (is_estimated_shipping_valid && is_zipcode_require)
			{
				show_estimation_form = false;
			}
			else if (is_estimated_shipping_valid)
			{
				show_estimation_form = !this.options.showEstimated;
			}
			else
			{
				show_estimation_form = true;
			}

			// @class Cart.Summary.View.Context
			return {
					// @property {LiveOrder.Model} model
					model: this.model
					// @property {Boolean} isWSDK
				,	isWSDK: is_wsdk
					// @property {String} continueURL
				,	continueURL: continueURL
					// @property {Boolean} showShipto
				,	showShipto: true
					// @property {Boolean} showActions
				,	showActions: true
					// @property {Boolean} showLabelsAsEstimated
				,	showLabelsAsEstimated: true
					// @property {Object} summary
				,	summary: summary
					// @property {Number} itemCount
				,	itemCount: item_count
					// @property {Boolean} singleItem
				,	singleItem: item_count === 1
					// @property {Boolean} isZipCodeRequire
				,	isZipCodeRequire: is_zipcode_require
					// @property {Boolean} showEstimate Shows or not the estimation form
				,	showEstimate: show_estimation_form
					// @property {Boolean} showPromocodeForm
				,	showPromocodeForm: !(promocode && promocode.isvalid)
					// @property {Boolean} showHandlingCost
				,	showHandlingCost: !!summary.handlingcost
					// @property {Boolean} showGiftCertificates
				,	showGiftCertificates: !!summary.giftcertapplied
					// @property {Object} promocode
				,	promocode: promocode
					// @property {Boolean} promocodeValid
				,	promocodeValid: promocode && promocode.isvalid
					// @property {Array} giftCertificates
				,	giftCertificates: gift_certificates
					// @property {Boolean} showDiscount
				,	showDiscount: (promocode && promocode.isvalid) || !!summary.giftcertapplied
					// @property {Boolean} showDiscountTotal
				,	showDiscountTotal: !!summary.discounttotal
					// @property {Boolean} defaultCountry
				,	defaultCountry: default_country
					// @property {Boolean} defaultCountryIsUS
				,	defaultCountryIsUS: default_country === 'US'
					// @property {Array} countries
				,	countries: countries_list
					// @property {Boolean} singleCountry
				,	singleCountry: single_country
					// @property {String} singleCountryCode
				,	singleCountryCode: single_country ? countries_list[0].code : ''
					// @property {String} shipToText
				,	shipToText: shipping_zip_code || selected_country.name
					// @property {String} singleCountryName
				,	singleCountryName: single_country ? countries_list[0].name : ''
					// @property {String} shippingZipCode
				,	shippingZipCode: shipping_zip_code || ''
					// @property {Boolean} showPaypalButton
				,	showPaypalButton: Configuration.siteSettings.checkout.paypalexpress.available === 'T'
					// @property {Boolean} paypalButtonImageUrl
				,	paypalButtonImageUrl: Configuration.get('paypalButtonImageUrl', 'https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-large.png')
					// @property {Boolean} showProceedButton
                ,   showProceedButton: Configuration.siteSettings.sitetype === 'STANDARD'
                	// @property {Boolean} isPriceEnabled
				,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
					// @property {String} urlLogin
				,	urlLogin: this.getUrlLogin()
			};
			// @class Cart.Summary.View
		}
	});

});