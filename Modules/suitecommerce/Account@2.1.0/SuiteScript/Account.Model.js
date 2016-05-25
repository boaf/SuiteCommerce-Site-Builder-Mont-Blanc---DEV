/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Account
// ----------
// Handles account creation, login, logout and password reset
// module Account
define(
	'Account.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'Profile.Model'
	,	'LiveOrder.Model'
	,	'Address.Model'
	,	'CreditCard.Model'
	,	'SiteSettings.Model'
	]

,	function (SCModel, Application, Profile, LiveOrder, Address, CreditCard, SiteSettings)
{
	'use strict';

	// @class Account.Model Defines the model used by the all Account related services.
	// @extends SCModel
	return SCModel.extend({

		name: 'Account'

		//@method login
		//@param {String} email
		//@param {String} password
		//@param {Boolean} redirect
		//@returns {Account.Model.Attributes} ret touchpoints and user profile data
	,	login: function (email, password, redirect)
		{
			session.login({
				email: email
			,	password: password
			});

			var user = Profile.get();
			user.isLoggedIn = session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = session.isRecognized() ? 'T' : 'F';

			var ret = {
				touchpoints: session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			};

			if (!redirect)
			{
				var Environment = Application.getEnvironment(session, request)
				,	language = Environment && Environment.currentLanguage || {};
				language.url = language.locale && session.getAbsoluteUrl('checkout', '/languages/' + language.locale + '.js') || '';

				_.extend(ret, {
					cart: LiveOrder.get()
				,	address: Address.list()
				,	creditcard: CreditCard.list()
				,	language: language
				,	currency: Environment && Environment.currentCurrency || ''
				});
			}

			// New record to return
			// @class Account.Model.Attributes
				// @property {Array<Object>} touchpoints
				// @property {Profile.Model} user
				// @property {LiveOrder.Model.Data} cart
				// @property {Array<Address.Model.Attributes>} address
				// @property {Array<Address.Model.Attributes>} creditcard
				// @property {Object} language
				// @property {Object} currency
			// @class Account.Model
			return ret;
		}

		//@method forgotPassword
		//@param {String} email
		//@returns {Boolean} success
	,	forgotPassword: function (email)
		{
			try
			{
				// this API method throws an exception if the email doesn't exist
				// 'The supplied email has not been registered as a customer at our Web store.'
				session.sendPasswordRetrievalEmail(email);
			}
			catch (e)
			{
				var error = Application.processError(e);
				// if the customer failed to log in previously
				// the password retrieval email is sent but an error is thrown
				if (error.errorCode !== 'ERR_WS_CUSTOMER_LOGIN')
				{
					throw e;
				}
			}

			return  {
				success: true
			};
		}

		//@method resetPassword
		//@param {Object} params
		//@param {String} password
		//@returns {Boolean} success
	,	resetPassword: function (params, password)
		{
			if (!session.doChangePassword(params, password))
			{
				throw new Error('An error has occurred');
			}
			else
			{
				return {
					success: true
				};
			}
		}

		//@method registerAsGuest
		//@param {Object} user
		//@return {Account.Model.Attributes}
	,	registerAsGuest: function (user)
		{
			var site_settings = SiteSettings.get();

			if (site_settings.registration.companyfieldmandatory === 'T')
			{
				user.companyname = 'Guest Shopper';
			}

			session.registerGuest(user);

			user = Profile.get();
			user.isLoggedIn = session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = session.isRecognized() ? 'T' : 'F';

			return {
				touchpoints: session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			,	cart: LiveOrder.get()
			,	address: Address.list()
			,	creditcard: CreditCard.list()
			};
		}

		//@method register
		//@param {UserData} user_data
		//@param {Account.Model.Attributes} user_data
	,	register: function (user_data)
		{
			var customer = session.getCustomer();

			if (customer.isGuest())
			{
				var guest_data = customer.getFieldValues();

				customer.setLoginCredentials({
					internalid: guest_data.internalid
				,	email: user_data.email
				,	password: user_data.password
				});

				session.login({
					email: user_data.email
				,	password: user_data.password
				});

				customer = session.getCustomer();

				customer.updateProfile({
					internalid: guest_data.internalid
				,	firstname: user_data.firstname
				,	lastname: user_data.lastname
				,	companyname: user_data.company
				,	emailsubscribe: (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F'
				});
			}
			else
			{
				user_data.emailsubscribe = (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F';

				session.registerCustomer({
					firstname: user_data.firstname
				,	lastname: user_data.lastname
				,	companyname: user_data.company
				,	email:user_data.email
				,	password:user_data.password
				,	password2:user_data.password2
				,	emailsubscribe: (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F'
				});
			}

			var user = Profile.get();
			user.isLoggedIn = session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = session.isRecognized() ? 'T' : 'F';

			return {
				touchpoints: session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			,	cart: LiveOrder.get()
			,	address: Address.list()
			,	creditcard: CreditCard.list()
			};
		}
	});
});


//@class UserData
//@property {String} email
//@property {String} password
//@property {String} password2
//@property {String} firstname
//@property {String} lastname
//@property {String} company
//@property {String} emailsubscribe T or F