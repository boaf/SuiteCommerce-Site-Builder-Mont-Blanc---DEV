/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemViews
define(
	'ItemViews.Option.View'
,	[
		'SC.Configuration'

	,	'item_views_option.tpl'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		Configuration

	,	item_views_option_tpl

	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class ItemViews.Option.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_views_option_tpl

	,	initialize: function()
		{
			this.template = this.model.get('templates').selector;
		}

		//@method getContext @returns {ItemViews.Option.View.Context}
	,	getContext: function()
		{
			var self = this
			,	selected_option = this.options.item.getOption(this.model.get('cartOptionId'))
			,	show_selected_option = !!(selected_option);

			selected_option = show_selected_option ? {
				internalId: selected_option.internalid
			,	isAvailable: selected_option.isAvailable
			,	label: selected_option.label
			} : {};

			var options = _.map(this.model.get('values'), function(value)
			{
				var is_active = show_selected_option && value.internalid === selected_option.internalId
				,	link = self.options.item.get('_url') + self.options.item.getQueryString();

				if (is_active)
				{
					link = _.removeUrlParameter(
						link
					,	self.model.get('url')
					);
				}
				else if (value.isAvailable)
				{
					link = _.setUrlParameter(
						link
					,	self.model.get('url')
					,	value.internalid
					);
				}
				else
				{
					link = _.setUrlParameter(
						self.options.item.get('_url') + self.options.item.getQueryStringButMatrixOptions()
					,	self.model.get('url')
					,	value.internalid
					);
				}


				var color = ''
				,	is_color_tile = false
				,	image = {}
				,	is_image_tile = false;
				if (self.model.get('colors'))
				{
					color = self.model.get('colors')[value.label] || self.model.get('colors').defaultColor;
					if (_.isObject(color))
					{
						image = color;
						color = '';
						is_image_tile = true;
					}
					else
					{
						is_color_tile = true;
					}
				}

				//@class ItemViews.Option.View.Option
				return {
					// @property {String} internalId
					internalId: value.internalid
					// @property {Boolean} isAvailable
				,	isAvailable: value.isAvailable
					// @property {String} label
				,	label: value.label
					// @property {Boolean} isActive
				,	isActive: is_active
					// @property {String} link
				,	link: link
					// @property {String} color
				,	color: color
					// @property {Boolean} isColorTile
				,	isColorTile: is_color_tile
					// @property {Object} image
				,	image: image
					// @property {Boolean} isImageTile
				,	isImageTile: is_image_tile
					// @property {Boolean} isLightColor
				,	isLightColor: _.contains(Configuration.lightColors, value.label)
				};
				//@class ItemViews.Option.View
			});

			// @class ItemViews.Option.View.Context
			var context =  {
				// @property {Array<ItemViews.Option.View.Option>} options
				options: options
				// @property {Boolean} showSelectedOption
			,	showSelectedOption: show_selected_option
				// @property {Boolean} isMandatory
			,	isMandatory: this.model.get('isMandatory')
				//@property {Boolean} isGiftCard
			,	isGiftCard: this.model.get('itemtype') === 'GiftCert'
				//@propert {Boolean} showRequiredFields
			,	showRequiredFields: this.model.get('isMandatory') || this.model.get('itemtype') === 'GiftCert' 
				// @property {Boolean} isMatrixDimension
			,	isMatrixDimension: this.model.get('isMatrixDimension')
				// @property {String} itemOptionId
			,	itemOptionId: this.model.get('itemOptionId')
				// @property {String} cartOptionId
			,	cartOptionId: this.model.get('cartOptionId')
				// @property {String} label
			,	label: this.model.get('label')
				// @property {String} type
			,	type: this.model.get('type')
				// @property {String} url
			,	url: this.model.get('url')
				// @property {ItemViews.Option.View.Option} selectedOption
			,	selectedOption: selected_option
				// @property {Boolean} isTextArea
			,	isTextArea: this.model.get('type') === 'textarea'
				// @property {Boolean} isEmail
			,	isEmail: this.model.get('type') === 'email'
				// @property {Boolean} isText
			,	isText: this.model.get('type') === 'text'
				// @property {Boolean} isSelect
			,	isSelect: this.model.get('type') === 'select'
				// @property {String} htmlId
			,	htmlId: 'option-' + this.model.get('cartOptionId')
				// @property {String} htmlIdContainer
			,	htmlIdContainer: this.model.get('cartOptionId') + '-container'
			};
			// @class ItemViews.Option.View
			return context;
		}
	});
});
