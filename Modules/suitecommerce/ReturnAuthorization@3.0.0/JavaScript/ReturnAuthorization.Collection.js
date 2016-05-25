/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization.Collection'
,	[	'ReturnAuthorization.Model'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		Model
	,	_
	,	Backbone
	)
{
	'use strict';

	//@class ReturnAuthorization.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: 'services/ReturnAuthorization.Service.ss'

	,	parse: function (response)
		{
			this.totalRecordsFound = response.totalRecordsFound;
			this.recordsPerPage = response.recordsPerPage;

			return response.records;
		}

	,	update: function (options)
		{
			var range = options.range || {}
			,	from = range.from && _.stringToDate(range.from)
			,	to = range.to && _.stringToDate(range.to);

			this.fetch({
				data: {
					sort: options.sort.value
				,	order: options.order
				,	from: from ? from.getTime() : null
				,	to: to ? to.getTime()  : null
				,	page: options.page
				}
			,	reset: true
			,	killerId: options.killerId
			});
		}
	});
});