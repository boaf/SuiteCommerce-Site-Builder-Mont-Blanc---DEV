/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// ----------------
// Service to manage cart items requests
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		var method = request.getMethod()
			// Cart model is defined on ssp library Models.js
		,	LiveOrder = require('LiveOrder.Model')
		,	data = JSON.parse(request.getBody() || '{}');

		if (method === 'GET')
		{
			// Sends the response of LiveOrder.get()
			Application.sendContent(LiveOrder.get());
		}

		// If we are not in the checkout OR we are logged in
		// When on store, login in is not required
		// when on checkout, login is required
		else if (!~request.getURL().indexOf('https') || session.isLoggedIn2())
		{
			switch (method)
			{
				case 'PUT':
					// Pass the data to the LiveOrder's update method and send it response
					LiveOrder.update(data);
					Application.sendContent(LiveOrder.get());
				break;

				case 'POST':
					// Updates the order with the passed in data
					LiveOrder.update(data);

					// Submit the order
					var confirmation = LiveOrder.submit();

					// Get the new order
					var order_info = LiveOrder.get();

					// Set the confirmation
					order_info.confirmation = confirmation;

					// Update touchpoints after submit order
					order_info.touchpoints = session.getSiteSettings(['touchpoints']).touchpoints;

					Application.sendContent(order_info);
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