/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderFulfillment.js
// -------------------
// Defines the OrderFulfillment  module (Model, Collection)
define('OrderFulfillment', ['OrderFulfillment.Model','OrderFulfillment.Collection'], function (Model,  Collection) {

	'use strict';
	
	return	{
		Model: Model
	,	Collection: Collection
	};
	
});