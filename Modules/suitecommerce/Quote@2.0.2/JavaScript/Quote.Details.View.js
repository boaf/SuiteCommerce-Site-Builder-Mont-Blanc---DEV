/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define(
	'Quote.Details.View'
,	[
		'SC.Configuration'
	,	'ItemViews.Cell.Navigable.View'

	,	'quote_details.tpl'

	,	'Backbone'
	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'
	,	'underscore'
	
	,	'Utils'
	]
,	function (
		Configuration
	,	ItemViewsCellNavigableView

	,	quote_details_tpl

	,	Backbone
	,	BackboneCollectionView
	,	BackboneCompositeView
	,	_
	)
{
	'use strict';

	// @class Quote.Details.View @extends Backbone.View
	return Backbone.View.extend({

		template: quote_details_tpl

	,	title: _('Quote Details').translate()

	,	attributes: { 'class': 'QuoteDetails' }

	,	initialize: function (options)
		{
			this.application = options.application;

			BackboneCompositeView.add(this);
		}
		
		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'quotes';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Quotes').translate()
				,	href: '/quotes'
				}
			,	{
					text: _('Quote #$(0)').translate(this.model.get('tranid') || '')
				,	href: '/quotes'
				}
			];
		}

	,	childViews: {
			'Items.Collection': function ()
			{
				return new BackboneCollectionView({
					collection: this.model.get('lineItems')
				,	childView: ItemViewsCellNavigableView
				,	viewsPerRow: 1
				,	childViewOptions: {
						navigable: true

					,	detail1Title: _('Qty:').translate()
					,	detail1: 'quantity'

					,	detail2Title: _('Unit price:').translate()
					,	detail2: 'rate_formatted'

					,	detail3Title: _('Amount:').translate()
					,	detail3: 'amount_formatted'
					}
				});
			}
		}

		// @method getContext @return Quote.Details.View.Context
	,	getContext: function()
		{
			// @class Quote.Details.View.Context
			return {
				// @property {String} pageHeader 
				pageHeader: _('Quote <span class="strong-text quote-id">#$(0)</span>').translate(this.model.get('tranid'))
				// @property {String} tranid 
			,	tranid: this.model.get('tranid') || ''
				// @property {Object} model 
			,	model: this.model
				// @property {Number} lineItemsLength 
			,	lineItemsLength: this.model.get('lineItems').length
				// @property {String} entitystatus 
			,	entitystatus: this.model.get('entitystatus')
				// @property {String} pdfUrl
			,	pdfUrl: _.getDownloadPdfUrl({asset: 'quote-details', 'id': this.model.get('internalid')})
				// @property {Array} itemsExtradata
			,	itemsExtradata: this.model.get('itemsExtradata')
				// @property {String} billaddress
			,	billaddress: this.model.get('billaddress') || _('N/A').translate()
				// @property {String} message
			,	message: this.model.get('message') || _('N/A').translate()
				// @property {Boolean} collapseElements
			,	collapseElements: Configuration.get('collapseElements')
				// @property {Object} summary
			,	summary: this.model.get('summary')
				// @property {String} totalFormatted
			,	totalFormatted: this.model.get('summary').total_formatted
				// @property {String} duedate
			,	duedate: this.model.get('duedate') || ''
				// @property {Boolean} checkSalesrep
			,	checkSalesrep: this.model.get('salesrep') && 0 < this.model.get('salesrep').length
			};
		}
	});
});