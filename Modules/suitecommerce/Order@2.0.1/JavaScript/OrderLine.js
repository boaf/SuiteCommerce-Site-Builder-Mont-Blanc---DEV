/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderLine.js
// ------------
// Defines the OrderLine  module (Model, Collection)
define('OrderLine', ['OrderLine.Model','OrderLine.Collection'], function (Model,  Collection) {

	'use strict';
	
	return	{
		Model: Model
	,	Collection: Collection
	};
	
});