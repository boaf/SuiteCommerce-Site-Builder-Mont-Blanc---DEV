/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global customer */
// Profile.js
// ----------------
// This file define the functions to be used on profile service
define(
	'Profile.Model'
,	['SC.Model', 'Utils']
,	function (SCModel, Utils)
{
	'use strict';

	return SCModel.extend({
		name: 'Profile'

	,	validation: {
			firstname: {required: true, msg: 'First Name is required'}

		// This code is commented temporally, because of the inconsistences between Checkout and My Account regarding the require data from profile information (Checkout can miss last name)
		,	lastname: {required: true, msg: 'Last Name is required'}

		,	email: {required: true, pattern: 'email', msg: 'Email is required'}
		,	confirm_email: {equalTo: 'email', msg: 'Emails must match'}
		}

	,	isSecure: request.getURL().indexOf('https') === 0

	,	isLoggedIn: session.isLoggedIn2()

	,	get: function ()
		{
			var profile = {};

			//You can get the profile information only if you are logged in.
			if (this.isLoggedIn && this.isSecure)
			{

				//Define the fields to be returned
				this.fields = this.fields || ['isperson', 'email', 'internalid', 'name', 'overduebalance', 'phoneinfo', 'companyname', 'firstname', 'lastname', 'middlename', 'emailsubscribe', 'campaignsubscriptions', 'paymentterms', 'creditlimit', 'balance', 'creditholdoverride'];

				profile = customer.getFieldValues(this.fields);

				//Make some attributes more friendly to the response
				profile.phone = profile.phoneinfo.phone;
				profile.altphone = profile.phoneinfo.altphone;
				profile.fax = profile.phoneinfo.fax;
				profile.priceLevel = (session.getShopperPriceLevel().internalid) ? session.getShopperPriceLevel().internalid : session.getSiteSettings(['defaultpricelevel']).defaultpricelevel;
				profile.type = profile.isperson ? 'INDIVIDUAL' : 'COMPANY';
				profile.isGuest = session.getCustomer().isGuest() ? 'T' : 'F';

				profile.creditlimit = parseFloat(profile.creditlimit || 0);
				profile.creditlimit_formatted = Utils.formatCurrency(profile.creditlimit);

				profile.balance = parseFloat(profile.balance || 0);
				profile.balance_formatted = Utils.formatCurrency(profile.balance);

				profile.balance_available = profile.creditlimit - profile.balance;
				profile.balance_available_formatted = Utils.formatCurrency(profile.balance_available);
			}
			else
			{
				profile = customer.getFieldValues();
				profile.subsidiary = session.getShopperSubsidiary();
				profile.language = session.getShopperLanguageLocale();
				profile.currency = session.getShopperCurrency();
				// @property {String} isLoggedIn. It saves the user logged status in the specified string.
				profile.isLoggedIn = this.isLoggedIn ? 'T' : 'F';
				profile.isGuest = session.getCustomer().isGuest() ? 'T' : 'F';
				profile.priceLevel = session.getShopperPriceLevel().internalid ? session.getShopperPriceLevel().internalid : session.getSiteSettings('defaultpricelevel');

				profile.internalid = nlapiGetUser() + '';
			}

			return profile;
		}

	,	update: function (data)
		{
			var login = nlapiGetLogin();

			if (data.current_password && data.password && data.password === data.confirm_password)
			{
				//Updating password
				return login.changePassword(data.current_password, data.password);
			}

			this.currentSettings = customer.getFieldValues();

			//Define the customer to be updated

			var customerUpdate = {
				internalid: parseInt(nlapiGetUser(), 10)
			};

			//Assign the values to the customer to be updated

			customerUpdate.firstname = data.firstname;

			if(data.lastname !== '')
			{
				customerUpdate.lastname = data.lastname;
			}

			if(this.currentSettings.lastname === data.lastname)
			{
				delete this.validation.lastname;
			}

			customerUpdate.companyname = data.companyname;


			customerUpdate.phoneinfo = {
					altphone: data.altphone
				,	phone: data.phone
				,	fax: data.fax
			};

			if(data.phone !== '')
			{
				customerUpdate.phone = data.phone;
			}

			if(this.currentSettings.phone === data.phone)
			{
				delete this.validation.phone;
			}

			customerUpdate.emailsubscribe = (data.emailsubscribe && data.emailsubscribe !== 'F') ? 'T' : 'F';

			if (!(this.currentSettings.companyname === '' || this.currentSettings.isperson || session.getSiteSettings(['registration']).registration.companyfieldmandatory !== 'T'))
			{
				this.validation.companyname = {required: true, msg: 'Company Name is required'};
			}

			if (!this.currentSettings.isperson)
			{
				delete this.validation.firstname;
				delete this.validation.lastname;
			}

			//Updating customer data
			if (data.email && data.email !== this.currentSettings.email && data.email === data.confirm_email)
			{
				if(data.isGuest === 'T')
				{
					customerUpdate.email = data.email;
				}
				else
				{
					login.changeEmail(data.current_password, data.email, true);
				}
			}

			// Patch to make the updateProfile call work when the user is not updating the email
			data.confirm_email = data.email;

			this.validate(data);
			// check if this throws error
			customer.updateProfile(customerUpdate);

			if (data.campaignsubscriptions)
			{
				customer.updateCampaignSubscriptions(data.campaignsubscriptions);
			}

			return this.get();
		}
	});
});
