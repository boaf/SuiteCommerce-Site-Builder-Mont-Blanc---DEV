/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Init.js
// -------
// Global variables to be used accross models
// This is the head of combined file Model.js
/* exported container, session, settings, customer, context, order */
var container = null
,	session = null
,	customer = null
,	context = null
,	order = null;

// only initialize vars when the context actually have the functions
switch(nlapiGetContext().getExecutionContext())
{
	case 'suitelet':
	case 'webstore':
	case 'webservices':
	case 'webapplication':
		//nlapiLogExecution('DEBUG', 'Initializing global vars', nlapiGetContext().getExecutionContext());
		container = nlapiGetWebContainer();
		session = container.getShoppingSession();
		customer = session.getCustomer();
		context = nlapiGetContext();
		order = session.getOrder();
		break;
	default:
		//nlapiLogExecution('DEBUG', 'Omitting initialization of global vars', nlapiGetContext().getExecutionContext());
		break;
}

define('Models.Init', function ()
{
	'use strict';

	// var container = nlapiGetWebContainer()
	// ,	session = container.getShoppingSession()
	// //,	settings = session.getSiteSettings()
	// ,	customer = session.getCustomer()
	// ,	context = nlapiGetContext()
	// ,	order = session.getOrder();

	// TODO: (migrate) analyze strategy here
	return {
		container: container
	,	session: session
	,	customer: customer
	,	context: context
	};
});