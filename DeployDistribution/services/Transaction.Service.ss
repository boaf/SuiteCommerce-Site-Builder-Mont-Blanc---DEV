/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Transaction.Service.ss
// ----------------
// Service to list transactions
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		// Only can get a order item if you are logged in
		if (session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	permissions = Application.getPermissions().transactions
			,	id = request.getParameter('internalid')
			,	record_type = request.getParameter('recordtype')
			,	Transaction = require('Transaction.Model');

			if (permissions)
			{
				switch (method)
				{
					case 'GET':

						if (id && record_type)
						{
							Application.sendContent(Transaction.get(record_type, id));
						}
						else
						{
							Application.sendContent(Transaction.list({
								filter: request.getParameter('filter')
							,	order: request.getParameter('order')
							,	sort: request.getParameter('sort')
							,	from: request.getParameter('from')
							,	to: request.getParameter('to')
							,	page: request.getParameter('page') || 1
							,	types: request.getParameter('types')
							,	createdfrom: request.getParameter('createdfrom')
							}));
						}

					break;

					default:
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
