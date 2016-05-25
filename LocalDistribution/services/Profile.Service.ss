/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
// Profile.Service.ss
// ----------------
// Service to manage profile requests
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
		//Note that this condition is expressed with 'registrationmandatory' property being 'T'
		var isRegistrationDisabled = session.getSiteSettings(['registration']).registration.registrationmandatory === 'T';

		if (isRegistrationDisabled || !SC.Configuration.passwordProtectedSite || session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	data = JSON.parse(request.getBody() || '{}')
			//  Profile model is defined on ssp library Models.js
			,	Profile = require('Profile.Model');

			switch (method)
			{
				case 'GET':
					// sends the response of Profile.get()
					Application.sendContent(Profile.get());
				break;

				case 'PUT':
					//Only can update a profile if you are logged in
					if (session.isLoggedIn2())
					{
						// Pass the data to the Profile's update method and send it response
						Profile.update(data);
						Application.sendContent(Profile.get());
					}
					else
					{
						// unauthorizedError is defined in ssp library commons.js
						Application.sendError(unauthorizedError);
					}

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