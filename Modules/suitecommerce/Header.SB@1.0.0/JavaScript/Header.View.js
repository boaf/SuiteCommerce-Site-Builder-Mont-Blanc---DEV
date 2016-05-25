/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header.SB
define(
	'Header.View'
,	[
		'header.tpl'
	,	'Backbone'
	]
,	function(
		header_tpl
	,	Backbone
	)
{
	'use strict';

	// @class Header.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_tpl
	
	});

});