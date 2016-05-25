/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Address.Service.ss
// ----------------
// Service to manage addresses requests

function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		//Only can get, modify, update or delete an address if you are logged in
		if (session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	id = request.getParameter('internalid')
			//  Address model is defined on ssp library Models.js
			,	Address = require('Address.Model')
			,	data = JSON.parse(request.getBody() || '{}');

			switch (method)
			{
				case 'GET':
					//If the id exist, sends the response of Address.get(id), else sends the response of (Address.list() || [])
					Application.sendContent(id ? Address.get(id) : (Address.list() || []));
				break;

				case 'PUT':
					// Pass the data to the Address's update method and send it response
					Address.update(id, data);
					Application.sendContent(Address.get(id));
				break;

				case 'POST':
					//Handles the creation and send the response
					id = Address.create(data);
					Application.sendContent(Address.get(id), {'status': 201});
				break;

				case 'DELETE':
					// The address is removed and we send a JSON Obj containing {'status': 'ok'}
					Address.remove(id);
					Application.sendContent({'status': 'ok'});
				break;

				default: 
					// methodNotAllowedError is defined in ssp library commons.js
					Application.sendError(methodNotAllowedError);
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