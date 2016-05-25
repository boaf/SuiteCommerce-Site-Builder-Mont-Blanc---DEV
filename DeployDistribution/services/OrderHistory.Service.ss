/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// placed-order.ss
// ----------------
// Service to manage orders requests
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		//Only can get an order if you are logged in
		if (session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	recordtype = request.getParameter('recordtype')
			,	id = request.getParameter('internalid')
			,	OrderHistory = require('OrderHistory.Model')
			,	permissions = Application.getPermissions().transactions;
			
			OrderHistory.loadSCISIntegrationStatus();

			if ((OrderHistory.getIsSCISIntegrationEnabled() ? permissions.tranPurchases > 0 : permissions.tranSalesOrd > 0) && permissions.tranFind > 0)
			{
				switch (method)
				{
					case 'GET':
						
						//If the id exist, sends the response of Order.get(id), else sends the response of (Order.list(options) || [])
						if (recordtype && id)
						{
							Application.sendContent(OrderHistory.get(recordtype, id));
						}
						else
						{
							Application.sendContent(OrderHistory.list({
								filter: request.getParameter('filter')
							,	order: request.getParameter('order')
							,	sort: request.getParameter('sort')
							,	from: request.getParameter('from')
							,	to: request.getParameter('to')
							,	page: request.getParameter('page') || 1
							,	results_per_page: request.getParameter('results_per_page')
							}));
						}

					break;
					case 'PUT':
						var data = JSON.parse(request.getBody() || '{}')
						,	cancel_result = OrderHistory.update(id, data, request.getAllHeaders())
						,	record = OrderHistory.get(data.recordtype, id);
						record.cancel_response = cancel_result;
						Application.sendContent(record);
					break;

					default: 
						// methodNotAllowedError is defined in ssp library commons.js
						Application.sendError(methodNotAllowedError);
				}
			}
			else
			{
				// forbiddenError is defined in ssp library commons.js
				Application.sendError(forbiddenError);
			}			
		}
		else
		{
			// unauthorizedError is defined in ssp library commons.js
			Application.sendError(unauthorizedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}