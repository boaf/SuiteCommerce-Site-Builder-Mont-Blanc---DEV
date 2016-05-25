/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module GlobalViews
define(
	'GlobalViews.Message.View'
,	[
		'global_views_message.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function(

		global_views_message_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class GlobalViews.Message.View @extends Backbone.View
	return Backbone.View.extend({

		template: global_views_message_tpl

	,	initialize: function (options)
		{
			this.message = options.message;
			this.closable = options.closable || false;
			this.type = options.type;
		}

	,	show: function($placeholder, time)
		{
			$placeholder.empty();

			this.render();
			$placeholder.html(this.$el).show();

			if (time && time > 0)
			{
				setTimeout(function ()
				{
					$placeholder.fadeOut(function ()
					{
						$placeholder.empty();
					});
				}, time);				
			}
		}

		// @method getContext @return {GlobalViews.Message.View.Context}
	,	getContext: function ()
		{
			// @class GlobalViews.Message.View.Context
			return {
					// @property {String} message
					message: this.message
					// @property {Boolean} closable
				,	closable: this.closable
					// @property {String} type
				,	type: this.type ? 'global-views-message-' + this.type : ''
					// @property {Boolean} showMultipleMessage
				,	showMultipleMessage: !!_.isObject(this.message)
					// @property {Array} messages
				,	messages: _.isArray(this.message) ? this.message : [this.message]
			};
		}
	});
});