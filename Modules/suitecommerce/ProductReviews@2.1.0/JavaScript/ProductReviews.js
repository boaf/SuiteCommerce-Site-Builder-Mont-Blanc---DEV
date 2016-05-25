/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductReviews
// Defines the ProductReviews module (Model, Collection, Views, Router)
// Mount to App also handles rendering of the reviews
// if the current view has any placeholder for them
define('ProductReviews'
,	[
		'ProductReviews.Router'
	]
,	function(
		Router
	)
{
	'use strict';
	
	// @class ProductReviews @extends ApplicationModule
	var ProductReviewsModule = 
	{
		mountToApp: function (application)
		{
			// default behaviour for mount to app
			return new Router(application);
		}
	};
	
	return ProductReviewsModule;
});
