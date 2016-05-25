/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemViews
define(
	'ItemViews.SelectedOption.View'
,	[
		'SC.Configuration'

	,	'item_views_selected_option.tpl'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		Configuration

	,	item_views_selected_option_tpl

	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	//@class ItemViews.SelectedOption.View @extend Backbone.View
	return Backbone.View.extend({

		template: item_views_selected_option_tpl

	,	initialize: function()
		{
			this.template = this.model.get('templates').selected;
		}

		//@method getContext
		//@return ItemViews.SelectedOption.View.Context
	,	getContext: function()
		{
			var self = this
			,	show_option = true
			,	cart_line_option = _.find(this.options.cartLine.get('options'), function(option, key)
				{
					if (option.id)
					{
						return (option.id + '').toLowerCase() === self.model.get('cartOptionId').toLowerCase();
					}
					else if (key)
					{
						return (key + '').toLowerCase() === self.model.get('cartOptionId').toLowerCase();
					}

				})
			,	color = ''
			,	is_color_tile = false
			,	image = {}
			,	is_image_tile = false;

			if (!cart_line_option)
			{
				cart_line_option = {};
				show_option = false;
			}


			if (this.model.get('colors'))
			{
				color = this.model.get('colors')[cart_line_option.displayvalue] || this.model.get('colors').defaultColor;
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

			if (this.model.get('values'))
			{
				var obj_value = _.findWhere(this.model.get('values'), {internalid: cart_line_option.value ? cart_line_option.value : cart_line_option.displayvalue});

				if (obj_value)
				{
					cart_line_option.displayvalue = obj_value.label;
				}
				else
				{
					cart_line_option.displayvalue = cart_line_option.displayvalue || cart_line_option.value;
				}
			}

			if (cart_line_option.displayvalue === '' || _.isNull(cart_line_option.displayvalue) ||  _.isUndefined(cart_line_option.displayvalue))
			{
				show_option = false;
			}

			//@class ItemViews.SelectedOption.View.Context
			return {
				//@property {Boolean} showOption
				showOption: show_option
				//@property {String} label
			,	label: this.model.get('label') || cart_line_option.name.replace(':', '')
				//@property {String} itemOptionId
			,	itemOptionId: this.model.get('itemOptionId')
				//@property {String} cartOptionId
			,	cartOptionId: this.model.get('cartOptionId')
				//@property {String} value
			,	value: cart_line_option.displayvalue
				//@property {String} color
			,	color: color
				//@property {Boolean} isColorTile
			,	isColorTile: is_color_tile
				//@property {String} image
			,	image: image
				//@property {Boolean} isImageTile
			,	isImageTile: is_image_tile
				// @property {Boolean} isLightColor
			,	isLightColor: _.contains(Configuration.lightColors, cart_line_option.displayvalue)
			};
		}
	});
});
