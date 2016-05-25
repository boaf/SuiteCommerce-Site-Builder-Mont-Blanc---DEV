/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module ItemsKeyMapping

Item related models, like ItemDetails.Model, override its get() method to support high level item semantics defined here.
For example, attributes like '_url', '_name', '_images' are calculated taking into account matrix options, item type, etc.

Since this holds the mapping definition of whats returned by the search api / Commerce api for items and this semantics
is used across all the applications it is a good place to extenders to add its own high level item semantics or even
override existing ones.

For example, people may want to set that the name of the items are store in a custom item field instead of the display name field,
then you just change the mapping here instead of looking for that attribute in all templates and js files.

*/
define('ItemsKeyMapping'
,	[	'underscore'
	,	'Handlebars'
	,	'Utils'
	,	'UrlHelper'
	]
,	function (
		_
	,	Handlebars
	)
{
	'use strict';

	// itemImageFlatten:
	// helper function that receives the itemimages_detail (returned by the search api)
	// and flatens it into an array of objects containing url and altimagetext
	function itemImageFlatten (images)
	{
		if ('url' in images && 'altimagetext' in images)
		{
			return [images];
		}

		return _.flatten(_.map(images, function (item)
		{
			if (_.isArray(item))
			{
				return item;
			}

			return itemImageFlatten(item);
		}));
	}

	function getKeyMapping (configuration)
	{
		/*
		@class ItemsKeyMapping can be used by Backbone Model to add high level semantic attributes defined here.
		For example, @?class ItemDetails.Model override its get() method to support these attributes. So for example
		item.get('_name') will return the _name semantics in property defined here.

		If the property value is a string then that attribute will be used. If the value is a function, then the
		function is evaluated passing the item model as first argument.
		*/
		return {
			// @property {String} _id Item Internal Id: used as a fallback to the URL and to add to cart
			// You should not need to change this tho
			_id: 'internalid'

			// @property {String} _sku Item SKU number
		,   _sku: function (item)
			{
				var childs = item.getSelectedMatrixChilds()
				,	sku = item.get('itemid') || '';

				if (childs && childs.length === 1)
				{
					sku = childs[0].get('itemid') || sku;
				}

				return sku;
			}

			// @property {String} _name Name of the item, some times displayname is empty but storedisplayname2 tends to be set always
		,   _name: function (item)
			{
				// If its a matrix child it will use the name of the parent
				var item_id = item.get('itemid') || '';
				var parent = item.get('_matrixParent');
				if (parent.get('internalid'))
				{
					//we need the displayname included in the itemdid, see #B-11868
					var matches = item_id.match(/:(.*)/);
					var child_name = matches && matches[1];
					return child_name || parent.get('storedisplayname2') || parent.get('displayname') || item_id;
				}

				// Otherways return its own name
				return item.get('storedisplayname2') || item.get('displayname') || item_id;
			}

			// @property {String} _pageTitle Page Title of the PDP
		,   _pageTitle: ['pagetitle', 'storedisplayname2', 'displayname']

			// @property {String}  _pageHeader h1 of the PDP and also the title of the modal
		,   _pageHeader: ['storedisplayname2', 'displayname']

			// @property {String}  _keywords
		,	_keywords: 'searchkeywords'

			// @property {String} _metaTags
		,	_metaTags: 'metataghtml'

			// @property {Array<Object>} _breadcrumb This returns the breadcrum json obj for the PDP
		,   _breadcrumb: function (item)
			{
				var breadcrumb = [];

				// defaultcategory_detail attribute of the item is not consistent with the facets values,
				// so we are going to use the facet values instead
				/*var categories = _.findWhere(item.get('facets'), {id: 'category'})
				,	walkCategories = function walkCategories(category)
					{
						breadcrumb.push({
							href: '/' + category.id
						,   text: category.url
						});

						category.values && category.values.length && walkCategories(category.values[0]);
					};

				if (categories)
				{
					categories.values && categories.values.length && walkCategories(categories.values[0]);
				}*/

				breadcrumb.push({
					href: item.get('_url')
				,   text: item.get('_name')
				});

				return breadcrumb;
			}

			// @property {String} _url Url of the item
		,   _url: function (item)
			{
				var matrixParent = item.get('_matrixParent');
				// If this item is a child of a matrix return the URL of the parent
				if (matrixParent && matrixParent.get('internalid'))
				{
					return item.get('_matrixParent').get('_url');
					}
				// if its a standard version we need to send it to the canonical URL
				else if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD')
				{
					return item.get('canonicalurl');
				}
				// Other ways it will use the URL component or a default /product/ID
				return item.get('urlcomponent') ? '/'+ item.get('urlcomponent') : '/product/'+ item.get('internalid');
			}

			// @property {String} _linkAttributes
		,	_linkAttributes: function (item)
			{
				var url = item.get('_url')
				,	queryStrings = item.getQueryStringWithQuantity(1)
				,	link_attributes = '';

				if (url && url.indexOf)
				{
					url +=  (~url.indexOf('?') ? queryStrings.replace('?', '&') : queryStrings);
				}

				if (url)
				{
					link_attributes = {
						href: url
					};

					if (SC.ENVIRONMENT.siteSettings.sitetype === 'ADVANCED')
					{
						_.extend(link_attributes, {
							data: {
								touchpoint: 'home'
							,	hashtag: '#' + url
							}
						});
					}
				}

				return new Handlebars.SafeString(_.objectToAtrributes(link_attributes));
			}

			// @property {String} _editUrl For an item in the cart it returns the url for you to edit the item
		,	_editUrl: function (item)
			{
				var url = (item.get('_matrixParent').get('_id')) ? item.get('_matrixParent').get('_url') : item.get('_url');

				// Appends the options you have configured in your item to the url
				url += item.getQueryString();

				// adds the order item id, the view will update the item in the cart instead of adding it
				if (item.get('line_id'))
				{
					var sep = url.indexOf('?') === -1 ? '?' : '&';
					url += sep + 'cartitemid=' + item.get('line_id');
				}

				return url;
			}

			// @property {String} _thumbnail Object containing the url and the altimagetext of the thumbnail
		,   _thumbnail: function (item)
			{
				var item_images_detail = item.get('itemimages_detail') || {};

				// If you generate a thumbnail position in the itemimages_detail it will be used
				if (item_images_detail.thumbnail)
				{
					if (_.isArray(item_images_detail.thumbnail.urls) && item_images_detail.thumbnail.urls.length)
					{
						return item_images_detail.thumbnail.urls[0];
					}

					return item_images_detail.thumbnail;
				}

				// otherwise it will try to use the storedisplaythumbnail
				if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD' && item.get('storedisplaythumbnail'))
				{
					return {
						url: item.get('storedisplaythumbnail')
					,	altimagetext: item.get('_name')
					};
				}
				// No images huh? carry on

				var parent_item = item.get('_matrixParent');
				// If the item is a matrix child, it will return the thumbnail of the parent
				if (parent_item && parent_item.get('internalid'))
				{
					return parent_item.get('_thumbnail');
				}

				var images = itemImageFlatten(item_images_detail);
				// If you using the advance images features it will grab the 1st one
				if (images.length)
				{
					return images[0];
				}

				// still nothing? image the not available
				return {
					url: configuration.imageNotAvailable
				,	altimagetext: item.get('_name')
				};
			}

			// @property {Array} _images Array of objects containing the URL and the altimagetext of the images of the item
		,	_images: function (item)
			{
				var result = []
				,	selected_options = item.itemOptions
				,	item_images_detail = item.get('itemimages_detail') || {}
				,   swatch = selected_options && selected_options[configuration.multiImageOption] || null;

				item_images_detail = item_images_detail.media || item_images_detail;

				if (swatch && item_images_detail[swatch.label])
				{
					result = itemImageFlatten(item_images_detail[swatch.label]);
				}
				else
				{
					result = itemImageFlatten(item_images_detail);
				}

				return result.length ? result : [{
					url: configuration.imageNotAvailable
				,	altimagetext: item.get('_name')
				}];
			}

			// @property _matrixParent For matrix child items in the cart we generate this position so we have a link to the parent
		,	_matrixParent: 'matrix_parent'

			// @property _matrixChilds For matrix parent items, where are the attributes of the children
		,   _matrixChilds: 'matrixchilditems_detail'

			// @property  _optionsDetailsThe definition of the options of items with options
		,   _optionsDetails: 'itemoptions_detail'

			// @property _relatedItems Related items
		,   _relatedItems: 'related_items'

			// @property _relatedItemsDetail _relatedItemsDetail Related items in the PDP.
		,	_relatedItemsDetail: 'relateditems_detail'

			// @property _correlatedItemsDetail Correlated (Up-sell) items in the PDP.
		,	_correlatedItemsDetail: 'correlateditems_detail'

			// @property _priceDetails Item price information
		,   _priceDetails: 'onlinecustomerprice_detail'

		 	// @property {String} _price
		,	_price: function (item)
			{
				return (item.get('onlinecustomerprice_detail') && item.get('onlinecustomerprice_detail').onlinecustomerprice) || '';
			}

			// @property {String} _price_formatted
		,	_price_formatted: function (item)
			{
				return (item.get('onlinecustomerprice_detail') && item.get('onlinecustomerprice_detail').onlinecustomerprice_formatted) || '';
			}

			// @property {String} _comparePriceAgainst
		,   _comparePriceAgainst: function (item)
			{
				var prices = item.get('_priceDetails');

				if (prices)
				{
					if (prices.priceschedule)
					{
						return prices.priceschedule[0].price;
					}
					else
					{
						return prices.onlinecustomerprice;
					}
				}
				else
				{
					return item.get('pricelevel1');
				}
			}

			// @property {String} _comparePriceAgainstFormated
		,   _comparePriceAgainstFormated: function (item)
			{
				var prices = item.get('_priceDetails');

				if (prices)
				{
					if (prices.priceschedule)
					{
						return prices.priceschedule[0].price_formatted;
					}
					else
					{
						return prices.onlinecustomerprice_formatted;
					}
				}
				else
				{
					return item.get('pricelevel1_formatted');
				}
			}

			// @property _itemType Item Type
		,   _itemType: 'itemtype'

			// @property {Number} _stock Stock, the number of items you have available
		,   _stock: 'quantityavailable'

			// @property {Number} _minimumQuantity
		,	_minimumQuantity: function (item)
			{
				// if there is an unique child selected then we show its message. Otherwise we show the parent's
				var childs = item.getSelectedMatrixChilds();
				if (childs && childs.length === 1)
				{
					return childs[0].get('minimumquantity') || 1;
				}
				return item.get('minimumquantity') || 1;
			}

			// @property {Boolean} _isReturnable
		,	_isReturnable: function (item)
			{
				var type = item.get('itemtype');

				return type === 'InvtPart' || type === 'NonInvtPart' || type === 'Kit';
			}

			// @property {Boolean} _isInStock
		,	_isInStock: 'isinstock'

			// @property {Boolean} _isPurchasable
		,	_isPurchasable: 'ispurchasable'

			// @property {Boolean} _isBackorderable
		,	_isBackorderable: 'isbackorderable'

			// @property {Boolean} _showOutOfStockMessage
		,	_showOutOfStockMessage: 'showoutofstockmessage'

			// @property {Boolean} _isfulfillable
		,	_isfulfillable: function (item)
			{
				return item.get('isfulfillable') !== false;
			}

			// @property {Boolean} _showInStockMessage Show the IN STOCK label, this can be configured in a per item basis
		,   _showInStockMessage: function ()
			{
				return false;
			}

			// @property {Boolean} _showStockDescription Should we show the stock description?
		,   _showStockDescription: function ()
			{
				return true;
			}

			// @property {String} _stockDescription Stock Description, some times used to display messages like New Arrival, Ships in 3 days or Refubrished
		,   _stockDescription: 'stockdescription'

			// @property {String} _stockDescriptionClass Stock Description class, we use this to add a class to the HTML element containing the _stockDescription so you can easily style it.
			// This implementation will strip spaces and other punctuations from the _stockDescription and prepends stock-description-
			// so if your _stockDescription is Ships in 3 days your _stockDescriptionClass will be stock-description-ships-in-3-days
		,   _stockDescriptionClass: function (item)
			{
				return 'stock-description-'+ (item.get('_stockDescription') || '').toLowerCase().replace(/[\W\"]+/g,'-').replace(/\-+/g,'-');
			}

			// @property {String} _outOfStockMessage What to write when the item is out of stock
		,   _outOfStockMessage: function (item)
			{
				return item.get('outofstockmessage2') || item.get('outofstockmessage');
			}

			// @property {String} _inStockMessage What to write when the item is in stock
		,   _inStockMessage: function ()
			{
				return _('In Stock').translate();
			}

			// Reviews related item attributes

			// @property {Number} _rating Overall item rating
		,   _rating: function (item)
			{
				return Math.round(item.get('custitem_ns_pr_rating') * 10) / 10 || 0;
			}

			// @property {Number} _ratingsCount How many times this item was reviewed
		,   _ratingsCount: function (item)
			{
				return item.get('custitem_ns_pr_count') || 0;
			}

			// @property {Array<String>} _attributesToRateOn What are the possible attributes I want this item to be rated on
		,   _attributesToRateOn: function (item)
			{
				var attributes = item.get('custitem_ns_pr_item_attributes') || '';

				return _.reject(attributes.split(', '), function (attribute)
				{
					return !attribute || attribute === '&nbsp;';
				});
			}

			// @property _attributesRating returns a object containing the average rating per attribute
		,   _attributesRating: function (item)
			{
				return JSON.parse(item.get('custitem_ns_pr_attributes_rating'));
			}

			// @property _ratingsCountsByRate returns an object containing how many reviews it the item has for each particular rating
		,   _ratingsCountsByRate: function (item)
			{
				return item.get('custitem_ns_pr_rating_by_rate') && JSON.parse(item.get('custitem_ns_pr_rating_by_rate')) || {};
			}

			// @property {String} _miniCartUrl
		,	_miniCartUrl: function(item)
			{
				return _(item.get('_url') + item.getQueryStringWithQuantity(1)).fixUrl();
			}		
		};
	}

	return {
		getKeyMapping: getKeyMapping
	};
});
