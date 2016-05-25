/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global customer */
// Address.js
// ----------
// Handles fetching, creating and updating addresses
// @module Address
define('Address.Model'
,	[
		'SC.Model'

	,	'Backbone.Validation'
	,	'underscore'
	]
,	function (
		SCModel

	,	BackboneValidation
	,	_
	)
{
	'use strict';

	// @class Address.Model Defines the model used by the Address frontent module.
	// @extends SCModel
	return SCModel.extend({
		name: 'Address'

		// @property validation
	,	validation: {
			addressee: {required: true, msg: 'Full Name is required'}
		,	addr1: {required: true, msg: 'Address is required'}
		,	country: {required: true, msg: 'Country is required'}
		,	state: function (value, attr, computedState)
			{
				var selected_country = computedState.country;

				if (selected_country && session.getStates([selected_country]) && !value)
				{
					return 'State is required';
				}
			}
		,	city: {required: true, msg: 'City is required'}
		,	zip: function (value, attr, computedState)
			{
				var selected_country = computedState.country
				,	countries = session.getCountries();

				if (!selected_country && !value || selected_country && countries[selected_country] && countries[selected_country].isziprequired === 'T' && !value)
				{
					return 'State is required';
				}
			}
		,	phone: {required: true, msg: 'Phone Number is required'}
		}
	
	,	isValid: function (data)
		{
			data = this.unwrapAddressee(_.clone(data));

			var validator = _.extend({
					validation: this.validation
				,	attributes: data
				}, BackboneValidation.mixin)

			,	invalidAttributes = validator.validate();

			return validator.isValid();
		}

		// @method wrapAddressee
		// our model has "fullname" and "company" insted of  the fields "addresse" and "attention" used on netsuite.
		// this function prepare the address object for sending it to the frontend
		// @param {Object} address
		// @returns {Object} address
	,	wrapAddressee: function (address)
		{
			if (address.attention && address.addressee)
			{
				address.fullname = address.attention;
				address.company = address.addressee;
			}
			else
			{
				address.fullname = address.addressee;
				address.company = null;
			}

			delete address.attention;
			delete address.addressee;

			return address;
		}

		// @method unwrapAddressee
		// @param {Object} address
		// @returns {Object} address
	,	unwrapAddressee: function (address)
		{
			if (address.company && address.company.trim().length > 0)
			{
				address.attention = address.fullname;
				address.addressee = address.company;
			}
			else
			{
				address.addressee = address.fullname;
				address.attention = null;
			}

			delete address.fullname;
			delete address.company;
			delete address.check;

			return address;
		}

		// @method get
		// @param {Number} id
		// @returns {Object} address
	,	get: function (id)
		{
			// @class Address.Model.Attributes
				//@property {String} company
				//@property {String} fullname
				//@property {String} internalid
				//@property {String} defaultbilling Valid values are 'T' or 'F'
				//@property {String} defaultshipping Valid values are 'T' or 'F'
				//@property {String} isvalid Valid values are 'T' or 'F'
				//@property {String} isresidential Valid values are 'T' or 'F'
				//@property {String?} addr3
				//@property {String} addr2
				//@property {String} addr1
				//@property {String} country
				//@property {String} city
				//@property {String} state
				//@property {String} phone
				//@property {String} zip
			// @class Address.Model
			return this.wrapAddressee(customer.getAddress(id));
		}
	
		// @method getDefaultBilling		
		// @returns {Object} default billing address
	,	getDefaultBilling: function ()
		{
			return _.find(customer.getAddressBook(), function (address)
			{
				return (address.defaultbilling === 'T');
			});
		}

		// @method getDefaultShipping		
		// @returns {Object} default shipping address
	,	getDefaultShipping: function ()
		{
			return _.find(customer.getAddressBook(), function (address)
			{
				return address.defaultshipping === 'T';
			});
		}

		// @method list		
		// @returns {Array<Object>} all user addresses
	,	list: function ()
		{
			var self = this;

			return  _.map(customer.getAddressBook(), function (address)
			{
				return self.wrapAddressee(address);
			});
		}

		// @method update
		// updates a given address
		// @param {String} id
		// @param {String} data
		// @returns undefined
	,	update: function (id, data)
		{
			data = this.unwrapAddressee(data);

			// validate the model
			this.validate(data);
			data.internalid = id;

			return customer.updateAddress(data);
		}

		// @method create
		// creates a new address
		// @param {Address.Data.Model} data
		// @returns {String} key of the new address
	,	create: function (data)
		{
			data = this.unwrapAddressee(data);
			// validate the model
			this.validate(data);

			return customer.addAddress(data);
		}

		// @method remove
		// removes a given address
		// @param {String} id
		// @returns undefined
	,	remove: function (id)
		{
			return customer.removeAddress(id);
		}
	});
});

//@class Address.Data.Model This is the model to send address to the backend