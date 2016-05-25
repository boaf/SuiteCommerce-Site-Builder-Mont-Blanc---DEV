/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module LiveOrder @class LiveOrder.Collection Live Orders collection @extends backbone.Collection
define('LiveOrder.Collection'
,	[	'LiveOrder.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	return Backbone.Collection.extend({
		model: Model
	});
});