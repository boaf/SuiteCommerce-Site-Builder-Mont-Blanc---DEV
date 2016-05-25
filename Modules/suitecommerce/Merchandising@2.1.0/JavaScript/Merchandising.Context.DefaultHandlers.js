/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module Merchandising
@class Merchandising.DefaultContextHandlers 
Registers a set of 'default handlers', this handlers are called depending on the execution context (current view they are in when being called)

The following handlers are required for correct functionality of the Merchandising Zone module:

 * getFilterValues - returns an array with the values of a specific filter in the current view
 * getIdItemsToExclude - returns an array with the ids of the items in the current view

@extends ApplicationModule
*/
define('Merchandising.Context.DefaultHandlers'
,	[	'Merchandising.Context'
	,	'Facets.Browse.View'
	,	'ItemDetails.View'
	,	'Cart.Detailed.View'
	,	'Cart.Confirmation.View'

	,	'underscore'
	]
,	function (
		MerchandisingContext
	,	BrowseView
	,	ItemDetailsView
	,	CartDetailedView
	,	CartConfirmationView

	,	_
	)
{
	'use strict';

	var DefaultContextHandlers = {

		// @method mergeFilterValues
		mergeFilterValues: function (current_values, facet_values)
		{
			return _.union(

				_.reject(current_values, function (value)
				{
					return value === '$current';
				})

			,	facet_values || []
			);
		}
		// @method parseValues @parma {Object} filters @param {Function} callback
	,	parseValues: function (filters, callback)
		{
			_.each(filters, function (values, key)
			{
				values = DefaultContextHandlers.mergeFilterValues(values, callback(values, key));

				if (values.length)
				{
					_.each(values, function(value)
                    {
						MerchandisingContext.appendFilterValue(filters, key, value);
					});
				}
				else
				{
					delete filters[key];
				}
			});

			return filters;
		}
		// @method includeFacetsToFilters @param {Array} facets @parma {Object} filters
	,	includeFacetsToFilters: function (facets, filters)
		{
			var facet_id = ''
			,	facet_values = [];

			_.each(facets, function (facet)
			{
				facet_id = facet.id;
				facet_values = facet.value;

				facet_values = _.isArray(facet_values) ? facet_values : [facet_values];

				if (filters.hasOwnProperty(facet_id))
				{
					facet_values = _.union(filters[facet_id], facet_values);
				}

				filters[facet_id] = facet_values;
			});

			return filters;
		}

		// @property {getFilters:Function,getIdItemsToExclude:Function} itemListHandlers
	,	itemListHandlers: {

			getFilters: function (filters, isWithin)
			{
				var facets = this.view.translator.facets;

				if (isWithin)
				{
					filters = DefaultContextHandlers.includeFacetsToFilters(facets, filters);
				}

				return DefaultContextHandlers.parseValues(filters, function (values, key)
				{
					var facet_values = [];

					if (_.contains(values, '$current'))
					{
						var current_facet = _.findWhere(facets, {id: key});

						facet_values = current_facet && current_facet.value || [];

						if (!_.isArray(facet_values))
						{
							facet_values = [facet_values];
						}
					}

					return facet_values;
				});
			}

			// [_.pluck](http://underscorejs.org/#pluck)
		,	getIdItemsToExclude: function ()
			{
				return this.view.model.get('items').pluck('internalid');
			}
		}

		// @method getItemValues  @param {Array} facets @parma {String} field_id @return {Array<String>}
	,	getItemValues: function (facets, field_id)
		{
			return _.pluck(_.findWhere(facets, {
				id: field_id
			}).values, 'url');
		}

		// @property {getFilters:Function,getIdItemsToExclude:Function} itemDetailsHandlers
	,	itemDetailsHandlers: {
			// depending on the item's attributes
			getFilters: function (filters, isWithin)
			{
				var facets = this.view.model.get('facets');

				return DefaultContextHandlers.parseValues(filters, function (values, key)
				{
					if (isWithin || _.contains(values, '$current'))
					{
						return DefaultContextHandlers.getItemValues(facets, key);
					}
				});
			}

			// there is only one it, we return its id
			// notice: we are returning it inside of an array
		,	getIdItemsToExclude: function ()
			{
				return [this.view.model.get('internalid')];
			}
		}

		// @method getCartLineItemValue @param {Itemdetails.Model} item @param {String} field_id
	,	getCartLineItemValue: function (item, filter_id)
		{
			var value = item.get(filter_id);

			if (!value)
			{
				var selected = _.findWhere(
					item.getPosibleOptions(), {itemOptionId: filter_id}
				);

				value = selected ? item.getOption(selected.cartOptionId).label : null;
			}

			return value;
		}

		// @method getCartItemValues returns an array with the values @param {Array<Itemdetails.Model>} item @param {String} field_id @return {Array<String>}
	,	getCartItemValues: function (items, filter_id)
		{
			return _.compact(items.map(function (line)
			{
				return MerchandisingContext.escapeValue(
					DefaultContextHandlers.getCartLineItemValue(line.get('item'), filter_id)
				);
			}));
		}

		// @property {getFilters:Function,getIdItemsToExclude:Function} cartDetailedHandlers
	,	cartDetailedHandlers: {

			getFilters: function (filters, isWithin)
			{
				var items = this.view.model.get('lines');

				return DefaultContextHandlers.parseValues(filters, function (values, key)
				{
					if (isWithin || _.contains(values, '$current'))
					{
						return DefaultContextHandlers.getCartItemValues(items, key);
					}
				});
			}

			// for each if the lines in the cart, we return either:
			// * the id of the matrix parent, if its a matrix
			// * the id of the line.item, if its not
		,	getIdItemsToExclude: function ()
			{
				var item = null;

				// [_.map](http://underscorejs.org/#map)
				return _.map(this.view.model.get('lines'), function (line)
				{
					item = line.get('item');

					return item.get('_matrixParent').get('_id') || item.get('_id');
				});
			}
		}

		// @property {getFilters:Function,getIdItemsToExclude:Function} cartConfirmationHandlers
	,	cartConfirmationHandlers: {

			// returns the value of the attribute in the view's line item
			getFilters: function (filters, isWithin)
			{
				var item = this.view.line.get('item');

				return DefaultContextHandlers.parseValues(filters, function (values, key)
				{
					if (isWithin || _.contains(values, '$current'))
					{
						return MerchandisingContext.escapeValue(
							DefaultContextHandlers.getCartLineItemValue(item, key)
						);
					}
				});
			}

			// returns either the matrix parent id or the item id
			// of the view's line item
		,	getIdItemsToExclude: function ()
			{
				var item = this.view.line.get('item');
				return [item.get('_matrixParent').get('_id') || item.get('_id')];
			}
		}

	,	mountToApp: function ()
		{
			MerchandisingContext
				.registerHandlers(BrowseView, this.itemListHandlers)
				.registerHandlers(ItemDetailsView, this.itemDetailsHandlers)
				.registerHandlers(CartDetailedView, this.cartDetailedHandlers)
				.registerHandlers(CartConfirmationView, this.cartConfirmationHandlers);

			return this;
		}
	};

	return DefaultContextHandlers;
});
