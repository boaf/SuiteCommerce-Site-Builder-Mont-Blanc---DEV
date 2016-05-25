/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Case.Service.ss
// ----------------
// Service to manage support cases
function service (request)
{
	'use strict';

	var Application = require('Application');
	
	try
	{		
		if (session.isLoggedIn2())
		{
			if (Application.getPermissions().lists.listCase > 0)
			{
					var method = request.getMethod()
				,	data = JSON.parse(request.getBody() || '{}')
				,	id = request.getParameter('internalid') || data.internalid
				,	Case = require('Case.Model')
				,	customerId = nlapiGetUser() + '';			

				switch (method)
				{
					case 'GET':
						if (id)
						{
							Application.sendContent(Case.get(id));
						}
						else
						{

							var list_header_data = {
								filter: request.getParameter('filter')
							,   order: request.getParameter('order')
		                    ,   sort: request.getParameter('sort')
		                    ,   from: request.getParameter('from')
		                    ,   to: request.getParameter('to')
		                    ,   page: request.getParameter('page')
							};

							Application.sendContent(Case.search(customerId, list_header_data));
						}
					break;

					case 'POST':
						var new_case_id = Case.create(customerId, data);

						Application.sendContent(Case.get(new_case_id));
					break;

					case 'PUT':
						Case.update(id, data);
						Application.sendContent(Case.get(id));
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
			Application.sendError(unauthorizedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}