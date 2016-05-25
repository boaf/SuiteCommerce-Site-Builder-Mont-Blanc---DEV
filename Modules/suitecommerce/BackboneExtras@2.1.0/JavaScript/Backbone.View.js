/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module BackboneExtras
#Backbone.View
Extends native Backbone.View with a bunch of required methods most of this were defined as no-ops in ApplicationSkeleton.js
@module Backbone @class Backbone.View
*/
define('Backbone.View'
,	[
		'Backbone'
	,	'GlobalViews.Message.View'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		Backbone
	,	GlobalViewsMessageView
	,	_
	,	jQuery
	)
{
	'use strict';

	_.extend(Backbone.View.prototype, {
		// @property {String} errorMessage Default error message, usally overwritten by server response on error
		errorMessage: 'Sorry, the information you provided is either incomplete or needs to be corrected.'

		// @method showContent @param {Boolean} dont_scroll will eventually be changed to an object literal
		// @return {jQuery.Deferred}
	,	showContent: function (dont_scroll)
		{
			return this.options.application && this.options.application.getLayout().showContent(this, dont_scroll);
		}

		// @method showInModal @param {Object} options @return {jQuery.Deferred}
	,	showInModal: function (options)
		{
			return this.options.application && this.options.application.getLayout().showInModal(this, options);
		}

		// @method getMetaDescription Get view's SEO attributes @return {String}
	,	getMetaDescription: function ()
		{
			return this.metaDescription;
		}

		// @method getMetaKeywords @return {String}
	,	getMetaKeywords: function ()
		{
			return this.metaKeywords;
		}

		// @method getMetaTags @return {Array<HTMLElement>}
	,	getMetaTags: function ()
		{
			return jQuery('<head/>').html(this.metaTags || '').children('meta');
		}

		//@method getTitle @returns {String} the document's title to show when this view is active.
	,	getTitle: function ()
		{
			// @property {String} title this view title. The default behavior is to set the document's title using view.title when calling view.showContent()
			return this.title;
		}

		//@method getCanonical @return {String}
	,	getCanonical: function ()
		{
			var canonical = window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment
			,	index_of_query = canonical.indexOf('?');

			// !~ means: indexOf == -1
			return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
		}

		// @method getRelPrev For paginated pages, subclasses should implement this operations to return the url of the previous and next pages
	,	getRelPrev: jQuery.noop

		// @method getRelNext For paginated pages, subclasses should implement this operations to return the url of the previous and next pages
	,	getRelNext: jQuery.noop

		// @method _destroy "private", shouldn't be overwritten if a custom destroy method is required override the destroy method. This method should still be called
		// @param {Boolean} softDestroy decides if the view should be empty instead of removed
	,	_destroy: function (softDestroy)
		{
			if(this.$el)
			{
				// http://backbonejs.org/#View-undelegateEvents
				this.undelegateEvents();
			}

			// http://backbonejs.org/#Events-off
			this.model && this.model.off(null, null, this);
			this.collection && this.collection.off(null, null, this);

			if(this.$el && softDestroy)
			{
				this.$el.empty();
			}
			else if(this.$el)
			{
				// http://backbonejs.org/#View-remove
				this.remove();
			}
		}

		// @method destroy
	,	destroy: function (softDestroy)
		{
			this._destroy(softDestroy);
		}

		// @method showConfirmationMessage @param {String} message
	,	showConfirmationMessage: function (message, fixed)
		{
			var confirmation_message = this.$('[data-confirm-message]')
			,	global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'success'
				,	closable: true
			});

			confirmation_message.html(global_view_message.render().$el.html());

			if (!fixed)
			{
				setTimeout(function()
				{
					confirmation_message.fadeOut(3000);
				}, 5000);
			}
		}

		// @method showWarningMessage @param {String} message
	,	showWarningMessage: function (message)
		{
			var global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'warning'
				,	closable: true
			});

			this.$('[data-confirm-message]').html(global_view_message.render().$el.html());
		}

		// @method disableElementsOnPromise Disables and re-enables a given set of elements based on a promise
		// @param {jQuery.Deferred} promise @param {String} selector
	,	disableElementsOnPromise: function (promise, selector)
		{
			var $target = this.$(selector);

			if ($target.length === 0)
			{
				return;
			}

			$target.attr('disabled', true);

			promise.always(function ()
			{
				$target.attr('disabled', false);
			});
		}
	});

	return Backbone.View;
});