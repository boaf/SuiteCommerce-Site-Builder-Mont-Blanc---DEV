/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//Backend Configuration file
// @module ssp.libraries

// @class Configuration Backend Configuration file
define('Configuration', function()
{
	'use strict';

	SC.Configuration = {

		// @property {String} filter_site Filter by site on Record Lists (possible values: 'all', 'current', [1,2,3])
		// 'all': all the sites in the account.
		// 'current': just records under current site.
		// [1,2,3]: Array of site ids. Current site and not related to any site records will be also considered.
		filter_site: 'current'

		// @property {Object} order_checkout_field_keys
	,	order_checkout_field_keys: {
			'items': [
					'amount'
				,	'promotionamount'
				,	'promotiondiscount'
				,	'orderitemid'
				,	'quantity'
				,	'minimumquantity'
				,	'onlinecustomerprice_detail'
				,	'internalid'
				,	'rate'
				,	'rate_formatted'
				,	'options'
				,	'itemtype'
				,	'itemid'
				]
			,	'giftcertificates': null
			,	'shipaddress': null
			,	'billaddress': null
			,	'payment': null
			,	'summary': null
			,	'promocodes': null
			,	'shipmethod': null
			,	'shipmethods': null
			,	'agreetermcondition': null
			,	'purchasenumber': null
		}

		// @property {Object} order_shopping_field_keys
	,	order_shopping_field_keys: {
			'items': [
					'amount'
				,	'promotionamount'
				,	'promotiondiscount'
				,	'orderitemid'
				,	'quantity'
				,	'minimumquantity'
				,	'onlinecustomerprice_detail'
				,	'internalid'
				,	'options'
				,	'itemtype'
				,	'rate'
				,	'rate_formatted'
			]
			,	'shipaddress': null
			,	'summary': null
			,	'promocodes': null
		}

		// @property {String} items_fields_advanced_name
	,	items_fields_advanced_name: 'order'

		// @property {Array<String>} items_fields_standard_keys
	,	items_fields_standard_keys: [
				'canonicalurl'
			,	'displayname'
			,	'internalid'
			,	'itemid'
			,	'itemoptions_detail'
			,	'itemtype'
			,	'minimumquantity'
			,	'onlinecustomerprice_detail'
			,	'pricelevel1'
			,	'pricelevel1_formatted'
			,	'isinstock'
			,	'ispurchasable'
			,	'isbackorderable'
			,	'outofstockmessage'
			,	'stockdescription'
			,	'showoutofstockmessage'
			,	'storedisplayimage'
			,	'storedisplayname2'
			,	'storedisplaythumbnail'
			,	'isfulfillable'
		]

		// @property {Configuration.ProductReviews} product_reviews product reviews configuration
		// @class Configuration.ProductReviews
	,	product_reviews: {
			// @property {Number} maxFlagsCount is the number at which a review is marked as flagged by users
			maxFlagsCount: 2
			// @property {Boolean} loginRequired
		,	loginRequired: false
			// @property {Number} flaggedStatus the id of the flaggedStatus. If maxFlagsCount is reached, this will be its new status.
		,	flaggedStatus: 4
			// @property {String} approvedStatus id of the approvedStatus
		,	approvedStatus: '2'
			// @property {Number} pendingApprovalStatus id of pendingApprovalStatus
		,	pendingApprovalStatus:	1
			// @property {Number} resultsPerPage
		,	resultsPerPage: 25
		}
		// @class Configuration

		// @property {Configuration.ProductLists} product_lists Product lists configuration.
		// Note: for activating the "single list" user experience use additionEnabled==false && list_templates.length === 1
		// @class Configuration.ProductLists
	,	product_lists: {

			// @propert {Boolean} additionEnabled can the user modify product lists ?  This is add new ones, edit and delete them.
			additionEnabled: true

			// @propert {Boolean} loginRequired must the user be logged in for the product list experience to be enabled ?
		,	loginRequired: true

			// @propert {Array<Configuration.ProductReviews.Template>} list_templates loginRequired Predefined lists, a.k.a templates:
			// Administrators can define predefined list of templates. New customers will have these template lists
			// by default. This lists will be of type=predefined and they cannot be modified/deleted.
			// Note: Associated record will be created only when the customer add some product to the list.
			// @class Configuration.ProductReviews.Template
		,	list_templates: [
				{
					// @property {String} templateid
					templateid: '1'
					// @property {String} name
				,	name: 'My list'
					// @property {String} description
				,	description: 'An example predefined list'
					// @property {id:String,name:String} scope
				,	scope: {
						id: '2'
					,	name: 'private'
					}
				}

			,	{
					templateid: '2'
				,	name: 'Saved for Later'
				,	description: 'This is for the cart saved for later items'
				,	scope: {
						id: '2'
					,	name: 'private'
					}
				,	type: {
						id: '2'
					,	name: 'later'
					}
				}
			,	{
					templateid: '3'
				,	name: 'Request a Quote'
				,	description: 'This is for the request a quote items'
				,	scope: {
						id: '2'
					,	name: 'private'
					}
				,	type: {
						id: '4'
					,	name: 'quote'
					}
				}
			]
			// @class Configuration.ProductReviews
		}
		// @class Configuration

		// @property {default_values:Object} cases Support Cases configuration
	,	cases: {
			// Initial required default values.
			default_values:
			{
				// Status value used when submitting a new case.
				status_start: {
					id: '1'
				,	name: 'Not Started'
				}

				// Status value used when closing an existing case.
			,	status_close: {
					id: '5'
				,	name: 'Closed'
				}

				// Case origin
			,	origin: {
					id: '-5'
				,	name: 'Web'
				}
			}
		}

		// @property {QuotesBackendConfiguration} quote Quote configuration
		// @class QuotesBackendConfiguration
	,	quote: {
			// @property {Number} days_to_expire Days before the expiration of the quote
			days_to_expire: 7
			//@property {String} purchase_ready_status_id Set the id used by SCA to know when the estimate/Quote have is ready to be purchased by the shopper
			//The list of status is configured in: Setup > Sales > Customer Statuses
		,	purchase_ready_status_id: '12'
		}
		// @class Configuration

		// @property {QuotesToSalesOrderWizardBackendConfiguration} quote_to_salesorder_wizard QuoteToSalesOrder configuration
		// @class QuotesToSalesOrderWizardBackendConfiguration
	,	quote_to_salesorder_wizard: {
			//@property {String} invoice_form_id Set the id of the invoice form used to generate sales order using terms
			//This value can be set by going to: Customization > Forms > Transaction Forms. Find the entry of type: Sales Order and name: Standard Sales Order - Invoice
			//for that value copy here its INTERNAL ID
			invoice_form_id: '89'
		}
		// @class Configuration

		// @property {cancelUrlRoot:String} returnAuthorizations Return Authorization Configuration
	,	returnAuthorizations: {
			// Cancel Return System Path
			cancelUrlRoot: 'https://system.netsuite.com'
			// cancelUrlRoot: 'https://system.f.netsuite.com'
			// cancelUrlRoot: 'https://system.na1.netsuite.com'
			// cancelUrlRoot: 'https://system.na1.beta.netsuite.com'
			// cancelUrlRoot: 'https://system.sandbox.netsuite.com'
		}

		// @property {Number} results_per_page results per page in default Application record search pagination
	,	results_per_page: 20

		// @property {Boolean} checkout_skip_login Checkout skip login mode - false by default. If enabled,
		// anonymous users will skip the login page and go directly to the Checkout's wizard first step with
		// the possibility of login.
	,	checkout_skip_login: false

		// @property {Array<Configuration.Host>} hosts Multi Language Support - not included by default.
		// If included, must set the according hosts for each language. Next, a sample configuration:
	,	hosts: [

			// @class Configuration.Host
			// @property {String} title
			// @property {Array<Configuration.Host.Currency>} currencies
			// @property {Array<Configuration.Host.Language>} languages

			// @class Configuration.Host.Currency
			// @property {String} title
			// @property {String} code

			// @class Configuration.Host.Language
			// @property {String} title
			// @property {String} host
			// @property {String} locale

			// @class Configuration

			/*
			{
				title:'United States'
			,	currencies:[
					{
						title:'American Dolars'
					,	code:'USD'
					}
				]
			,	languages:[
					{
						title:'English'
					,	host:'en.site.com'
					,	locale:'en_US'
					}
				]
			}
			,	{
				title:'South America'
			,	currencies:[
					{
						title:'American Dolars'
					,	code:'USD'
					}
				,	{
						title:'Peso Argentino'
					,	code:'ARS'
					}
				,	{
						title:'Peso Uruguayo'
					,	code:'UYU'
					}
				]
			,	languages:[
					{
						title:'Spanish'
					,	host:'sa.site.dev'
					,	locale:'es_ES'
					}   
				,	{
						title:'Portuguese'
					,	host:'pt.sa.site.dev'
					,	locale:'pt_BR'
					}
				,	{
						title:'English'
					,	host:'en.sa.site.dev'
					,	locale:'en'
					}
				]
			},
			{
				title:'French'
			,	currencies:[
					{
						title:'Euro'
					,	code:'EUR'
					}
				,	{
						title:'American Dolars'
					,	code:'USD'
					}
				]
			,	languages:[
					{
						title:'French'
					,	host:'fr.site.com'
					,	locale:'fr_FR'
					}
				]
			}
			*/
		]

		// @property {Array<Configuration.Publish>} publish Here you can specify objects that will be exported to the frontend using environment.ssp.
		// A model specified in "model" will be created and the function specified in "call" will return
		// a value that will be retrieved in the frontend by "key" calling SC.getPublishedObject("key1")
	,	publish:[
			// @class Configuration.Publish
			// @param {String} key @param {String} model @param {String} call the function name to call
			// @class Configuration
			/*
			{
				key:'key1'
			,	model:'model'
			,	call:'functionName'
			}
		,	{
				key:'key2'
			,	model:'model'
			,	call:'functionName'
			}
			*/
		]

		// @property {Boolean} isMultiShippingEnabled must be truthy for the multiple shipping experience to be enabled (turned off by default)
	,	isMultiShippingEnabled: false
		// @property {Boolean} isSCISIntegrationEnabled must be truthy for the omni channel experience to be enabled (turned on by default)
	,	isSCISIntegrationEnabled: true

	,	locationTypeMapping: {
			store: {
				internalid: '1'
			,	name: 'Store'
			}
		}
		// @property {Boolean} The use of CDS and CMS are mutually exclusive, if you use CMS you can't use CDS, or if you use CDS you can't use CMS
		// By default we use CMS, so if you are going to use CDS, set 'useCMS' to 'false'
	,	useCMS: true

		// @property {Boolean} passwordProtectedSite Default: 'false'. If you need users to be redirected to the login page every time they are not authenticated
	,	passwordProtectedSite: false

		// @property {Boolean} loginToSeePrices Default: 'false'. If we need to hide the items prices to user who are not logged in, set it to 'true'.
	,	loginToSeePrices : false
	};

	return SC.Configuration;
});
