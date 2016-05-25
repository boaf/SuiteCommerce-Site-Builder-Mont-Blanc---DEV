/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* exported forbiddenError, unauthorizedError, notFoundError, methodNotAllowedError, sessionTimedOutError, invalidItemsFieldsAdvancedName */
/* jshint -W079 */

// @module ssp.libraries

// This stands for SuiteCommerce
var SC = {};

define(
	'Application'
,	[
		'underscore'
	,	'Events'
	,	'Configuration'
	,	'Console'
	,	'Models.Init'
	]
,	function(
		_
	,	Events
	)
{
	'use strict';

	// @class Application @extends Events
	// The Application object contains high level functions to interact with low level suitescript and Commerce API
	// like obtaining all the context environment information, sending http responses, defining http errors, searching with paginated results, etc.
	var Application = _.extend({

		init: function () {}

//GENERAL-CONTEXT

		// @method getEnvironment returns an Object with high level settings. Gets the information with session.getSiteSettings()
		// and then mix it with high level information like languages, permissions, currencies, hosts, etc.  also it will take care of calling
		// session.setShopperCurrency and session.setShopperLanguage to automatically set this information in the shopper session according to passed request parameters.
		// @param {ShoppingSession} session
		// @param {nlobjRequest} request - used for read passed parameters in the url, i.e. in sc.environment.ssp?lang=es_ES
		// @return {Object} an object with many environment properties serializable to JSON.
	,	getEnvironment: function (session, request)
		{
			var context = nlapiGetContext()
			,	isSecure = request.getURL().indexOf('https:') === 0;

			// HEADS UP!! This hack is because currently CMS doesn't support Secure Domain yet
			// When CMS does support it, delete this
			SC.Configuration.useCMS = !isSecure && SC.Configuration.useCMS && context.getSetting('FEATURE', 'ADVANCEDSITEMANAGEMENT') === 'T';

			// Sets Default environment variables
			//,	isSecure = request.getURL().indexOf('https:') === 0
			var siteSettings = session.getSiteSettings(['currencies', 'languages'])
			,	result = {
					baseUrl: session.getAbsoluteUrl(isSecure ? 'checkout' : 'shopping', '/{{file}}')
				,	currentHostString: Application.getHost()
				,	availableHosts: SC.Configuration.hosts || []
				,	availableLanguages: siteSettings.languages || []
				,	availableCurrencies: siteSettings.currencies || []
				,	companyId: context.getCompany()
				,	casesManagementEnabled: context.getSetting('FEATURE', 'SUPPORT') === 'T'
				,	giftCertificatesEnabled: context.getSetting('FEATURE', 'GIFTCERTIFICATES') === 'T'
				,	currencyCodeSpecifiedOnUrl : ''
				,	useCMS: SC.Configuration.useCMS
				};

			// If there are hosts associated in the site we iterate them to check which we are in
			// and which language and currency we are in
			if (result.availableHosts.length && !isSecure)
			{
				var pushLanguage = function (language)
				{
					result.availableLanguages.push(_.extend({}, language, available_languages_object[language.locale]));
				};
				var pushCurrency = function(currency)
				{
					result.availableCurrencies.push(_.extend({}, currency, available_currencies_object[currency.code]));
				};
				for (var i = 0; i < result.availableHosts.length; i++)
				{
					var host = result.availableHosts[i];
					if (host.languages && host.languages.length)
					{
						// looks for the language match
						for (var n = 0; n < host.languages.length; n++)
						{
							var language = host.languages[n];

							if (language.host === result.currentHostString)
							{
								// if we found the language we mark the host and the language and we brake
								result = _.extend(result, {
									currentHost: host
								,	currentLanguage: language
								});

								// Enhaces the list of languages with the info provided by the site settings
								var available_languages_object = _.object(_.pluck(result.availableLanguages, 'locale'), result.availableLanguages);

								result.availableLanguages = [];

								_.each(host.languages, pushLanguage);

								break;
							}
						}
					}

					if (result.currentHost)
					{
						//////////////////////////////////////////////////////////////
						// Set the available currency based on the hosts currencies //
						//////////////////////////////////////////////////////////////
						var available_currencies_object = _.object(_.pluck(result.availableCurrencies, 'code'), result.availableCurrencies);
						result.availableCurrencies = [];
						_.each(host.currencies, pushCurrency);
						break;
					}
				}
			}

			//////////////////////////////////////
			// Sets the Currency of the shopper //
			//////////////////////////////////////
			var currency_codes = _.pluck(result.availableCurrencies, 'code');

			// there is a code passed in and it's on the list lets use it
			if (request.getParameter('cur') && ~currency_codes.indexOf(request.getParameter('cur')))
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					return currency.code === request.getParameter('cur');
				});
				result.currencyCodeSpecifiedOnUrl = result.currentCurrency.code;
			}
			// The currency of the current user is valid fot this host let's just use that
			else if (session.getShopperCurrency().code && ~currency_codes.indexOf(session.getShopperCurrency().code))
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					return currency.code === session.getShopperCurrency().code;
				});
				result.currencyCodeSpecifiedOnUrl = result.currentCurrency.code;
			}
			else if (result.availableCurrencies && result.availableCurrencies.length)
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					result.currencyCodeSpecifiedOnUrl =  currency.code;
					return currency.isdefault === 'T';
				});
			}
			// We should have result.currentCurrency setted by now
			result.currentCurrency && session.setShopperCurrency(result.currentCurrency.internalid);

			result.currentCurrency = _.find(result.availableCurrencies, function (currency)
			{
				return currency.code === session.getShopperCurrency().code;
			});

			///////////////////////////////////////
			// Sets the Language in the Shopper //
			///////////////////////////////////////
			if (!result.currentLanguage)
			{
				var shopper_preferences = session.getShopperPreferences()
				,	shopper_locale = shopper_preferences.language.locale
				,	locales = _.pluck(result.availableLanguages, 'locale');

				if (request.getParameter('lang') && ~locales.indexOf(request.getParameter('lang')))
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.locale === request.getParameter('lang');
					});
				}
				else if (shopper_locale && ~locales.indexOf(shopper_locale))
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.locale === shopper_locale;
					});
				}
				else if (result.availableLanguages && result.availableLanguages.length)
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.isdefault === 'T';
					});
				}
			}

			// We should have result.currentLanguage set by now
			result.currentLanguage && session.setShopperLanguageLocale(result.currentLanguage.locale);

			// Shopper Price Level
			result.currentPriceLevel = session.getShopperPriceLevel().internalid ? session.getShopperPriceLevel().internalid : session.getSiteSettings(['defaultpricelevel']).defaultpricelevel;

			return result;
		}

		// @method getPermissions @return {transactions: Object, lists: Object}
	,	getPermissions: function ()
		{
			// transactions.tranCustInvc.1,transactions.tranCashSale.1
			var context = nlapiGetContext()
			,	purchases_permissions = [
					context.getPermission('TRAN_SALESORD')
				,	context.getPermission('TRAN_CUSTINVC')
				,	context.getPermission('TRAN_CASHSALE')
				]
			,	purchases_returns_permissions = [
					context.getPermission('TRAN_RTNAUTH')
				,	context.getPermission('TRAN_CUSTCRED')
				];

			return	{
				transactions: {
					tranCashSale: context.getPermission('TRAN_CASHSALE')
				,	tranCustCred: context.getPermission('TRAN_CUSTCRED')
				,	tranCustDep: context.getPermission('TRAN_CUSTDEP')
				,	tranCustPymt: context.getPermission('TRAN_CUSTPYMT')
				,	tranStatement: context.getPermission('TRAN_STATEMENT')
				,	tranCustInvc: context.getPermission('TRAN_CUSTINVC')
				,	tranItemShip: context.getPermission('TRAN_ITEMSHIP')
				,	tranSalesOrd: context.getPermission('TRAN_SALESORD')
				,	tranEstimate: context.getPermission('TRAN_ESTIMATE')
				,	tranRtnAuth: context.getPermission('TRAN_RTNAUTH')
				,	tranDepAppl: context.getPermission('TRAN_DEPAPPL')
				,	tranSalesOrdFulfill: context.getPermission('TRAN_SALESORDFULFILL')
				,	tranFind: context.getPermission('TRAN_FIND')
				,	tranPurchases: _.max(purchases_permissions)
				,	tranPurchasesReturns: _.max(purchases_returns_permissions)
				}
			,	lists: {
					regtAcctRec: context.getPermission('REGT_ACCTREC')
				,	regtNonPosting: context.getPermission('REGT_NONPOSTING')
				,	listCase: context.getPermission('LIST_CASE')
				,	listContact: context.getPermission('LIST_CONTACT')
				,	listCustJob: context.getPermission('LIST_CUSTJOB')
				,	listCompany: context.getPermission('LIST_COMPANY')
				,	listIssue: context.getPermission('LIST_ISSUE')
				,	listCustProfile: context.getPermission('LIST_CUSTPROFILE')
				,	listExport: context.getPermission('LIST_EXPORT')
				,	listFind: context.getPermission('LIST_FIND')
				,	listCrmMessage: context.getPermission('LIST_CRMMESSAGE')
				}
			};
		}

		// @method getHost
	,	getHost: function ()
		{
			return request.getURL().match(/http(s?):\/\/([^\/]*)\//)[2];
		}

//SERVICES

		// @method sendContent writes the given content in the request object using the right headers, and content type
		// @param {String} content
		// @param {Object} options
	,	sendContent: function (content, options)
		{
			// Default options
			options = _.extend({status: 200, cache: false}, options || {});

			// Triggers an event for you to know that there is content being sent
			Application.trigger('before:Application.sendContent', content, options);

			// We set a custom status
			response.setHeader('Custom-Header-Status', parseInt(options.status, 10).toString());

			// The content type will be here
			var content_type = false;

			// If its a complex object we transform it into an string
			if (_.isArray(content) || _.isObject(content))
			{
				content_type = 'JSON';
				content = JSON.stringify( content );
			}

			// If you set a jsonp callback this will honor it
			if (request.getParameter('jsonp_callback'))
			{
				content_type = 'JAVASCRIPT';
				content = request.getParameter('jsonp_callback') + '(' + content + ');';
			}

			//Set the response chache option
			if (options.cache)
			{
				response.setCDNCacheable(options.cache);
			}

			// Content type was set so we send it
			content_type && response.setContentType(content_type);

			response.write(content);

			Application.trigger('after:Application.sendContent', content, options);
		}

		// @method processError builds an error object suitable to send back in the http response.
		// @param {nlobjError|Application.Error}
		// @returns {errorStatusCode:Number,errorCode:String,errorMessage:String} an error object suitable to send back in the http response.
	,	processError: function (e)
		{
			var status = 500
			,	code = 'ERR_UNEXPECTED'
			,	message = 'error';

			if (e instanceof nlobjError)
			{
				code = e.getCode();
				message = e.getDetails();
				status = badRequestError.status;
			}
			else if (_.isObject(e) && !_.isUndefined(e.status))
			{
				status = e.status;
				code = e.code;
				message = e.message;
			}
			else
			{
				var error = nlapiCreateError(e);
				code = error.getCode();
				message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
			}

			if (code === 'INSUFFICIENT_PERMISSION')
			{
				status = forbiddenError.status;
				code = forbiddenError.code;
				message = forbiddenError.message;
			}

			var content = {
				errorStatusCode: parseInt(status,10).toString()
			,	errorCode: code
			,	errorMessage: message
			};

			if (e.errorDetails)
			{
				content.errorDetails = e.errorDetails;
			}

			return content;
		}


		// @method sendError process the error and then writes it in the http response. @param {nlobjError|Application.Error}
	,	sendError: function (e)
		{
			// @event before:Application.sendError
			Application.trigger('before:Application.sendError', e);

			var content = Application.processError(e)
			,	content_type = 'JSON';

			response.setHeader('Custom-Header-Status', content.errorStatusCode);

			if (request.getParameter('jsonp_callback'))
			{
				content_type = 'JAVASCRIPT';
				content = request.getParameter('jsonp_callback') + '(' + JSON.stringify(content) + ');';
			}
			else
			{
				content = JSON.stringify(content);
			}

			response.setContentType(content_type);

			response.write(content);

			// @event before:Application.sendError
			Application.trigger('after:Application.sendError', e);
		}

//SEARCHES

		// @method getPaginatedSearchResults
		// @param {page:Number,columns:Array<nlobjSearchColumn>,filters:Array<nlobjSearchFilter>,record_type:String,results_per_page:Number} options
		// @returns {records:Array<nlobjSearchResult>,totalRecordsFound:Number,page:Number}
	,	getPaginatedSearchResults: function (options)
		{
			options = options || {};

			var results_per_page = options.results_per_page || SC.Configuration.results_per_page
			,	page = options.page || 1
			,	columns = options.columns || []
			,	filters = options.filters || []
			,	record_type = options.record_type
			,	range_start = (page * results_per_page) - results_per_page
			,	range_end = page * results_per_page
			,	do_real_count = _.any(columns, function (column)
				{
					return column.getSummary();
				})
			,	result = {
					page: page
				,	recordsPerPage: results_per_page
				,	records: []
				};

			if (!do_real_count || options.column_count)
			{
				var column_count = options.column_count || new nlobjSearchColumn('internalid', null, 'count')
				,	count_result = nlapiSearchRecord(record_type, null, filters, [column_count]);

				result.totalRecordsFound = parseInt(count_result[0].getValue(column_count), 10);
			}

			if (do_real_count || (result.totalRecordsFound > 0 && result.totalRecordsFound > range_start))
			{
				var search = nlapiCreateSearch(record_type, filters, columns).runSearch();
				result.records = search.getResults(range_start, range_end);

				if (do_real_count && !options.column_count)
				{
					result.totalRecordsFound = search.getResults(0, 1000).length;
				}
			}

			return result;
		}

		// @method getAllSearchResults
		// @param {String} record_type
		// @param {Array<nlobjSearchFilter>} filters
		// @param {Array<nlobjSearchColumn>} columns
		// @return {Array<nlobjSearchResult>}
	,	getAllSearchResults: function (record_type, filters, columns)
		{
			var search = nlapiCreateSearch(record_type, filters, columns);
			search.setIsPublic(true);

			var searchRan = search.runSearch()
			,	bolStop = false
			,	intMaxReg = 1000
			,	intMinReg = 0
			,	result = [];

			while (!bolStop && nlapiGetContext().getRemainingUsage() > 10)
			{
				// First loop get 1000 rows (from 0 to 1000), the second loop starts at 1001 to 2000 gets another 1000 rows and the same for the next loops
				var extras = searchRan.getResults(intMinReg, intMaxReg);

				result = Application.searchUnion(result, extras);
				intMinReg = intMaxReg;
				intMaxReg += 1000;
				// If the execution reach the the last result set stop the execution
				if (extras.length < 1000)
				{
					bolStop = true;
				}
			}

			return result;
		}

		// @method addFilterSite @param adds filters to current search filters so it matches given site ids.
		// @param {Array<String>} filters
	,	addFilterSite: function (filters)
		{
			var search_filter_array = this.getSearchFilterArray();

			search_filter_array.length && filters.push(new nlobjSearchFilter('website', null, 'anyof', search_filter_array));
		}

		// @method addFilterSite @param adds filters to current search filters so it matches given website item ids.
		// @param {Array<String>} filters
	,	addFilterItem: function (filters)
		{
			var search_filter_array = this.getSearchFilterArray();

			search_filter_array.length && filters.push(new nlobjSearchFilter('website', 'item', 'anyof', search_filter_array));
		}

		// @method getSearchFilterArray @return {Array<String>} current record search filters array taking in account multi site feature
	,	getSearchFilterArray: function ()
		{
			var context = nlapiGetContext()
			,	site_id = session.getSiteSettings(['siteid']).siteid
			,	filter_site = SC.Configuration.filter_site
			,	search_filter_array = [];

			// Validate if: MULTISITE, site_id, filter_site and also if filter_site is different of 'all'
			if (context.getFeature('MULTISITE') && site_id && filter_site && 'all' !== filter_site)
			{
				search_filter_array = filter_site instanceof Array ? filter_site : [];
				search_filter_array.push(site_id, '@NONE@');
			}

			return _.uniq(search_filter_array);
		}

		// @method searchUnion utility method for unite two arrays @param {Array} target @param {Array} array
	,	searchUnion: function (target, array)
		{
			return target.concat(array); // TODO: use _.union
		}

	}, Events);

	return Application;
});


