/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Quote.Model.js
// --------------
// Defines the model used by the Quote.Service.ss service
define(
	'Quote.Model'
,	[
		'SC.Model'
	,	'Utils'
	,	'Application'
	,	'StoreItem.Model'
	]
,	function (
		SCModel
	,	Utils
	,	Application
	,	StoreItem
	)
{
	'use strict';

	// @class Quote.Model Defines the model used by the Quote.Service.ss service
	// @extends SCModel
	return SCModel.extend({

		//@property {String} name
		name: 'Quote'

		//@method get
		//@param {String} id
		//@return {Quote.Model.Attributes}
	,	get: function (id)
		{
			var fields = ['entitystatus']
			,	recordLookup = nlapiLookupField('estimate', id, fields, true)
			,	record = nlapiLoadRecord('estimate', id);

			return this.createResultSingle(record, recordLookup);
		}

		//@method list
		//@param {Object} data
		//@return {Array}
	,	list: function (data)
		{
			var self = this
			,   page = data.page
			,	result = {}
			,   filters = [
					new nlobjSearchFilter('mainline', null, 'is', 'T')
				]
			,   columns = [
					new nlobjSearchColumn('internalid')
				,   new nlobjSearchColumn('tranid')
				,   new nlobjSearchColumn('trandate')
				,   new nlobjSearchColumn('duedate')
				,   new nlobjSearchColumn('expectedclosedate')
				,   new nlobjSearchColumn('entitystatus')
				,   new nlobjSearchColumn('total')
				];

			self.setFilter(data.filter, filters);
			self.setDateFromTo(data.from, data.to, filters);
			self.setSortOrder(data.sort, data.order, columns);

			result = Application.getPaginatedSearchResults({
				record_type: 'estimate'
				, filters: filters
				, columns: columns
				, page: page
			});

			result.records = _.map(result.records, function (record)
			{
				return self.createResultMultiple(record);
			});

			return result;
		}

		//@method setFilter
		//@param {Number} filter
		//@param {Array} filters
	,	setFilter: function (filter, filters)
		{
			if (filter && 0 < filter)
			{
				filters.push(new nlobjSearchFilter('entitystatus', null, 'is', filter));
			}
		}

		//@method setDateFromTo
		//@param {String} from
		//@param {String} to
		//@param {Array} filters
	,	setDateFromTo: function (from, to, filters)
		{
			if (from)
			{
				filters.push(new nlobjSearchFilter('trandate', null, 'onorafter', this.setDateInt(from), null));
			}

			if (to)
			{
				filters.push(new nlobjSearchFilter('trandate', null, 'onorbefore', this.setDateInt(to), null));
			}
		}

		//@method setDateInt
		//@param {String} date
		//@return {Date}
	,	setDateInt: function (date)
		{
			var offset = new Date().getTimezoneOffset() * 60 * 1000;

			return new Date(parseInt(date, 10) + offset);
		}

		//@method setSortOrder
		//@param {String} sort
		//@param {Number} order
		//@param {Array} columns
	,	setSortOrder: function (sort, order, columns)
		{
			switch (sort)
			{
				case 'trandate':
					columns[2].setSort(order > 0);
				break;

				case 'duedate':
					columns[3].setSort(order > 0);
				break;

				case 'total':
					columns[6].setSort(order > 0);
				break;

				default:
					columns[1].setSort(order > 0);
			}
		}

		//@method createResultSingle
		//@param record
		//@param recordLookup
		//@return {Quote.Model.Attributes}
	,	createResultSingle: function (record, recordLookup)
		{
			//@class Quote.Model.Attributes
			var result = {}
			,	duedate = record.getFieldValue('duedate');

			//@property {String} internalid
			result.internalid = record.getId();
			//@property {String} type
			result.type =  record.getRecordType();
			//@property {String} tranid
			result.tranid = record.getFieldValue('tranid');
			//@property {String} trandate
			result.trandate = record.getFieldValue('trandate');
			//@property {String} duedate
			result.duedate = duedate;
			//@property {Boolean} isOverdue
			result.isOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - this.getDateTime());
			//@property {Boolean} isCloseOverdue
			result.isCloseOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - (this.getDateTime() + this.getDaysBeforeExpiration()));
			//@property {String} expectedclosedate
			result.expectedclosedate = record.getFieldValue('expectedclosedate');
			//@property {String} entitystatus
			result.entitystatus = recordLookup.entitystatus;
			//@property {String} salesrep
			result.salesrep = record.getFieldText('salesrep');

			//@property {Array<StoreItem.Model.Attributes>} lineItems
			result.lineItems = this.getLines(record, 'item');
			//@property {Quote.Model.Attributes.ItemsExtradata} itemsExtradata
			//@class Quote.Model.Attributes.ItemsExtraData
			result.itemsExtradata = 
			{
				//@property {String} couponcode
				couponcode: record.getFieldText('couponcode')
				//@property {String} promocode
			,	promocode: record.getFieldText('promocode')
				//@property {String} discountitem
			,	discountitem: record.getFieldText('discountitem')
				//@property {String} discountrate
			,	discountrate: record.getFieldValue('discountrate')
			};
			//@class Quote.Model.Attributes

			//@property {String} billaddress Address
			result.billaddress = record.getFieldValue('billaddress');

			//@property {String} messages Message
			result.message = record.getFieldValue('message');

			//@property {Quote.Model.Attributes.Summary} summary Summary
			//@class Quote.Model.Attributes.Summary
			result.summary = {
				//@property {Number} subtotal
				subtotal: Utils.toCurrency(record.getFieldValue('subtotal'))
				//@property {String} subtotal_formatted
			,   subtotal_formatted: Utils.formatCurrency(record.getFieldValue('subtotal'))

				//@property {Number} discounttotal
			,   discounttotal: Utils.toCurrency(record.getFieldValue('discounttotal'))
				//@property {String} discounttotal_formatted
			,   discounttotal_formatted: Utils.formatCurrency(record.getFieldValue('discounttotal'))

				//@property {Number} taxtotal
			,   taxtotal: Utils.toCurrency(record.getFieldValue('taxtotal'))
				//@property {String} taxtotal_formatted
			,   taxtotal_formatted: Utils.formatCurrency(record.getFieldValue('taxtotal'))

				//@property {Number} shippingcost
			,   shippingcost: Utils.toCurrency(record.getFieldValue('shippingcost'))
				//@property {String} shippingcost_formatted
			,   shippingcost_formatted: Utils.formatCurrency(record.getFieldValue('shippingcost'))

				//@property {Number} total
			,   total: Utils.formatCurrency(record.getFieldValue('total'))
				//@property {String} total_formatted
			,   total_formatted: Utils.formatCurrency(record.getFieldValue('total'))
			};
			//@class Quote.Model				

			return result;
		}

		//@method createResultMultiple
		//@param {Object} record
		//@return {Object}
	,	createResultMultiple: function (record)
		{
			var result = {}
			,	duedate = record.getValue('duedate');

			result.internalid = record.getValue('internalid');
			result.tranid = record.getValue('tranid');
			result.trandate = record.getValue('trandate');
			result.duedate = duedate;
			result.isOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - this.getDateTime());
			result.isCloseOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - (this.getDateTime() + this.getDaysBeforeExpiration()));
			result.expectedclosedate = record.getValue('expectedclosedate');
			result.entitystatus = {
				id: record.getValue('entitystatus')
			,	name: record.getText('entitystatus')
			};
			result.total = Utils.toCurrency(record.getValue('total'));
			result.total_formatted = Utils.formatCurrency(record.getValue('total'));

			return result;
		}

		//@method getLines
		//@param {Object} record
		//@param {String} name
		//@return {Array<StoreItem.Model.Attributes>}
	,	getLines: function (record, name)
		{
			var result_lines = []
			,	items_to_preload = []
			,	items_to_query = []
			,	line_items_count = record.getLineItemCount(name);

			for (var i = 1; i <= line_items_count; i++)
			{
				items_to_preload[result_lines.item_id] = {
					id: result_lines.item_id
				,	type: result_lines.item_type
				};

				result_lines.push(this.getLineInformation(record, i, name));
			}

			StoreItem.preloadItems(_.values(items_to_preload));

			_.each(result_lines, function(line)
			{
				if (line.item_id)
				{
					var item = StoreItem.get(line.item_id, line.item_type);
					if (!item || typeof item.itemid === 'undefined')
					{
						items_to_query.push(line.item_id);
					}
				}
			});

			if (items_to_query.length > 0)
			{
				var inactive_items = this.getInactiveLineInformation(items_to_query);

				_.each(inactive_items, function(item)
				{
					var inactive_item = {
						internalid: item.getValue('internalid', 'item')
					,	type: item.getValue('type', 'item')
					,	displayname: item.getValue('displayname', 'item')
					,	storedisplayname: item.getValue('storedisplayname', 'item')
					,	itemid: item.getValue('itemid', 'item')
					};

					StoreItem.set(inactive_item);
				});
			}

			_.each(result_lines, function (line)
			{
				line.item = StoreItem.get(line.item_id, line.item_type);
			});

			return result_lines;
		}

		//@method getLineInformation
		//@param {Object} record
		//@param {Number} index
		//@param {String} name
		//@return {Object}
	,	getLineInformation: function (record, index, name)
		{
			var lineInformation = {}
			,	amount = record.getLineItemValue(name, 'amount', index)
			,   rate = record.getLineItemValue(name, 'rate', index);

			lineInformation = {
				item_id: record.getLineItemValue(name, 'item', index)
			,	item_type: record.getLineItemValue('item', 'itemtype', index)
			,	quantity: Math.abs(record.getLineItemValue(name, 'quantity', index))
			,   options: Utils.getItemOptionsObject(record.getLineItemValue(name, 'options', index))

			,   amount: Utils.toCurrency(amount)
			,   amount_formatted: Utils.formatCurrency(amount)

			,   rate: Utils.toCurrency(rate)
			,   rate_formatted: Utils.formatCurrency(rate)

			,   item: StoreItem.get(
					record.getLineItemValue(name, 'item', index)
				,   record.getLineItemValue(name, 'itemtype', index)
				)
			};

			return lineInformation;
		}

		//@method getInactiveLineInformation
		//@param {String} items_to_query
		//@return {Array}
	,	getInactiveLineInformation: function (items_to_query)
		{
			var filters = [
					new nlobjSearchFilter('internalid', 'item', 'anyof', items_to_query)
				]
			,	columns = [
					new nlobjSearchColumn('internalid', 'item')
				,	new nlobjSearchColumn('type', 'item')
				,	new nlobjSearchColumn('parent', 'item')
				,	new nlobjSearchColumn('displayname', 'item')
				,	new nlobjSearchColumn('storedisplayname', 'item')
				,	new nlobjSearchColumn('itemid', 'item')
				];

			return Application.getAllSearchResults('transaction', filters, columns);
		}

		//@method getDateTime
		//@return {Number}
	,	getDateTime: function ()
		{
			return new Date().getTime();
		}

		//@method isDateInterval
		//@param {Number} date
		//@return {Boolean}
	,	isDateInterval: function (date)
		{
			return 0 >= date  && ((-1 * date) / 1000 / 60 / 60 / 24) >= 1;
		}

		//@method getDaysBeforeExpiration
		//return {Number}
	,	getDaysBeforeExpiration: function ()
		{
			return SC.Configuration.quote.days_to_expire*24*60*60*1000;
		}
	});
});