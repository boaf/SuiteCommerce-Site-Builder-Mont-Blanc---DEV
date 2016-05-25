/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//! © 2015 NetSuite Inc.
/*exported service */
/**/
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		var method	= request.getMethod();
		var data	= JSON.parse(request.getBody() || '{}');
		var ses = {};
		switch (method)
		{
			case 'GET':
				ses.currentOrderId = context.getSessionObject('currentOrderId');
				ses.void_lines = context.getSessionObject('void_lines');
				ses.return_lines = context.getSessionObject('return_lines');
				ses.returnauthorization_id = context.getSessionObject('returnauthorization_id');
				ses.invoiceId = context.getSessionObject('invoiceId');
				ses.currentLocation = context.getSessionObject('currentLocation');
				ses.salesRepId = context.getSessionObject('salesRepId');
				ses.customerId = context.getSessionObject('customerId');
				ses.salesRepId = context.getSessionObject('salesRepId');
				ses.orderId = context.getSessionObject('orderId');

				Application.sendContent(ses);
			break;
			case 'PATCH':
				context.setSessionObject(data.key, data.value);
				Application.sendContent({}, {status: 200});
			break;
		}
	}
	catch (e)
	{
		console.warn(e);
		Application.sendError(e);
	}
}