/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module LiveOrder
// Defines the LiveOrder  module (Model, Collection)
define('LiveOrder', ['LiveOrder.Model','LiveOrder.Collection'], function (Model,  Collection) {

	'use strict';
	
	return	{
		Model: Model
	,	Collection: Collection
	};
	
});