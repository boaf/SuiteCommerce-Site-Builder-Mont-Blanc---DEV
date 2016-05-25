/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@method LoginRegister
define('LoginRegister.View'
,	[	'login_register.tpl'

	,	'Profile.Model'
	,	'LoginRegister.Login.View'
	,	'LoginRegister.Register.View'
	,	'LoginRegister.CheckoutAsGuest.View'
	,	'Backbone.CompositeView'
	,	'SC.Configuration'
	,	'Header.Simplified.View'
	,	'Footer.Simplified.View'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		login_register_tpl

	,	ProfileModel
	,	LoginView
	,	RegisterView
	,	CheckoutAsGuestView
	,	BackboneCompositeView
	,	Configuration
	,	HeaderSimplifiedView
	,	FooterSimplifiedView

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class LoginRegister.View This class shows both the Login form and the Register at the same time. @extends Backbone.View
	return Backbone.View.extend({

		template: login_register_tpl

	,	title: _('Log in | Register').translate()

	,	events: {
			// login error message could contain link to registration page
			'click .alert-error a': 'handleErrorLink'
		}

	,	initialize: function (options)
		{
			var application = options.application
				// To distinguish between when the login is called from the Register header link or the Proceed to Checkout link, we use the origin URL param (is_checking_out)
				// origin=checkout when the checkout link is clicked so we show the guest checkout button.
			,	parameters = _.parseUrlOptions(location.search)
			,	is_checking_out = (parameters && parameters.is === 'checkout') || (parameters && parameters.origin === 'checkout') || false
			,	profile_model = ProfileModel.getInstance();

			this.child_view_options = {
					application: application
				,	parentView: this
				,	timedout: options.timedout
				};

			this.pageTitle = _('Log in').translate();

			this.enableLogin = Configuration.getRegistrationType() !== 'disabled';

			this.enableRegister = Configuration.getRegistrationType() === 'optional' || Configuration.getRegistrationType() === 'required';

			// we only show the CheckoutAsGuest button in 'checkout' touchpoint. Never in login/register touchpoints.
			this.enableCheckoutAsGuest = is_checking_out && profile_model.get('isLoggedIn') === 'F' &&
				(Configuration.getRegistrationType() === 'optional' || Configuration.getRegistrationType() === 'disabled');

			BackboneCompositeView.add(this);
		}

		// @method handleErrorLink workaround to native netsuite error links. In particular if error contains a link to the register touch-point we want to show the registration form without navigate.
	,	handleErrorLink: function (e)
		{
			// if the link contains the register touch-point
			if (~e.target.href.indexOf(Configuration.get('siteSettings.touchpoints.register')))
			{
				e.preventDefault();
				this.showRegistrationForm();

				this.childViewInstances.Login.hideError();
			}
		}

		//@method disableButtons @param {Boolean} state
	,	disableButtons: function (state)
		{
			this.childViewInstances.Login.$('a, input, button').prop('disabled', state);
			if (this.childViewInstances.CheckoutAsGuest)
			{
				this.childViewInstances.CheckoutAsGuest.$('a, input, button').prop('disabled', state);
			}
			this.childViewInstances.Register.$('a, input, button').prop('disabled', state);

			return this;
		}


		// @method showRegistrationForm  make sure the registration form is in the front
	,	showRegistrationForm: function ()
		{
			// show the form
			this.$('[data-view="Register"]').addClass('in');
			// hide the container of the link to show it
			this.$('[data-view="CheckoutAsGuest"]').removeClass('in');
		}

	,	getHeaderView: function ()
		{
			//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
			if (Configuration.getRegistrationType() !== 'disabled' && SC.getSessionInfo('passwordProtectedSite'))
			{
				return HeaderSimplifiedView;
			}
		}

	,	getFooterView: function()
		{
			//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
			if (Configuration.getRegistrationType() !== 'disabled' && SC.getSessionInfo('passwordProtectedSite'))
			{
				return FooterSimplifiedView;
			}
		}

	,	childViews: {
			'Login': function ()
			{
				return new LoginView(this.child_view_options);
			}
		,	'CheckoutAsGuest': function ()
			{
				return new CheckoutAsGuestView(_.extend({ hideRegister: !this.enableRegister }, this.child_view_options));
			}
		,	'Register': function ()
			{
				return new RegisterView(this.child_view_options);
			}
		}

		//@method getContext @return {LoginRegister.View.Context}
	,	getContext: function ()
		{
			//@class LoginRegister.View.Context
			return {
				//@property {Boolean} showRegister
				showRegister: this.enableRegister
				//@property {Boolean} showCheckoutAsGuest
			,	showCheckoutAsGuest: this.enableCheckoutAsGuest
				//@property {Boolean} showLogin
			,	showLogin: this.enableLogin
				//@property {Boolean} showRegisterOrGuest
			,	showRegisterOrGuest: this.enableRegister || this.enableCheckoutAsGuest
			};
		}
	});
});