/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Receipt
define('Receipt.Model'
,	[	'Backbone.CachedModel'
	,	'Order.Model'
	]
,	function (
		BackboneCachedModel
	,	OrderModel
	)
{
	'use strict';

	//@class Receipt.Model Model for showing information about past receipts
	var Model = OrderModel.extend({
		urlRoot: 'services/Receipt.Service.ss'

	,	expand: function ()
		{
			if (this.expanded)
			{
				this.trigger('expand', this);
			}
			else
			{
				var self = this;

				this.fetch().done(function ()
				{
					self.expanded = true;
					self.trigger('expand', this);
				});
			}
		}
	});

	// add support for cache
	Model.prototype.sync =  BackboneCachedModel.prototype.sync;
	Model.prototype.addToCache =  BackboneCachedModel.prototype.addToCache;

	return Model;

});
