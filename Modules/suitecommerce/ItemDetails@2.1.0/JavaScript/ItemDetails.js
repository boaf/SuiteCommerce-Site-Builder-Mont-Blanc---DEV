/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemDetails Implements the full experience of the Product Details Page
// Consists on a router, a model and the DetailsView with an image gallery view to show the product images
define(
	'ItemDetails'
,	[
		'ItemDetails.Model'
	,	'ItemDetails.Collection'
	,	'ItemDetails.View'
	,	'ItemDetails.Router'
	]
,	function (
		Model
	,	Collection
	,	View
	,	Router
	)
{
	'use strict';

	//@class ItemDetails instantiate the router @extends ApplicationModule
	return {
		mountToApp: function (application)
		{
			if (application.getConfig('modulesConfig.ItemDetails.startRouter'))
			{
				return new Router({application: application, model: Model, view: View});
			}
		}
	};
});