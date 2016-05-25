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
		if (session.isLoggedIn())
		{
			var permissions = Application.getPermissions().transactions;
			
			if (permissions.tranEstimate > 0 && permissions.tranFind > 0)
			{
				var method = request.getMethod()
				,	id = request.getParameter('internalid')
				,	Quote = require('Quote.Model');

				switch (method)
				{
					case 'GET':
						Application.sendContent(id ? Quote.get(id) : Quote.list({
							filter: request.getParameter('filter')
						,	order: request.getParameter('order')
						,	sort: request.getParameter('sort')
						,	from: request.getParameter('from')
						,	to: request.getParameter('to')
						,	page: request.getParameter('page')
						}));
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