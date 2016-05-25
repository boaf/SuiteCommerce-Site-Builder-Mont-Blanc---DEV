/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReorderItems
define('ReorderItems.Model'
,	[	'ItemDetails.Model'
	,	'Backbone'
	,	'underscore'
	]
,	function (
		ItemDetailsModel
	,	Backbone
	,	_
	)
{
	'use strict';

	//@class ReorderItems.Model @extend Backbone.Model
	return Backbone.Model.extend({

		//@property {String} urlRoot
		urlRoot: 'services/ReorderItems.Service.ss'

		//@property {Object} validation
	,	validation: {}

		//@method parse
		//@param {Object} record
		//@return {Object}
	,	parse: function (record)
		{

			if (record.item)
			{
				record.id = record.item.internalid;
				record.item = new ItemDetailsModel(record.item);

				var item_options = _.filter(record.options, function (option)
				{
					return option.value !== '';
				});

				record.internalid = record.item.get('internalid') +'|'+ JSON.stringify(item_options).replace(/"/g, '\'');
				record.item.setOptionsArray(item_options, true);

				record.options = item_options;
				
			}

			return record;
		}
	});
});
