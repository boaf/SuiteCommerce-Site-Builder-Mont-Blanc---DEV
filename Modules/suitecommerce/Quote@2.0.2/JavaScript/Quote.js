/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Quote.js
// -----------------
// Defines the Return Authorization module (Model, Collection, Views, Router)
// @module Quote
define(
		'Quote'
,	[	
		'Quote.Router'

	,	'underscore'
	,	'Utils'
	]
,	function (
		Router

	,	_
	)
{
	'use strict';

	return	{
		Router: Router

	,	MenuItems: {
			parent: 'orders'
		,	id: 'quotes'
		,	name: _('Quotes').translate()
		,	url: 'quotes'
		,	index: 5
		,	permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
		}

	,	mountToApp: function (application)
		{
			return new Router(application);
		}
	};
});
