/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ItemDetails.Cache.js
// --------------------
// Represents 1 single product of the web store
define('ItemDetails.Cache'
,	[	'ItemDetails.Model'
	,	'ItemDetails.Collection'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		ItemDetailsModel
	,	ItemDetailsCollection
	,	_
	,	jQuery
	)
{
	'use strict';

	return {

		cache: {}

	,	indexByUpc: {}

	,	indexByName: {}

	,	subscribers: {} // internalid -> List of subscribers

	,	getByUpc: function(upc)
		{
			if (upc)
			{
				upc = upc.toUpperCase();
				return this.indexByUpc[upc] && this.cache[this.indexByUpc[upc]];
			}
		}

	,	getByName: function(name)
		{
			if (name)
			{
				name = name.toLowerCase();
				return this.indexByName[name] && this.cache[this.indexByName[name]];
			}
		}

	,	getById: function(id, matrix_parent, itemid)
		{
			var item = this.cache[parseInt(id, 10)] || this.cache[parseInt(matrix_parent, 10)];
			if (!item && !matrix_parent)
			{
				item = _.find(this.cache, function (_item)
				{
					var res =  _.find(_item.get('matrixchilditems_detail'), function (child_item)
					{
						return child_item.internalid === parseInt(id, 10);
					});
					return !!res;
				});
				if (item)
				{
					matrix_parent = item.get('_id');
				}
			}
			if (item && parseInt(item.get('internalid'), 10) === parseInt(matrix_parent, 10))
			{
				var parent_attributes = _.clone(item.attributes);
				var child_attributes = _.find(item.get('matrixchilditems_detail'), function (child_item)
				{
					return child_item.internalid === parseInt(id, 10);
				});
				if (child_attributes && parent_attributes)
				{
					var attributes = _.extend(parent_attributes, child_attributes);
					attributes._id = id;
					if (itemid)
					{
						attributes.itemid = itemid;
					}
					delete attributes.matrixchilditems_detail;
					delete attributes._matrixChilds;
					var child_item = new ItemDetailsModel(attributes);
					child_item.set('_matrixParent', item);
					item = child_item;
					//We remove this attributes if they exist, since they belong to the parent and would prevent the correct name to be obtained through itemKeyMapping for the child
					item.unset('_name');
					item.unset('_nameAttributes');
					this.add(item);
				}
			}
			return item;
		}

	,	getOrAdd: function(id)
		{
			var self = this;
			var deferred = jQuery.Deferred();
			var item = this.getById(id);
			if (item)
			{
				deferred.resolve(item);
			}
			else
			{
				item = new ItemDetailsModel({ id: id });
				item.fetch({ data: { id: id } }).done(function()
				{
					if (!item.isNew())
					{
						self.add(item);
						deferred.resolve(item);
					}
					else
					{
						deferred.reject(item);
					}
				}).error(function ()
				{
					deferred.reject(item);
				});
			}
			return deferred.promise();
		}

	,	getOrAddAll: function(ids)
		{
			var self = this;
			var deferred = jQuery.Deferred();
			var collection = new ItemDetailsCollection();
			var toFetch = [];
			// Cached items
			ids.forEach(function (id)
			{
				var item = self.getById(id);
				if (item)
				{
					collection.add(item);
				}
				else
				{
					toFetch.push(id);
				}
			});
			// Non cached items
			if (toFetch.length > 0)
			{
				// We need to partition the list in groups of 5, as it is a limitation of the Item Search API.
				var partitions = _.values(_.groupBy(toFetch, function(item, i) {
					return Math.floor(i / 5);
				}));
				var nonCachedItems = new ItemDetailsCollection();
				var promises = _.map(partitions, function (partition)
				{
					var data = { id: partition.join(',') };
					return nonCachedItems.fetch({ data: data }).done(function()
					{
						nonCachedItems.each(function (item)
						{
							self.add(item);
						});
						collection.add(nonCachedItems.models);
					});
				});
				jQuery.when.apply(jQuery, promises).always(function ()
				{
					deferred.resolve(collection);
				});
			}
			else
			{
				deferred.resolve(collection);
			}
			return deferred.promise();
		}

	,	add: function(model)
		{
			var internalid = parseInt(model.get('internalid'), 10);
			var upccode = model.get('upccode');
			this.cache[internalid] = model;
			if (upccode)
			{
				this.indexByUpc[upccode.toUpperCase()] = internalid;
			}
			if (model.get('itemid'))
			{
				this.indexByName[model.get('itemid').toLowerCase()] = internalid;	
			}
			var subs = this.subscribers[internalid];
			if (!!subs)
			{
				_.each(subs, function(sub)
				{
					sub(model);
				});
			}
		}

	,	subscribe: function(internalid, callback)
		{
			if (!this.subscribers[internalid])
			{
				this.subscribers[internalid] = [];
			}
			this.subscribers[internalid].push(callback);
		}

	};
});
