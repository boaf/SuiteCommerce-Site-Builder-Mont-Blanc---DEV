/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module GlobalViews
define(
	'GlobalViews.Confirmation.View'
,	[	'global_views_confirmation.tpl'

	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function(
		global_views_confirmation_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class GlobalViews.Conformation.View @extends Backbone.View
	return Backbone.View.extend({

		template: global_views_confirmation_tpl

	,	title: _('Confirm').translate()

	,	page_header: _('Confirm').translate()

	,	events: {
			'click [data-action="confirm"]' : 'confirm'
		}

	,	initialize: function (options)
		{
			this.callBack = options.callBack;
			this.callBackParameters = options.callBackParameters;
			this.title = options.title;
			this.page_header = options.title;
			this.body = options.body;
			this.autohide = !!options.autohide;
			this.confirmLabel = options.confirmLabel || _('Yes').translate();
		}

	,	render: function ()
		{
			Backbone.View.prototype.render.apply(this, arguments);
			var self = this;
			this.$containerModal.on('shown.bs.modal', function()
			{
				self.$('[data-action="confirm"]').focus();
			});
		}

		// @method confirm Invokes parent view delete confirm callback function
	,	confirm : function ()
		{
			this.callBack.call(this, this.callBackParameters);

			if (this.autohide)
			{
				this.$containerModal.modal('hide');
			}
		}

		// @method getTitle Sets focus con cancel button and returns the title text
	,	getTitle: function ()
		{
			return _('Confirmation').translate();
		}

		// @method getContext @return {GlobalViews.Conformation.View.Context}
	,	getContext: function()
		{
			// @class GlobalViews.Conformation.View.Context
			return {
				// @property {String} body
				body: this.body
				// @property {Boolean} hasConfirmLabel
			,	hasConfirmLabel: !!this.confirmLabel
				// @property {String} confirmLabel
			,	confirmLabel: this.confirmLabel
				// @property {Boolean} hasCancelLabel
			,	hasCancelLabel: !!this.cancelLabel
				// @property {String} cancelLabel
			,	cancelLabel: this.cancelLabel
			};
		}
	});
});