/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Case.Fields.Service.ss
// ----------------
// Service to manage support case fields
function service (request)
{
	'use strict';

	var Application = require('Application');

	// Application is defined in ssp library commons.js
	try
	{
		if (session.isLoggedIn2())
		{
			if (Application.getPermissions().lists.listCase > 0)
			{
				switch (request.getMethod())
				{
					case 'GET':
						var Case = require('Case.Model');
						
						Application.sendContent(Case.getNew());				
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