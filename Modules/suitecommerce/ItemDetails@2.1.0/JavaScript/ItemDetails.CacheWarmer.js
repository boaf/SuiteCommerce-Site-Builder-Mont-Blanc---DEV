/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ItemDetails.Cache.js
// --------------------
// Represents 1 single product of the web store
define(
	'ItemDetails.CacheWarmer'
,	['ItemDetails.Cache', 'ItemDetails.Collection', 'Discount.Collections', 'Order.Return.Collections']
,	function(ItemDetailsCache, ItemDetailsCollection, DiscountCollections, OrderReturnCollections)
{
	'use strict';

	return {

		mountToApp: function()
		{
			if (SC.ENVIRONMENT.loggedIn)
			{
				var items_collection = new ItemDetailsCollection();
				items_collection.fetch({cache: true}).then(function()
				{
					items_collection.each(function(item)
					{
						ItemDetailsCache.add(item);
					});
				});

				var discounts = new DiscountCollections.Discounts();
				discounts.fetch().then(function()
				{
					discounts.each(function(discount)
					{
						ItemDetailsCache.add(discount);
					});
				});

				// as is cached, the next fetch will be instantaneous
				var returnReasons = new OrderReturnCollections.ReturnReasons();
				returnReasons.fetch();
			}
		}
	};
});
