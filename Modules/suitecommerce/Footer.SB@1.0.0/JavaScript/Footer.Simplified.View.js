/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define(
	'Footer.Simplified.View'
,	[
		'footer_simplified.tpl'
	,	'Backbone'
	]
,	function(
		footer_simplified_tpl
	,	Backbone
	)
{
	'use strict';

	// @class Footer.Simplified.View @extends Backbone.View
	return Backbone.View.extend({
		//@property {Function} template
		template: footer_simplified_tpl
	});
});