// Default error objects

// @class globals

// @class badRequestError @extends Application.Error
var badRequestError = {
		// @property {Number} status
		status: 400
		// @property {String} code
	,	code: 'ERR_BAD_REQUEST'
		// @property {String} message
	,	message: 'Bad Request'
	}

// @class unauthorizedError @extends Application.Error
,	unauthorizedError = {
		// @property {Number} status
		status: 401
		// @property {String} code
	,	code: 'ERR_USER_NOT_LOGGED_IN'
		// @property {String} message
	,	message: 'Not logged In'
	}

,	sessionTimedOutError = {
		// @property {Number} status
		status: 401
		// @property {String} code
	,	code: 'ERR_USER_SESSION_TIMED_OUT'
		// @property {String} message
	,	message: 'User session timed out'
	}


	// @class forbiddenError @extends Application.Error
,	forbiddenError = {
		// @property {Number} status
		status: 403
		// @property {String} code
	,	code: 'ERR_INSUFFICIENT_PERMISSIONS'
		// @property {String} message
	,	message: 'Insufficient permissions'
	}

	// @class notFoundError @extends Application.Error
,	notFoundError = {
		// @property {Number} status
		status: 404
		// @property {String} code
	,	code: 'ERR_RECORD_NOT_FOUND'
		// @property {String} message
	,	message: 'Not found'
	}

	// @class methodNotAllowedError @extends Application.Error
,	methodNotAllowedError = {
		// @property {Number} status
		status: 405
		// @property {String} code
	,	code: 'ERR_METHOD_NOT_ALLOWED'
		// @property {String} message
	,	message: 'Sorry, you are not allowed to perform this action.'
	}

	// @class invalidItemsFieldsAdvancedName @extends Application.Error
,	invalidItemsFieldsAdvancedName = {
		// @property {Number} status
		status: 500
		// @property {String} code
	,	code:'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME'
		// @property {String} message
	,	message: 'Please check if the fieldset is created.'
	};

	// @class Application.Error a high level error object that can be processed and written in the response using processError and sendError methods
