/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Receipt.Service.ss
// ----------------
// Service to manage invoice requests
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		// Only can get a receipt if you are logged in
		if (session.isLoggedIn2())
		{
			var permissions = Application.getPermissions().transactions;

			if (permissions.tranFind > 0 && permissions.tranCashSale > 0)
			{
			var method = request.getMethod()
			,	id = request.getParameter('internalid')
			,	status = request.getParameter('status')
				,	page = request.getParameter('page')
				,	Receipt = require('Receipt.Model');

				switch (method)
				{
					case 'GET':
						// If the id exist, sends the response of Receipt.get(id), else send (Receipt.list(options) || [])
						Application.sendContent(id ? Receipt.get('cashsale', id) : Receipt.list({
							types: 'CashSale'
						,	status: status
						,	page: page
						}));

					break;

					default:
						// methodNotAllowedError is defined in ssp library commons.js
						Application.sendError(methodNotAllowedError);
				}
			}
			else
			{
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
