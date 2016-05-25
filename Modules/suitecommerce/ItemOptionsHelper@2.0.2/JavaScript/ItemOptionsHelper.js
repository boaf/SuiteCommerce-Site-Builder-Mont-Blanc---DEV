/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemOptionsHelper
// Defines methods that will extend ItemDetails.Model to easily handling options.
define('ItemOptionsHelper'
,	['underscore']
,	function (_)
{
	'use strict';

	// @module ItemDetails @class ItemDetails.Model
	var ItemOptionsHelper = {

		// @method getValidOptionsFor @param {String} item_option_id
		// @returns {Array<ItemDetails.Model.Option>} a list of all valid options for the option you passed in
		getValidOptionsFor: function (item_option_id)
		{
			var selection = this.getMatrixOptionsSelection();

			delete selection[item_option_id];

			return _.uniq(_.map(this.getSelectedMatrixChilds(selection), function (model)
			{
				return model.get(item_option_id);
			}));
		}

		// @method isSelectionComplete
		// @returns {Boolean} true if all mandatory options are set,
		// if it's a matrix it also checks that there is only one sku selected
	,	isSelectionComplete: function ()
		{
			var posible_options = this.getPosibleOptions()
			,	is_matrix = false;

			// Checks all mandatory fields are set
			// in the mean time
			for (var i = 0; i < posible_options.length; i++)
			{
				var posible_option = posible_options[i];

				is_matrix = is_matrix || posible_option.isMatrixDimension;

				if (posible_option.isMandatory && !this.getOption(posible_option.cartOptionId))
				{
					return false;
				}
			}

			// If its matrix its expected that only 1 item is selected, not more than one nor 0
			if (is_matrix && this.getSelectedMatrixChilds().length !== 1)
			{
				return false;
			}

			return true;
		}

		// @method getPosibleOptionByCartOptionId
		// @return {ItemDetails.Model.Option} gets the configuration for one option by its cart id.
	,	getPosibleOptionByCartOptionId: function (cart_option_id)
		{
			return _.where(this.getPosibleOptions(), {cartOptionId: cart_option_id})[0];
		}

		// @method getPosibleOptionByUrl
		// @returns {ItemDetails.Model.Option} gets the configuration for one option by its URL component.
	,	getPosibleOptionByUrl: function (url)
		{
			return _.where(this.getPosibleOptions(), {url: url})[0];
		}

		// @method getPosibleOptions
		// @returns {Array<ItemDetails.Model.Option>} an array of all the possible options with values and information
	,	getPosibleOptions: function ()
		{
			if (this.cachedPosibleOptions)
			{
				return this.cachedPosibleOptions;
			}

			var result = [];
			if (this.get('_optionsDetails') && this.get('_optionsDetails').fields)
			{
				var self = this
					// Prepares a simple map of the configuration
				,	options_config_map = {};

				_.each(this.itemOptionsConfig, function (option)
				{
					if (option.cartOptionId)
					{
						options_config_map[option.cartOptionId] = option;
					}
				});

				// if you are an child in the cart it then checks for the options of the parent
				var fields = this.get('_matrixParent').get('_id') ? this.get('_matrixParent').get('_optionsDetails').fields : this.get('_optionsDetails').fields;

				// Walks the _optionsDetails to generate a standard options response.
				_.each(fields, function (option_details)
				{
					var option = {
						label: option_details.label
					,	values: option_details.values
					,	type: option_details.type
					,	cartOptionId: option_details.internalid
					,	itemOptionId: option_details.sourcefrom || ''
					,	isMatrixDimension: option_details.ismatrixdimension || false
					,	isMandatory: option_details.ismandatory || false
					,	templates: {}
					};

					// Makes sure all options are availabe by defualt
					_.each(option.values, function (value)
					{
						value.isAvailable = true;
					});

					// Merges this with the configuration object
					if (options_config_map[option.cartOptionId])
					{
						option = _.extend(option, options_config_map[option.cartOptionId]);
					}

					if (option_details.ismatrixdimension && self.get('_matrixChilds').length)
					{
						var item_values = self.get('_matrixChilds').pluck(option.itemOptionId);

						option.values = _.filter(option.values, function (value)
						{
							if (value.internalid)
							{
								return _.contains(item_values, value.label);
							}
							else
							{
								return true;
							}
						});
					}

					if (self.itemOptionsDefaultTemplates && self.itemOptionsDefaultTemplates.selectorByType)
					{
						// Sets templates for this option
						if (!option.templates.selector)
						{
							var option_selector_template = self.itemOptionsDefaultTemplates.selectorByType[option.type]
							,	default_option_selector_template = self.itemOptionsDefaultTemplates.selectorByType['default'];

							option.templates.selector = option_selector_template || default_option_selector_template;
						}
						if (!option.templates.selected)
						{
							var selected_option_template = self.itemOptionsDefaultTemplates.selectedByType[option.type]
							,	default_selected_option_template = self.itemOptionsDefaultTemplates.selectedByType['default'];

							option.templates.selected = selected_option_template || default_selected_option_template;
						}
					}

					// Makes sure the URL key of the object is set,
					// otherwise sets it to the cartOptionId (it should always be there)
					if (!option.url)
					{
						option.url = option.cartOptionId;
					}

					result.push(option);
				});

				// Since this is not going to change in the life of the model we can cache it
				this.cachedPosibleOptions = result;
			}

			return result;
		}

		// @method getSelectedOptions
		// @returns an array of all the selected options basic information
	,	getSelectedOptions: function ()
		{
			var selected_options = []
			,	self = this;
			_.each(this.getPosibleOptions(), function(opt)
			{
				var option = self.getOption(opt.cartOptionId);
				if(option)
				{
					selected_options.push(self.getOption(opt.cartOptionId));
				}
			});

			return selected_options;
		}

		// @method isCombinationAvailable @returns {Boolean}
	,	isCombinationAvailable: function (selection)
		{
			return _.findWhere(_.pluck(this.getSelectedMatrixChilds(), 'attributes'), selection);
		}

		// @method isProperlyConfigured
		// @returns {Boolean} true if all matrix options are mapped to the cart options
	,	isProperlyConfigured: function ()
		{
			var options = this.getPosibleOptions()
			,	option = null;

			if (options && options.length)
			{
				for (var i = 0; i < options.length; i++)
				{
					option = options[i];

					if (option.isMatrixDimension && !option.itemOptionId)
					{
						return false;
					}
				}
			}
			// If you omit item options from the field set and use matrix, that's an issue.
			else if (this.get('_matrixChilds') && this.get('_matrixChilds').length)
			{
				return false;
			}

			return true;
		}

		// @method getMatrixOptionsSelection
		// @returns {Object} an object of all the matrix options with its values set
	,	getMatrixOptionsSelection: function ()
		{
			var matrix_options = _.where(this.getPosibleOptions(), {isMatrixDimension: true})
			,	result = {}
			,	self = this;

			_.each(matrix_options, function (matrix_option)
			{
				var value = self.getOption(matrix_option.cartOptionId);
				if (value && value.label)
				{
					result[matrix_option.itemOptionId] = value.label;
				}
			});

			return result;
		}

		// @method getSelectedMatrixChilds
		// @returns {Array} all the children of a matrix that complies with the current or passed in selection
	,	getSelectedMatrixChilds: function (selection)
		{
			selection = selection || this.getMatrixOptionsSelection();
			var selection_key = JSON.stringify(selection);

			// Creates the Cache container
			if (!this.matrixSelectionCache)
			{
				this.matrixSelectionCache = {};
			}

			if (!this.get('_matrixChilds'))
			{
				return [];
			}

			// Caches the entry for the item
			if (!this.matrixSelectionCache[selection_key])
			{
				this.matrixSelectionCache[selection_key] = _.values(selection).length ? this.get('_matrixChilds').where(selection) : this.get('_matrixChilds').models;
			}

			return this.matrixSelectionCache[selection_key];
		}

		// @method getQueryString
		// @return {String} Computes all the selected options and transforms them into a URL query string
	,	getQueryString: function ()
		{
			return this.getQueryStringWithQuantity(this.get('quantity'));
		}

		// @method getQueryStringButMatrixOptions @return {String}
	,	getQueryStringButMatrixOptions: function ()
		{
			return this.getQueryStringWithQuantity(this.get('quantity'), true);
		}


		// @method getQueryStringWithQuantity @return {String} Computes all the selected options and
		// transforms them into a url query string with a given quantity
	,	getQueryStringWithQuantity: function (quantity, exclude_matrix_options)
		{
			var self = this
			,	result = [];

			if (quantity > 0 && quantity !== this.get('_minimumQuantity', true))
			{
				result.push('quantity=' + (quantity || 1));
			}

			_.each (this.getPosibleOptions(), function (option)
			{
				if (exclude_matrix_options && option.isMatrixDimension)
				{
					return;
				}

				var value = self.getOption(option.cartOptionId);

				if (value)
				{
					result.push(option.url + '=' + encodeURIComponent(value.internalid));
				}
			});

			result = result.join('&');

			return result.length ? '?' + result : '';
		}

		// @method parseQueryStringOptions Given a URL query string, it sets the options in the model
	,	parseQueryStringOptions: function (options)
		{
			var self = this;
			_.each(options, function (value, name)
			{
				if (name === 'quantity')
				{
					self.setOption('quantity', value);
				}
				else if (name === 'cartitemid')
				{
					self.cartItemId = value;
				}
				else if (value && name)
				{
					value = decodeURIComponent(value);
					var option = self.getPosibleOptionByUrl(name);

					if (option)
					{
						if (option.values)
						{
							// We check for both Label and internal id because we detected that sometimes they return one or the other
							value = _.where(option.values, {internalid: value})[0] || null;
							self.setOption(option.cartOptionId, value);
						}
						else
						{
							self.setOption(option.cartOptionId, value);
						}
					}
				}
			});
		}
	};

	return ItemOptionsHelper;
});
