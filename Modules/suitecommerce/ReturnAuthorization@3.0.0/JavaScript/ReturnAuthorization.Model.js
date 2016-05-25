/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization.Model'
,	[	
		'OrderLine.Collection'
	,	'Transaction.Collection'
	,	'Backbone'
	]
,	function (
		OrderLineCollection
	,	TransactionCollection
	,	Backbone
	)
{
	'use strict';

	//@class ReturnAuthorization.Model @extend Backobne.Model
	return Backbone.Model.extend({

		//@property {String} urlRoot
		urlRoot: 'services/ReturnAuthorization.Service.ss'

		//@method initialize
		//@param {Object} attributes
	,	initialize: function (attributes)
		{
			this.on('change:lines', function (model, lines)
			{
				model.set('lines', new OrderLineCollection(lines), {silent: true});
			});

			this.trigger('change:lines', this, attributes && attributes.lines || []);

			this.on('change:applies', function (model, applies)
			{
				model.set('applies', new TransactionCollection(applies), {silent: true});
			});

			this.trigger('change:applies', this, attributes && attributes.lines || []);
		}
	});
});