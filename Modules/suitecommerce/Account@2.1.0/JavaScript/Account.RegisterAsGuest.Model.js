/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Account
define('Account.RegisterAsGuest.Model'
,	[	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Backbone
	,	_
	)
{
	'use strict';

	//@class Account.RegisterAsGuest.Model
	//Register the User as Guest
	//@extend Backbone.Model
	return Backbone.Model.extend({

		//@property {String} urlRoot
		urlRoot: _.getAbsoluteUrl('services/Account.RegisterAsGuest.Service.ss')

		//@property {Object} validation. Backbone.Validation attribute used for validating the form before submit.
	,	validation: {
			firstname: {
				required: true
			,	msg: _('First Name is required').translate()
			}

			// This code is commented temporarily, because of the inconsistence between Checkout and My Account regarding the require data from profile information (Checkout can miss last name)
		,	lastname: {
				required: true
			,	msg: _('Last Name is required').translate()
			}

		,	email: {
				required: true
			,	pattern: 'email'
			,	msg: _('Valid Email is required').translate()
			}
		}
	});
});