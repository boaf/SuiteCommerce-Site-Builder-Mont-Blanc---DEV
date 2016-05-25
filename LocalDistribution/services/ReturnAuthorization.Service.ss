/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* exported service */
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{
		if (session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	recordtype = request.getParameter('recordtype')
			,	id = request.getParameter('internalid')
			,	data = JSON.parse(request.getBody() || '{}')
			,	permissions = Application.getPermissions().transactions
			,	ReturnAuthorization = require('ReturnAuthorization.Model');

			ReturnAuthorization.loadSCISIntegrationStatus();

			if ((ReturnAuthorization.getIsSCISIntegrationEnabled() ? permissions.tranPurchasesReturns > 0 : permissions.tranRtnAuth > 0) && permissions.tranFind > 0)
			{
				switch (method)
				{
					case 'GET':
						Application.sendContent(id && recordtype ? ReturnAuthorization.get(recordtype, id) : ReturnAuthorization.list({
							order: request.getParameter('order')
						,	sort: request.getParameter('sort')
						,	from: request.getParameter('from')
						,	to: request.getParameter('to')
						,	page: request.getParameter('page')
						}));
					break;

					case 'PUT':
						ReturnAuthorization.update(id, data, request.getAllHeaders());
						Application.sendContent(ReturnAuthorization.get('returnauthorization', id));
					break;

					case 'POST':
						if (permissions.tranRtnAuth > 1)
						{
							id = ReturnAuthorization.create(data);
							Application.sendContent(ReturnAuthorization.get('returnauthorization', id), {'status': 201});
						}
						else
						{
							Application.sendError(forbiddenError);
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
			Application.sendError(unauthorizedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}
