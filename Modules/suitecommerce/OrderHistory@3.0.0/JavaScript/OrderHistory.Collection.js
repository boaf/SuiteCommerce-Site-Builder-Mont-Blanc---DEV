/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderHistory
define('OrderHistory.Collection'
,	[	'OrderHistory.Model'
	,	'Backbone'
	]
,	function (
		OrderHistoryModel
	,	Backbone
	)
{
	'use strict';

	//@class OrderHistory.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({

		//@property {OrderHistory.Model} model
		model: OrderHistoryModel

		//@property {String} url
	,	url: 'services/OrderHistory.Service.ss'

		//@method parse Handle the response from the back-end to properly manage total records found value
		//@param {Object} response JSON Response from the back-end service
		//@return {Array<Object>} List of returned records from the back-end
	,	parse: function (response)
		{
			this.totalRecordsFound = response.totalRecordsFound;
			this.recordsPerPage = response.recordsPerPage;

			return response.records;
		}

		//@method update Method called by ListHeader.View when applying new filters and constrains
		//@param {Collection.Filter} options
		//@return {Void}
	,	update: function (options)
		{
			var range = options.range || {};

			this.fetch({
				data: {
					filter: options.filter && options.filter.value
				,	sort: options.sort.value
				,	order: options.order
				,	from: range.from ? new Date(range.from.replace(/-/g,'/')).getTime() : null
				,	to: range.to ? new Date(range.to.replace(/-/g,'/')).getTime() : null
				,	page: options.page
				}
			,	reset: true
			,	killerId: options.killerId
			});
		}

	});
});