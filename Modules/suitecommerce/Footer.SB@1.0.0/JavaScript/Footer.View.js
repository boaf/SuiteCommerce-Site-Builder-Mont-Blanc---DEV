/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define(
	'Footer.View'
,	[
		'footer.tpl'
	,	'Backbone'
	]
,	function(
		footer_tpl
	,	Backbone
	)
{
	'use strict';

	// @class Footer.View @extends Backbone.View
	return Backbone.View.extend({
		template: footer_tpl
	});

});